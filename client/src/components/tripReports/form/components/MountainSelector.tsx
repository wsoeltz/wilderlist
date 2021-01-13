import { faMountain } from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import styled from 'styled-components';
import useFluent from '../../../../hooks/useFluent';
import {
  BasicIconInText,
  ButtonPrimary,
  DetailBox,
  DetailBoxTitle,
  lightBlue,
} from '../../../../styling/styleUtils';
import Modal from '../../../sharedComponents/Modal';
import Search from '../../../sharedComponents/search';
import {ModalButtonWrapper} from '../Utils';
import {MountainDatum} from './AddMountains';

const mobileWidth = 550; // in px

const Root = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
  height: 100%;

  @media (max-width: ${mobileWidth}px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto 350px;
    height: auto;
  }
`;

const SelectedMountainsRoot = styled.div`
  grid-column: 1 / -1;
  grid-row: 1;
`;

const SearchPanel = styled.div`
  width: 600px;
  grid-row: 2;
  display: flex;
  flex-direction: column;

  @media (max-width: ${mobileWidth}px) {
    width: 100%;
  }
`;

const SelectedMountainsDetails = styled(DetailBox)`
  display: flex;
  flex-wrap: wrap;
`;

const MountainItemRemove = styled.div`
  flex-shrink: 0;
  white-space: nowrap;
  background-color: ${lightBlue};
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  margin: 0.4rem 0.8rem 0.4rem 0;

  &:hover {
    cursor: pointer;
  }

  &:after {
    margin-left: 1rem;
    content: '×';
  }
`;

interface Props {
  initialSelectedMountains: MountainDatum[];
  closeAndAddMountains: (mountains: MountainDatum[]) => void;
}

const MountainSelector = (props: Props) => {
  const {
    initialSelectedMountains, closeAndAddMountains,
  } = props;

  const getString = useFluent();

  const [selectedMountains, setSelectedMountains] = useState<MountainDatum[]>(initialSelectedMountains);

  const addMountainToList = (newMtn: {datum: MountainDatum}) => {
    if (!selectedMountains.find(mtn => mtn.id === newMtn.datum.id)) {
      setSelectedMountains([...selectedMountains, newMtn.datum]);
    }
  };

  const removeMountainFromList = (mtnToRemove: MountainDatum) => {
    const updatedMtnList = selectedMountains.filter(mtn => mtn.id !== mtnToRemove.id);
    setSelectedMountains([...updatedMtnList]);
  };

  const selectedMountainList = selectedMountains.map(mtn => (
    <MountainItemRemove
      onClick={() => removeMountainFromList(mtn)}
      key={mtn.id}
    >
      {mtn.name}
    </MountainItemRemove>
  ));

  const onClose = () => {
    closeAndAddMountains(selectedMountains);
  };

  const actions = (
    <ModalButtonWrapper>
      <ButtonPrimary onClick={onClose} mobileExtend={true}>
        Done Updating Mountains
      </ButtonPrimary>
    </ModalButtonWrapper>
  );

  return (
    <Modal
      onClose={onClose}
      actions={actions}
      width={'650px'}
      height={'600px'}
    >
      <Root>
        <SelectedMountainsRoot>
          <DetailBoxTitle>
            <BasicIconInText icon={faMountain} />
            {getString('trip-report-add-additional-mtns-title')}
          </DetailBoxTitle>
          <SelectedMountainsDetails>
            {selectedMountainList}
          </SelectedMountainsDetails>
        </SelectedMountainsRoot>
        <SearchPanel>
          <Search
            endpoint={'/api/mountain-search'}
            ignore={selectedMountains.map(mtn => mtn.id)}
            onSelect={addMountainToList}
          />
        </SearchPanel>
      </Root>
    </Modal>
  );
};

export default MountainSelector;
