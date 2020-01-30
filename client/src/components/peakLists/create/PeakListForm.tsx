import React, {useState, useContext} from 'react';
import {
  Root,
  Title,
  FullColumn,
  CheckboxLabel,
  ButtonWrapper,
  SaveButton,
  DeleteButton,
} from '../../sharedComponents/formUtils';
import {
  CheckboxInput,
  CheckboxRoot,
  GhostButton,
  InputBase,
  Label,
  TextareaBase,
  SelectBox,
  LabelContainer,
} from '../../../styling/styleUtils';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { GetString } from 'fluent-react';
import {
  PeakListFlag,
  PeakListVariants,
} from '../../../types/graphQLTypes';
import sortBy from 'lodash/sortBy';
import { getStatesOrRegion, StateDatum } from '../list/PeakListCard';
import { isState } from '../Utils';
import AddMountains, {MountainDatum} from '../detail/completionModal/AdditionalMountains';
import Map from '../../sharedComponents/map';

export interface InitialPeakListDatum {
  id: string | undefined;
  name: string,
  shortName: string,
  description: string,
  optionalPeaksDescription: string,
  type: PeakListVariants,
  mountains: MountainDatum[];
  optionalMountains: MountainDatum[];
  flag: PeakListFlag | null;
}

interface Props extends RouteComponentProps {
  initialData: InitialPeakListDatum;
  onSubmit: () => void;
}

const PeakListForm = (props: Props) => {
  const { initialData, onSubmit, history } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [name, setName] = useState<string>(initialData.name);
  const [shortName, setShortName] = useState<string>(initialData.shortName);
  const [type, setType] = useState<PeakListVariants>(initialData.type);
  const [description, setDescription] = useState<string>(initialData.description);
  const [optionalPeaksDescription, setOptionalPeaksDescription] =
    useState<string>(initialData.optionalPeaksDescription);
  const [mountains, setMountains] = useState<MountainDatum[]>(initialData.mountains);
  const [optionalMountains, setOptionalMountains] = useState<MountainDatum[]>(initialData.optionalMountains);

  const [verifyChangesIsChecked, setVerifyChangesIsChecked] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const titleText = initialData.name !== '' ? getFluentString('create-peak-list-title-edit', {
    'list-name': initialData.name,
  }) : getFluentString('create-peak-list-title-create');

  let statesArray: StateDatum[] = [];
  [...mountains, ...optionalMountains].forEach(mtn => {
    if (mtn.state !== null) {
      const mtnStateId = mtn.state.id;
      if (statesArray.filter(state => state.id === mtnStateId).length === 0) {
        statesArray.push(mtn.state);
      }
    }
  });

  const verify = () => (
    name && shortName && type &&
    verifyChangesIsChecked && !loadingSubmit
  ) ? true : false;

  const validateAndSave = () => {
    if (verify()) {
      console.log({
        name, shortName, type, description, optionalPeaksDescription,
        mountains, optionalMountains, statesArray,
      })
      setLoadingSubmit(true);
      onSubmit();
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

  let descriptionPlaceholderText: string;
  if (description && description.length) {
    descriptionPlaceholderText = description;
  } else if (mountains && mountains.length) {
    const statesOrRegions = getStatesOrRegion(statesArray, getFluentString);
    const isStateOrRegion = isState(statesOrRegions) === true ? 'state' : 'region';
    const mountainsSortedByElevation = sortBy(mountains, ['elevation']).reverse();
    descriptionPlaceholderText = getFluentString('peak-list-detail-list-overview-para-1', {
      'list-name': name.length ? name : '[List Name]',
      'number-of-peaks': mountains.length,
      'state-or-region': isStateOrRegion.toString(),
      'state-region-name': statesOrRegions,
      'highest-mountain-name': mountainsSortedByElevation[0].name,
      'highest-mountain-elevation': mountainsSortedByElevation[0].elevation,
      'smallest-mountain-name':
        mountainsSortedByElevation[mountainsSortedByElevation.length - 1].name,
      'smallest-mountain-elevation':
        mountainsSortedByElevation[mountainsSortedByElevation.length - 1].elevation,
    });
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
    <DeleteButton>
      {deleteButtonText}
    </DeleteButton>
  );

  const mountainCoordinates = [...mountains, ...optionalMountains].map(mtn => ({...mtn, completionDates: null }));

  return (
    <Root>
      <FullColumn>
        <Title>{titleText}</Title>
      </FullColumn>
      <FullColumn>
        <LabelContainer htmlFor={'create-peak-list-name'}>
          <Label>
            {getFluentString('create-peak-list-peak-list-name-label')}
          </Label>
        </LabelContainer>
        <InputBase
          id={'create-peak-list-name'}
          type={'text'}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={getFluentString('create-peak-list-peak-list-name-placeholder')}
          autoComplete={'off'}
          maxLength={1000}
        />
      </FullColumn>
      <div>
        <LabelContainer htmlFor={'create-peak-list-short-name'}>
          <Label>
            {getFluentString('create-peak-list-peak-list-short-name-label')}
            {' '}
            <small>({getFluentString('create-peak-list-peak-list-short-name-note')})</small>
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
              'type': PeakListVariants.standard,
            })}
          </option>
          <option value={PeakListVariants.winter}>
            {getFluentString('global-text-value-list-type', {
              'type': PeakListVariants.winter,
            })}
          </option>
          <option value={PeakListVariants.fourSeason}>
            {getFluentString('global-text-value-list-type', {
              'type': PeakListVariants.fourSeason,
            })}
          </option>
          <option value={PeakListVariants.grid}>
            {getFluentString('global-text-value-list-type', {
              'type': PeakListVariants.grid,
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
      <FullColumn>
        <LabelContainer>
          <Label>
            {getFluentString('global-text-value-mountains')}
          </Label>
        </LabelContainer>
        <AddMountains
          targetMountainId={null}
          selectedMountains={mountains}
          setSelectedMountains={setMountains}
          expandedLayout={true}
        />
      </FullColumn>
      <FullColumn>
        <Map
          id={''}
          coordinates={mountainCoordinates}
          userId={null}
          isOtherUser={true}
          colorScaleColors={[]}
          colorScaleLabels={[]}
          key={'create-peak-list-key'}
        />
      </FullColumn>
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
      <FullColumn>
        <CheckboxRoot>
          <CheckboxInput
            type='checkbox'
            value={'verify-changes-are-accurate'}
            id={`verify-changes-are-accurate`}
            checked={verifyChangesIsChecked}
            onChange={() => setVerifyChangesIsChecked(!verifyChangesIsChecked)}
          />
          <CheckboxLabel htmlFor={`verify-changes-are-accurate`}>
            {getFluentString('create-peak-list-check-your-work')}
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
            {saveButtonText}
          </SaveButton>
        </ButtonWrapper>
      </FullColumn>
    </Root>
  );
}

export default withRouter(PeakListForm);
