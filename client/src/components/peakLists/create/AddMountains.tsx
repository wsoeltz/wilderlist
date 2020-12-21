import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  ButtonPrimary,
  ButtonSecondary,
  GhostButton,
  Section,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import MountainTable from '../detail/MountainTable';
import MountainSelectionModal, {MountainDatum} from './MountainSelectionModal';

const AddButtonsContainer = styled(Section)`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  selectedMountains: MountainDatum[];
  setSelectedMountains: (mountains: MountainDatum[]) => void;
  openParentModal?: () => void;
  states: Array<{id: string, abbreviation: string}>;
}

const AdditionalMountains = (props: Props) => {
  const {
    selectedMountains, setSelectedMountains, openParentModal, states,
  } = props;

  const getString = useFluent();

  const [mountainSelectionModalOpen, setMountainSelectionModalOpen] = useState<boolean>(false);
  const openMountainSelectionModal = useCallback(() => setMountainSelectionModalOpen(true), []);

  const total = selectedMountains && selectedMountains.length ? selectedMountains.length : 0;

  const addRemoveMountainsButtonText = !total
    ? getString('trip-report-add-mtns-btn')
    : getString('trip-report-add-remove-mtns-btn');
  const openParentModalButton = openParentModal !== undefined ? (
    <ButtonSecondary onClick={openParentModal}>
      {getString('create-peak-list-select-parent-modal-button')}
    </ButtonSecondary>
  ) : null;
  const closeAndSetMountains = (mountains: MountainDatum[]) => {
    setSelectedMountains([...mountains]);
    setMountainSelectionModalOpen(false);
  };
  const mountainSelectionModal = mountainSelectionModalOpen ? (
    <MountainSelectionModal
      closeAndSetMountains={closeAndSetMountains}
      initialSelectedMountains={selectedMountains}
      states={states}
    />
  ) : null;

  const removeMountainFromList = (mtnToRemove: MountainDatum) => {
    const updatedMtnList = selectedMountains.filter(mtn => mtn.id !== mtnToRemove.id);
    setSelectedMountains([...updatedMtnList]);
  };

  const selectedMountainsTable = selectedMountains.length ? (
    <div style={{backgroundColor: '#fff'}}>
      <MountainTable
        key={'mountain-table-' + selectedMountains.length}
        mountains={selectedMountains.map(mtn => ({...mtn, completionDates: null}))}
        user={null}
        type={PeakListVariants.standard}
        peakListId={null}
        peakListShortName={''}
        disableLinks={true}
        showCount={true}
        customAction={removeMountainFromList}
        customActionTitle={getString('global-text-value-remove')}
        customActionText={<GhostButton>×</GhostButton>}
      />
    </div>
  ) : null;
  return (
    <>
      <AddButtonsContainer>
        <ButtonPrimary onClick={openMountainSelectionModal}>
          {addRemoveMountainsButtonText}
        </ButtonPrimary>
        {openParentModalButton}
      </AddButtonsContainer>
      {selectedMountainsTable}
      {mountainSelectionModal}
    </>
  );
};

export default AdditionalMountains;
