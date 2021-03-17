import { faCheck, faClone, faCompass, faMountain, faTrash } from '@fortawesome/free-solid-svg-icons';
import sortBy from 'lodash/sortBy';
import React, {useCallback, useEffect, useState} from 'react';
import usePointLocationData from '../../../hooks/servicesHooks/pointData/usePointLocationData';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import useWindowWidth from '../../../hooks/useWindowWidth';
import { BaseMountainVariables } from '../../../queries/mountains/addRemoveMountain';
import {useUpdateMountainFlag} from '../../../queries/mountains/flagMountain';
import { StateDatum } from '../../../queries/states/useStates';
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
  Coordinate,
  Mountain,
  State,
} from '../../../types/graphQLTypes';
import {
  CoreItem,
} from '../../../types/itemTypes';
import AreYouSureModal, {
  Props as AreYouSureModalProps,
} from '../../sharedComponents/AreYouSureModal';
import DelayedInput from '../../sharedComponents/DelayedInput';
import Crosshairs from '../../sharedComponents/detailComponents/map/Crosshairs';
import {
  ButtonWrapper,
  DeleteButton,
  Root as Grid,
  SaveButton,
  Wrapper,
} from '../../sharedComponents/formUtils';
import Loading from '../../sharedComponents/LoadingSimple';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {mobileWidth} from '../../sharedComponents/Modal';
import {noClickItemId} from '../../template/globalMap/tooltip';

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

export interface InitialMountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: string;
  longitude: string;
  elevation: string;
  state: null | { id: State['id']};
  flag: string | null;
  locationText: string;
  locationTextShort: string;
}

interface Props {
  states: StateDatum[];
  initialData: InitialMountainDatum;
  onSubmit: (input: BaseMountainVariables) => void;
  onSubmitAndAddAnother: null | ((input: BaseMountainVariables) => void);
  onCancel: () => void;
}

const MountainForm = (props: Props) => {
  const { states, initialData, onSubmit, onSubmitAndAddAnother, onCancel } = props;

  const getString = useFluent();

  const windowWidth = useWindowWidth();
  const mapContext = useMapContext();

  const [name, setName] = useState<string>(initialData.name);

  const [locationText, setLocationText] = useState<string>(initialData.locationText);
  const [locationTextShort, setLocationTextShort] = useState<string>(initialData.locationTextShort);

  const [stringLat, setStringLat] = useState<string>(initialData.latitude);
  const [autoLat, setAutoLat] = useState<string>(initialData.latitude);
  const [stringLong, setStringLong] = useState<string>(initialData.longitude);
  const [autoLong, setAutoLong] = useState<string>(initialData.longitude);

  const [stringElevation, setStringElevation] = useState<string>(initialData.elevation);
  const [autoElevation, setAutoElevation] = useState<string>(initialData.elevation);
  const [selectedState, setSelectedState] = useState<State['id'] | null>(
    initialData.state === null ? null : initialData.state.id,
  );

  const latitude: number = validateFloatValue(stringLat, latitudeMin, latitudeMax, 0);
  const longitude: number = validateFloatValue(stringLong, longitudeMin, longitudeMax, 0);
  const elevation: number = validateFloatValue(stringElevation, elevationMin, elevationMax);

  useEffect(() => {
    if (mapContext.intialized && longitude && latitude) {
      mapContext.setExternalHoveredPopup(name, CoreItem.mountain, elevation + 'ft', [longitude, latitude]);
    }
    return () => {
      if (mapContext.intialized) {
        mapContext.clearExternalHoveredPopup();
      }
    };
  }, [mapContext, latitude, longitude, elevation, name]);

  const {
    loading: loadingLocationData, data: locationData, error: locationDataError,
  } = usePointLocationData({
    latitude: stringLat ? parseFloat(stringLat) : undefined,
    longitude: stringLong ? parseFloat(stringLong) : undefined,
  });

  const setLatLongFromMap = (coord: Coordinate) => {
    setStringLat(coord[1].toFixed(6));
    setStringLong(coord[0].toFixed(6));
    setAutoLat(coord[1].toFixed(6));
    setAutoLong(coord[0].toFixed(6));
  };

  useEffect(() => {
    if (loadingLocationData === true) {
        setSelectedState(null);
        setStringElevation('');
        setAutoElevation('');
    } else {
      if (locationData) {
        if (locationData.state !== null && locationData.state.id) {
          const newStateId = locationData.state.id;
          setSelectedState(curVal => newStateId !== curVal ? newStateId : curVal);
        }
        if (locationData.elevation !== null) {
          const newElevation = locationData.elevation.toFixed(0);
          setStringElevation(curVal => newElevation !== curVal ? newElevation : curVal);
          setAutoElevation(curVal => newElevation !== curVal ? newElevation : curVal);
        } else {
          setStringElevation('');
          setAutoElevation('');
        }
        if (locationData.locationText !== null) {
          const newLocationText = locationData.locationText.toString();
          setLocationText(curVal => newLocationText !== curVal ? newLocationText : curVal);
        } else {
          const newLocationText = locationData.state !== null && locationData.state.name
            ? locationData.state.name : '';
          setLocationText(newLocationText);
        }
        if (locationData.locationTextShort !== null) {
          const newLocationTextShort = locationData.locationTextShort.toString();
          setLocationTextShort(curVal => newLocationTextShort !== curVal ? newLocationTextShort : curVal);
        } else {
          const newLocationTextShort = locationData.state !== null && locationData.state.abbreviation
            ? locationData.state.abbreviation : '';
          setLocationTextShort(newLocationTextShort);
        }
      }
    }
  }, [locationData, loadingLocationData, states]);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const closeAreYouSureModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);
  const openDeleteModal = useCallback(() => setDeleteModalOpen(true), []);
  const updateMountainFlag = useUpdateMountainFlag();
  const flagForDeletion = (id: string) => {
    if (id) {
      updateMountainFlag({variables: {id, flag: 'DELETE REQUEST'}});
    }
    closeAreYouSureModal();
  };
  const clearFlag = (id: string) => {
    if (id) {
      updateMountainFlag({variables: {id, flag: null}});
    }
    closeAreYouSureModal();
  };

  const areYouSureProps: AreYouSureModalProps = initialData.flag === 'DELETE REQUEST' ? {
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

  const preventSubmit = () =>
    (name && selectedState && latitude && longitude &&
     elevation && !loadingSubmit) ? false : true;

  const validateAndSave = () => {
    if (name && selectedState && latitude && longitude &&
        elevation && !loadingSubmit) {
      setLoadingSubmit(true);
      onSubmit({
        name, latitude, longitude, elevation, state: selectedState, locationText, locationTextShort});
    }
  };

  const validateAndSaveAndAdd = () => {
    if (name && selectedState && latitude && longitude &&
        elevation && !loadingSubmit && onSubmitAndAddAnother) {
      setLoadingSubmit(true);
      onSubmitAndAddAnother({
        name, latitude, longitude, elevation, state: selectedState, locationText, locationTextShort});
    }
  };

  const saveButtonText = loadingSubmit === true
    ? getString('global-text-value-saving') + '...' : getString('global-text-value-save');

  const deleteButtonText = initialData.flag !== 'DELETE REQUEST'
    ? getString('global-text-value-delete')
    : getString('global-text-value-cancel-delete-request');

  const deleteButton = !initialData.id ? null : (
    <DeleteButton
      onClick={openDeleteModal}
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
    >
      <BasicIconInText icon={faClone} />
      {createAnotherText}
    </CreateAnotherButton>
  ) : null;

  const center: Coordinate = [longitude, latitude];
  const mountainForMap = {
    id: noClickItemId,
    name,
    elevation,
    location: center,
  };

  const map = latitude && longitude ? (
    <MapRenderProp
      id={'create-edit-mountain-' + JSON.stringify(mountainForMap)}
      mountains={[mountainForMap]}
    />
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
          <Crosshairs getCenter={setLatLongFromMap} />
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
                key={'latitude-' + autoLat}
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
                key={'longitude-' + autoLong}
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
        <ButtonWrapper>
          {deleteButton}
          <GhostButton
            onClick={onCancel}
          >
            {getString('global-text-value-modal-cancel')}
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
      </Wrapper>
      {map}
      {areYouSureModal}
    </>
  );
};

export default MountainForm;
