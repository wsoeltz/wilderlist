import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CSVLink } from 'react-csv';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {useBasicListDetails} from '../../../queries/lists/useBasicListDetails';
import {
  ButtonSecondary,
} from '../../../styling/styleUtils';
import Modal from '../../sharedComponents/Modal';

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
  items: any[];
  onCancel: () => void;
  specialExport: SpecialExport | null;
  peakListId: string;
}

const ExportAscentsModal = (props: Props) => {
  const { onCancel, items, specialExport, peakListId } = props;

  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const {data: listDetails} = useBasicListDetails(peakListId, userId);

  const getString = useFluent();

  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onCancel} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
      </ButtonSecondary>
    </ButtonWrapper>
  );

  const fileName = listDetails && listDetails.peakList
    ? `${listDetails.peakList.name} - ${
      getString('global-text-value-list-type', {type: listDetails.peakList.type})
    }.csv` : 'Wilderlist Data.tsx';

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
          data={items}
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
