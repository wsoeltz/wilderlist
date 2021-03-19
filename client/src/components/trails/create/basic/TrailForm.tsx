import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import React, {useCallback, useEffect, useState} from 'react';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import { Variables } from '../../../../queries/trails/addRemoveTrail';
import {useUpdateTrailFlag} from '../../../../queries/trails/flagTrail';
import {
  BasicIconInText,
  DetailBoxTitle,
  DetailBoxWithMargin,
  GhostButton,
  Label,
  LabelContainer,
  SelectBox,
} from '../../../../styling/styleUtils';
import {
  Trail,
  TrailType,
} from '../../../../types/graphQLTypes';
import {
  CoreItem,
} from '../../../../types/itemTypes';
import AreYouSureModal, {
  Props as AreYouSureModalProps,
} from '../../../sharedComponents/AreYouSureModal';
import DelayedInput from '../../../sharedComponents/DelayedInput';
import {
  ButtonWrapper,
  DeleteButton,
  FullColumn,
  Root as Grid,
  SaveButton,
  Wrapper,
} from '../../../sharedComponents/formUtils';
import MapRenderProp from '../../../sharedComponents/MapRenderProp';
import {noClickItemId} from '../../../template/globalMap/tooltip';

export interface InitialTrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  waterCrossing: Trail['waterCrossing'];
  allowsBikes: Trail['allowsBikes'];
  allowsHorses: Trail['allowsHorses'];
  skiTrail: Trail['skiTrail'];
  line: Trail['line'];
  center: Trail['center'];
  flag: Trail['flag'];
}

interface Props {
  initialData: InitialTrailDatum;
  onSubmit: (input: Variables) => void;
  onCancel: () => void;
}

enum Trivalent {
  Yes = 'Yes',
  No = 'No',
  Unknown = '',
}

const TrailForm = (props: Props) => {
  const { initialData, onSubmit, onCancel } = props;

  const getString = useFluent();

  const mapContext = useMapContext();

  const [name, setName] = useState<string>(initialData.name ? initialData.name : '');

  const [type, setType] = useState<TrailType | null>(initialData.type);
  const setSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && value.length) {
      setType(value as TrailType);
    } else {
      setType(null);
    }
  };

  const [waterCrossing, setWaterCrossing] = useState<string>(
    initialData.waterCrossing ? initialData.waterCrossing : '',
  );

  const [allowsBikes, setAllowsBikes] = useState<boolean | null>(initialData.allowsBikes);
  const [allowsHorses, setAllowsHorses] = useState<boolean | null>(initialData.allowsHorses);
  const [skiTrail, setSkiTrail] = useState<boolean | null>(initialData.skiTrail);
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
  useEffect(() => {
    if (mapContext.intialized) {
      mapContext.setExternalHoveredPopup(
        name, CoreItem.trail,
        getString('global-formatted-trail-type', {type}),
        initialData.center,
      );
    }
    return () => {
      if (mapContext.intialized) {
        mapContext.clearExternalHoveredPopup();
      }
    };
  }, [mapContext, type, name, initialData, getString]);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const closeAreYouSureModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);
  const openDeleteModal = useCallback(() => setDeleteModalOpen(true), []);
  const updateTrailFlag = useUpdateTrailFlag();
  const flagForDeletion = (id: string) => {
    if (id) {
      updateTrailFlag({variables: {id, flag: 'DELETE REQUEST'}});
    }
    closeAreYouSureModal();
  };
  const clearFlag = (id: string) => {
    if (id) {
      updateTrailFlag({variables: {id, flag: null}});
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

  const preventSubmit = () =>
    (type && !loadingSubmit) ? false : true;

  const validateAndSave = () => {
    if (type && !loadingSubmit) {
      setLoadingSubmit(true);
      onSubmit({
        id: initialData.id,
        name: name && name.length ? name : null,
        type,
        waterCrossing: waterCrossing && waterCrossing.length ? waterCrossing : null,
        allowsBikes,
        allowsHorses,
        skiTrail,
      });
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

  const trailForMap = {
    id: noClickItemId,
    name,
    type: type as TrailType,
    location: initialData.center,
    line: initialData.line,
  };

  const map = type ? (
    <MapRenderProp
      id={'create-edit-trail-' + JSON.stringify(trailForMap)}
      trails={[trailForMap]}
    />
  ) : null;

  return (
    <>
      <Wrapper>
        <DetailBoxTitle>
          {getString('create-trail-name-title')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          <Grid>
            <FullColumn>
              <LabelContainer htmlFor={'create-trail-name'}>
                <Label>
                  {getString('global-text-value-name')}
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-trail-name'}
                initialValue={name}
                setInputValue={value => setName(value)}
                placeholder={getString('create-trail-name-placeholder')}
                /* autoComplete='off' is ignored in Chrome, but other strings aren't */
                maxLength={1000}
              />
            </FullColumn>
            <FullColumn>
              <LabelContainer htmlFor={'create-trail-select-type'}>
                <Label>
                  {getString('global-text-classification')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-trail-select-type'}
                value={`${type || ''}`}
                onChange={setSelectedType}
                placeholder={''}
              >
                <option value=''></option>
                <option value={TrailType.dirtroad}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.dirtroad}))}
                </option>
                <option value={TrailType.trail}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.trail}))}
                </option>
                <option value={TrailType.path}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.path}))}
                </option>
                <option value={TrailType.stairs}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.stairs}))}
                </option>
                <option value={TrailType.cycleway}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.cycleway}))}
                </option>
                <option value={TrailType.road}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.road}))}
                </option>
                <option value={TrailType.hiking}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.hiking}))}
                </option>
                <option value={TrailType.bridleway}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.bridleway}))}
                </option>
                <option value={TrailType.demandingMountainHiking}>
                  {upperFirst(getString('global-type-official-classification',
                    {type: TrailType.demandingMountainHiking}))}
                </option>
                <option value={TrailType.mountainHiking}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.mountainHiking}))}
                </option>
                <option value={TrailType.herdpath}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.herdpath}))}
                </option>
                <option value={TrailType.alpineHiking}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.alpineHiking}))}
                </option>
                <option value={TrailType.demandingAlpineHiking}>
                  {upperFirst(getString('global-type-official-classification',
                    {type: TrailType.demandingAlpineHiking}))}
                </option>
                <option value={TrailType.difficultAlpineHiking}>
                  {upperFirst(getString('global-type-official-classification',
                    {type: TrailType.difficultAlpineHiking}))}
                </option>
                <option value={TrailType.parentTrail}>
                  {upperFirst(getString('global-type-official-classification', {type: TrailType.parentTrail}))}
                </option>
              </SelectBox>
            </FullColumn>
          </Grid>
        </DetailBoxWithMargin>

        <DetailBoxTitle>
          {getString('create-mountain-optional-title')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          <Grid>
            <div>
              <LabelContainer htmlFor={'create-trail-waterCrossing'}>
                <Label>
                  {getString('trail-detail-water-crossing')}
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-trail-waterCrossing'}
                initialValue={waterCrossing ? waterCrossing : ''}
                setInputValue={value => setWaterCrossing(value)}
                placeholder={''}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'trail-detail-allows-bikes'}>
                <Label>
                  {getString('trail-detail-allows-bikes')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'trail-detail-allows-bikes'}
                value={booleanNullToTrivalent(allowsBikes)}
                onChange={trivalentToBooleanNull(setAllowsBikes)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-trail-select-allowshorses'}>
                <Label>
                  {getString('trail-detail-allows-horses')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-trail-select-allowsHorses'}
                value={booleanNullToTrivalent(allowsHorses)}
                onChange={trivalentToBooleanNull(setAllowsHorses)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
            </div>
            <div>
              <LabelContainer htmlFor={'create-trail-select-skiTrail'}>
                <Label>
                  {getString('trail-detail-ski-trail')}
                </Label>
              </LabelContainer>
              <SelectBox
                id={'create-trail-select-skiTrail'}
                value={booleanNullToTrivalent(skiTrail)}
                onChange={trivalentToBooleanNull(setSkiTrail)}
                placeholder={''}
              >
                <option value={Trivalent.Unknown}>{Trivalent.Unknown}</option>
                <option value={Trivalent.Yes}>{Trivalent.Yes}</option>
                <option value={Trivalent.No}>{Trivalent.No}</option>
              </SelectBox>
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

export default TrailForm;
