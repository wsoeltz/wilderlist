import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CSVLink } from 'react-csv';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
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

  const getString = useFluent();

  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onCancel} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
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
    if (mtn && type === PeakListVariants.standard) {
      const {
        name, state, elevation,
        completionDates,
      } = mtn;
      const date =
        completionDates && completionDates.type === PeakListVariants.standard && completionDates.standard
        ? formatDate(completionDates.standard) : '';
      const abbreviation = state ? state.abbreviation : '';
      csvData.push([
        name, elevation.toString(), abbreviation, date,
      ]);
    }
    if (mtn && type === PeakListVariants.winter) {
      const {
        name, state, elevation,
        completionDates,
      } = mtn;
      const date =
        completionDates && completionDates.type === PeakListVariants.winter && completionDates.winter
        ? formatDate(completionDates.winter) : '';
      const abbreviation = state ? state.abbreviation : '';
      csvData.push([
        name, elevation.toString(), abbreviation, date,
      ]);
    }
    if (mtn && type === PeakListVariants.fourSeason) {
      const {
        name, state, elevation,
        completionDates,
      } = mtn;
      const summerDate =
      completionDates && completionDates.type === PeakListVariants.fourSeason && completionDates.summer
      ? formatDate(completionDates.summer) : '';
      const fallDate =
      completionDates && completionDates.type === PeakListVariants.fourSeason && completionDates.fall
      ? formatDate(completionDates.fall) : '';
      const winterDate =
      completionDates && completionDates.type === PeakListVariants.fourSeason && completionDates.winter
      ? formatDate(completionDates.winter) : '';
      const springDate =
      completionDates && completionDates.type === PeakListVariants.fourSeason && completionDates.spring
      ? formatDate(completionDates.spring) : '';
      const abbreviation = state ? state.abbreviation : '';
      csvData.push([
        name, elevation.toString(), abbreviation,
        summerDate, fallDate, winterDate, springDate,
      ]);
    }
    if (mtn && type === PeakListVariants.grid) {
      const {
        name, state, elevation,
        completionDates,
      } = mtn;
      const abbreviation = state ? state.abbreviation : '';
      const januaryDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.january
        ? formatGridDate(completionDates.january) : '';
      const februaryDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.february
        ? formatGridDate(completionDates.february) : '';
      const marchDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.march
        ? formatGridDate(completionDates.march) : '';
      const aprilDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.april
        ? formatGridDate(completionDates.april) : '';
      const mayDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.may
        ? formatGridDate(completionDates.may) : '';
      const juneDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.june
        ? formatGridDate(completionDates.june) : '';
      const julyDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.july
        ? formatGridDate(completionDates.july) : '';
      const augustDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.august
        ? formatGridDate(completionDates.august) : '';
      const septemberDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.september
        ? formatGridDate(completionDates.september) : '';
      const octoberDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.october
        ? formatGridDate(completionDates.october) : '';
      const novemberDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.november
        ? formatGridDate(completionDates.november) : '';
      const decemberDate =
        completionDates && completionDates.type === PeakListVariants.grid && completionDates.december
        ? formatGridDate(completionDates.december) : '';
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
      {getString('download-official-grid-xlsx-button')}
    </DownloadLink>
  ) : null;

  return (
    <Modal
      onClose={onCancel}
      width={'80%'}
      height={'auto'}
      actions={actions}
    >
      <h2 style={{textAlign: 'center'}}>{getString('mountain-table-export-button')}</h2>
      <DownloadButtonsWrapper>
        <DownloadCSVLink
          headers={csvHeaders}
          data={csvData}
          filename={fileName}
        >
          <DownloadIcon icon={'file-csv'} />
          {getString('download-csv-button')}
        </DownloadCSVLink>
        {specialExportButton}
      </DownloadButtonsWrapper>
    </Modal>
  );
};

export default ExportAscentsModal;
