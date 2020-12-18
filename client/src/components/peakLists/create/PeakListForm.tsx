import { useMutation } from '@apollo/react-hooks';
import {
  faCheck,
  faEdit,
  faHiking,
  faMountain,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  ButtonSecondary,
  DetailBoxTitle,
  DetailBoxWithMargin,
  GhostButton,
  Label,
  LabelContainer,
  Section,
  SelectBox,
  SmallTextNote,
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
  Sublabel,
  Wrapper,
} from '../../sharedComponents/formUtils';
import Tooltip from '../../sharedComponents/Tooltip';
import AddMountains from './AddMountains';
import {MountainDatum} from './MountainSelectionModal';
import ParentModal from './ParentModal';

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
  parent: null;
}

export interface FormInput {
  name: string;
  shortName: string;
  description: string | null;
  optionalPeaksDescription: string | null;
  type: PeakListVariants;
  mountains: string[];
  optionalMountains: string[];
  parent: null;
  states: string[];
  resources: ExternalResource[] | null;
  tier: PeakListTier | null;
}

interface Props extends RouteComponentProps {
  initialData: InitialPeakListDatum;
  onSubmit: (input: FormInput) => void;
  mapContainer: HTMLDivElement | null;
  states: Array<{id: string, abbreviation: string}>;
}

const PeakListForm = (props: Props) => {
  const { initialData, onSubmit, history, states } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [name, setName] = useState<string>(initialData.name);
  const [shortName, setShortName] = useState<string>(initialData.shortName);
  const [parentModalOpen, setParentModalOpen] = useState<boolean>(false);
  const [tier, setTier] = useState<PeakListTier | undefined>(initialData.tier);
  const [description, setDescription] = useState<string>(initialData.description);
  const [optionalPeaksDescription, setOptionalPeaksDescription] =
    useState<string>(initialData.optionalPeaksDescription);
  const [mountains, setMountains] = useState<MountainDatum[]>(initialData.mountains);
  const [optionalMountains, setOptionalMountains] = useState<MountainDatum[]>(initialData.optionalMountains);
  const [externalResources, setExternalResources] =
    useState<ExternalResource[]>([...initialData.resources, {title: '', url: ''}]);
  const [createMountainModalOpen, setCreateMountainModalOpen] = useState<boolean>(false);

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

  const statesArray: Array<{id: string, abbreviation: string}> = [];
  [...mountains, ...optionalMountains].forEach(mtn => {
    if (mtn.state !== null) {
      const mtnStateId = mtn.state.id;
      if (statesArray.filter(state => state && state.id === mtnStateId).length === 0) {
        statesArray.push(mtn.state);
      }
    }
  });

  const verify = () => name && shortName && tier && mountains.length && !loadingSubmit
    ? true : false;

  const validateAndSave = () => {
    if (verify() && tier) {
      const mountainIds = mountains.map(mtn => mtn.id);
      const optionalMountainIds = optionalMountains.map(mtn => mtn.id);
      const stateIds = statesArray.map(state => state.id);
      setLoadingSubmit(true);
      const resources = externalResources.filter(resource => resource.title.length && resource.url.length);
      onSubmit({
        name,
        shortName,
        type: initialData.type ? initialData.type : PeakListVariants.standard,
        description,
        optionalPeaksDescription,
        mountains: mountainIds,
        optionalMountains: optionalMountainIds,
        states: stateIds,
        tier,
        resources,
        parent: null,
      });
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

  const saveButtonText = loadingSubmit === true
    ? getFluentString('global-text-value-saving') + '...' : getFluentString('global-text-value-save');

  const deleteButtonText = initialData.flag !== PeakListFlag.deleteRequest
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
        setInputValue={value => handleExternalResourceChange(value)('title', i)}
        placeholder={getFluentString('global-text-value-resource-title')}
      />
      <DelayedInput
        initialValue={resource.url}
        setInputValue={value => handleExternalResourceChange(value)('url', i)}
        placeholder={getFluentString('global-text-value-resource-url')}
      />
      <GhostButton onClick={e => deleteResource(e)(i)}>
        ×
      </GhostButton>
    </ResourceContainer>
  ));

  const copyMountains = (mountainArray: MountainDatum[], optionalMountainArray: MountainDatum[]) => {
    const uniqueMountains = mountainArray.filter(mtn1 => !mountains.find(mtn2 => mtn1.id === mtn2.id));
    setMountains([...mountains, ...uniqueMountains]);
    const uniqueOptionalMountains =
      optionalMountainArray.filter(mtn1 => !optionalMountains.find(mtn2 => mtn1.id === mtn2.id));
    setOptionalMountains([...optionalMountains, ...uniqueOptionalMountains]);
  };

  const parentModal = parentModalOpen === false ? null : (
    <ParentModal
      copyMountains={copyMountains}
      onCancel={() => setParentModalOpen(false)}
    />
  );

  const onNewMountainCreate = (mtn: MountainDatum) => setMountains([...mountains, mtn]);
  const createMountainModal = createMountainModalOpen === false ? null : (
    <CreateMountainModal
      onCancel={() => setCreateMountainModalOpen(false)}
      onSuccess={onNewMountainCreate}
    />
  );

  return (
    <>
      <Wrapper>
        <DetailBoxTitle>
          <BasicIconInText icon={faHiking} />
          {getFluentString('create-peak-list-peak-list-name-label')}
        </DetailBoxTitle>
        <DetailBoxWithMargin>
          <Section>
            <LabelContainer htmlFor={'create-peak-list-name'}>
              <Label>
                {getFluentString('global-text-value-name')}
              </Label>
            </LabelContainer>
            <DelayedInput
              id={'create-peak-list-name'}
              type={'text'}
              initialValue={name}
              setInputValue={value => setName(value)}
              placeholder={getFluentString('create-peak-list-peak-list-name-placeholder')}
              /* autoComplete='off' is ignored in Chrome, but other strings aren't */
              maxLength={1000}
            />
          </Section>
          <Grid>
            <div>
              <LabelContainer htmlFor={'create-peak-list-short-name'}>
                <Label>
                  {getFluentString('create-peak-list-peak-list-short-name-label')}
                  {' '}
                  <Sublabel>({getFluentString('create-peak-list-peak-list-short-name-note')})</Sublabel>
                </Label>
              </LabelContainer>
              <DelayedInput
                id={'create-peak-list-short-name'}
                type={'text'}
                initialValue={shortName}
                setInputValue={value => setShortName(value)}
                placeholder={getFluentString('create-peak-list-peak-list-short-name-placeholder')}
                maxLength={8}
              />
            </div>
            <div>
              <LabelContainer htmlFor={'create-peak-list-select-tier'}>
                <Label>
                  {getFluentString('global-text-value-difficulty')}
                </Label>
                <Tooltip
                  explanation={
                    <div dangerouslySetInnerHTML={{__html: getFluentString('global-text-value-list-tier-desc')}} />
                  }
                />
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
            </div>
          </Grid>
        </DetailBoxWithMargin>
        <CollapsibleDetailBox
          title={
            <>
              <BasicIconInText icon={faMountain} />
              {getFluentString('global-text-value-mountains')}
              {' '}({mountains.length})
            </>
          }
        >
          <Section>
            <SmallTextNote>
              {getFluentString('create-peak-list-peak-list-mountains-note', {
                'number-mountains': mountains.length,
              })}
            </SmallTextNote>
          </Section>
          <div>
            <AddMountains
              selectedMountains={mountains}
              setSelectedMountains={setMountains}
              openParentModal={() => setParentModalOpen(true)}
              states={states}
            />
          </div>
        </CollapsibleDetailBox>
        <CollapsibleDetailBox
          title={
            <>
              <BasicIconInText icon={faEdit} />
              {getFluentString('create-mountain-optional-title')}
            </>
          }
          defaultHidden={true}
        >
          <div style={{marginBottom: '1rem'}}>
            <LabelContainer htmlFor={'create-peak-list-description'}>
              <Label>
                {getFluentString('create-peak-list-peak-list-description-label')}
              </Label>
            </LabelContainer>
            <DelayedTextarea
              id={'create-peak-list-description'}
              rows={6}
              initialValue={description}
              setInputValue={value => setDescription(value)}
              placeholder={getFluentString('create-peak-list-peak-description')}
              maxLength={5000}
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

        <CollapsibleDetailBox
          title={
            <>
              <BasicIconInText icon={faMountain} style={{opacity: 0.5}}/>
              {getFluentString('create-peak-list-peak-list-optional-mountains')}
              {' '}({optionalMountains.length})
            </>
          }
          defaultHidden={true}
        >
          <Section>
            <SmallTextNote>{getFluentString('create-peak-list-peak-list-optional-mountains-note')}</SmallTextNote>
          </Section>
          <Section>
            <LabelContainer htmlFor={'create-peak-list-optional-description'}>
              <Label>
                {getFluentString('create-peak-list-peak-list-optional-description-label')}
              </Label>
            </LabelContainer>
            <DelayedTextarea
              id={'create-peak-list-optional-description'}
              rows={6}
              initialValue={optionalPeaksDescription}
              setInputValue={value => setOptionalPeaksDescription(value)}
              placeholder={getFluentString('create-peak-list-peak-optional-description')}
              maxLength={5000}
            />
          </Section>
          <div>
            <LabelContainer>
              <Label>
                {getFluentString('peak-list-detail-text-optional-mountains')}
              </Label>
            </LabelContainer>
            <AddMountains
              selectedMountains={optionalMountains}
              setSelectedMountains={setOptionalMountains}
              states={states}
            />
          </div>
        </CollapsibleDetailBox>
      </Wrapper>

      <ActionButtons>
        <ButtonWrapper>
          {deleteButton}
          <GhostButton
            onClick={history.goBack}
            mobileExtend={true}
          >
            {getFluentString('global-text-value-modal-cancel')}
          </GhostButton>
          <SaveButton
            disabled={!verify()}
            onClick={validateAndSave}
            mobileExtend={true}
          >
            <BasicIconInText icon={faCheck} />
            {saveButtonText}
          </SaveButton>
        </ButtonWrapper>
      </ActionButtons>
      {parentModal}
      {areYouSureModal}
      {createMountainModal}
    </>
  );
};

export default withRouter(PeakListForm);
