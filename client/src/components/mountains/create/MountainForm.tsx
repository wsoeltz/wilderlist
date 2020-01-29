import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext, useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  CheckboxInput,
  CheckboxRoot,
  GhostButton,
  InputBase,
  Label,
  SelectBox,
  LabelContainer,
} from '../../../styling/styleUtils';
import {
  Mountain,
  MountainFlag,
  PeakListVariants,
  State,
} from '../../../types/graphQLTypes';
import AreYouSureModal, {
  Props as AreYouSureModalProps,
} from '../../sharedComponents/AreYouSureModal';
import Map, {CoordinateWithDates} from '../../sharedComponents/map';
import { BaseMountainVariables } from './';
import {
  Root,
  Title,
  FullColumn,
  CheckboxLabel,
  ButtonWrapper,
  SaveButton,
  DeleteButton,
} from '../../sharedComponents/formUtils';

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

export const FLAG_MOUNTAIN = gql`
  mutation($id: ID!, $flag: MountainFlag) {
    mountain: updateMountainFlag(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

export interface FlagSuccessResponse {
  mountain: null | {
    id: Mountain['id'];
    flag: Mountain['flag'];
  };
}

export interface FlagVariables {
  id: string;
  flag: MountainFlag | null;
}

const latitudeMin = -90;
const latitudeMax = 90;
const longitudeMin = -180;
const longitudeMax = 180;
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

export interface InitialMountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: string;
  longitude: string;
  elevation: string;
  state: null | { id: State['id']};
  flag: MountainFlag | null;
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

  const latitude: number = validateFloatValue(stringLat, latitudeMin, latitudeMax);
  const longitude: number = validateFloatValue(stringLong, longitudeMin, longitudeMax);
  const elevation: number = validateFloatValue(stringElevation, elevationMin, elevationMax);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_NEARBY_MOUNTAINS, {
    variables: { latitude, longitude, latDistance: 0.1, longDistance: 0.2 },
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const closeAreYouSureModal = () => {
    setDeleteModalOpen(false);
  };
  const [updateMountainFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_MOUNTAIN);
  const flagForDeletion = (id: string) => {
    if (id) {
      updateMountainFlag({variables: {id, flag: MountainFlag.deleteRequest}});
    }
    closeAreYouSureModal();
  };
  const clearFlag = (id: string) => {
    if (id) {
      updateMountainFlag({variables: {id, flag: null}});
    }
    closeAreYouSureModal();
  };

  const areYouSureProps: AreYouSureModalProps = initialData.flag === MountainFlag.deleteRequest ? {
    onConfirm: () => clearFlag(initialData.id),
    onCancel: closeAreYouSureModal,
    title: getFluentString('global-text-value-cancel-delete-request'),
    text: getFluentString('global-text-value-modal-cancel-request-text', {
      name: initialData.name,
    }),
    confirmText: getFluentString('global-text-value-modal-confirm'),
    cancelText: getFluentString('global-text-value-modal-cancel'),
  } : {
    onConfirm: () => flagForDeletion(initialData.id),
    onCancel: closeAreYouSureModal,
    title: getFluentString('global-text-value-modal-request-delete-title'),
    text: getFluentString('global-text-value-modal-request-delete-text', {
      name: initialData.name,
    }),
    confirmText: getFluentString('global-text-value-modal-confirm'),
    cancelText: getFluentString('global-text-value-modal-cancel'),
  };

  const areYouSureModal = deleteModalOpen === false ? null : (
    <AreYouSureModal {...areYouSureProps}/>
  );

  let nearbyMountains: CoordinateWithDates[];
  if (!loading && !error && data !== undefined && data.mountains) {
    const filteredMountains = data.mountains.filter(mtn => mtn.id !== initialData.id);
    nearbyMountains = filteredMountains.map(mtn => ({...mtn, completionDates: null }));
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
    && latitude <= latitudeMax && latitude >= latitudeMin && longitude <= longitudeMax && longitude >= longitudeMin
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

  const titleText = initialData.name !== '' ? getFluentString('create-mountain-title-edit', {
    'mountain-name': initialData.name,
  }) : getFluentString('create-mountain-title-create');

  const deleteButtonText = initialData.flag !== MountainFlag.deleteRequest
    ? getFluentString('global-text-value-delete')
    : getFluentString('global-text-value-cancel-delete-request');

  const deleteButton = !initialData.id ? null : (
    <DeleteButton
      onClick={() => setDeleteModalOpen(true)}
    >
      {deleteButtonText}
    </DeleteButton>
  );

  return (
    <Root>
      <FullColumn>
        <Title>{titleText}</Title>
      </FullColumn>
      <FullColumn>
        <LabelContainer htmlFor={'create-mountain-name'}>
          <Label>
            {getFluentString('create-mountain-mountain-name-placeholder')}
          </Label>
        </LabelContainer>
        <InputBase
          id={'create-mountain-name'}
          type={'text'}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={getFluentString('create-mountain-mountain-name-placeholder')}
          autoComplete={'off'}
          maxLength={1000}
        />
      </FullColumn>
      <div>
        <LabelContainer htmlFor={'create-mountain-select-a-state'}>
          <Label>
            {getFluentString('global-text-value-state')}
          </Label>
        </LabelContainer>
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
        <LabelContainer htmlFor={'create-mountain-elevation'}>
          <Label>
            {getFluentString('global-text-value-elevation')}
            {' '}
            <small>({getFluentString('global-text-value-feet')})</small>
          </Label>
        </LabelContainer>
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
        <LabelContainer htmlFor={'create-mountain-latitude'}>
          <Label>
            {getFluentString('global-text-value-latitude')}
            {' '}
            <small>({getFluentString('create-mountain-latlong-note')})</small>
          </Label>
        </LabelContainer>
        <InputBase
          id={'create-mountain-latitude'}
          type={'number'}
          min={latitudeMin}
          max={latitudeMax}
          value={stringLat}
          onChange={e => setStringLat(e.target.value)}
          placeholder={getFluentString('create-mountain-latitude-placeholder')}
          autoComplete={'off'}
        />
      </div>
      <div>
        <LabelContainer htmlFor={'create-mountain-longitude'}>
          <Label>
            {getFluentString('global-text-value-longitude')}
            {' '}
            <small>({getFluentString('create-mountain-latlong-note')})</small>
          </Label>
        </LabelContainer>
        <InputBase
          id={'create-mountain-longitude'}
          type={'number'}
          min={longitudeMin}
          max={longitudeMax}
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
          {deleteButton}
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
      {areYouSureModal}
    </Root>
  );
};

export default withRouter(MountainForm);
