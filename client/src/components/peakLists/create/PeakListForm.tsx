import { useMutation } from '@apollo/react-hooks';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext, useState} from 'react';
import { createPortal } from 'react-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
  FORMAT_STATE_REGION_FOR_TEXT,
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
  PlaceholderText,
  Required,
  RequiredNote as RequiredNoteBase,
  SelectBox,
  SmallTextNote,
  TextareaBase,
} from '../../../styling/styleUtils';
import {
  ExternalResource,
  PeakList,
  PeakListFlag,
  PeakListTier,
  PeakListVariants,
} from '../../../types/graphQLTypes';
import CreateMountainModal from '../../mountains/create/CreateMountainModal';
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
import Map, {MapContainer} from '../../sharedComponents/map';
import AddMountains, {MountainDatum} from '../detail/completionModal/AdditionalMountains';
import { getSentences } from '../detail/IntroText';
import { StateDatum } from '../list/ListPeakLists';
import { getStatesOrRegion } from '../list/PeakListCard';
import { isState } from '../Utils';
import ParentModal, {PeakListDatum} from './ParentModal';

export const RequiredNote = styled(RequiredNoteBase)`
  margin: 0.67rem 0;
  text-align: right;
`;

const NoMountainSelection = styled(PlaceholderText)`
  min-height: 200px;
`;

const CenteredFullColumn = styled(FullColumn)`
  display: flex;
  justify-content: center;
`;

export const FLAG_PEAK_LIST = gql`
  mutation($id: ID!, $flag: PeakListFlag) {
    peakList: updatePeakListFlag(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

export interface FlagSuccessResponse {
  peakList: null | {
    id: PeakList['id'];
    flag: PeakList['flag'];
  };
}

export interface FlagVariables {
  id: string;
  flag: PeakListFlag | null;
}

export interface InitialPeakListDatum {
  id: string | undefined;
  name: string;
  shortName: string;
  description: string;
  optionalPeaksDescription: string;
  type: PeakListVariants;
  mountains: MountainDatum[];
  optionalMountains: MountainDatum[];
  flag: PeakListFlag | null;
  tier: PeakListTier | undefined;
  resources: ExternalResource[];
  parent: {id: string, name: string} | null;
}

export interface FormInput {
  name: string;
  shortName: string;
  description: string | null;
  optionalPeaksDescription: string | null;
  type: PeakListVariants;
  mountains: string[];
  optionalMountains: string[];
  parent: string | null;
  states: string[];
  resources: ExternalResource[] | null;
  tier: PeakListTier;
}

interface Props extends RouteComponentProps {
  initialData: InitialPeakListDatum;
  onSubmit: (input: FormInput) => void;
  mapContainer: HTMLDivElement | null;
}

const PeakListForm = (props: Props) => {
  const { initialData, onSubmit, history, mapContainer } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [name, setName] = useState<string>(initialData.name);
  const [shortName, setShortName] = useState<string>(initialData.shortName);
  const [parentModalOpen, setParentModalOpen] = useState<boolean>(false);
  const [parent, setParent] = useState<{id: string, name: string} | null>(initialData.parent);
  const [type, setType] = useState<PeakListVariants>(initialData.type);
  const [tier, setTier] = useState<PeakListTier | undefined>(initialData.tier);
  const [description, setDescription] = useState<string>(initialData.description);
  const [optionalPeaksDescription, setOptionalPeaksDescription] =
    useState<string>(initialData.optionalPeaksDescription);
  const [mountains, setMountains] = useState<MountainDatum[]>(initialData.mountains);
  const [optionalMountains, setOptionalMountains] = useState<MountainDatum[]>(initialData.optionalMountains);
  const [externalResources, setExternalResources] =
    useState<ExternalResource[]>([...initialData.resources, {title: '', url: ''}]);
  const [createMountainModalOpen, setCreateMountainModalOpen] = useState<boolean>(false);
  const [createOptionalMountainModalOpen, setCreateMountainOptionalModalOpen] = useState<boolean>(false);

  const [verifyChangesIsChecked, setVerifyChangesIsChecked] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const closeAreYouSureModal = () => {
    setDeleteModalOpen(false);
  };

  const [updatePeakListFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_PEAK_LIST);
  const flagForDeletion = (id: string | undefined) => {
    if (id) {
      updatePeakListFlag({variables: {id, flag: PeakListFlag.deleteRequest}});
    }
    closeAreYouSureModal();
  };
  const clearFlag = (id: string | undefined) => {
    if (id) {
      updatePeakListFlag({variables: {id, flag: null}});
    }
    closeAreYouSureModal();
  };

  const areYouSureProps: AreYouSureModalProps =
    initialData.flag === PeakListFlag.deleteRequest ? {
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

  const titleText = initialData.name !== '' ? getFluentString('create-peak-list-title-edit', {
    'list-name': initialData.name,
  }) : getFluentString('create-peak-list-title-create');

  const statesArray: StateDatum[] = [];
  [...mountains, ...optionalMountains].forEach(mtn => {
    if (mtn.state !== null) {
      const mtnStateId = mtn.state.id;
      if (statesArray.filter(state => state.id === mtnStateId).length === 0) {
        statesArray.push(mtn.state);
      }
    }
  });

  const verify = () => (
    name && shortName && type && tier && mountains.length &&
    verifyChangesIsChecked && !loadingSubmit
  ) ? true : false;

  const validateAndSave = () => {
    if (verify() && tier) {
      const mountainIds = parent === null ? mountains.map(mtn => mtn.id) : [];
      const optionalMountainIds = parent === null ? optionalMountains.map(mtn => mtn.id) : [];
      const stateIds = parent === null ? statesArray.map(state => state.id) : [];
      const parentId = parent === null ? null : parent.id;
      setLoadingSubmit(true);
      const resources = externalResources.filter(resource => resource.title.length && resource.url.length);
      onSubmit({
        name,
        shortName,
        type,
        description,
        optionalPeaksDescription,
        mountains: mountainIds,
        optionalMountains: optionalMountainIds,
        states: stateIds,
        tier,
        resources,
        parent: parentId,
      });
    }
  };

  const setStringToPeakListVariant = (value: string) => {
    if (value === 'standard') {
      setType(PeakListVariants.standard);
    } else if (value === 'winter') {
      setType(PeakListVariants.winter);
    } else if (value === 'fourSeason') {
      setType(PeakListVariants.fourSeason);
    } else if (value === 'grid') {
      setType(PeakListVariants.grid);
    }
  };
  const setStringToPeakListTier = (value: string) => {
    if (value === 'casual') {
      return setTier(PeakListTier.casual);
    } else if (value === 'advanced') {
      return setTier(PeakListTier.advanced);
    } else if (value === 'expert') {
      return setTier(PeakListTier.expert);
    } else if (value === 'mountaineer') {
      return setTier(PeakListTier.mountaineer);
    }
    return setTier(undefined);
  };

  let descriptionPlaceholderText: string;
  if (description && description.length) {
    descriptionPlaceholderText = description;
  } else if (mountains && mountains.length) {
    const statesOrRegions = getStatesOrRegion(statesArray, getFluentString);
    const isStateOrRegion = isState(statesOrRegions) === true ? 'state' : 'region';
    const mountainsSortedByElevation = sortBy(mountains, ['elevation']).reverse();
    const {firstParagraph, secondParagraph, thirdParagraph} = getSentences({
      listName: name.length ? name : '[List Name]',
      numberOfPeaks: mountains.length,
      isStateOrRegion,
      stateRegionName: FORMAT_STATE_REGION_FOR_TEXT(statesOrRegions),
      highestMountain: mountainsSortedByElevation[0],
      smallestMountain: mountainsSortedByElevation[mountainsSortedByElevation.length - 1],
      parent,
      getFluentString,
      type,
      shortName,
    });
    descriptionPlaceholderText = firstParagraph +
      '\n\n' +
      secondParagraph +
      '\n\n' +
      thirdParagraph;
  } else {
    descriptionPlaceholderText = getFluentString('peak-list-detail-list-overview-empty', {
      'list-name': name.length ? name : '[List Name]',
    });
  }

  let optionalPeaksDescriptionPlaceholderText: string;
  if (optionalPeaksDescription && optionalPeaksDescription.length) {
    optionalPeaksDescriptionPlaceholderText = optionalPeaksDescription;
  } else {
    optionalPeaksDescriptionPlaceholderText =
    getFluentString('peak-list-detail-text-optional-mountains-desc');
  }

  const saveButtonText = loadingSubmit === true
    ? getFluentString('global-text-value-saving') + '...' : getFluentString('global-text-value-save');

  const deleteButtonText = initialData.flag !== PeakListFlag.deleteRequest
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

  const mountainCoordinates = [...mountains, ...optionalMountains].map(mtn => ({...mtn, completionDates: null }));

  let map: React.ReactElement<any> | null;
  if (mapContainer !== null) {
    map = createPortal((
      <FullColumn style={{height: '100%'}}>
        <Map
          mountainId={null}
          peakListId={null}
          coordinates={mountainCoordinates}
          userId={null}
          isOtherUser={true}
          colorScaleColors={[]}
          colorScaleSymbols={[]}
          colorScaleLabels={[]}
          fillSpace={true}
          completedAscents={[]}
          key={'create-peak-list-key'}
        />
      </FullColumn>
    ), mapContainer);
  } else {
    map = (
      <FullColumn>
        <MapContainer>
          <Map
            mountainId={null}
            peakListId={null}
            coordinates={mountainCoordinates}
            userId={null}
            isOtherUser={true}
            colorScaleColors={[]}
            colorScaleSymbols={[]}
            colorScaleLabels={[]}
            completedAscents={[]}
            key={'create-peak-list-key'}
          />
        </MapContainer>
      </FullColumn>
    );
  }

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

  const setParentId = (parentObj: PeakListDatum | null) => setParent(parentObj);
  const copyMountains = (mountainArray: MountainDatum[], optionalMountainArray: MountainDatum[]) => {
    setMountains([...mountainArray]);
    setOptionalMountains([...optionalMountainArray]);
  };

  const parentModal = parentModalOpen === false ? null : (
    <ParentModal
      setParent={setParentId}
      copyMountains={copyMountains}
      onCancel={() => setParentModalOpen(false)}
    />
  );

  const clearParent = () => {
    setParentId(null);
    setMountains([]);
    setOptionalMountains([]);
  };

  const onNewMountainCreate = (mtn: MountainDatum) => setMountains([...mountains, mtn]);
  const createMountainModal = createMountainModalOpen === false ? null : (
    <CreateMountainModal
      onCancel={() => setCreateMountainModalOpen(false)}
      onSuccess={onNewMountainCreate}
    />
  );

  const onNewOptionalMountainCreate = (mtn: MountainDatum) => setOptionalMountains([...optionalMountains, mtn]);
  const createOptionalMountainModal = createOptionalMountainModalOpen === false ? null : (
    <CreateMountainModal
      onCancel={() => setCreateMountainOptionalModalOpen(false)}
      onSuccess={onNewOptionalMountainCreate}
    />
  );

  const mountainSelection = parent !== null ? (
    <FullColumn>
      <NoMountainSelection>
        <p>
          {getFluentString('global-text-value-parent')}: <strong>{parent.name}</strong>
          <br />
          <small>
            <em>{getFluentString('create-peak-list-has-parent-mountains')}</em></small>
          <br />
          <GhostButton onClick={clearParent}>
            {getFluentString('create-peak-list-remove-parent')}
          </GhostButton>
        </p>
      </NoMountainSelection>
    </FullColumn>
  ) : (
    <>
      <FullColumn>
        <LabelContainer>
          <Label>
            {getFluentString('global-text-value-mountains')}
            <Required children={'*'} />
          </Label>
        </LabelContainer>
        <AddMountains
          targetMountainId={null}
          selectedMountains={mountains}
          setSelectedMountains={setMountains}
          expandedLayout={true}
        />
      </FullColumn>
      <CenteredFullColumn>
        <small>{getFluentString('create-mountain-title-create-question')}</small>
      </CenteredFullColumn>
      <CenteredFullColumn>
        <ButtonPrimary onClick={() => setCreateMountainModalOpen(true)}>
          {getFluentString('create-mountain-title-create-new')}
        </ButtonPrimary>
      </CenteredFullColumn>
    </>
  );

  const optionalMountainSelection = parent !== null ? (
    <FullColumn>
      <NoMountainSelection>
        <p>
          {getFluentString('global-text-value-parent')}: <strong>{parent.name}</strong>
          <br />
          <small>
            <em>{getFluentString('create-peak-list-has-parent-optional-mountains')}</em></small>
          <br />
          <GhostButton onClick={clearParent}>
            {getFluentString('create-peak-list-remove-parent')}
          </GhostButton>
        </p>
      </NoMountainSelection>
    </FullColumn>
  ) : (
    <>
      <FullColumn>
        <LabelContainer>
          <Label>
            {getFluentString('peak-list-detail-text-optional-mountains')}
            {' '}
            <small>({getFluentString('global-text-value-optional')})</small>
          </Label>
        </LabelContainer>
        <AddMountains
          targetMountainId={null}
          selectedMountains={optionalMountains}
          setSelectedMountains={setOptionalMountains}
          expandedLayout={true}
        />
      </FullColumn>
      <CenteredFullColumn>
        <small>{getFluentString('create-mountain-title-create-question-optional')}</small>
      </CenteredFullColumn>
      <CenteredFullColumn>
        <ButtonPrimary onClick={() => setCreateMountainOptionalModalOpen(true)}>
          {getFluentString('create-mountain-title-create-new')}
        </ButtonPrimary>
      </CenteredFullColumn>
    </>
  );

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
        <LabelContainer htmlFor={'create-peak-list-name'}>
          <Label>
            {getFluentString('create-peak-list-peak-list-name-label')}
            <Required children={'*'} />
          </Label>
        </LabelContainer>
        <InputBase
          id={'create-peak-list-name'}
          type={'text'}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={getFluentString('create-peak-list-peak-list-name-placeholder')}
          /* autoComplete='off' is ignored in Chrome, but other strings aren't */
          autoComplete={'nope'}
          maxLength={1000}
        />
      </FullColumn>
      <div>
        <LabelContainer htmlFor={'create-peak-list-short-name'}>
          <Label>
            {getFluentString('create-peak-list-peak-list-short-name-label')}
            {' '}
            <small>({getFluentString('create-peak-list-peak-list-short-name-note')})</small>
            <Required children={'*'} />
          </Label>
        </LabelContainer>
        <InputBase
          id={'create-peak-list-short-name'}
          type={'text'}
          value={shortName}
          onChange={e => setShortName(e.target.value)}
          placeholder={getFluentString('create-peak-list-peak-list-short-name-placeholder')}
          autoComplete={'off'}
          maxLength={8}
        />
      </div>
      <div>
        <LabelContainer htmlFor={'create-peak-list-select-type'}>
          <Label>
            {getFluentString('global-text-value-type')}
            <Required children={'*'} />
          </Label>
        </LabelContainer>
        <SelectBox
          id={'create-peak-list-select-type'}
          value={type}
          onChange={e => setStringToPeakListVariant(e.target.value)}
          placeholder={getFluentString('global-text-value-type')}
        >
          <option value={PeakListVariants.standard}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.standard,
            })}
          </option>
          <option value={PeakListVariants.winter}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.winter,
            })}
          </option>
          <option value={PeakListVariants.fourSeason}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.fourSeason,
            })}
          </option>
          <option value={PeakListVariants.grid}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.grid,
            })}
          </option>
        </SelectBox>
      </div>
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
          placeholder={descriptionPlaceholderText}
          autoComplete={'off'}
          maxLength={5000}
        />
      </FullColumn>
      <CenteredFullColumn>
        <ButtonPrimary onClick={() => setParentModalOpen(true)}>
          {getFluentString('create-peak-list-select-parent-modal-button')}
        </ButtonPrimary>
      </CenteredFullColumn>
      {mountainSelection}
      {map}
      <FullColumn>
        <LabelContainer htmlFor={'create-peak-list-optional-description'}>
          <Label>
            {getFluentString('create-peak-list-peak-list-optional-description-label')}
            {' '}
            <small>({getFluentString('global-text-value-optional')})</small>
          </Label>
        </LabelContainer>
        <TextareaBase
          id={'create-peak-list-optional-description'}
          rows={6}
          value={optionalPeaksDescription}
          onChange={e => setOptionalPeaksDescription(e.target.value)}
          placeholder={optionalPeaksDescriptionPlaceholderText}
          autoComplete={'off'}
          maxLength={5000}
        />
      </FullColumn>
      {optionalMountainSelection}
      <FullColumn>
        <LabelContainer htmlFor={'create-peak-list-select-tier'}>
          <Label>
            {getFluentString('global-text-value-tier')}
            <Required children={'*'} />
          </Label>
        </LabelContainer>
        <SelectBox
          id={'create-peak-list-select-tier'}
          value={tier || ''}
          onChange={e => setStringToPeakListTier(e.target.value)}
          placeholder={getFluentString('global-text-value-tier')}
        >
          <option value=''></option>
          <option value={PeakListTier.casual}>
            {getFluentString('global-text-value-list-tier', {
              tier: PeakListTier.casual,
            })}
          </option>
          <option value={PeakListTier.advanced}>
            {getFluentString('global-text-value-list-tier', {
              tier: PeakListTier.advanced,
            })}
          </option>
          <option value={PeakListTier.expert}>
            {getFluentString('global-text-value-list-tier', {
              tier: PeakListTier.expert,
            })}
          </option>
          <option value={PeakListTier.mountaineer}>
            {getFluentString('global-text-value-list-tier', {
              tier: PeakListTier.mountaineer,
            })}
          </option>
        </SelectBox>
        <SmallTextNote dangerouslySetInnerHTML={{__html: getFluentString('global-text-value-list-tier-desc') }} />
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
            value={'create-peak-list-verify-changes-are-accurate'}
            id={'create-peak-list-verify-changes-are-accurate'}
            checked={verifyChangesIsChecked}
            onChange={() => setVerifyChangesIsChecked(!verifyChangesIsChecked)}
          />
          <CheckboxLabel htmlFor={'create-peak-list-verify-changes-are-accurate'}>
            {getFluentString('create-peak-list-check-your-work')}
            <Required children={'*'} />
           </CheckboxLabel>
        </CheckboxRoot>
        <ButtonWrapper>
          {deleteButton}
          <GhostButton onClick={history.goBack}>
            {getFluentString('global-text-value-modal-cancel')}
          </GhostButton>
          <SaveButton
            disabled={!verify()}
            onClick={validateAndSave}
          >
            <BasicIconInText icon={faCheck} />
            {saveButtonText}
          </SaveButton>
        </ButtonWrapper>
      </FullColumn>
      {parentModal}
      {areYouSureModal}
      {createMountainModal}
      {createOptionalMountainModal}
    </Root>
  );
};

export default withRouter(PeakListForm);
