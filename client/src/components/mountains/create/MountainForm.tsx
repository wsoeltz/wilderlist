import { gql, useMutation } from '@apollo/client';
import { faCheck, faClone, faCompass, faEdit, faMountain, faTrash } from '@fortawesome/free-solid-svg-icons';
import sortBy from 'lodash/sortBy';
import React, {useContext, useEffect, useState} from 'react';
import useFluent from '../../../hooks/useFluent';
import usePointLocationData from '../../../hooks/usePointLocationData';
import {
  BasicIconInText,
  ButtonSecondary,
  DetailBoxTitle,
  DetailBoxWithMargin,
  GhostButton,
  Label,
  LabelContainer,
  RequiredNote,
  SelectBox,
  SmallTextNoteWithMargin,
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
import DelayedInput from '../../sharedComponents/DelayedInput';
import DelayedTextarea from '../../sharedComponents/DelayedTextarea';
import {
  ActionButtons,
  ButtonWrapper,
  DeleteButton,
  ResourceContainer,
  Root as Grid,
  SaveButton,
  Wrapper,
} from '../../sharedComponents/formUtils';
import Loading from '../../sharedComponents/LoadingSimple';
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

  const getString = useFluent();

  const {windowWidth, usersLocation} = useContext(AppContext);

  const [name, setName] = useState<string>(initialData.name);

  const [stringLat, setStringLat] = useState<string>(initialData.latitude);
  const [stringLong, setStringLong] = useState<string>(initialData.longitude);

  const [stringElevation, setStringElevation] = useState<string>(initialData.elevation);
  const [autoElevation, setAutoElevation] = useState<string>(initialData.elevation);
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
        setAutoElevation('');
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
        setAutoElevation(curVal => newElevation !== curVal ? newElevation : curVal);
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
    title: getString('global-text-value-cancel-delete-request'),
    text: getString('global-text-value-modal-cancel-request-text', {
      name: initialData.name,
    }),
    confirmText: getString('global-text-value-modal-confirm'),
    cancelText: getString('global-text-value-modal-cancel'),
  } : {
    onConfirm: () => flagForDeletion(initialData.id),
    onCancel: closeAreYouSureModal,
    title: getString('global-text-value-modal-request-delete-title'),
    text: getString('global-text-value-modal-request-delete-text', {
      name: initialData.name,
    }),
    confirmText: getString('global-text-value-modal-confirm'),
    cancelText: getString('global-text-value-modal-cancel'),
  };

  const areYouSureModal = deleteModalOpen === false ? null : (
    <AreYouSureModal {...areYouSureProps}/>
  );

  const locationInformationTitle = !loadingLocationData ? (
    <>
      <BasicIconInText icon={faCompass} />
      {getString('create-mountain-location-title')}
    </>
  ) : (
    <>
      <Loading size={16} color={'#666'} />
      {getString('create-mountain-location-loading')}
    </>
  );

  const locationError = locationDataError ? (
    <SmallTextNoteWithMargin>
      <RequiredNote>
        <span className={'red-text'}>
          {getString('create-mountain-location-error')}
        </span>
      </RequiredNote>
    </SmallTextNoteWithMargin>
  ) : null;

  const sortedStates = sortBy(states, ['name']);
  const stateOptions = sortedStates.map(state => (
      <option key={state.id} value={state.id}>
        {state.name} ({state.abbreviation})
      </option>
    ),
  );

  const handleExternalResourceChange = (value: string) =>
    (field: keyof ExternalResource, index: number) =>
      setExternalResources(
        externalResources.map((resource, _index) => {
          if (resource[field] === value || index !== _index) {
            return resource;
          } else {
            return {...resource, [field]: value};
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
      <DelayedInput
        initialValue={resource.title}
        setInputValue={val => handleExternalResourceChange(val)('title', i)}
        placeholder={getString('global-text-value-resource-title')}
      />
      <DelayedInput
        initialValue={resource.url}
        setInputValue={val => handleExternalResourceChange(val)('url', i)}
        placeholder={getString('global-text-value-resource-url')}
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
    ? getString('global-text-value-saving') + '...' : getString('global-text-value-save');

  const deleteButtonText = initialData.flag !== MountainFlag.deleteRequest
    ? getString('global-text-value-delete')
    : getString('global-text-value-cancel-delete-request');

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
    ? getString('global-text-value-saving') + '...' : getString('global-text-value-save-and-add');

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
          {getString('create-mountain-name-title')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          <DelayedInput
            id={'create-mountain-name'}
            initialValue={name}
            setInputValue={value => setName(value)}
            placeholder={getString('create-mountain-mountain-name-placeholder')}
            /* autoComplete='off' is ignored in Chrome, but other strings aren't */
            maxLength={1000}
          />
        </DetailBoxWithMargin>
        <DetailBoxTitle>
          {locationInformationTitle}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          {locationError}
          <SmallTextNoteWithMargin>
            {getString('create-mountain-location-note', {
              position: mapContainer !== null ? 'right' : 'bottom',
            })}
          </SmallTextNoteWithMargin>
          <Grid>
            <div>
              <LabelContainer htmlFor={'create-mountain-latitude'}>
                <Label>
                  {getString('global-text-value-latitude')}
                  {' '}
                  <small>({getString('create-mountain-latlong-note')})</small>
                </Label>
              </LabelContainer>
              <DelayedInput
                key={'latitude-' + stringLat}
                id={'create-mountain-latitude'}
                type={'number'}
                min={latitudeMin}
                max={latitudeMax}
                initialValue={stringLat}
                setInputValue={value => setStringLat(value)}
                placeholder={'e.g. 40.000'}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'create-mountain-longitude'}>
                <Label>
                  {getString('global-text-value-longitude')}
                  {' '}
                  <small>({getString('create-mountain-latlong-note')})</small>
                </Label>
              </LabelContainer>
              <DelayedInput
                key={'longitude-' + stringLong}
                id={'create-mountain-longitude'}
                type={'number'}
                min={longitudeMin}
                max={longitudeMax}
                initialValue={stringLong}
                setInputValue={value => setStringLong(value)}
                placeholder={'e.g. -72.000'}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'create-mountain-select-a-state'}>
                <Label>
                  {getString('global-text-value-state')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-mountain-select-a-state'}
                value={`${selectedState || ''}`}
                onChange={e => setSelectedState(e.target.value)}
                placeholder={getString('create-mountain-select-a-state')}
              >
                <option value='' key='empty-option-to-select'></option>
                {stateOptions}
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-mountain-elevation'}>
                <Label>
                  {getString('global-text-value-elevation')}
                  {' '}
                  <small>({getString('global-text-value-feet')})</small>
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-mountain-elevation'}
                key={'elevation-' + autoElevation}
                type={'number'}
                min={elevationMin}
                max={elevationMax}
                initialValue={stringElevation}
                setInputValue={value => setStringElevation(value)}
                placeholder={'e.g. 1000ft'}
              />
            </div>
          </Grid>
        </DetailBoxWithMargin>
        <CollapsibleDetailBox
          title={
            <>
              <BasicIconInText icon={faEdit} />
              {getString('create-mountain-optional-title')}
            </>
          }
          defaultHidden={true}
        >
          <div style={{marginBottom: '1rem'}}>
            <LabelContainer htmlFor={'create-peak-list-description'}>
              <Label>
                {getString('create-peak-list-peak-list-description-label')}
              </Label>
            </LabelContainer>
            <DelayedTextarea
              id={'create-peak-list-description'}
              rows={6}
              initialValue={description}
              setInputValue={value => setDescription(value)}
              placeholder={getString('create-mountain-optional-description')}
              maxLength={5000}
            />
          </div>
          <div>
            <LabelContainer>
              <Label>
                {getString('global-text-value-external-resources')}
              </Label>
            </LabelContainer>
            {resourceInputs}
            <div>
              <ButtonSecondary onClick={e => {
                e.preventDefault();
                setExternalResources([...externalResources, {title: '', url: ''}]);
              }}>
                {getString('global-text-value-add-external-resources')}
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
            {getString('global-text-value-modal-cancel')}
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
