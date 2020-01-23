import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import {
  Mountain,
  PeakListVariants,
  State,
  ExternalResource,
} from '../../../types/graphQLTypes';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {
  AddPeakListVariables,
  SuccessResponse as PeakListDatum,
} from '../AdminPeakLists';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  CheckboxRoot,
  CreateButton,
  EditPanel,
  NameActive,
  NameInput,
  NavButtonLink,
  SelectBox,
  SelectedItemsContainer,
  SelectionPanel,
  SubNav,
  TextareaActive,
  ResourceContainer,
} from '../sharedStyles';
import { MountainReqLevel } from './EditPeakList';
import { ButtonPrimary, GhostButton } from '../../../styling/styleUtils';

const GET_MOUNTAINS_AND_STATES = gql`
  query ListMountainsAndStates{
    mountains {
      id
      name
      state {
        id
        name
      }
    }
  }
`;

interface SuccessResponse {
  mountains: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    state: {
      id: State['id'];
      name: State['name'];
    }
  }>;
}

interface CheckboxProps {
  mountain: MountainDatum;
  toggleItem: (mountain: MountainDatum, checked: boolean) => void;
  startChecked: boolean;
}

const Checkbox = ({mountain, toggleItem, startChecked}: CheckboxProps) => {
  const {
    id, name,
  } = mountain;
  const [checked, setChecked] = useState<boolean>(startChecked);
  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    toggleItem(mountain, checkedWillBe);
  };

  return (
    <CheckboxRoot>
      <CheckboxInput
        type='checkbox'
        value={id}
        id={`state-checkbox-${id}`}
        checked={checked}
        onChange={onChange}
      />
      <CheckboxLabel htmlFor={`state-checkbox-${id}`}>{name}</CheckboxLabel>
    </CheckboxRoot>
  );
};

interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: StateDatum | null;
}
interface StateDatum {
  id: State['id'];
  name: State['name'];
}

interface Props {
  listDatum: PeakListDatum | undefined;
  addPeakList: (input: AddPeakListVariables) => void;
  cancel: () => void;
}

const AddPeakList = (props: Props) => {
  const { listDatum, addPeakList, cancel } = props;

  const [name, setName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [optionalPeaksDescription, setOptionalPeaksDescription] = useState<string>('');
  const [mountainReqLevel, setMountainReqLevel] = useState<MountainReqLevel>(MountainReqLevel.required);
  const [selectedMountains, setSelectedMountains] = useState<MountainDatum[]>([]);
  const [selectedOptionalMountains, setSelectedOptionalMountains] = useState<MountainDatum[]>([]);
  const [selectedStates, setSelectedStates] = useState<StateDatum[]>([]);
  const [type, setType] = useState<PeakListVariants>(PeakListVariants.standard);
  const [parent, setParent] = useState<string | null>(null);
  const [mountainSearchQuery, setMountainSearchQuery] = useState<string>('');
  const [externalResources, setExternalResources] = useState<ExternalResource[]>([{title: '', url: ''}]);

  const handExternalResourceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    (field: keyof ExternalResource, index: number) =>
      setExternalResources(
        externalResources.map((resource, _index) => {
          if (resource[field] === e.target.value || index !== _index) {
            return resource;
          } else {
            return {...resource, [field]: e.target.value};
          }
        }
      )
    );

  const deleteResource = (e: React.MouseEvent<HTMLButtonElement>) => (index: number) => {
    e.preventDefault();
    setExternalResources(externalResources.filter((_v, i) => i !== index));
  }

  const resourceInputs = externalResources.map((resource, i) => (
    <ResourceContainer key={i}>
      <NameInput
        value={resource.title}
        onChange={e => handExternalResourceChange(e)('title', i)}
        placeholder={'title'}
      />
      <NameInput
        value={resource.url}
        onChange={e => handExternalResourceChange(e)('url', i)}
        placeholder={'url'}
      />
      <GhostButton onClick={e => deleteResource(e)(i)}>
        Delete
      </GhostButton>
    </ResourceContainer>
  ));

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (type !== null) {
      const selectedMountainIds = selectedMountains.map(({id}) => id);
      const selectedStateIds = selectedStates.map(({id}) => id);
      const selectedOptionalMountainIds = selectedOptionalMountains.map(({id}) => id);
      addPeakList({
        name, shortName, mountains: selectedMountainIds,
        type, parent, states: selectedStateIds,
        optionalMountains: selectedOptionalMountainIds,
        description, optionalPeaksDescription, resources: externalResources,
      });
    }
    cancel();
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

  const currentMountainList = mountainReqLevel === MountainReqLevel.required
    ? selectedMountains : selectedOptionalMountains;
  const otherMountainList = mountainReqLevel === MountainReqLevel.optional
    ? selectedMountains : selectedOptionalMountains;
  const toggleCurrentMountainList = mountainReqLevel === MountainReqLevel.required
    ? setSelectedMountains : setSelectedOptionalMountains;

  const sortedSelectedMountains = sortBy(currentMountainList, ['name']);
  const selectedMountainsLi = sortedSelectedMountains.map(mountain => <li key={mountain.id}>{mountain.name}</li>);

  const sortedSelectedStates = sortBy(selectedStates, ['name']);
  const selectedStatesLi = sortedSelectedStates.map(state => <li key={state.id}>{state.name}</li>);

  const {loading, error, data} = useQuery<SuccessResponse>(GET_MOUNTAINS_AND_STATES);

  let mountains: React.ReactElement | null;
  if (loading === true) {
    mountains = (<p>Loading</p>);
  } else if (error !== undefined) {
    mountains = null;
    console.error(error);
  } else if (data !== undefined) {

  const toggleMountainListItem = (mountain: MountainDatum, checked: boolean) => {
    const {
      id, name: mountainName, state,
    } = mountain;
    if (checked === true) {
      toggleCurrentMountainList([...currentMountainList, {id, name: mountainName, state}]);
      if (state && state.id) {
        if (selectedStates.find(st => st.id === state.id) === undefined) {
          setSelectedStates([...selectedStates, {
            id: state.id,
            name: state.name,
          }]);
        }
      }
    } else if (checked === false) {
      const newSelectedMountains = currentMountainList.filter(mtn => mtn.id !== id);
      toggleCurrentMountainList([...newSelectedMountains]);
      const stateExists = [...newSelectedMountains, ...otherMountainList].find(mtn => {
        if (mtn && mtn.state && mtn.state.id && state && state.id) {
          return mtn.state.id === state.id;
        } else {
          return false;
        }
      });
      if (stateExists === undefined) {
        setSelectedStates(selectedStates.filter(st => {
            if (state && state.id) {
              return st.id !== state.id;
            } else {
              return false;
            }
          }),
        );
      }
    }
  };

  const sortedMountains = sortBy(data.mountains, ['name']);
  const mountainList = sortedMountains.map(mountain => {
      if (mountain.name.toLowerCase().includes(mountainSearchQuery.toLowerCase())) {
        return (
          <Checkbox
            key={mountain.id + mountainReqLevel}
            mountain={mountain}
            toggleItem={toggleMountainListItem}
            startChecked={
              (currentMountainList.filter(peakListMountain => peakListMountain.id === mountain.id).length > 0)
            }
          />
        );
      } else {
        return null;
      }
    });
  mountains = <>{mountainList}</>;
  } else {
    mountains = null;
  }
  const parentOptions = listDatum !== undefined ? listDatum.peakLists.map(peakList => (
      <option value={peakList.id} key={peakList.id}>{peakList.name}</option>
    ),
  ) : null;
  const setParentFromString = (value: string) => {
    if (value === '') {
      setParent(null);
    } else {
      setParent(value);
    }
  };

  const filterMountains = (value: string) => {
    setMountainSearchQuery(value);
  };

  return (
    <EditPanel onCancel={cancel}>
      <form
        onSubmit={handleSubmit}
      >
        <NameActive>
          <NameInput
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Name'
          />
          <NameInput
            value={shortName}
            onChange={e => setShortName(e.target.value)}
            placeholder='shortName'
          />
          <TextareaActive
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='description'
          />
          <TextareaActive
            value={optionalPeaksDescription}
            onChange={e => setOptionalPeaksDescription(e.target.value)}
            placeholder='optionalPeaksDescription'
          />
          {resourceInputs}
          <ButtonPrimary onClick={e => {
            e.preventDefault();
            setExternalResources([...externalResources, {title: '', url: ''}])
          }}>
            Add Another resource
          </ButtonPrimary>
        </NameActive>
        <div>
          <label>Set list type</label>
          <SelectBox
            value={`${type || ''}`}
            onChange={e => setStringToPeakListVariant(e.target.value)}
          >
            <option value={PeakListVariants.standard}>{PeakListVariants.standard}</option>
            <option value={PeakListVariants.winter}>{PeakListVariants.winter}</option>
            <option value={PeakListVariants.fourSeason}>{PeakListVariants.fourSeason}</option>
            <option value={PeakListVariants.grid}>{PeakListVariants.grid}</option>
          </SelectBox>
        </div>
        <div>
          <label>Set list parent (optional)</label>
          <SelectBox
            value={`${parent || ''}`}
            onChange={e => setParentFromString(e.target.value)}
          >
            <option value=''>Parent (none)</option>
            {parentOptions}
          </SelectBox>
        </div>
        <SubNav>
          <NavButtonLink
            onClick={e => {
              e.preventDefault();
              setMountainReqLevel(MountainReqLevel.required);
            }}
            style={{
              fontWeight: mountainReqLevel === MountainReqLevel.required ? 600 : 400,
            }}
          >
            Required Peaks
          </NavButtonLink>
          <NavButtonLink
            onClick={e => {
              e.preventDefault();
              setMountainReqLevel(MountainReqLevel.optional);
            }}
            style={{
              fontWeight: mountainReqLevel === MountainReqLevel.optional ? 600 : 400,
            }}
          >
            Optional Peaks
          </NavButtonLink>
        </SubNav>
        <SelectionPanel>
          <CheckboxContainer>
            <StandardSearch
              placeholder={'Filter mountains'}
              setSearchQuery={filterMountains}
              focusOnMount={false}
              initialQuery={mountainSearchQuery}
            />
            {mountains}
          </CheckboxContainer>
          <SelectedItemsContainer>
            <strong>Selected Mountains</strong>
            <ol>
              {selectedMountainsLi}
            </ol>
          </SelectedItemsContainer>
        </SelectionPanel>
        <SelectionPanel>
          <SelectedItemsContainer>
            <strong>Selected States</strong>
            <ol>
              {selectedStatesLi}
            </ol>
          </SelectedItemsContainer>
        </SelectionPanel>
        <CreateButton type='submit' disabled={name === '' || shortName === ''}>Add Peak List</CreateButton>
      </form>
    </EditPanel>
  );

};

export default AddPeakList;
