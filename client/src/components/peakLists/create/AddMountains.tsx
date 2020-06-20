import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
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
}

const AdditionalMountains = (props: Props) => {
  const {
    selectedMountains, setSelectedMountains, openParentModal,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [mountainSelectionModalOpen, setMountainSelectionModalOpen] = useState<boolean>(false);

  const total = selectedMountains && selectedMountains.length ? selectedMountains.length : 0;

  const addRemoveMountainsButtonText = !total
    ? getFluentString('trip-report-add-mtns-btn')
    : getFluentString('trip-report-add-remove-mtns-btn');
  const openParentModalButton = openParentModal !== undefined ? (
    <ButtonSecondary onClick={openParentModal}>
      {getFluentString('create-peak-list-select-parent-modal-button')}
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
    />
  ) : null;

  const removeMountainFromList = (mtnToRemove: MountainDatum) => {
    const updatedMtnList = selectedMountains.filter(mtn => mtn.id !== mtnToRemove.id);
    setSelectedMountains([...updatedMtnList]);
  };

  const selectedMountainsTable = selectedMountains.length ? (
    <div style={{backgroundColor: '#fff'}}>
      <MountainTable
        mountains={selectedMountains.map(mtn => ({...mtn, completionDates: null}))}
        user={null}
        type={PeakListVariants.standard}
        peakListId={null}
        peakListShortName={''}
        disableLinks={true}
        showCount={true}
        customAction={removeMountainFromList}
        customActionTitle={getFluentString('global-text-value-remove')}
        customActionText={<GhostButton>×</GhostButton>}
      />
    </div>
  ) : null;
  return (
    <>
      <AddButtonsContainer>
        <ButtonPrimary onClick={() => setMountainSelectionModalOpen(true)}>
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
