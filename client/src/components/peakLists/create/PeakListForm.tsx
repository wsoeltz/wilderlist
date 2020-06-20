import { useMutation } from '@apollo/react-hooks';
import {
  faCheck,
  faEdit,
  faHiking,
  faMountain,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import { createPortal } from 'react-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  ButtonPrimary,
  ButtonSecondary,
  CheckboxInput,
  CheckboxRoot,
  DetailBoxTitle,
  DetailBoxWithMargin,
  GhostButton,
  InputBase,
  Label,
  LabelContainer,
  Required,
  Section,
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
import CollapsibleDetailBox from '../../sharedComponents/CollapsibleDetailBox';
import {
  ButtonWrapper,
  CheckboxLabel,
  DeleteButton,
  FullColumn,
  ResourceContainer,
  Root as Grid,
  SaveButton,
  Sublabel,
} from '../../sharedComponents/formUtils';
import Map, {MapContainer} from '../../sharedComponents/map';
import {CoordinateWithDates} from '../../sharedComponents/map/types';
import Tooltip from '../../sharedComponents/Tooltip';
import AddMountains, {MountainDatum} from './AddMountains';
import ParentModal from './ParentModal';

const AddButtonsContainer = styled(Section)`
  display: flex;
  justify-content: space-between;
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
  const [tier, setTier] = useState<PeakListTier | undefined>(initialData.tier);
  const [description, setDescription] = useState<string>(initialData.description);
  const [optionalPeaksDescription, setOptionalPeaksDescription] =
    useState<string>(initialData.optionalPeaksDescription);
  const [mountains, setMountains] = useState<MountainDatum[]>(initialData.mountains);
  const [optionalMountains, setOptionalMountains] = useState<MountainDatum[]>(initialData.optionalMountains);
  const [externalResources, setExternalResources] =
    useState<ExternalResource[]>([...initialData.resources, {title: '', url: ''}]);
  const [createMountainModalOpen, setCreateMountainModalOpen] = useState<boolean>(false);

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

  const statesArray: Array<{id: string, abbreviation: string}> = [];
  [...mountains, ...optionalMountains].forEach(mtn => {
    if (mtn.state !== null) {
      const mtnStateId = mtn.state.id;
      if (statesArray.filter(state => state && state.id === mtnStateId).length === 0) {
        statesArray.push(mtn.state);
      }
    }
  });

  const verify = () => (
    name && shortName && tier && mountains.length &&
    verifyChangesIsChecked && !loadingSubmit
  ) ? true : false;

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
    >
      <BasicIconInText icon={faTrash} />
      {deleteButtonText}
    </DeleteButton>
  );

  const mountainCoordinates = [...mountains, ...optionalMountains].map(mtn => ({...mtn, completionDates: null }));

  const addMountainToList = (mtnToAdd: CoordinateWithDates) => {
    if (!mountains.find(mtn => mtn.id === mtnToAdd.id)) {
      axios.post('/graphql', {
        query: `query GetMountainDatum($id: ID) {
          mountain(id: $id) {
            id
            name
            state {
              id
              abbreviation
            }
            elevation
            latitude
            longitude
          }
        }`,
        variables: {id: mtnToAdd.id} },
        { headers: {'Content-Type': 'application/json'},
      }).then((res) => {
        if (res && res.data && res.data.data && res.data.data.mountain) {
          const newMountain: MountainDatum = res.data.data.mountain;
          setMountains([...mountains, newMountain]);
        }
      }).catch(e => console.error(e));
    }
  };
  const removeMountainFromList = (mountainToRemove: CoordinateWithDates) => {
    const updatedMtnList = mountains.filter(mtn => mtn.id !== mountainToRemove.id);
    setMountains([...updatedMtnList]);
  };
  const addRemoveMountains = {
    addText: 'Add to List',
    onAdd: addMountainToList,
    removeText: 'Remove from List',
    onRemove: removeMountainFromList,
  };

  const addNewMountainButton = (
    <div style={{textAlign: 'center'}}>
      <Section>
        <SmallTextNote>
          {getFluentString('create-mountain-title-create-question')}
        </SmallTextNote>
      </Section>
      <ButtonPrimary onClick={() => setCreateMountainModalOpen(true)}>
        {getFluentString('create-mountain-title-create-new')}
      </ButtonPrimary>
    </div>
  );
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
          showOtherMountains={true}
          defaultOtherMountainsOn={true}
          addRemoveMountains={addRemoveMountains}
          primaryMountainLegendCopy={'Mountains on this list'}
          customScaleContentBottom={addNewMountainButton}
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
            showOtherMountains={true}
            defaultOtherMountainsOn={true}
            addRemoveMountains={addRemoveMountains}
            primaryMountainLegendCopy={'Mountains on this list'}
            customScaleContentBottom={addNewMountainButton}
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
        <AddButtonsContainer>
          <ButtonSecondary onClick={() => setParentModalOpen(true)}>
            {getFluentString('create-peak-list-select-parent-modal-button')}
          </ButtonSecondary>
        </AddButtonsContainer>
        <div>
          <AddMountains
            selectedMountains={mountains}
            setSelectedMountains={setMountains}
          />
        </div>
      </CollapsibleDetailBox>
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
            placeholder={getFluentString('create-peak-list-peak-description')}
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

      <CollapsibleDetailBox
        title={
          <>
            <BasicIconInText icon={faMountain} style={{opacity: 0.5}}/>
            {getFluentString('create-peak-list-peak-list-optional-mountains')}
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
          <TextareaBase
            id={'create-peak-list-optional-description'}
            rows={6}
            value={optionalPeaksDescription}
            onChange={e => setOptionalPeaksDescription(e.target.value)}
            placeholder={getFluentString('create-peak-list-peak-optional-description')}
            autoComplete={'off'}
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
          />
        </div>
      </CollapsibleDetailBox>

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
    </>
  );
};

export default withRouter(PeakListForm);
