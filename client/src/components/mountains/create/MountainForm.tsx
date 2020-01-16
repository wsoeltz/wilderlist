import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext, useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  CheckboxInput,
  CheckboxLabel as CheckboxLabelBase,
  CheckboxRoot,
  GhostButton,
  InputBase,
  Label,
  SelectBox,
} from '../../../styling/styleUtils';
import { Mountain, PeakListVariants, State } from '../../../types/graphQLTypes';
import Map, {CoordinateWithDates} from '../../sharedComponents/map';
import { BaseMountainVariables } from './';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`;

const FullColumn = styled.div`
  grid-column: span 2;
`;

const CheckboxLabel = styled(CheckboxLabelBase)`
  margin-bottom: 1rem;
  font-size: 0.8rem;
  line-height: 1.6;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled(ButtonPrimary)`
  min-width: 100px;
  margin-left: 1rem;
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
  }>;
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
};

export interface StateDatum {
  id: State['id'];
  name: State['name'];
  abbreviation: State['abbreviation'];
}

interface InitialMountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: string;
  longitude: string;
  elevation: string;
  state: null | { id: State['id']};
}

interface Props extends RouteComponentProps {
  states: StateDatum[];
  initialData: InitialMountainDatum;
  onSubmit: (input: BaseMountainVariables) => void;
}

const MountainForm = (props: Props) => {
  const { states, initialData, onSubmit, history } = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [name, setName] = useState<string>(initialData.name);

  const [stringLat, setStringLat] = useState<string>(initialData.latitude);
  const [stringLong, setStringLong] = useState<string>(initialData.longitude);

  const [stringElevation, setStringElevation] = useState<string>(initialData.elevation);
  const [selectedState, setSelectedState] = useState<State['id'] | null>(
    initialData.state === null ? null : initialData.state.id,
  );

  const [verifyChangesIsChecked, setVerifyChangesIsChecked] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

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
  };

  const setLatLongFromMap = (lat: string | number, long: string | number) => {
    setStringLat('' + lat);
    setStringLong('' + long);
  };

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
          showCenterCrosshairs={true}
          returnLatLongOnClick={setLatLongFromMap}
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

  const preventSubmit = () =>
    (name && selectedState && latitude && longitude &&
     elevation && verifyChangesIsChecked && !loadingSubmit) ? false : true;

  const validateAndSave = () => {
    if (name && selectedState && latitude && longitude &&
        elevation && verifyChangesIsChecked && !loadingSubmit) {
      setLoadingSubmit(true);
      onSubmit({name, latitude, longitude, elevation, state: selectedState});
    }
  };

  const saveButtonText = loadingSubmit === true
    ? getFluentString('global-text-value-saving') + '...' : getFluentString('global-text-value-save');

  return (
    <Root>
      <FullColumn>
        <h1>{getFluentString('create-mountain-title-create')}</h1>
      </FullColumn>
      <FullColumn>
        <label htmlFor={'create-mountain-name'}>
          <Label>
            {getFluentString('create-mountain-mountain-name-placeholder')}
          </Label>
        </label>
        <InputBase
          id={'create-mountain-name'}
          type={'text'}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={getFluentString('create-mountain-mountain-name-placeholder')}
          autoComplete={'off'}
        />
      </FullColumn>
      <div>
        <label htmlFor={'create-mountain-select-a-state'}>
          <Label>
            {getFluentString('global-text-value-state')}
          </Label>
        </label>
        <SelectBox
          id={'create-mountain-select-a-state'}
          value={`${selectedState || ''}`}
          onChange={e => setSelectedState(e.target.value)}
          placeholder={getFluentString('create-mountain-select-a-state')}
        >
          <option value='' key='empty-option-to-select'></option>
          {stateOptions}
        </SelectBox>
      </div>
      <div>
        <label htmlFor={'create-mountain-elevation'}>
          <Label>
            {getFluentString('global-text-value-elevation')}
            {' '}
            <small>({getFluentString('global-text-value-feet')})</small>
          </Label>
        </label>
        <InputBase
          id={'create-mountain-elevation'}
          type={'number'}
          min={elevationMin}
          max={elevationMax}
          value={stringElevation}
          onChange={e => setStringElevation(e.target.value)}
          placeholder={getFluentString('create-mountain-elevation-placeholder')}
          autoComplete={'off'}
        />
      </div>
      <div>
        <label htmlFor={'create-mountain-latitude'}>
          <Label>
            {getFluentString('global-text-value-latitude')}
            {' '}
            <small>({getFluentString('create-mountain-latlong-note')})</small>
          </Label>
        </label>
        <InputBase
          id={'create-mountain-latitude'}
          type={'number'}
          max={longLatMax}
          min={longLatMin}
          value={stringLat}
          onChange={e => setStringLat(e.target.value)}
          placeholder={getFluentString('create-mountain-latitude-placeholder')}
          autoComplete={'off'}
        />
      </div>
      <div>
        <label htmlFor={'create-mountain-longitude'}>
          <Label>
            {getFluentString('global-text-value-longitude')}
            {' '}
            <small>({getFluentString('create-mountain-latlong-note')})</small>
          </Label>
        </label>
        <InputBase
          id={'create-mountain-longitude'}
          type={'number'}
          max={longLatMax}
          min={longLatMin}
          value={stringLong}
          onChange={e => setStringLong(e.target.value)}
          placeholder={getFluentString('create-mountain-longitude-placeholder')}
          autoComplete={'off'}
        />
      </div>
      <FullColumn>
        <CheckboxRoot>
          <CheckboxInput
            type='checkbox'
            value={'verify-changes-are-accurate'}
            id={`verify-changes-are-accurate`}
            checked={verifyChangesIsChecked}
            onChange={() => setVerifyChangesIsChecked(!verifyChangesIsChecked)}
          />
          <CheckboxLabel htmlFor={`verify-changes-are-accurate`}>
            {getFluentString('create-mountain-check-your-work')}
           </CheckboxLabel>
        </CheckboxRoot>
        <ButtonWrapper>
          <GhostButton onClick={history.goBack}>
            {getFluentString('global-text-value-modal-cancel')}
          </GhostButton>
          <SaveButton
            disabled={preventSubmit()}
            onClick={validateAndSave}
          >
            {saveButtonText}
          </SaveButton>
        </ButtonWrapper>
      </FullColumn>
      <FullColumn>
        {map}
      </FullColumn>
    </Root>
  );
};

export default withRouter(MountainForm);
