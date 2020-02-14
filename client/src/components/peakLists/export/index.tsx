import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import { CSVLink } from 'react-csv';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonSecondary,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import Modal from '../../sharedComponents/Modal';
import { MountainDatumWithDate } from '../detail/MountainRow';
import {
  formatDate,
  formatGridDate,
} from '../Utils';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DownloadButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const downloadLinkStyles = `
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  font-size: 0.9rem;
  margin: 0.5rem 1rem;
  max-width: 120px;
`;

const DownloadLink = styled.a`
  ${downloadLinkStyles}
`;

const DownloadCSVLink = styled(CSVLink)`
  ${downloadLinkStyles}
`;

const DownloadIcon = styled(FontAwesomeIcon)`
  display: block;
  font-size: 40px;
  margin-bottom: 0.8rem;
`;

export enum SpecialExport {
  nh48grid = 'nh48grid',
}

interface Props {
  mountains: MountainDatumWithDate[];
  type: PeakListVariants;
  listShortName: string;
  onCancel: () => void;
  specialExport: SpecialExport | null;
}

const ExportAscentsModal = (props: Props) => {
  const { onCancel, mountains, listShortName, type, specialExport } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onCancel}>
        {getFluentString('global-text-value-modal-close')}
      </ButtonSecondary>
    </ButtonWrapper>
  );

  let csvHeaders: string[];
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    csvHeaders = [
      'Name', 'Elevation', 'State', 'Date',
    ];
  } else if (type === PeakListVariants.fourSeason) {
    csvHeaders = [
      'Name', 'Elevation', 'State',
      'Summer', 'Fall', 'Winter', 'Spring',
    ];
  } else if (type === PeakListVariants.grid) {
    csvHeaders = [
      'Name', 'Elevation', 'State',
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec',
    ];
  } else {
    csvHeaders = [];
    failIfValidOrNonExhaustive(type, 'Invalid value for ' + type);
  }

  const csvData: string[][] = [];
  mountains.forEach(mtn => {
    if (mtn && mtn.completionDates && mtn.completionDates.type === PeakListVariants.standard) {
      const {
        name, state: {abbreviation}, elevation,
        completionDates: {standard},
      } = mtn;
      const date = standard ? formatDate(standard) : '';
      csvData.push([
        name, elevation.toString(), abbreviation, date,
      ]);
    }
    if (mtn && mtn.completionDates && mtn.completionDates.type === PeakListVariants.winter) {
      const {
        name, state: {abbreviation}, elevation,
        completionDates: {winter},
      } = mtn;
      const date = winter ? formatDate(winter) : '';
      csvData.push([
        name, elevation.toString(), abbreviation, date,
      ]);
    }
    if (mtn && mtn.completionDates && mtn.completionDates.type === PeakListVariants.fourSeason) {
      const {
        name, state: {abbreviation}, elevation,
        completionDates: {summer, fall, winter, spring},
      } = mtn;
      const summerDate = summer ? formatDate(summer) : '';
      const fallDate = fall ? formatDate(fall) : '';
      const winterDate = winter ? formatDate(winter) : '';
      const springDate = spring ? formatDate(spring) : '';
      csvData.push([
        name, elevation.toString(), abbreviation,
        summerDate, fallDate, winterDate, springDate,
      ]);
    }
    if (mtn && mtn.completionDates && mtn.completionDates.type === PeakListVariants.grid) {
      const {
        name, state: {abbreviation}, elevation,
        completionDates: {
          january, february, march, april,
          may, june, july, august, september,
          october, november, december,
        },
      } = mtn;
      const januaryDate = january ? formatGridDate(january) : '';
      const februaryDate = february ? formatGridDate(february) : '';
      const marchDate = march ? formatGridDate(march) : '';
      const aprilDate = april ? formatGridDate(april) : '';
      const mayDate = may ? formatGridDate(may) : '';
      const juneDate = june ? formatGridDate(june) : '';
      const julyDate = july ? formatGridDate(july) : '';
      const augustDate = august ? formatGridDate(august) : '';
      const septemberDate = september ? formatGridDate(september) : '';
      const octoberDate = october ? formatGridDate(october) : '';
      const novemberDate = november ? formatGridDate(november) : '';
      const decemberDate = december ? formatGridDate(december) : '';
      csvData.push([
        name, elevation.toString(), abbreviation,
        januaryDate, februaryDate, marchDate, aprilDate,
        mayDate, juneDate, julyDate, augustDate, septemberDate,
        octoberDate, novemberDate, decemberDate,
      ]);
    }
  });

  const fileName = `wilderlist-${listShortName.toLowerCase()}-${type.toLowerCase()}.csv`;

  const specialExportButton = specialExport === SpecialExport.nh48grid ? (
    <DownloadLink href='/download/grid-application.xlsx'>
      <DownloadIcon icon={'file-excel'} />
      {getFluentString('download-official-grid-xlsx-button')}
    </DownloadLink>
  ) : null;

  return (
    <Modal
      onClose={onCancel}
      width={'80%'}
      height={'auto'}
      actions={actions}
    >
      <h2 style={{textAlign: 'center'}}>{getFluentString('mountain-table-export-button')}</h2>
      <DownloadButtonsWrapper>
        <DownloadCSVLink
          headers={csvHeaders}
          data={csvData}
          filename={fileName}
        >
          <DownloadIcon icon={'file-csv'} />
          {getFluentString('download-csv-button')}
        </DownloadCSVLink>
        {specialExportButton}
      </DownloadButtonsWrapper>
    </Modal>
  );
};

export default ExportAscentsModal;
