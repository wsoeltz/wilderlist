import { faMountain } from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import useFluent from '../../../../../hooks/useFluent';
import {
  BasicIconInText,
  ButtonPrimary,
  DetailBoxTitle,
  DetailBoxWithMargin,
  SemiBold,
  SmallTextNote,
} from '../../../../../styling/styleUtils';
import { Mountain, State } from '../../../../../types/graphQLTypes';
import {getDistanceFromLatLonInMiles} from '../../../../../Utils';
import {
  ButtonWrapper,
  ListItem,
} from '../Utils';
import MountainSelector from './MountainSelector';

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
  elevation: Mountain['elevation'];
  location: Mountain['location'];
}

interface Props {
  selectedMountains: MountainDatum[];
  setSelectedMountains: (mountains: MountainDatum[]) => void;
}

const AdditionalMountains = (props: Props) => {
  const {
    selectedMountains, setSelectedMountains,
  } = props;

  const getString = useFluent();

  const [isMountainSelectorOpen, setMountainSelectorOpen] = useState<boolean>(false);
  const openMountainSelector = useCallback(() => setMountainSelectorOpen(true), []);

  const targetMountain = selectedMountains.length ? selectedMountains[0] : null;

  const selectedMountainList = selectedMountains.map(({id, name, elevation, location, state}, i) => {
    const stateAbbr = state && state.abbreviation ? ', ' + state.abbreviation : '';
    const distance = targetMountain && i !== 0
      ? ` | ${getDistanceFromLatLonInMiles({
        lat1: location[1], lon1: location[0], lat2: targetMountain.location[1], lon2: targetMountain.location[0],
      }).toFixed(2)} mi from ${targetMountain.name}` : '';
    return (
        <ListItem key={id}>
          <SemiBold>{name}{stateAbbr}</SemiBold>
          <br />
          <SmallTextNote>{elevation}ft {distance}</SmallTextNote>
        </ListItem>
      );
  });

  const closeAndAddMountains = (mountains: MountainDatum[]) => {
    setSelectedMountains([...mountains]);
    setMountainSelectorOpen(false);
  };

  const mountainSelectorModal = isMountainSelectorOpen ? (
    <MountainSelector
      initialSelectedMountains={selectedMountains}
      closeAndAddMountains={closeAndAddMountains}
    />
  ) : null;

  const addBtnText = selectedMountains.length
    ? getString('trip-report-add-remove-mtns-btn') : getString('trip-report-add-mtns-btn');

  return (
    <>
      <DetailBoxTitle>
        <BasicIconInText icon={faMountain} />
        {getString('trip-report-add-additional-mtns-title')}
      </DetailBoxTitle>
      <DetailBoxWithMargin>
        <SmallTextNote style={{marginBottom: '0.45rem'}}>
          {getString('trip-report-add-additional-mtns-desc')}
        </SmallTextNote>
        <div>
          {selectedMountainList}
        </div>
        <ButtonWrapper>
          <ButtonPrimary onClick={openMountainSelector}>
            {addBtnText}
          </ButtonPrimary>
        </ButtonWrapper>
      </DetailBoxWithMargin>
      {mountainSelectorModal}
    </>
  );
};

export default AdditionalMountains;
