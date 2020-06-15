import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
} from '../../../../../styling/styleUtils';
import { Mountain, State } from '../../../../../types/graphQLTypes';
import {getDistanceFromLatLonInMiles} from '../../../../../Utils';
import {
  SectionTitle,
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
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
}

interface Props {
  selectedMountains: MountainDatum[];
  setSelectedMountains: (mountains: MountainDatum[]) => void;
}

const AdditionalMountains = (props: Props) => {
  const {
    selectedMountains, setSelectedMountains,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [isMountainSelectorOpen, setMountainSelectorOpen] = useState<boolean>(false);

  const targetMountain = selectedMountains.length ? selectedMountains[0] : null;

  const selectedMountainList = selectedMountains.map(({name, elevation, latitude, longitude, state}, i) => {
    const stateAbbr = state && state.abbreviation ? ', ' + state.abbreviation : '';
    const distance = targetMountain && i !== 0
      ? ` | ${getDistanceFromLatLonInMiles({
        lat1: latitude, lon1: longitude, lat2: targetMountain.latitude, lon2: targetMountain.longitude,
      }).toFixed(2)} mi from ${targetMountain.name}` : '';
    return (
        <div>
          <strong>{name}{stateAbbr}</strong>
          <br />
          <small>{elevation}ft {distance}</small>
        </div>
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

  return (
    <>
      <SectionTitle>
        {getFluentString('trip-report-add-additional-mtns-title')}
      </SectionTitle>
      <small>
        {getFluentString('trip-report-add-additional-mtns-desc')}
      </small>
      {selectedMountainList}
      <ButtonPrimary onClick={() => setMountainSelectorOpen(true)}>
        Add/Remove Mountains
      </ButtonPrimary>
      {mountainSelectorModal}
    </>
  );
};

export default AdditionalMountains;
