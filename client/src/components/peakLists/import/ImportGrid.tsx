import { useMutation } from '@apollo/react-hooks';
import axios from 'axios';
import csv from 'csvtojson';
import { GetString } from 'fluent-react';
import raw from 'raw.macro';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import FileUploadImgUrl from '../../../assets/images/import-gifs/import-grid/file-upload.png';
import NewButtonImgUrl from '../../../assets/images/import-gifs/import-grid/new-button.png';
import PublishToWebLinkImgUrl from '../../../assets/images/import-gifs/import-grid/publish-to-web-link.png';
import PublishToWebModalImgUrl from '../../../assets/images/import-gifs/import-grid/publish-to-web-modal.png';
import PublishToWebImgUrl from '../../../assets/images/import-gifs/import-grid/publish-to-web.png';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
  lightBorderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { convertFieldsToDate } from '../../../Utils';
import Modal from '../../sharedComponents/Modal';
import {
  ADD_MOUNTAIN_COMPLETION,
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../detail/MountainCompletionModal';
import {
  BigNumber,
  HelpText as HelpTextBase,
  SuccessBox,
  WarningBox,
} from './index';

export const NH48_GRID_OBJECT_ID = '5d8952e6d9d8254dd40b7627';

interface Mountain {
  name: string;
  id: string;
}
const mountains: Mountain[] = JSON.parse(raw('./nh48_ids.json'));

const HelpTextContainer = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
`;

const HelpText = styled(HelpTextBase)`
  grid-column: 2;
`;

const ButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const SubmitButton = styled(ButtonPrimary)`
  margin-left: auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-column: auto repeat(12, 1fr);
`;

const GridCell = styled.div`
  padding: 4px;
  border-left: solid 1px ${lightBorderColor};
`;

const GridTitle = styled(GridCell)`
  text-transform: uppercase;
  font-size: 0.8rem;
  grid-row: 1;
  font-weight: ${semiBoldFontBoldWeight};
  border-bottom: 1px solid ${lightBorderColor};
`;

const PasteBox = styled.input`
  width: 100%;
  padding: 0.7rem;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid ${lightBorderColor};
  margin-left: 1rem;
  grid-row: 1;
  grid-column: 2;
`;

const FileUploadImageContainer = styled.div`
  grid-row: 2;
  grid-column: 1 / 3;
  display: grid;
  padding-top: 2rem;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
`;

const PublishHelpContainer = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-rows: auto auto auto auto;
`;

const Image = styled.img`
  margin: 1.5rem auto;
  width: 100%;
`;

interface DateToImport {
  id: string;
  date: string;
}

interface GridData {
  name: string;
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  total: string;
}

interface Props {
  onCancel: () => void;
  userId: string;
}

const ImportAscentsModal = (props: Props) => {
  const { onCancel, userId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [urlInput, setUrlInput] = useState<string>('');
  const [gridData, setGridData] = useState<GridData[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);

  const onGridCsvPaste = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fetchGridData = async () => {
      try {
        const url = e.target.value;
        setUrlInput(url);
        if (url !== '') {
          if (url.includes('://docs.google.com/spreadsheets/')) {
            if (url.includes('output=csv')) {
              if (url.includes('single=true')) {
                const res = await axios.get(url);
                const newGridData: GridData[] = [];
                csv({
                    noheader: false,
                    headers: [
                      'name',
                      'jan',
                      'feb',
                      'mar',
                      'apr',
                      'may',
                      'jun',
                      'jul',
                      'aug',
                      'sep',
                      'oct',
                      'nov',
                      'dec',
                      'total',
                    ],
                  })
                  .fromString(res.data)
                  .subscribe((jsonObj) => {
                    newGridData.push(jsonObj);
                  });
                const objShouldBeWashington = newGridData[0];
                if (Object.keys(objShouldBeWashington).length !== 14
                  || objShouldBeWashington.name !== 'Washington'
                  || newGridData.length !== 52) {
                  setImportError(getFluentString('import-grid-error-incorrect-format'));
                } else {
                  setImportError(null);
                  setGridData([...newGridData]);
                }
              } else {
                setImportError(getFluentString('import-grid-error-entire-file'));
              }
            } else {
              setImportError(getFluentString('import-grid-error-not-csv'));
            }
          } else {
            setImportError(getFluentString('import-grid-error-not-google-url'));
          }
        }
      } catch (error) {
        console.error(error);
        setImportError(getFluentString('import-grid-error-network-error'));
      }
    };
    await fetchGridData();
  };

  const errorMessage = (importError !== null && urlInput !== '') ? (
      <WarningBox
        dangerouslySetInnerHTML={{__html: importError}}
      />
    ) : null;

  const datesToImport: DateToImport[] = [];

  const onConfirm = () => {
    datesToImport.forEach(({id, date}) => {
      addMountainCompletion({ variables: {userId, mountainId: id, date}});
    });
    onCancel();
  };

  const valideDate = (month: number, date: string, id: string) => {
    const dateArray = date.replace(/[.,/#!$%^&*;:{}=\-_`~()'"]/g, ' ').split(' ');
    const parsedArray = dateArray.map(val => parseInt(val, 10));
    const numbersOnly = parsedArray.filter(val => !isNaN(val));
    if (numbersOnly.length === 2) {
      const [day, year] = numbersOnly;
      let validYear: number;
      if (year < 1000) {
        if (year <= new Date().getFullYear() - 2000) {
          validYear = year + 2000;
        } else {
          validYear = year + 1900;
        }
      } else {
        validYear = year;
      }
      const completedDate = convertFieldsToDate(day.toString(), month.toString(), validYear.toString());
      if (completedDate.error !== undefined) {
        console.error(completedDate.error);
        return null;
      } else {
        datesToImport.push({id, date: completedDate.date});
        return day + ", '" + year;
      }
    } else {
      return null;
    }
  };

  let successOutput: React.ReactElement<any> | null;
  let confirmButton: React.ReactElement<any> | null;
  if (importError === null && urlInput !== '' && gridData.length === 52) {
    const gridInput = gridData.map((mtn, index) => {
      const mountain = mountains.filter(data => data.name === mtn.name);
      const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0)
        ? undefined : lightBorderColor;
      const borderColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0)
        ? undefined : '#fff';
      const gridRow = index + 2;
      const style: React.CSSProperties = { backgroundColor, borderColor, gridRow };
      if (index < 48 && mountain[0] !== undefined) {
        const id = mountain[0].id;
        const janDate = valideDate(1, mtn.jan, id);
        const febDate = valideDate(2, mtn.feb, id);
        const marDate = valideDate(3, mtn.mar, id);
        const aprDate = valideDate(4, mtn.apr, id);
        const mayDate = valideDate(5, mtn.may, id);
        const junDate = valideDate(6, mtn.jun, id);
        const julDate = valideDate(7, mtn.jul, id);
        const augDate = valideDate(8, mtn.aug, id);
        const sepDate = valideDate(9, mtn.sep, id);
        const octDate = valideDate(10, mtn.oct, id);
        const novDate = valideDate(11, mtn.nov, id);
        const decDate = valideDate(12, mtn.dec, id);
        return (
          <React.Fragment key={mtn.name}>
            <GridCell style={style}>
              <strong>
                {mtn.name}
              </strong>
            </GridCell>
            <GridCell style={style}>{janDate}</GridCell>
            <GridCell style={style}>{febDate}</GridCell>
            <GridCell style={style}>{marDate}</GridCell>
            <GridCell style={style}>{aprDate}</GridCell>
            <GridCell style={style}>{mayDate}</GridCell>
            <GridCell style={style}>{junDate}</GridCell>
            <GridCell style={style}>{julDate}</GridCell>
            <GridCell style={style}>{augDate}</GridCell>
            <GridCell style={style}>{sepDate}</GridCell>
            <GridCell style={style}>{octDate}</GridCell>
            <GridCell style={style}>{novDate}</GridCell>
            <GridCell style={style}>{decDate}</GridCell>
          </React.Fragment>
        );
      } else {
        return null;
      }
    });
    successOutput = (
      <>
        <SuccessBox
          dangerouslySetInnerHTML={{__html: getFluentString('import-grid-success')}}
        />
        <GridContainer>
          <GridTitle>{getFluentString('global-text-value-mountain')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-jan')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-feb')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-mar')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-apr')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-may')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-jun')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-jul')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-aug')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-sep')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-oct')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-nov')}</GridTitle>
          <GridTitle>{getFluentString('global-text-value-month-short-dec')}</GridTitle>
          {gridInput}
        </GridContainer>
      </>
    );
    confirmButton = (
      <SubmitButton onClick={onConfirm}>
        {getFluentString('global-text-value-modal-confirm')}
      </SubmitButton>
    );
  } else {
    successOutput = null;
    confirmButton = null;
  }

  return (
    <Modal
      onClose={onCancel}
      width={'900px'}
      height={'auto'}
    >
      <h2>{getFluentString('import-ascents-title')}</h2>
      <p
        dangerouslySetInnerHTML={{__html: getFluentString('import-grid-introduction')}}
      />
      <HelpTextContainer>
        <BigNumber>1</BigNumber>
        <HelpText
          dangerouslySetInnerHTML={{__html: getFluentString('import-grid-steps-1')}}
        />
        <FileUploadImageContainer>
          <Image
            src={NewButtonImgUrl}
            alt={getFluentString('import-grid-img-alt-new-button')}
            style={{maxWidth: 260}}
          />
          <Image
            src={FileUploadImgUrl}
            alt={getFluentString('import-grid-img-alt-file-upload')}
            style={{maxWidth: 260}}
          />
        </FileUploadImageContainer>
      </HelpTextContainer>
      <HelpTextContainer>
        <BigNumber>2</BigNumber>
        <PublishHelpContainer>
          <HelpTextBase
            dangerouslySetInnerHTML={{__html: getFluentString('import-grid-steps-2-a')}}
          />
          <Image
            src={PublishToWebImgUrl}
            alt={getFluentString('import-grid-img-alt-file-publish')}
            style={{maxWidth: 250}}
          />
          <HelpTextBase
            dangerouslySetInnerHTML={{__html: getFluentString('import-grid-steps-2-b')}}
          />
          <Image
            src={PublishToWebModalImgUrl}
            alt={getFluentString('import-grid-img-alt-publish-setting')}
            style={{maxWidth: 460}}
          />
        </PublishHelpContainer>
      </HelpTextContainer>
      <HelpTextContainer>
          <BigNumber>3</BigNumber>
        <PublishHelpContainer>
          <HelpTextBase
            dangerouslySetInnerHTML={{__html: getFluentString('import-grid-steps-3')}}
          />
          <Image
            src={PublishToWebLinkImgUrl}
            alt={getFluentString('import-grid-img-alt-publish-link')}
              style={{maxWidth: 460}}
          />
        </PublishHelpContainer>
      </HelpTextContainer>

      <HelpTextContainer>
          <BigNumber>4</BigNumber>
          <PasteBox
            onChange={onGridCsvPaste}
            placeholder={getFluentString('import-grid-paste-url')}
          />
      </HelpTextContainer>
      {errorMessage}
      {successOutput}
      <ButtonWrapper>
        <CancelButton onClick={onCancel}>
          {getFluentString('global-text-value-modal-cancel')}
        </CancelButton>
        {confirmButton}
      </ButtonWrapper>
    </Modal>
  );
};

export default ImportAscentsModal;
