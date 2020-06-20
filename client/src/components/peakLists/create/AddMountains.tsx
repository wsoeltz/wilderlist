import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
  Section,
} from '../../../styling/styleUtils';
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

  const selectedMountainsList = selectedMountains.map(mtn => {
    return (
      <div>
        {mtn.name}
      </div>
    );
  });
  return (
    <>
      <AddButtonsContainer>
        <ButtonPrimary onClick={() => setMountainSelectionModalOpen(true)}>
          {addRemoveMountainsButtonText}
        </ButtonPrimary>
        {openParentModalButton}
      </AddButtonsContainer>
      {selectedMountainsList}
      {mountainSelectionModal}
    </>
  );
};

export default AdditionalMountains;
