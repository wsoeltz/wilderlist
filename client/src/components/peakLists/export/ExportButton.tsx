import {faDownload} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  BasicIconInTextCompact,
  LinkButtonCompact,
} from '../../../styling/styleUtils';
import {KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import SignUpModal from '../../sharedComponents/SignUpModal';
import { NH48_GRID_OBJECT_ID } from '../import/ImportGrid';
import ExportModal, {SpecialExport} from './';

const Link = styled(LinkButtonCompact)`
  margin-right: 0.75rem;
`;

interface Props {
  items: any[];
  dataFieldKeys: KeySortPair[];
  stringDateFields: KeySortPair[];
  peakListId: string;
}

const ExportButton = (props: Props) => {
  const {items, dataFieldKeys, stringDateFields, peakListId} = props;
  const user = useCurrentUser();
  const getString = useFluent();
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  let exportDataModal: React.ReactElement<any> | null;
  if (user && isExportModalOpen === true) {
    const keys: KeySortPair[] = [
      {
        displayKey: 'name',
        sortKey: 'name',
        label: 'Name',
      },
      ...dataFieldKeys,
      ...stringDateFields,
    ];
    const csvData = items.map((item) => {
      const value: {[key: string]: string} = {};
      keys.forEach(({displayKey, label}) => {
        value[label] = item[displayKey];
      });
      return value;
    });

    exportDataModal = (
      <ExportModal
        items={csvData}
        onCancel={() => setIsExportModalOpen(false)}
        specialExport={peakListId === NH48_GRID_OBJECT_ID ? SpecialExport.nh48grid : null}
        peakListId={peakListId}
      />
    );
  } else if (isExportModalOpen === true) {
    exportDataModal = (
        <SignUpModal
          text={getString('global-text-value-modal-sign-up-today-import')}
          onCancel={() => setIsExportModalOpen(false)}
        />
    );
  } else {
    exportDataModal = null;
  }

  return (
    <>
      <Link onClick={() => setIsExportModalOpen(true)}>
        <BasicIconInTextCompact icon={faDownload} />
        {getString('mountain-table-export-button')}
      </Link>
      {exportDataModal}
    </>
  );
};

export default ExportButton;
