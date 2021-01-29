import {faCopy} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  BasicIconInText,
  CompactButtonSecondary,
} from '../../../styling/styleUtils';
import {CoreItem} from '../../../types/itemTypes';
import CopyItemsModal from './CopyItemsModal';

const CopyButton = styled(CompactButtonSecondary)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  padding: 0 0.5rem;
`;

interface Props {
  type: CoreItem;
  copyItems: (items: any[]) => void;
}

const CopyItemsButton = ({type, copyItems}: Props) => {
  const getString = useFluent();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
  const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

  const modal = modalOpen ? (
    <CopyItemsModal
      onCancel={closeModal}
      type={type}
      copyItems={copyItems}
    />
  ) : null;

  return (
    <>
      <CopyButton onClick={openModal}>
        <BasicIconInText icon={faCopy} />
        {getString('create-peak-list-copy-from-list-button')}
      </CopyButton>
      {modal}
    </>
  );

};

export default CopyItemsButton;
