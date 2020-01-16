import React, {useState, useContext} from 'react';
import {
  ButtonPrimary,
  ButtonSecondary,
  InputBase,
  Label,
  SelectBox,
} from '../../../styling/styleUtils';
import styled from 'styled-components';
import Map, {CoordinateWithDates} from '../../sharedComponents/map';
import { Mountain, PeakListVariants, State } from '../../../types/graphQLTypes';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { GetString } from 'fluent-react';
import sortBy from 'lodash/sortBy';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`;

const FullColumn = styled.div`
  grid-column: span 2;
`;

const GET_NEARBY_MOUNTAINS = gql`
  query getNearbyMountains(
    $latitude: Float!, $longitude: Float!, $latDistance: Float!, $longDistance: Float!) {
  mountains: nearbyMountains(
    latitude: $latitude,
    longitude: $longitude,
    latDistance: $latDistance,
    longDistance: $longDistance,
  ) {
    id
    name
    latitude
    longitude
    elevation
  }
}
`;

interface SuccessResponse {
  mountains: null | Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    latitude: Mountain['latitude'];
    longitude: Mountain['longitude'];
    elevation: Mountain['elevation'];
  }>
}

interface Variables {
  latitude: number;
  longitude: number;
  latDistance: number;
  longDistance: number;
}


const longLatMin = -90;
const longLatMax = 90;
const elevationMin = 0;
const elevationMax = 29029; // Height of Everest

const validateFloatValue = (value: string, min: number, max: number) => {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    return 0;
  } else if (parsedValue > max || parsedValue < min) {
    return 0;
  } else {
    return parsedValue;
  }
}

export interface StateDatum {
  id: State['id'];
  name: State['name'];
  abbreviation: State['abbreviation'];
}

interface Props {
  states: StateDatum[];
}

const MountainForm = (props: Props) => {
  const { states } = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [name, setName] = useState<string>('');

  const [stringLat, setStringLat] = useState<string>('');
  const [stringLong, setStringLong] = useState<string>('');

  const [stringElevation, setStringElevation] = useState<string>('');
  const [selectedState, setSelectedState] = useState<State['id'] | null>(null);

  const latitude: number = validateFloatValue(stringLat, longLatMin, longLatMax);
  const longitude: number = validateFloatValue(stringLong, longLatMin, longLatMax);
  const elevation: number = validateFloatValue(stringElevation, elevationMin, elevationMax);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_NEARBY_MOUNTAINS, {
    variables: { latitude, longitude, latDistance: 0.1, longDistance: 0.2 },
  });

  let nearbyMountains: CoordinateWithDates[];
  if (!loading && !error && data !== undefined && data.mountains) {
    nearbyMountains = data.mountains.map(mtn => ({...mtn, completionDates: null }));
  } else {
    nearbyMountains = [];
  }

  const coordinate: CoordinateWithDates = {
    id: '',
    latitude, longitude,
    name: name ? name : `[${getFluentString('create-mountain-mountain-name-placeholder')}]`,
    elevation,
    completionDates: null,
  }

  const map = !isNaN(latitude) && !isNaN(longitude) && !isNaN(elevation)
    && latitude <= 90 && latitude >= - 90 && longitude <= 90 && longitude >= - 90
    ? (
        <Map
          id={''}
          coordinates={[coordinate, ...nearbyMountains]}
          highlighted={[coordinate]}
          peakListType={PeakListVariants.standard}
          userId={null}
          isOtherUser={true}
          createOrEditMountain={true}
          key={'create-mountain-key'}
        />
      ) : null;

  const sortedStates = sortBy(states, ['name']);
  const stateOptions = sortedStates.map(state => {
    return (
      <option key={state.id} value={state.id}>
        {state.name} ({state.abbreviation})
      </option>
    );
  });

  return (
    <Root>
      <FullColumn>
        <Label>
          {getFluentString('create-mountain-mountain-name-placeholder')}
        </Label>
        <InputBase
          type={'text'}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={getFluentString('create-mountain-mountain-name-placeholder')}
        />
      </FullColumn>
      <div>
        <Label>
          {getFluentString('global-text-value-state')}
        </Label>
        <SelectBox
          value={`${selectedState || ''}`}
          onChange={e => setSelectedState(e.target.value)}
          placeholder={getFluentString('create-mountain-select-a-state')}
        >
          <option value='' key='empty-option-to-select'></option>
          {stateOptions}
        </SelectBox>
      </div>
      <div>
        <Label>
          {getFluentString('global-text-value-elevation')}
        </Label>
        <InputBase
          type={'number'}
          min={elevationMin}
          max={elevationMax}
          value={stringElevation}
          onChange={e => setStringElevation(e.target.value)}
          placeholder={getFluentString('create-mountain-elevation-placeholder')}
        />
      </div>
      <div>
        <Label>
          {getFluentString('global-text-value-latitude')}
        </Label>
        <InputBase
          type={'number'}
          max={longLatMax}
          min={longLatMin}
          value={stringLat}
          onChange={e => setStringLat(e.target.value)}
          placeholder={getFluentString('create-mountain-latitude-placeholder')}
        />
      </div>
      <div>
        <Label>
          {getFluentString('global-text-value-longitude')}
        </Label>
        <InputBase
          type={'number'}
          max={longLatMax}
          min={longLatMin}
          value={stringLong}
          onChange={e => setStringLong(e.target.value)}
          placeholder={getFluentString('create-mountain-longitude-placeholder')}
        />
      </div>
      <FullColumn>
        <ButtonSecondary>
          Cancel
        </ButtonSecondary>
        <ButtonPrimary>
          Submit
        </ButtonPrimary>
      </FullColumn>
      <FullColumn>
        <p>
          {getFluentString('create-mountain-check-your-work')}
        </p>
        {map}
      </FullColumn>
    </Root>
  );
}

export default MountainForm;