import upperFirst from 'lodash/upperFirst';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  ButtonPrimary,
  ButtonSecondary,
  lightBorderColor,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {CoreItem, coreItemToCoreItems} from '../../../types/itemTypes';
import Modal, {mobileWidth} from '../../sharedComponents/Modal';
import Search from '../../sharedComponents/search';
import CopyItemsList from './CopyItemsList';

const Container = styled.div`
  background-color: ${tertiaryColor};
  overflow: hidden;
  border: 1px solid ${lightBorderColor};
  height: 300px;
  overflow: auto;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${mobileWidth}px) {
    padding: 1rem 0.5rem;
  }
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

interface Props {
  onCancel: () => void;
  type: CoreItem;
  copyItems: (items: any[]) => void;
}

const CopyItemsModal = (props: Props) => {
  const { onCancel, copyItems, type } = props;

  const getString = useFluent();
  const [peakListId, setPeakListId] = useState<string | null>(null);
  const [items, setItems] = useState<any[] | null>(null);

  const onClose = useCallback(() => {
    if (items) {
      copyItems(items);
      onCancel();
    }
  }, [items, onCancel, copyItems]);

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={onCancel}>
        {getString('global-text-value-modal-close')}
      </CancelButton>
      <ButtonPrimary onClick={onClose} disabled={!items || !items.length}>
        {getString('global-text-value-copy')} {upperFirst(coreItemToCoreItems(type))}
      </ButtonPrimary>
    </ButtonWrapper>
  );

  const itemList = peakListId ? (
    <CopyItemsList
      peakListId={peakListId}
      field={type}
      setItems={setItems}
    />
  ) : null;

  return (
    <Modal
      onClose={onCancel}
      width={'600px'}
      height={'auto'}
      actions={actions}
    >
      <h3>{getString('create-peak-list-select-parent-title', {type: upperFirst(coreItemToCoreItems(type))})}</h3>
      <Search
        endpoint={'/api/hiking-list-search'}
        ignore={[]}
        onSelect={(d) => setPeakListId(d.id)}
        onClear={() => setPeakListId(null)}
        placeholder={getString('global-text-value-search-hiking-lists')}
      />
      <Container>
        {itemList}
      </Container>
    </Modal>
  );
};

export default CopyItemsModal;
