import { faCheck, faClone, faCompass, faTrash } from '@fortawesome/free-solid-svg-icons';
import {validate as validateEmail} from 'email-validator';
import sortBy from 'lodash/sortBy';
import upperFirst from 'lodash/upperFirst';
import validatePhone from 'phone';
import React, {useCallback, useEffect, useState} from 'react';
import validUrl from 'valid-url';
import usePointLocationData from '../../../hooks/servicesHooks/pointData/usePointLocationData';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import useWindowWidth from '../../../hooks/useWindowWidth';
import { BaseCampsiteVariables } from '../../../queries/campsites/addRemoveCampsite';
import {useUpdateCampsiteFlag} from '../../../queries/campsites/flagCampsite';
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
  Campsite,
  CampsiteOwnership,
  CampsiteReservation,
  CampsiteType,
  Coordinate,
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
  FullColumn,
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

export interface InitialCampsiteDatum {
  id: string;
  name: string;
  type: CampsiteType | null;
  longitude: string;
  latitude: string;
  elevation: string;
  locationText: string;
  locationTextShort: string;
  website: Campsite['website'];
  ownership: Campsite['ownership'];
  electricity: Campsite['electricity'];
  toilets: Campsite['toilets'];
  drinking_water: Campsite['drinking_water'];
  email: Campsite['email'];
  reservation: Campsite['reservation'];
  showers: Campsite['showers'];
  phone: Campsite['phone'];
  fee: Campsite['fee'];
  tents: Campsite['tents'];
  capacity: Campsite['capacity'];
  internet_access: Campsite['internet_access'];
  fire: Campsite['fire'];
  maxtents: Campsite['maxtents'];
  state: null | {id: State['id'], name: State['name']};
  flag: Campsite['flag'];
}

interface Props {
  states: StateDatum[];
  initialData: InitialCampsiteDatum;
  onSubmit: (input: BaseCampsiteVariables) => void;
  onSubmitAndAddAnother: null | ((input: BaseCampsiteVariables) => void);
  onCancel: () => void;
}

enum Trivalent {
  Yes = 'Yes',
  No = 'No',
  Unknown = '',
}

const CampsiteForm = (props: Props) => {
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

  const [type, setType] = useState<CampsiteType | null>(initialData.type);
  const setSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && value.length) {
      setType(value as CampsiteType);
    } else {
      setType(null);
    }
  };

  const [website, setWebsite] = useState<string>(initialData.website ? initialData.website : '');
  const [email, setEmail] = useState<string>(initialData.email ? initialData.email : '');
  const [phone, setPhone] = useState<string>(initialData.phone ? initialData.phone : '');
  const [ownership, setOwnership] = useState<CampsiteOwnership | null>(initialData.ownership);
  const setSelectedOwnership = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && value.length) {
      setOwnership(value as CampsiteOwnership);
    } else {
      setOwnership(null);
    }
  };

  const [reservation, setReservation] = useState<CampsiteReservation | string | null>(initialData.reservation);
  const setSelectedReservation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && value.length) {
      setReservation(value as CampsiteReservation);
    } else {
      setReservation(null);
    }
  };

  const [electricity, setElectricity] = useState<boolean | null>(initialData.electricity);
  const [toilets, setToilets] = useState<boolean | null>(initialData.toilets);
  const [drinking_water, setDrinking_water] = useState<boolean | null>(initialData.drinking_water);
  const [showers, setShowers] = useState<boolean | null>(initialData.showers);
  const [fee, setFee] = useState<boolean | null>(initialData.fee);
  const [tents, setTents] = useState<boolean | null>(initialData.tents);
  const [internet_access, setInternet_access] = useState<boolean | null>(initialData.internet_access);
  const [fire, setFire] = useState<boolean | null>(initialData.fire);
  const trivalentToBooleanNull = (fn: (value: boolean | null) => void) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === Trivalent.Yes) {
        fn(true);
      } else if (value === Trivalent.No) {
        fn(false);
      } else {
        fn(null);
      }
  };
  const booleanNullToTrivalent = (value: boolean | null) => {
    if (value === true) {
      return Trivalent.Yes;
    } else if (value === false) {
      return Trivalent.No;
    } else {
      return Trivalent.Unknown;
    }
  };

  const [capacity, setCapacity] = useState<number | null>(initialData.capacity);
  const [maxtents, setMaxTents] = useState<number | null>(initialData.maxtents);

  const latitude: number = validateFloatValue(stringLat, latitudeMin, latitudeMax, 0);
  const longitude: number = validateFloatValue(stringLong, longitudeMin, longitudeMax, 0);
  const elevation: number = validateFloatValue(stringElevation, elevationMin, elevationMax);

  useEffect(() => {
    if (mapContext.intialized && longitude && latitude) {
      mapContext.setExternalHoveredPopup(name, CoreItem.campsite, elevation + 'ft', [longitude, latitude]);
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
  const updateCampsiteFlag = useUpdateCampsiteFlag();
  const flagForDeletion = (id: string) => {
    if (id) {
      updateCampsiteFlag({variables: {id, flag: 'DELETE REQUEST'}});
    }
    closeAreYouSureModal();
  };
  const clearFlag = (id: string) => {
    if (id) {
      updateCampsiteFlag({variables: {id, flag: null}});
    }
    closeAreYouSureModal();
  };

  const areYouSureProps: AreYouSureModalProps = initialData.flag && initialData.flag.includes('DELETE REQUEST') ? {
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
    (selectedState && latitude && longitude &&
     elevation && type && !loadingSubmit) ? false : true;

  const validateAndSave = () => {
    if (selectedState && latitude && longitude &&
        elevation && type && !loadingSubmit) {
      setLoadingSubmit(true);
      const validPhoneNum = validatePhone(phone, '', true);
      let validWebsite: URL | null = null;
      try {
        if (website && website.length && validUrl.isUri(website)) {
          validWebsite = new URL(website);
        } else if (website && website.length && validUrl.isUri('http://' + website)) {
          validWebsite = new URL('http://' + website);
        }
      } catch (err) {
        console.error(err);
      }
      onSubmit({
        name: name && name.length ? name : null,
        latitude, longitude, elevation, state: selectedState, locationText, locationTextShort,
        website: validWebsite && validWebsite.href ? validWebsite.href : null,
        email: email && validateEmail(email) ? email : null,
        phone: validPhoneNum.length && validPhoneNum[0] ? validPhoneNum[0] : null,
        ownership, electricity, toilets, drinking_water, reservation, showers,
        fee, tents,  internet_access, fire, type,
        capacity: capacity ? Math.round(capacity) : null,
        maxtents: maxtents ? Math.round(maxtents) : null,
      });
    }
  };

  const validateAndSaveAndAdd = () => {
    if (selectedState && latitude && longitude &&
        elevation && type && !loadingSubmit && onSubmitAndAddAnother) {
      setLoadingSubmit(true);
      const validPhoneNum = validatePhone(phone, '', true);
      let validWebsite: URL | null = null;
      try {
        if (website && website.length && validUrl.isUri(website)) {
          validWebsite = new URL(website);
        } else if (website && website.length && validUrl.isUri('http://' + website)) {
          validWebsite = new URL('http://' + website);
        }
      } catch (err) {
        console.error(err);
      }
      onSubmitAndAddAnother({
        name: name && name.length ? name : null,
        latitude, longitude, elevation, state: selectedState, locationText, locationTextShort,
        website: validWebsite && validWebsite.href ? validWebsite.href : null,
        email: email && validateEmail(email) ? email : null,
        phone: validPhoneNum.length && validPhoneNum[0] ? validPhoneNum[0] : null,
        ownership, electricity, toilets, drinking_water, reservation, showers,
        fee, tents,  internet_access, fire, type,
        capacity: capacity ? Math.round(capacity) : null,
        maxtents: maxtents ? Math.round(maxtents) : null,
      });
    }
  };

  const saveButtonText = loadingSubmit === true
    ? getString('global-text-value-saving') + '...' : getString('global-text-value-save');

  const deleteButtonText = !initialData.flag || !initialData.flag.includes('DELETE REQUEST')
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
  const campsiteForMap = {
    id: noClickItemId,
    name,
    type: type as CampsiteType,
    location: center,
  };

  const map = latitude && longitude && type ? (
    <MapRenderProp
      id={'create-edit-campsite-' + JSON.stringify(campsiteForMap)}
      campsites={[campsiteForMap]}
    />
  ) : null;

  return (
    <>
      <Wrapper>
        <DetailBoxTitle>
          {getString('create-campsite-name-title')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          <Grid>
            <FullColumn>
              <LabelContainer htmlFor={'create-campsite-name'}>
                <Label>
                  {getString('global-text-value-name')}
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-campsite-name'}
                initialValue={name}
                setInputValue={value => setName(value)}
                placeholder={getString('create-campsite-name-placeholder')}
                /* autoComplete='off' is ignored in Chrome, but other strings aren't */
                maxLength={1000}
              />
            </FullColumn>
            <FullColumn>
              <LabelContainer htmlFor={'create-campsite-select-type'}>
                <Label>
                  {getString('global-text-classification')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-type'}
                value={`${type || ''}`}
                onChange={setSelectedType}
                placeholder={''}
              >
                <option value=''></option>
                <option value={CampsiteType.campSite}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.campSite}))}
                </option>
                <option value={CampsiteType.caravanSite}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.caravanSite}))}
                </option>
                <option value={CampsiteType.weatherShelter}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.weatherShelter}))}
                </option>
                <option value={CampsiteType.campPitch}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.campPitch}))}
                </option>
                <option value={CampsiteType.leanTo}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.leanTo}))}
                </option>
                <option value={CampsiteType.wildernessHut}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.wildernessHut}))}
                </option>
                <option value={CampsiteType.alpineHut}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.alpineHut}))}
                </option>
                <option value={CampsiteType.basicHut}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.basicHut}))}
                </option>
                <option value={CampsiteType.rockShelter}>
                  {upperFirst(getString('global-formatted-campsite-type', {type: CampsiteType.rockShelter}))}
                </option>
              </SelectBox>
            </FullColumn>
          </Grid>
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

        <DetailBoxTitle>
          {getString('create-item-campsite-contact-title')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          <Grid>
            <div>
              <LabelContainer htmlFor={'create-campsite-website'}>
                <Label>
                  {getString('global-text-value-website')}
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-campsite-website'}
                initialValue={website ? website : ''}
                setInputValue={value => setWebsite(value)}
                placeholder={'https://example.com'}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-phone'}>
                <Label>
                  {getString('global-text-value-phone')}
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-campsite-phone'}
                initialValue={phone ? phone : ''}
                setInputValue={value => setPhone(value)}
                placeholder={'(111)-123-4567'}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-email'}>
                <Label>
                  {getString('global-text-value-modal-email')}
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-campsite-email'}
                initialValue={email ? email : ''}
                setInputValue={value => setEmail(value)}
                placeholder={'camp@example.com'}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-ownership'}>
                <Label>
                  {getString('global-text-value-ownership')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-ownership'}
                value={`${ownership || ''}`}
                onChange={setSelectedOwnership}
                placeholder={''}
              >
                <option value=''></option>
                <option value={CampsiteOwnership.federal}>
                  {upperFirst(getString('campsite-formatted-ownership', {ownership: CampsiteOwnership.federal}))}
                </option>
                <option value={CampsiteOwnership.state}>
                  {upperFirst(getString('campsite-formatted-ownership', {ownership: CampsiteOwnership.state}))}
                </option>
                <option value={CampsiteOwnership.private}>
                  {upperFirst(getString('campsite-formatted-ownership', {ownership: CampsiteOwnership.private}))}
                </option>
              </SelectBox>
            </div>
          </Grid>
        </DetailBoxWithMargin>

        <DetailBoxTitle>
          {getString('create-mountain-optional-title')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          <Grid>
            <div>
              <LabelContainer htmlFor={'campsite-detail-reservation'}>
                <Label>
                  {getString('campsite-detail-reservation')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-reservation'}
                value={`${reservation || ''}`}
                onChange={setSelectedReservation}
                placeholder={''}
              >
                <option value=''></option>
                <option value={CampsiteReservation.reservable}>
                  {upperFirst(CampsiteReservation.reservable)}
                </option>
                <option value={CampsiteReservation.notReservable}>
                  {upperFirst(CampsiteReservation.notReservable)}
                </option>
                <option value={CampsiteReservation.recommended}>
                  {upperFirst(CampsiteReservation.recommended)}
                </option>
                <option value={CampsiteReservation.required}>
                  {upperFirst(CampsiteReservation.required)}
                </option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-electricity'}>
                <Label>
                  {getString('campsite-detail-electricity')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-electricity'}
                value={booleanNullToTrivalent(electricity)}
                onChange={trivalentToBooleanNull(setElectricity)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-toilets'}>
                <Label>
                  {getString('campsite-detail-toilets')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-toilets'}
                value={booleanNullToTrivalent(toilets)}
                onChange={trivalentToBooleanNull(setToilets)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-drinking_water'}>
                <Label>
                  {getString('campsite-detail-drinking-water')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-drinking_water'}
                value={booleanNullToTrivalent(drinking_water)}
                onChange={trivalentToBooleanNull(setDrinking_water)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-showers'}>
                <Label>
                  {getString('campsite-detail-showers')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-showers'}
                value={booleanNullToTrivalent(showers)}
                onChange={trivalentToBooleanNull(setShowers)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-fee'}>
                <Label>
                  {getString('campsite-detail-required-fee')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-fee'}
                value={booleanNullToTrivalent(fee)}
                onChange={trivalentToBooleanNull(setFee)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-tents'}>
                <Label>
                  {getString('campsite-detail-allows-tents')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-tents'}
                value={booleanNullToTrivalent(tents)}
                onChange={trivalentToBooleanNull(setTents)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-internet-access'}>
                <Label>
                  {getString('campsite-detail-internet-access')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-internet_access'}
                value={booleanNullToTrivalent(internet_access)}
                onChange={trivalentToBooleanNull(setInternet_access)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-campsite-select-fire'}>
                <Label>
                  {getString('campsite-detail-allows-fires')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-campsite-select-fire'}
                value={booleanNullToTrivalent(fire)}
                onChange={trivalentToBooleanNull(setFire)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'campsite-detail-max-capacity'}>
                <Label>
                  {getString('campsite-detail-max-capacity')}
                </Label>
              </LabelContainer>
              <DelayedInput
                type={'number'}
                min={0}
                initialValue={capacity ? capacity.toString() : ''}
                setInputValue={value => setCapacity(parseInt(value, 10))}
                placeholder={''}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'campsite-detail-max-tents'}>
                <Label>
                  {getString('campsite-detail-max-tents')}
                </Label>
              </LabelContainer>
              <DelayedInput
                type={'number'}
                min={0}
                initialValue={maxtents ? maxtents.toString() : ''}
                setInputValue={value => setMaxTents(parseInt(value, 10))}
                placeholder={''}
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

export default CampsiteForm;
