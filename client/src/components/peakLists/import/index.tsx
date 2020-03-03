import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import {intersection, sortBy} from 'lodash';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import SelectDatesGifUrl from '../../../assets/images/import-gifs/select-dates.gif';
import SelectDatesStaticUrl from '../../../assets/images/import-gifs/select-dates.png';
import SelectMountainsGifUrl from '../../../assets/images/import-gifs/select-mountains.gif';
import SelectMountainsStaticUrl from '../../../assets/images/import-gifs/select-mountains.png';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
  lightBorderColor,
  lowWarningColor,
  lowWarningColorLight,
  primaryColor,
  primaryHoverColor,
  semiBoldFontBoldWeight,
  successColor,
  successColorLight,
} from '../../../styling/styleUtils';
import { Mountain, State } from '../../../types/graphQLTypes';
import { asyncForEach, convertFieldsToDate, roundPercentToSingleDecimal } from '../../../Utils';
import Modal from '../../sharedComponents/Modal';
import {
  ADD_MOUNTAIN_COMPLETION,
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../detail/completionModal/MountainCompletionModal';
import {
  horizontalPadding,
} from '../detail/MountainRow';
import {
  Root as Table,
} from '../detail/MountainTable';
import MountainItem, { gridCols } from './MountainItem';

const TitleBase = styled.div`
  text-transform: uppercase;
  padding: ${horizontalPadding}rem;
  border-bottom: solid 2px ${lightBorderColor};
  font-weight: ${semiBoldFontBoldWeight};
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const InputTitle = styled(TitleBase)`
  opacity: 0.7;
  font-size: 0.8rem;
`;
const OutputTitle = styled(TitleBase)`
  font-size: 1rem;
`;

const UserInput = styled(InputTitle)`
  grid-column: ${gridCols.userInput};
`;
const ExpectedName = styled(OutputTitle)`
  grid-column: ${gridCols.expectedName};
`;
const UserDate = styled(InputTitle)`
  grid-column: ${gridCols.userDate};
`;
const ExpectedDate = styled(OutputTitle)`
  grid-column: ${gridCols.expectedDate};
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const SubmitButton = styled(ButtonPrimary)`
  margin-left: auto;
`;

const PasteContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  margin-bottom: 2rem;
`;

const PasteArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  grid-row: 2;
  height: 3.5rem;

  &::placeholder {
    text-align: center;
  }
`;

const HelpTextContainer = styled.div`
  grid-row: 1;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
`;

export const BigNumber = styled.div`
  grid-column: 1;
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 200px;
  color: white;
  background-color: ${primaryHoverColor};
  border: solid 4px ${primaryColor};
`;

export const HelpText = styled.div`
  padding: 0 0.7rem;
  line-height: 1.4;
`;

const HelpGifContainer = styled.div`
  grid-row: 3;
  grid-column: 1 / 3;

  img {
    max-width: 100%;
    max-height: 180px;
    cursor: pointer;
  }
`;

const SignalBox = styled.div`
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 4px;
  line-height: 1.4;
`;

export const WarningBox = styled(SignalBox)`
  background-color: ${lowWarningColorLight};
  border: 1px solid ${lowWarningColor};
`;

export const SuccessBox = styled(SignalBox)`
  background-color: ${successColorLight};
  border: 1px solid ${successColor};
`;

const OutputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const genericWords = [
  'mount',
  'mountain',
];

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  elevation: Mountain['elevation'];
  state: {
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null;
}
export interface DateDatum {
  day: number;
  month: number;
  year: number;
}

type DateArray = Array<DateDatum | undefined | null>;

interface Props {
  mountains: MountainDatum[];
  onCancel: () => void;
  userId: string;
}

const maxValIndicies = (array: number[]) => {
  const sortedArray = sortBy(array).reverse();
  const indexOfValuesInOrder: number[] = [];
  for (let i = 0; i < 3; i++) {
    const val = sortedArray[i];
    const index = array.indexOf(val);
    if (indexOfValuesInOrder.includes(index)) {
    // if index is already in, then find the next index
      const nextIndex = array.indexOf(val, index + 1);
      indexOfValuesInOrder.push(nextIndex);
    } else {
      indexOfValuesInOrder.push(index);
    }
  }
  return indexOfValuesInOrder;
};

const ImportAscentsModal = (props: Props) => {
  const { onCancel, mountains, userId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [pastedMountains, setPastedMountains] = useState<string[]>([]);
  const [cleanedMountains, setCleanedMountains] = useState<MountainDatum[] | null>([]);

  const [pastedDates, setPastedDates] = useState<string[]>([]);
  const [cleanedDates, setCleanedDates] = useState<DateArray | null>([]);

  const [selectMountainsGif, setSelectMountainsGif] = useState<string>(SelectMountainsStaticUrl);
  const [selectDatesGif, setSelectDatesGif] = useState<string>(SelectDatesStaticUrl);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  const toggleMountainGif = () => {
    const src = selectMountainsGif === SelectMountainsGifUrl
      ? SelectMountainsStaticUrl : SelectMountainsGifUrl;
    setSelectMountainsGif(src);
  };
  const toggleDatesGif = () => {
    const src = selectDatesGif === SelectDatesGifUrl
      ? SelectDatesStaticUrl : SelectDatesGifUrl;
    setSelectDatesGif(src);
  };

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);

  const validateAndAddMountainCompletion =
    async (mountainId: Mountain['id'], day: string, month: string, year: string) => {
    const completedDate = convertFieldsToDate(day, month, year);
    if (completedDate.error !== undefined) {
      console.error(completedDate.error);
    } else {
      await addMountainCompletion({ variables: {userId, mountainId, date: completedDate.date}});
    }
  };

  const onConfirm = async () => {
    if (
      cleanedMountains !== null && cleanedDates !== null
      && cleanedMountains.length > 0 && cleanedDates.length > 0
      && cleanedMountains.length === cleanedDates.length) {
      cleanedMountains.forEach((mtn, i) => {
        const dates = cleanedDates[i];
        const mountainId = mtn.id;
        if (dates !== null && dates !== undefined && mountainId) {
          const {day, month, year} = dates;
          validateAndAddMountainCompletion(mountainId, day.toString(), month.toString(), year.toString());
        } else {
          console.warn('dates are undefined, skipping');
        }
      });
      setIsLoading(true);
      let counter = 0;
      await asyncForEach(cleanedMountains, async (mtn: MountainDatum) => {
        const dates = cleanedDates[counter];
        const mountainId = mtn.id;
        if (dates !== null && dates !== undefined && mountainId) {
          const {day, month, year} = dates;
          await validateAndAddMountainCompletion(mountainId, day.toString(), month.toString(), year.toString());
        } else {
          console.warn('dates are undefined, skipping');
        }
        counter++;
        setPercent(roundPercentToSingleDecimal(counter, cleanedMountains.length));
      });
    } else {
      // The following should not run
      // button should not exist if data is incorrect
      console.error('Data doesnt exist or is the wrong length');
    }
    onCancel();
  };

  const onMountainNamesPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedValue = e.target.value;
    const valueArray = pastedValue.split(/\r?\n/);
    if (valueArray[valueArray.length - 1] === '') {
      valueArray.pop();
    }
    const hasEmptyString = valueArray.indexOf('');
    if (valueArray.length > mountains.length || !pastedValue || hasEmptyString !== -1) {
      setCleanedMountains(null);
    } else {
      const matchPercentages = valueArray.map(mtn => {
        const mtnLowerCase = mtn.toLowerCase();
        const letters = mtnLowerCase.split('');
        const pastedWords = mtnLowerCase.trim().split(/\W+/).filter(w => !genericWords.includes(w));
        const matches = mountains.map(({name}) => {
          const lowerCaseName = name.toLowerCase();
          const nameWords = lowerCaseName.trim().split(/\W+/).filter(w => !genericWords.includes(w));
          let exactMatch = mtnLowerCase === lowerCaseName ? 100 : 0;
          if (pastedWords.length === 1 && nameWords.length === 1) {
            if (pastedWords[0] === nameWords[0]) {
              exactMatch = exactMatch + 100;
            }
          }
          let nameMatch: number = 0;
          pastedWords.forEach(pastedWord => {
            if (lowerCaseName.includes(pastedWord)
              && pastedWord.length > 1) {
              nameMatch = nameMatch + 1;
            }
          });
          let pastedMatch: number = 0;
          nameWords.forEach(nameWord => {
            if (mtnLowerCase.includes(nameWord)
              && nameWord.length > 1) {
              pastedMatch = pastedMatch + 1;
            }
          });
          const letterMatch = intersection(lowerCaseName.split(''), letters).length;
          const percentMatchOriginal = letterMatch / mtn.length;
          const percentMatchTarget = letterMatch / name.length;
          const totalMatch = exactMatch + nameMatch + pastedMatch + percentMatchOriginal + percentMatchTarget;
          return totalMatch;
        });
        return matches;
      });
      const topChoices = matchPercentages.map((matches) => {
        return maxValIndicies(matches);
      });
      const usedPeak: string[] = [];
      const cleanPeaknames = topChoices.map(([a1, b1], i) => {
        const firstChoice = mountains[a1];
        const secondChoice = mountains[b1];
        // check if someone else has the same first choice but with a higher match rating
        let useSecondChoice: boolean = false;
        if (usedPeak.indexOf(firstChoice.name) !== -1) {
          useSecondChoice = true;
        }
        if (useSecondChoice === false) {
          topChoices.forEach(([a2], j) => {
            if (j !== i) {
              if (a2 === a1) {
                // get weight of a2
                if (matchPercentages[j][a1] > matchPercentages[i][a1]) {
                  useSecondChoice = true;
                }
              }
            }
          });
        }
        if (useSecondChoice === true) {
          // // if so return second choice
          usedPeak.push(secondChoice.name);
          return secondChoice;
        } else {
          usedPeak.push(firstChoice.name);
          return firstChoice;
        }
      });
      setCleanedMountains([...cleanPeaknames]);
    }
    setPastedMountains([...valueArray]);
  };

  const onMountainDatesPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedValue = e.target.value;
    const valueArray = pastedValue.split(/\r?\n/);
    if (cleanedMountains !== null &&
        valueArray.length === cleanedMountains.length + 1 &&
        valueArray[valueArray.length - 1] === '') {
      valueArray.pop();
    }
    if (valueArray.length > mountains.length || !pastedValue) {
      setCleanedDates(null);
    } else {
      const cleanedDatesArray: DateArray = [];
      valueArray.forEach(dateAsString => {
        const dateParts = dateAsString.split('/');
        if (dateAsString === '' || dateParts.length === 0) {
          cleanedDatesArray.push(undefined);
        } else if (dateParts.length === 3) {
          const month = parseInt(dateParts[0], 10);
          const day = parseInt(dateParts[1], 10);
          let year = parseInt(dateParts[2], 10);
          if (year < 1000) {
            if (year <= new Date().getFullYear() - 2000) {
              year = year + 2000;
            } else {
              year = year + 1900;
            }
          }
          if (isNaN(month) || isNaN(day) || isNaN(year)) {
            cleanedDatesArray.push(null);
          } else {
            cleanedDatesArray.push({day, month, year});
          }
        } else if (dateParts.length === 2) {
          // is it DD/(DD)/YYYY
          // or is is DD/YY/(YYYY)
          if (dateParts[1].length === 4) {
            const month = parseInt(dateParts[0], 10);
            const day = month;
            let year = parseInt(dateParts[1], 10);
            if (year < 1000) {
              if (year < new Date().getFullYear() - 2000) {
                year = year + 2000;
              } else {
                year = year + 1900;
              }
            }
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
              cleanedDatesArray.push(null);
            } else {
              cleanedDatesArray.push({day, month, year});
            }
          } else if (dateParts[1].length === 2) {
            const month = parseInt(dateParts[0], 10);
            const day = parseInt(dateParts[1], 10);
            const year = day + 2000;
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
              cleanedDatesArray.push(null);
            } else {
              cleanedDatesArray.push({day, month, year});
            }
          } else {
            cleanedDatesArray.push(null);
          }
        } else {
          cleanedDatesArray.push(null);
        }
      });
      setCleanedDates([...cleanedDatesArray]);
    }
    setPastedDates([...valueArray]);
  };

  const mountainList =
    (cleanedMountains === null || cleanedDates === null ||
      cleanedMountains.length !== cleanedDates.length)
    ? null
    : cleanedMountains.map((mtn, i) => {
    const fixMountain = (newMountain: MountainDatum) => {
      const newPeaks = cleanedMountains;
      newPeaks[i] = { ...newMountain };
      setCleanedMountains([...newPeaks]);
    };
    const fixDate = (value: string | undefined, dayMonthYear: keyof DateDatum) => {
      const newDates = cleanedDates;
      const originalDates = newDates[i];
      if (originalDates !== null && originalDates !== undefined && value !== undefined) {
        const numberValue = parseInt(value, 10);
        if (!isNaN(numberValue)) {
          newDates[i] = {...originalDates, [dayMonthYear]: numberValue};
        } else {
          newDates[i] = {...originalDates, [dayMonthYear]: -1};
        }
      }
      setCleanedDates([...newDates]);
    };
    const duplicate = (cleanedMountains.filter(({id}) => id === mtn.id).length > 1);
    return (
      <MountainItem
        userInput={pastedMountains[i]}
        officialMountain={mtn}
        mountains={mountains}
        fixMountain={fixMountain}
        fixDate={fixDate}
        duplicate={duplicate}
        date={cleanedDates[i]}
        dateInput={pastedDates[i]}
        index={i}
        getFluentString={getFluentString}
        key={mtn.id + i}
      />
    );
  });
  let errorMessage: React.ReactElement<any> | null;
  if (pastedMountains.length > mountains.length) {
      // mountains is longer than total mountains
      const pastedOutMountains = pastedMountains.map((mtn, i) => <li key={mtn + i}>{mtn}</li>);
      const mountainNames = mountains.map((mtn, i) => <li key={mtn.id + i}>{mtn.name}</li>);
      errorMessage = (
        <WarningBox>
          <p dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-error-message-your-list-too-long')}}/>
          <OutputContainer>
            <div>
              <h4>{getFluentString('import-ascents-your-input')}</h4>
              <ol>
                {pastedOutMountains}
              </ol>
            </div>
            <div>
              <h4>{getFluentString('import-ascents-mountains-on-list')}</h4>
              <ol>
                {mountainNames}
              </ol>
            </div>
          </OutputContainer>
        </WarningBox>
      );
  } else if (cleanedDates === null && cleanedMountains === null) {
    // neither list has received any input, no error
    errorMessage = null;
  } else if ((cleanedDates === null || cleanedDates.length === 0)  &&
    (cleanedMountains !== null && cleanedMountains.length !== 0)) {
    // mountains has input but dates does not
    // ask to paste in the dates
    errorMessage = (
      <WarningBox
        dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-error-message-please-paste-dates')}}
      />
    );
  } else if ((cleanedMountains === null || cleanedMountains.length === 0)  &&
    (cleanedDates !== null && cleanedDates.length !== 0)) {
    // date has input but mountains does not
    // ask to paste in the dates
    errorMessage = (
      <WarningBox
        dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-error-message-please-paste-mountains')}}
      />
    );
  } else if (cleanedDates !== null && cleanedMountains !== null
    && cleanedMountains.length !== 0 && cleanedDates.length !== 0
    && cleanedMountains.length !== cleanedDates.length) {
    // length of both lists does not match
    const biggerList = cleanedMountains.length > cleanedDates.length ? 'mountains' : 'dates';
    const smallerList = cleanedMountains.length > cleanedDates.length ? 'dates' : 'mountains';
    const pastedOutMountains = pastedMountains.map((mtn, i) => <li key={mtn + i}>{mtn}</li>);
    const pastedOutDates = pastedDates.map((date, i) => <li key={date + i}>{date}</li>);
    errorMessage = (
      <WarningBox>
        <p>{getFluentString('import-ascents-error-message-list-is-bigger-than-other', {
          'bigger-list': biggerList,
          'smaller-list': smallerList,
        })}</p>
        <OutputContainer>
          <div>
            <h4>{getFluentString('global-text-value-mountains')}</h4>
            <ol>
              {pastedOutMountains}
            </ol>
          </div>
          <div>
            <h4>{getFluentString('global-text-value-dates')}</h4>
            <ol>
              {pastedOutDates}
            </ol>
          </div>
        </OutputContainer>
      </WarningBox>
    );
  } else {
    errorMessage = null;
  }

  const allDataAvailable = !(cleanedDates === null || cleanedMountains === null
      || cleanedMountains.length === 0
      || cleanedDates.length === 0
      || cleanedMountains.length !== cleanedDates.length);

  const table = allDataAvailable
    ? (
      <Table>
        <UserInput>{getFluentString('import-ascents-your-name-input')}</UserInput>
        <ExpectedName>{getFluentString('import-ascents-name-output')}</ExpectedName>
        <UserDate>{getFluentString('import-ascents-your-date-input')}</UserDate>
        <ExpectedDate>{getFluentString('import-ascents-date-output')}</ExpectedDate>
        {mountainList}
      </Table>
    ) : null;

  const successMessage = allDataAvailable
      ? <SuccessBox dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-success-message')}} />
      : null;

  const submitBtnText: string = isLoading === false
    ? getFluentString('global-text-value-submit')
    : getFluentString('global-text-value-saving') + ` - (${percent}%)`;

  const submitBtn = allDataAvailable
      ? <SubmitButton onClick={onConfirm}>{submitBtnText}</SubmitButton>
      : null;

  const style: React.CSSProperties = isLoading === false ? {} : {
    pointerEvents: 'none',
    opacity: 0.5,
  };

  const actions = (
    <ButtonWrapper style={style}>
      <CancelButton onClick={onCancel}>
        {getFluentString('global-text-value-modal-cancel')}
      </CancelButton>
      {submitBtn}
    </ButtonWrapper>
  );

  return (
    <Modal
      onClose={onCancel}
      width={'900px'}
      height={'auto'}
      actions={actions}
    >
      <h2>{getFluentString('import-ascents-title')}</h2>
      <p>{getFluentString('import-ascents-para-1')}</p>
      <p>
        <em
          dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-date-note')}}
        />
      </p>
      <PasteContainer>
        <HelpTextContainer>
          <BigNumber>1</BigNumber>
          <HelpText
            dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-step-1')}}
          />
          <HelpGifContainer>
            <img
              src={selectMountainsGif}
              onClick={toggleMountainGif}
              alt={getFluentString('import-ascents-gif-help-alt-text')}
            />
          </HelpGifContainer>
        </HelpTextContainer>
        <HelpTextContainer>
          <BigNumber>2</BigNumber>
          <HelpText
            dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-step-2')}}
          />
          <HelpGifContainer>
            <img
              src={selectDatesGif}
              onClick={toggleDatesGif}
              alt={getFluentString('import-ascents-gif-help-alt-text')}
            />
          </HelpGifContainer>
        </HelpTextContainer>
        <PasteArea
          placeholder={getFluentString('import-ascents-paste-mountains-here')}
          onChange={onMountainNamesPaste}
        />
        <PasteArea
          placeholder={getFluentString('import-ascents-paste-dates-here')}
          onChange={onMountainDatesPaste}
        />
      </PasteContainer>
      {successMessage}
      {errorMessage}
      {table}
    </Modal>
  );
};

export default ImportAscentsModal;
