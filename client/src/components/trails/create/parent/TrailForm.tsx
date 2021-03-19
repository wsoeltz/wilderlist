const {lineString, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
const length = require('@turf/length').default;
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import uniq from 'lodash/uniq';
import React, {useCallback, useState} from 'react';
import useFluent from '../../../../hooks/useFluent';
import { Variables } from '../../../../queries/trails/editTrailParent';
import {useUpdateTrailFlag} from '../../../../queries/trails/flagTrail';
import {
  BasicIconInText,
  DetailBoxTitle,
  DetailBoxWithMargin,
  GhostButton,
  Label,
  LabelContainer,
} from '../../../../styling/styleUtils';
import {
  State,
  Trail,
} from '../../../../types/graphQLTypes';
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
import AddItems from './AddItems';

export interface InitialTrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  flag: Trail['flag'];
  children: Array<{
    id: Trail['id'];
    name: Trail['name'];
    line: Trail['line'];
    center: Trail['center'];
    type: Trail['type'];
    states: Array<{id: State['id'], abbreviation: State['abbreviation']}>;
  }>;
}

interface Props {
  initialData: InitialTrailDatum;
  onSubmit: (input: Variables) => void;
  onCancel: () => void;
}

const TrailForm = (props: Props) => {
  const { initialData, onSubmit, onCancel } = props;

  const getString = useFluent();

  const [name, setName] = useState<string>(initialData.name ? initialData.name : '');
  const [children, setChildren] = useState<InitialTrailDatum['children']>(initialData.children);

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
    (name && !loadingSubmit) ? false : true;

  const validateAndSave = () => {
    if (name && !loadingSubmit) {
      setLoadingSubmit(true);
      const allLines: any[] = [];
      const childIds: string[] = [];
      const allStates: string[] = [];
      let totalLength: number = 0;
      children.forEach(c => {
        childIds.push(c.id);
        if (c.line && c.line.length > 1) {
          const geoJsonLine = lineString(c.line);
          allLines.push(geoJsonLine);
          const trailLength = length(geoJsonLine, {units: 'miles'});
          if (trailLength) {
            totalLength += trailLength;
          }
        }
        if (c.states && c.states.length) {
          c.states.forEach(s => s && s.id ? allStates.push(s.id) : null);
        }
      });
      onSubmit({
        id: initialData.id,
        name,
        children: childIds,
        trailLength: totalLength,
        bbox: getBbox(featureCollection(allLines)),
        states: uniq(allStates),
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
          </Grid>
        </DetailBoxWithMargin>

        <AddItems
          selectedTrails={children}
          setSelectedTrails={setChildren}
        />

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

      {areYouSureModal}
    </>
  );
};

export default TrailForm;
