import { useMutation } from '@apollo/react-hooks';
import { faCheck, faClone, faCompass, faEdit, faMountain, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext, useEffect, useState} from 'react';
import { createPortal } from 'react-dom';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import usePointLocationData from '../../../hooks/usePointLocationData';
import {
  BasicIconInText,
  ButtonSecondary,
  DetailBoxTitle,
  DetailBoxWithMargin,
  GhostButton,
  InputBase,
  Label,
  LabelContainer,
  RequiredNote,
  SelectBox,
  SmallTextNoteWithMargin,
  TextareaBase,
} from '../../../styling/styleUtils';
import {
  ExternalResource,
  Mountain,
  MountainFlag,
  State,
} from '../../../types/graphQLTypes';
import {AppContext} from '../../App';
import AreYouSureModal, {
  Props as AreYouSureModalProps,
} from '../../sharedComponents/AreYouSureModal';
import CollapsibleDetailBox from '../../sharedComponents/CollapsibleDetailBox';
import {
  ActionButtons,
  ButtonWrapper,
  DeleteButton,
  FullColumn,
  ResourceContainer,
  Root as Grid,
  SaveButton,
  Wrapper,
} from '../../sharedComponents/formUtils';
import Loading from '../../sharedComponents/LoadingSimple';
import Map, {MapContainer} from '../../sharedComponents/map';
import {CoordinateWithDates} from '../../sharedComponents/map/types';
import {mobileWidth} from '../../sharedComponents/Modal';
import { BaseMountainVariables } from './';

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

  const {windowWidth, usersLocation} = useContext(AppContext);

  const [name, setName] = useState<string>(initialData.name);

  const [stringLat, setStringLat] = useState<string>(initialData.latitude);
  const [stringLong, setStringLong] = useState<string>(initialData.longitude);

  const [stringElevation, setStringElevation] = useState<string>(initialData.elevation);
  const [selectedState, setSelectedState] = useState<State['id'] | null>(
    initialData.state === null ? null : initialData.state.id,
  );

  const {
    loading: loadingLocationData, data: locationData, error: locationDataError,
  } = usePointLocationData({
    latitude: stringLat ? parseFloat(stringLat) : undefined,
    longitude: stringLong ? parseFloat(stringLong) : undefined,
  });

  useEffect(() => {
    if (loadingLocationData === true) {
        setSelectedState(null);
        setStringElevation('');
    } else {
      if (locationData && locationData.state !== null) {
        const targetState = states.find(
          state => state.name.toLowerCase() === (locationData.state as string).toLowerCase());
        if (targetState) {
          setSelectedState(curVal => targetState.id !== curVal ? targetState.id : curVal);
        }
      }
      if (locationData && locationData.elevation !== null) {
        const newElevation = locationData.elevation.toString();
        setStringElevation(curVal => newElevation !== curVal ? newElevation : curVal);
      }
    }
  }, [locationData, loadingLocationData, states]);

  const [description, setDescription] = useState<string>(initialData.description);
  const [externalResources, setExternalResources] =
  useState<ExternalResource[]>([...initialData.resources, {title: '', url: ''}]);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  let defaultLatitude: number;
  let defaultLongitude: number;
  if (usersLocation && usersLocation.data && usersLocation.data.localCoordinates) {
    defaultLatitude = usersLocation.data.localCoordinates.lat;
    defaultLongitude = usersLocation.data.localCoordinates.lng;
  } else {
    defaultLatitude = 43.20415146;
    defaultLongitude = -71.52769471;
  }
  const latitude: number = validateFloatValue(stringLat, latitudeMin, latitudeMax, defaultLatitude);
  const longitude: number = validateFloatValue(stringLong, longitudeMin, longitudeMax, defaultLongitude);
  const elevation: number = validateFloatValue(stringElevation, elevationMin, elevationMax);

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

  const locationInformationTitle = !loadingLocationData ? (
    <>
      <BasicIconInText icon={faCompass} />
      {getFluentString('create-mountain-location-title')}
    </>
  ) : (
    <>
      <Loading size={16} color={'#666'} />
      {getFluentString('create-mountain-location-loading')}
    </>
  );

  const locationError = locationDataError ? (
    <SmallTextNoteWithMargin>
      <RequiredNote>
        <span className={'red-text'}>
          {getFluentString('create-mountain-location-error')}
        </span>
      </RequiredNote>
    </SmallTextNoteWithMargin>
  ) : null;

  const coordinate: CoordinateWithDates = {
    id: initialData.id,
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
              coordinates={[coordinate]}
              highlighted={[coordinate]}
              userId={null}
              isOtherUser={true}
              createOrEditMountain={true}
              showCenterCrosshairs={true}
              returnLatLongOnClick={setLatLongFromMap}
              colorScaleColors={[]}
              colorScaleSymbols={[]}
              showOtherMountains={true}
              defaultOtherMountainsOn={true}
              primaryMountainLegendCopy={getFluentString('create-mountain-map-your-mountain')}
              fillSpace={true}
              completedAscents={[]}
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
              coordinates={[coordinate]}
              highlighted={[coordinate]}
              userId={null}
              isOtherUser={true}
              createOrEditMountain={true}
              showCenterCrosshairs={true}
              returnLatLongOnClick={setLatLongFromMap}
              colorScaleColors={[]}
              colorScaleSymbols={[]}
              primaryMountainLegendCopy={getFluentString('create-mountain-map-your-mountain')}
              showOtherMountains={true}
              defaultOtherMountainsOn={true}
              key={'create-mountain-key'}
              completedAscents={[]}
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
        ×
      </GhostButton>
    </ResourceContainer>
  ));

  const preventSubmit = () =>
    (name && selectedState && latitude && longitude &&
     elevation && !loadingSubmit) ? false : true;

  const validateAndSave = () => {
    if (name && selectedState && latitude && longitude &&
        elevation && !loadingSubmit) {
      setLoadingSubmit(true);
      const resources = externalResources.filter(resource => resource.title.length && resource.url.length);
      onSubmit({
        name, latitude, longitude, elevation, state: selectedState, description, resources});
    }
  };

  const validateAndSaveAndAdd = () => {
    if (name && selectedState && latitude && longitude &&
        elevation && !loadingSubmit && onSubmitAndAddAnother) {
      setLoadingSubmit(true);
      const resources = externalResources.filter(resource => resource.title.length && resource.url.length);
      onSubmitAndAddAnother({
        name, latitude, longitude, elevation, state: selectedState, description, resources});
    }
  };

  const saveButtonText = loadingSubmit === true
    ? getFluentString('global-text-value-saving') + '...' : getFluentString('global-text-value-save');

  const deleteButtonText = initialData.flag !== MountainFlag.deleteRequest
    ? getFluentString('global-text-value-delete')
    : getFluentString('global-text-value-cancel-delete-request');

  const deleteButton = !initialData.id ? null : (
    <DeleteButton
      onClick={() => setDeleteModalOpen(true)}
      mobileExtend={true}
    >
      <BasicIconInText icon={faTrash} />
      {deleteButtonText}
    </DeleteButton>
  );

  const createAnotherText = loadingSubmit === true
    ? getFluentString('global-text-value-saving') + '...' : getFluentString('global-text-value-save-and-add');

  const CreateAnotherButton = windowWidth > mobileWidth ? SaveButton : ButtonSecondary;
  const createAnother = !initialData.id && onSubmitAndAddAnother !== null ? (
    <CreateAnotherButton
      disabled={preventSubmit()}
      onClick={validateAndSaveAndAdd}
      mobileExtend={true}
    >
      <BasicIconInText icon={faClone} />
      {createAnotherText}
    </CreateAnotherButton>
  ) : null;

  return (
    <>
      <Wrapper>
        <DetailBoxTitle>
          <BasicIconInText icon={faMountain} />
          {getFluentString('create-mountain-name-title')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
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
        </DetailBoxWithMargin>
        <DetailBoxTitle>
          {locationInformationTitle}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          {locationError}
          <SmallTextNoteWithMargin>
            {getFluentString('create-mountain-location-note', {
              position: mapContainer !== null ? 'right' : 'bottom',
            })}
          </SmallTextNoteWithMargin>
          <Grid>
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
                placeholder={'e.g. 40.000'}
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
                placeholder={'e.g. -72.000'}
                autoComplete={'off'}
              />
            </div>
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
                placeholder={'e.g. 1000ft'}
                autoComplete={'off'}
              />
            </div>
          </Grid>
        </DetailBoxWithMargin>
        {map}
        <CollapsibleDetailBox
          title={
            <>
              <BasicIconInText icon={faEdit} />
              {getFluentString('create-mountain-optional-title')}
            </>
          }
          defaultHidden={true}
        >
          <div>
            <LabelContainer htmlFor={'create-peak-list-description'}>
              <Label>
                {getFluentString('create-peak-list-peak-list-description-label')}
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
              style={{marginBottom: '1rem'}}
            />
          </div>
          <div>
            <LabelContainer>
              <Label>
                {getFluentString('global-text-value-external-resources')}
              </Label>
            </LabelContainer>
            {resourceInputs}
            <div>
              <ButtonSecondary onClick={e => {
                e.preventDefault();
                setExternalResources([...externalResources, {title: '', url: ''}]);
              }}>
                {getFluentString('global-text-value-add-external-resources')}
              </ButtonSecondary>
            </div>
          </div>
        </CollapsibleDetailBox>
      </Wrapper>
      <ActionButtons>
        <ButtonWrapper>
          {deleteButton}
          <GhostButton
            mobileExtend={true}
            onClick={onCancel}
          >
            {getFluentString('global-text-value-modal-cancel')}
          </GhostButton>
          {createAnother}
          <SaveButton
            mobileExtend={true}
            disabled={preventSubmit()}
            onClick={validateAndSave}
          >
            <BasicIconInText icon={faCheck} />
            {saveButtonText}
          </SaveButton>
        </ButtonWrapper>
      </ActionButtons>
      {areYouSureModal}
    </>
  );
};

export default MountainForm;
