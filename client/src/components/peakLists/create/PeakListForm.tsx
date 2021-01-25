const {point, featureCollection} = require('@turf/helpers');
const centroid = require('@turf/centroid').default;
const getBbox = require('@turf/bbox').default;
import {
  faCheck,
  faEdit,
  faMountain,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {Types} from 'mongoose';
import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import useBeforeUnload from '../../../hooks/useBeforeUnload';
import useFluent from '../../../hooks/useFluent';
import {SuccessResponse, Variables} from '../../../queries/lists/addEditPeakList';
import {useUpdatePeakListFlag} from '../../../queries/lists/flagPeakList';
import {Routes} from '../../../routing/routes';
import {listDetailLink} from '../../../routing/Utils';
import {
  BasicIconInText,
  ButtonSecondary,
  ButtonWrapper,
  CancelButton,
  GhostButton,
  Label,
  LabelContainer,
  Section,
  SmallTextNote,
} from '../../../styling/styleUtils';
import {
  ExternalResource,
  ListPrivacy,
  PeakListFlag,
  PeakListTier,
} from '../../../types/graphQLTypes';
import CreateMountainModal from '../../mountains/create/CreateMountainModal';
import AreYouSureModal, {
  Props as AreYouSureModalProps,
} from '../../sharedComponents/AreYouSureModal';
import CollapsibleDetailBox from '../../sharedComponents/CollapsibleDetailBox';
import DelayedInput from '../../sharedComponents/DelayedInput';
import DelayedTextarea from '../../sharedComponents/DelayedTextarea';
import {
  DeleteButton,
  ResourceContainer,
  SaveButton,
  Wrapper,
} from '../../sharedComponents/formUtils';
import AddItems, {
  CampsiteDatum,
  MountainDatum,
  TrailDatum,
} from './AddItems';
import FormHeader from './FormHeader';
import ParentModal from './ParentModal';

export enum FormSource {
  Create = 'create',
  Edit = 'edit',
}

interface Props {
  initialData: SuccessResponse['peakList'];
  onSubmit: (input: Variables) => void;
  source: FormSource;
}

const PeakListForm = (props: Props) => {
  const { initialData, onSubmit, source } = props;

  const history = useHistory();
  const getString = useFluent();

  const initialMountains = initialData.mountains.filter(d => d !== null).map((d) => ({
    ...d, optional: false,
  })) as MountainDatum[];
  const initialOptionalMountains = initialData.optionalMountains.filter(d => d !== null).map((d) => ({
    ...d, optional: true,
  })) as MountainDatum[];

  const initialTrails = initialData.trails.filter(d => d !== null).map(d => ({
    ...d, optional: false,
  })) as TrailDatum[];
  const initialOptionalTrails = initialData.optionalTrails.filter(d => d !== null).map((d) => ({
    ...d, optional: true,
  })) as TrailDatum[];

  const initialCampsites = initialData.campsites.filter(d => d !== null).map(d => ({
    ...d, optional: false,
  })) as CampsiteDatum[];
  const initialOptionalCampsites = initialData.optionalCampsites.filter(d => d !== null).map((d) => ({
    ...d, optional: true,
  })) as CampsiteDatum[];

  const [listId, setListId] = useState<string | Types.ObjectId>(initialData.id);
  const [name, setName] = useState<string>(initialData.name);
  const [shortName, setShortName] = useState<string>(initialData.shortName);
  const [parentModalOpen, setParentModalOpen] = useState<boolean>(false);
  const [tier, setTier] = useState<PeakListTier | null>(initialData.tier);
  const [privacy, setPrivacy] = useState<ListPrivacy | null>(
    initialData.privacy ? initialData.privacy : ListPrivacy.Public,
  );
  const [description, setDescription] = useState<string>(initialData.description ? initialData.description : '');
  const [mountains, setMountains] = useState<MountainDatum[]>([...initialMountains, ...initialOptionalMountains]);
  const [trails, setTrails] = useState<TrailDatum[]>([...initialTrails, ...initialOptionalTrails]);
  const [campsites, setCampsites] = useState<CampsiteDatum[]>([...initialCampsites, ...initialOptionalCampsites]);
  const [externalResources, setExternalResources] =
    useState<ExternalResource[]>(
      initialData.resources ? [...initialData.resources, {title: '', url: ''}] : [{title: '', url: ''}]);
  const [createMountainModalOpen, setCreateMountainModalOpen] = useState<boolean>(false);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const checkIfModified = () => {
    return !loadingSubmit &&
    (
      name !== initialData.name ||
      shortName !== initialData.shortName ||
      tier !== initialData.tier ||
      privacy !== initialData.privacy ||
      description !== initialData.description ||
      mountains.length !== (initialMountains.length + initialOptionalMountains.length) ||
      trails.length !== (initialTrails.length + initialOptionalTrails.length) ||
      campsites.length !== (initialCampsites.length + initialOptionalCampsites.length)
    ) ? true : false;
  };

  useBeforeUnload(checkIfModified);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const closeAreYouSureModal = useCallback(() => setDeleteModalOpen(false), []);
  const openDeleteModal = useCallback(() => setDeleteModalOpen(true), []);
  // const openParentModal = useCallback(() => setParentModalOpen(true), []);
  const closeParentModal = useCallback(() => setParentModalOpen(false), []);
  const closeCreateMountainModal = useCallback(() => setCreateMountainModalOpen(false), []);

  const updatePeakListFlag = useUpdatePeakListFlag();
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

  const statesArray: Array<{id: string, abbreviation: string}> = [];
  [...mountains, ...campsites].forEach(datum => {
    if (datum.state !== null) {
      const datumStateId = datum.state.id;
      if (statesArray.filter(state => state && state.id === datumStateId).length === 0) {
        statesArray.push(datum.state);
      }
    }
  });
  trails.forEach(trail => {
    if (trail.states !== null && trail.states.length) {
      trail.states.forEach(trailState => {
        const trailStateId = trailState.id;
        if (statesArray.filter(state => state && state.id === trailStateId).length === 0) {
          statesArray.push(trailState);
        }
      });
    }
  });

  const verify = () => name && shortName && tier && privacy && !loadingSubmit && (
    mountains.length || trails.length || campsites.length
  ) ? true : false;

  const validateAndSave = () => {
    if (verify() && tier && privacy) {
      const mountainIds: string[] = [];
      const optionalMountainIds: string[] = [];
      mountains.forEach(mtn => {
        if (mtn.optional) {
          optionalMountainIds.push(mtn.id);
        } else {
          mountainIds.push(mtn.id);
        }
      });
      const trailIds: string[] = [];
      const optionalTrailIds: string[] = [];
      trails.forEach(trail => {
        if (trail.optional) {
          optionalTrailIds.push(trail.id);
        } else {
          trailIds.push(trail.id);
        }
      });
      const campsiteIds: string[] = [];
      const optionalCampsiteIds: string[] = [];
      campsites.forEach(campsite => {
        if (campsite.optional) {
          optionalCampsiteIds.push(campsite.id);
        } else {
          campsiteIds.push(campsite.id);
        }
      });
      const stateIds = statesArray.map(state => state.id);
      setLoadingSubmit(true);
      const resources = externalResources.filter(resource => resource.title.length && resource.url.length);
      const allPoints = featureCollection([
        ...mountains.map(mtn => point(mtn.location)),
        ...campsites.map(campsite => point(campsite.location)),
        ...trails.map(trail => point(trail.center)),
      ]);
      const center = centroid(allPoints);
      const bbox = getBbox(allPoints);
      onSubmit({
        id: listId as unknown as string,
        name,
        shortName,
        description,
        mountains: mountainIds,
        optionalMountains: optionalMountainIds,
        trails: trailIds,
        optionalTrails: optionalTrailIds,
        campsites: campsiteIds,
        optionalCampsites: optionalCampsiteIds,
        states: stateIds,
        tier,
        resources,
        privacy,
        center: center.geometry.coordinates.map((c: number) => parseFloat(c.toFixed(3))),
        bbox,
      });
    }
  };

  const onCancel = useCallback(() => {
    if (source === FormSource.Edit) {
      history.push(listDetailLink(initialData.id));
    } else {
      history.push(Routes.SearchLists);
    }
  }, [source, history, initialData.id]);

  const setStringToPeakListTier = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'casual') {
      return setTier(PeakListTier.casual);
    } else if (value === 'advanced') {
      return setTier(PeakListTier.advanced);
    } else if (value === 'expert') {
      return setTier(PeakListTier.expert);
    } else if (value === 'mountaineer') {
      return setTier(PeakListTier.mountaineer);
    }
    return setTier(null);
  }, [setTier]);

  const setStringToListPrivacy = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'public') {
      return setPrivacy(ListPrivacy.Public);
    } else if (value === 'private') {
      return setPrivacy(ListPrivacy.Private);
    }
    return setPrivacy(ListPrivacy.Public);
  }, [setPrivacy]);

  const saveButtonText = loadingSubmit === true
    ? getString('global-text-value-saving') + '...' : getString('global-text-value-save');

  const deleteButtonText = initialData.flag !== PeakListFlag.deleteRequest
    ? getString('global-text-value-delete')
    : getString('global-text-value-cancel-delete-request');

  const deleteButton = !initialData.id || source === FormSource.Create ? null : (
    <DeleteButton
      onClick={openDeleteModal}
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
        placeholder={getString('global-text-value-resource-title')}
      />
      <DelayedInput
        initialValue={resource.url}
        setInputValue={value => handleExternalResourceChange(value)('url', i)}
        placeholder={getString('global-text-value-resource-url')}
      />
      <GhostButton onClick={e => deleteResource(e)(i)}>
        ×
      </GhostButton>
    </ResourceContainer>
  ));

  const copyMountains = (mountainArray: MountainDatum[] /*optionalMountainArray: MountainDatum[]*/) => {
    const uniqueMountains = mountainArray.filter(mtn1 => !mountains.find(mtn2 => mtn1.id === mtn2.id));
    setMountains([...mountains, ...uniqueMountains]);
    // const uniqueOptionalMountains =
    //   optionalMountainArray.filter(mtn1 => !optionalMountains.find(mtn2 => mtn1.id === mtn2.id));
    // setOptionalMountains([...optionalMountains, ...uniqueOptionalMountains]);
  };

  const parentModal = parentModalOpen === false ? null : (
    <ParentModal
      copyMountains={copyMountains}
      onCancel={closeParentModal}
    />
  );

  const onNewMountainCreate = (mtn: MountainDatum) => setMountains([...mountains, mtn]);
  const createMountainModal = createMountainModalOpen === false ? null : (
    <CreateMountainModal
      onCancel={closeCreateMountainModal}
      onSuccess={onNewMountainCreate}
    />
  );

  const toggleId = useCallback(() => setListId(new Types.ObjectId()), [setListId]);

  return (
    <>
      <FormHeader
        id={listId.toString()}
        name={name}
        setName={setName}
        shortName={shortName}
        setShortName={setShortName}
        tier={tier}
        setStringToPeakListTier={setStringToPeakListTier}
        privacy={privacy}
        setStringToListPrivacy={setStringToListPrivacy}
        toggleId={source === FormSource.Create ? toggleId : null}
      />
      <Wrapper>
        <CollapsibleDetailBox
          title={
            <>
              <BasicIconInText icon={faMountain} />
              {getString('global-text-value-mountains')}
              {' '}({mountains.length})
            </>
          }
        >
          <Section>
            <SmallTextNote>
              {getString('create-peak-list-peak-list-mountains-note', {
                'number-mountains': mountains.length,
              })}
            </SmallTextNote>
          </Section>
          <AddItems
            selectedMountains={mountains}
            setSelectedMountains={setMountains}
            selectedTrails={trails}
            setSelectedTrails={setTrails}
            selectedCampsites={campsites}
            setSelectedCampsites={setCampsites}
          />
        </CollapsibleDetailBox>
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
              placeholder={getString('create-peak-list-peak-description')}
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

      <ButtonWrapper>
        {deleteButton}
        <CancelButton
          onClick={onCancel}
          mobileExtend={true}
        >
          {getString('global-text-value-modal-cancel')}
        </CancelButton>
        <SaveButton
          disabled={!verify()}
          onClick={validateAndSave}
          mobileExtend={true}
        >
          <BasicIconInText icon={faCheck} />
          {saveButtonText}
        </SaveButton>
      </ButtonWrapper>
      {parentModal}
      {areYouSureModal}
      {createMountainModal}
    </>
  );
};

export default PeakListForm;
