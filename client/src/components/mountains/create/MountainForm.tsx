import { useMutation, useQuery } from '@apollo/react-hooks';
import { faCheck, faClone, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext, useState} from 'react';
import { createPortal } from 'react-dom';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  ButtonPrimary,
  CheckboxInput,
  CheckboxRoot,
  GhostButton,
  InputBase,
  Label,
  LabelContainer,
  Required,
  SelectBox,
  TextareaBase,
} from '../../../styling/styleUtils';
import {
  ExternalResource,
  Mountain,
  MountainFlag,
  State,
} from '../../../types/graphQLTypes';
import { RequiredNote } from '../../peakLists/create/PeakListForm';
import AreYouSureModal, {
  Props as AreYouSureModalProps,
} from '../../sharedComponents/AreYouSureModal';
import {
  ButtonWrapper,
  CheckboxLabel,
  DeleteButton,
  FullColumn,
  ResourceContainer,
  Root,
  SaveButton,
  Title,
} from '../../sharedComponents/formUtils';
import Map, {CoordinateWithDates, MapContainer} from '../../sharedComponents/map';
import { legendColorScheme, legendSymbolScheme } from '../../sharedComponents/map/colorScaleColors';
import { BaseMountainVariables } from './';

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

const validateFloatValue = (value: string, min: number, max: number, defaultValue: number = 0) => {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    return defaultValue;
  } else if (parsedValue > max || parsedValue < min) {
    return defaultValue;
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
  description: string;
  resources: ExternalResource[];
}

interface Props {
  states: StateDatum[];
  initialData: InitialMountainDatum;
  onSubmit: (input: BaseMountainVariables) => void;
  onSubmitAndAddAnother: null | ((input: BaseMountainVariables) => void);
  mapContainer: HTMLDivElement | null;
  onCancel: () => void;
}

const MountainForm = (props: Props) => {
  const { states, initialData, onSubmit, onSubmitAndAddAnother, mapContainer, onCancel } = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [name, setName] = useState<string>(initialData.name);

  const [stringLat, setStringLat] = useState<string>(initialData.latitude);
  const [stringLong, setStringLong] = useState<string>(initialData.longitude);

  const [stringElevation, setStringElevation] = useState<string>(initialData.elevation);
  const [selectedState, setSelectedState] = useState<State['id'] | null>(
    initialData.state === null ? null : initialData.state.id,
  );

  const [description, setDescription] = useState<string>(initialData.description);
  const [externalResources, setExternalResources] =
  useState<ExternalResource[]>([...initialData.resources, {title: '', url: ''}]);

  const [verifyChangesIsChecked, setVerifyChangesIsChecked] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const latitude: number = validateFloatValue(stringLat, latitudeMin, latitudeMax, 43.20415146);
  const longitude: number = validateFloatValue(stringLong, longitudeMin, longitudeMax, -71.52769471);
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
    nearbyMountains = data.mountains.filter(mtn => mtn.id !== initialData.id);
  } else {
    nearbyMountains = [];
  }

  const coordinate: CoordinateWithDates = {
    id: '',
    latitude, longitude,
    name: name ? name : `[${getFluentString('create-mountain-mountain-name-placeholder')}]`,
    elevation,
  };

  const setLatLongFromMap = (lat: string | number, long: string | number) => {
    setStringLat('' + lat);
    setStringLong('' + long);
  };

  let map: React.ReactElement<any> | null;
  if (mapContainer !== null) {
    map = !isNaN(latitude) && !isNaN(longitude) && !isNaN(elevation)
      && latitude <= latitudeMax && latitude >= latitudeMin && longitude <= longitudeMax && longitude >= longitudeMin
      ? createPortal((
          <FullColumn style={{height: '100%'}}>
            <Map
              mountainId={null}
              peakListId={null}
              coordinates={[coordinate, ...nearbyMountains]}
              highlighted={[coordinate]}
              userId={null}
              isOtherUser={true}
              createOrEditMountain={true}
              showCenterCrosshairs={true}
              returnLatLongOnClick={setLatLongFromMap}
              colorScaleColors={[legendColorScheme.secondary, legendColorScheme.primary]}
              colorScaleSymbols={[legendSymbolScheme.secondary, legendSymbolScheme.primary]}
              colorScaleLabels={[
                getFluentString('create-mountain-map-nearby-mountains'),
                getFluentString('create-mountain-map-your-mountain'),
              ]}
              fillSpace={true}
              key={'create-mountain-key'}
            />
          </FullColumn>
      ), mapContainer) : null;
  } else {
    map = !isNaN(latitude) && !isNaN(longitude) && !isNaN(elevation)
      && latitude <= latitudeMax && latitude >= latitudeMin && longitude <= longitudeMax && longitude >= longitudeMin
      ? (
        <FullColumn>
          <MapContainer>
            <Map
              mountainId={null}
              peakListId={null}
              coordinates={[coordinate, ...nearbyMountains]}
              highlighted={[coordinate]}
              userId={null}
              isOtherUser={true}
              createOrEditMountain={true}
              showCenterCrosshairs={true}
              returnLatLongOnClick={setLatLongFromMap}
              colorScaleColors={[legendColorScheme.secondary, legendColorScheme.primary]}
              colorScaleSymbols={[legendSymbolScheme.secondary, legendSymbolScheme.primary]}
              colorScaleLabels={[
                getFluentString('create-mountain-map-nearby-mountains'),
                getFluentString('create-mountain-map-your-mountain'),
              ]}
              key={'create-mountain-key'}
            />
          </MapContainer>
        </FullColumn>
      ) : null;
  }

  const sortedStates = sortBy(states, ['name']);
  const stateOptions = sortedStates.map(state => {
    return (
      <option key={state.id} value={state.id}>
        {state.name} ({state.abbreviation})
      </option>
    );
  });

  const handleExternalResourceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    (field: keyof ExternalResource, index: number) =>
      setExternalResources(
        externalResources.map((resource, _index) => {
          if (resource[field] === e.target.value || index !== _index) {
            return resource;
          } else {
            return {...resource, [field]: e.target.value};
          }
        },
      ),
    );

  const deleteResource = (e: React.MouseEvent<HTMLButtonElement>) => (index: number) => {
    e.preventDefault();
    setExternalResources(externalResources.filter((_v, i) => i !== index));
  };

  const resourceInputs = externalResources.map((resource, i) => (
    <ResourceContainer key={i}>
      <InputBase
        value={resource.title}
        onChange={e => handleExternalResourceChange(e)('title', i)}
        placeholder={getFluentString('global-text-value-resource-title')}
        autoComplete={'off'}
      />
      <InputBase
        value={resource.url}
        onChange={e => handleExternalResourceChange(e)('url', i)}
        placeholder={getFluentString('global-text-value-resource-url')}
        autoComplete={'off'}
      />
      <GhostButton onClick={e => deleteResource(e)(i)}>
        × {getFluentString('global-text-value-remove')}
      </GhostButton>
    </ResourceContainer>
  ));

  const preventSubmit = () =>
    (name && selectedState && latitude && longitude &&
     elevation && verifyChangesIsChecked && !loadingSubmit) ? false : true;

  const validateAndSave = () => {
    if (name && selectedState && latitude && longitude &&
        elevation && verifyChangesIsChecked && !loadingSubmit) {
      setLoadingSubmit(true);
      const resources = externalResources.filter(resource => resource.title.length && resource.url.length);
      onSubmit({
        name, latitude, longitude, elevation, state: selectedState, description, resources});
    }
  };

  const validateAndSaveAndAdd = () => {
    if (name && selectedState && latitude && longitude &&
        elevation && verifyChangesIsChecked && !loadingSubmit && onSubmitAndAddAnother) {
      setLoadingSubmit(true);
      const resources = externalResources.filter(resource => resource.title.length && resource.url.length);
      onSubmitAndAddAnother({
        name, latitude, longitude, elevation, state: selectedState, description, resources});
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
      <BasicIconInText icon={faTrash} />
      {deleteButtonText}
    </DeleteButton>
  );

  const createAnotherText = loadingSubmit === true
    ? getFluentString('global-text-value-saving') + '...' : getFluentString('global-text-value-save-and-add');

  const createAnother = !initialData.id && onSubmitAndAddAnother !== null ? (
    <SaveButton
      disabled={preventSubmit()}
      onClick={validateAndSaveAndAdd}
    >
      <BasicIconInText icon={faClone} />
      {createAnotherText}
    </SaveButton>
  ) : null;

  return (
    <Root>
      <FullColumn>
        <Title>{titleText}</Title>
        <RequiredNote
          dangerouslySetInnerHTML={{
            __html: getFluentString('global-form-html-required-note'),
          }}
        />
      </FullColumn>
      <FullColumn>
        <LabelContainer htmlFor={'create-mountain-name'}>
          <Label>
            {getFluentString('create-mountain-mountain-name-placeholder')}
            <Required children={'*'} />
          </Label>
        </LabelContainer>
        <InputBase
          id={'create-mountain-name'}
          type={'text'}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={getFluentString('create-mountain-mountain-name-placeholder')}
          /* autoComplete='off' is ignored in Chrome, but other strings aren't */
          autoComplete={'off'}
          maxLength={1000}
        />
      </FullColumn>
      <div>
        <LabelContainer htmlFor={'create-mountain-select-a-state'}>
          <Label>
            {getFluentString('global-text-value-state')}
            <Required children={'*'} />
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
            <Required children={'*'} />
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
            <Required children={'*'} />
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
            <Required children={'*'} />
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
      {map}
      <FullColumn>
        <LabelContainer htmlFor={'create-peak-list-description'}>
          <Label>
            {getFluentString('create-peak-list-peak-list-description-label')}
            {' '}
            <small>({getFluentString('global-text-value-optional')})</small>
          </Label>
        </LabelContainer>
        <TextareaBase
          id={'create-peak-list-description'}
          rows={6}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={getFluentString('create-mountain-optional-description')}
          autoComplete={'off'}
          maxLength={5000}
        />
      </FullColumn>
      <FullColumn>
        <LabelContainer>
          <Label>
            {getFluentString('global-text-value-external-resources')}
            {' '}
            <small>({getFluentString('global-text-value-optional')})</small>
          </Label>
        </LabelContainer>
        {resourceInputs}
        <ButtonPrimary onClick={e => {
          e.preventDefault();
          setExternalResources([...externalResources, {title: '', url: ''}]);
        }}>
          {getFluentString('global-text-value-add-external-resources')}
        </ButtonPrimary>
      </FullColumn>
      <FullColumn>
        <CheckboxRoot>
          <CheckboxInput
            type='checkbox'
            value={'create-mountain-verify-changes-are-accurate'}
            id={`create-mountain-verify-changes-are-accurate`}
            checked={verifyChangesIsChecked}
            onChange={() => setVerifyChangesIsChecked(!verifyChangesIsChecked)}
          />
          <CheckboxLabel htmlFor={`create-mountain-verify-changes-are-accurate`}>
            {getFluentString('create-mountain-check-your-work')}
            <Required children={'*'} />
           </CheckboxLabel>
        </CheckboxRoot>
        <ButtonWrapper>
          {deleteButton}
          <GhostButton onClick={onCancel}>
            {getFluentString('global-text-value-modal-cancel')}
          </GhostButton>
          {createAnother}
          <SaveButton
            disabled={preventSubmit()}
            onClick={validateAndSave}
          >
            <BasicIconInText icon={faCheck} />
            {saveButtonText}
          </SaveButton>
        </ButtonWrapper>
      </FullColumn>
      {areYouSureModal}
    </Root>
  );
};

export default MountainForm;
