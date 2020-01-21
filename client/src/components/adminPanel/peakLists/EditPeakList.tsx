import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import {
  ButtonSecondary,
} from '../../../styling/styleUtils';
import { Mountain, PeakList, PeakListVariants, State } from '../../../types/graphQLTypes';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {
  SuccessResponse as PeakListDatum,
} from '../AdminPeakLists';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  CheckboxRoot,
  EditNameForm,
  EditPanel,
  NameActive,
  NameInactive,
  NameInput,
  NameText,
  NavButtonLink,
  SelectBox,
  SelectedItemsContainer,
  SelectionPanel,
  SubNav,
  UpdateButton,
} from '../sharedStyles';

const GET_PEAK_LIST_AND_ALL_MOUNTAINS = gql`
  query GetPeakListAndAllMountains($id: ID!) {
    peakList(id: $id) {
      id
      name
      shortName
      type
      states {
        id
        name
      }
      mountains {
        id
        name
        state {
          id
          name
        }
      }
      optionalMountains {
        id
        name
        state {
          id
          name
        }
      }
      parent {
        id
        name
        type
        states {
          id
          name
        }
      }
    }
    mountains {
      id
      name
      elevation
      state {
        id
        name
        abbreviation
      }
    }
  }
`;

const REMOVE_MOUNTAIN_FROM_PEAK_LIST = gql`
  mutation($listId: ID!, $itemId: ID!) {
    removeItemFromPeakList(listId: $listId, itemId: $itemId) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
    }
  }
`;

const ADD_MOUNTAIN_TO_PEAK_LIST = gql`
  mutation($listId: ID!, $itemId: ID!) {
    addItemToPeakList(listId: $listId, itemId: $itemId) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
    }
  }
`;
const REMOVE_OPTIONAL_MOUNTAIN_FROM_PEAK_LIST = gql`
  mutation($listId: ID!, $itemId: ID!) {
    removeOptionalMountainFromPeakList(listId: $listId, itemId: $itemId) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
    }
  }
`;

const ADD_OPTIONAL_MOUNTAIN_TO_PEAK_LIST = gql`
  mutation($listId: ID!, $itemId: ID!) {
    addOptionalMountainToPeakList(listId: $listId, itemId: $itemId) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
    }
  }
`;

const CHANGE_PEAK_LIST_NAME = gql`
  mutation($id: ID!, $newName: String!) {
    changePeakListName(id: $id, newName: $newName) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
    }
  }
`;

const CHANGE_PEAK_LIST_SHORT_NAME = gql`
  mutation($id: ID!, $newShortName: String!) {
    changePeakListShortName(id: $id, newShortName: $newShortName) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
    }
  }
`;

const CHANGE_PEAK_LIST_VARIANT = gql`
  mutation($id: ID!, $type: PeakListVariants!) {
    adjustPeakListVariant(id: $id, type: $type) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
      parent {
        id
      }
    }
  }
`;

const CHANGE_PEAK_LIST_PARENT = gql`
  mutation($id: ID!, $parent: ID) {
    changePeakListParent(id: $id, parent: $parent) {
      id
      name
      shortName
      type
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
      parent {
        id
      }
    }
  }
`;

const REMOVE_STATE_FROM_PEAK_LIST = gql`
  mutation($listId: ID!, $stateId: ID!) {
    removeStateFromPeakList(listId: $listId, stateId: $stateId) {
      id
      name
      shortName
      type
      states {
        id
        name
      }
    }
  }
`;

const ADD_STATE_TO_PEAK_LIST = gql`
  mutation($listId: ID!, $stateId: ID!) {
    addStateToPeakList(listId: $listId, stateId: $stateId) {
      id
      name
      shortName
      type
      states {
        id
        name
      }
    }
  }
`;

interface StateDatum {
  id: State['id'];
  name: State['name'];
}

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    name: PeakList['name'];
    shortName: PeakList['shortName'];
    type: PeakList['type'];
    mountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
      state: StateDatum;
    }>
    optionalMountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
      state: StateDatum;
    }>
    states: StateDatum[];
    parent: PeakList['parent'] | null;
  };
  mountains: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    state: {
      id: State['id'];
      name: State['name'];
      abbreviation: State['abbreviation'];
    }
  }>;
}

interface QueryVariables {
  id: string;
}

interface AdjustMountainVariables {
  listId: string;
  itemId: string;
}

interface AdjustStateVariables {
  listId: string;
  stateId: string;
}

interface ChangeNameVariables {
  id: string;
  newName: string;
}

interface ChangeShortNameVariables {
  id: string;
  newShortName: string;
}

interface ChangeVariantVariables {
  id: string;
  type: PeakListVariants;
}

interface ChangeParentVariables {
  id: string;
  parent: string | null;
}

interface CheckboxProps {
  name: string;
  id: string;
  defaultChecked: boolean;
  removeItemFromPeakList: (itemId: string) => void;
  addItemToPeakList: (itemId: string) => void;
}

const Checkbox = (props: CheckboxProps) => {
  const {
    name, id, defaultChecked,
    removeItemFromPeakList, addItemToPeakList,
  } = props;
  const [checked, setChecked] = useState<boolean>(defaultChecked);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    if (checkedWillBe === true) {
      addItemToPeakList(id);
    } else if (checkedWillBe === false) {
      removeItemFromPeakList(id);
    }
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

enum MountainReqLevel {
  required = 'required',
  optional = 'optional',
}

interface Props {
  listDatum: PeakListDatum | undefined;
  peakListId: string;
  cancel: () => void;
}

const EditPeakList = (props: Props) => {
  const { listDatum, peakListId, cancel } = props;
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingShortName, setEditingShortName] = useState<boolean>(false);
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [inputShortNameValue, setInputShortNameValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mountainReqLevel, setMountainReqLevel] = useState<MountainReqLevel>(MountainReqLevel.required);

  const {loading, error, data} = useQuery<SuccessResponse, QueryVariables>(GET_PEAK_LIST_AND_ALL_MOUNTAINS, {
    variables: { id: peakListId },
  });
  const [removeItemFromPeakList] = useMutation<SuccessResponse, AdjustMountainVariables>
    (REMOVE_MOUNTAIN_FROM_PEAK_LIST, {
      refetchQueries: () => [{query: GET_PEAK_LIST_AND_ALL_MOUNTAINS, variables: { id: peakListId }}],
    });
  const [addItemToPeakList] = useMutation<SuccessResponse, AdjustMountainVariables>(ADD_MOUNTAIN_TO_PEAK_LIST, {
    refetchQueries: () => [{query: GET_PEAK_LIST_AND_ALL_MOUNTAINS, variables: { id: peakListId }}],
  });
  const [removeOptionalMountainFromPeakList] =
    useMutation<SuccessResponse, AdjustMountainVariables>(
      REMOVE_OPTIONAL_MOUNTAIN_FROM_PEAK_LIST, {
      refetchQueries: () => [{query: GET_PEAK_LIST_AND_ALL_MOUNTAINS, variables: { id: peakListId }}],
    });
  const [addOptionalMountainToPeakList] =
    useMutation<SuccessResponse, AdjustMountainVariables>(ADD_OPTIONAL_MOUNTAIN_TO_PEAK_LIST, {
    refetchQueries: () => [{query: GET_PEAK_LIST_AND_ALL_MOUNTAINS, variables: { id: peakListId }}],
  });
  const [removeStateFromPeakList] = useMutation<SuccessResponse, AdjustStateVariables>
    (REMOVE_STATE_FROM_PEAK_LIST, {
      refetchQueries: () => [{query: GET_PEAK_LIST_AND_ALL_MOUNTAINS, variables: { id: peakListId }}],
    });
  const [addStateToPeakList] = useMutation<SuccessResponse, AdjustStateVariables>(ADD_STATE_TO_PEAK_LIST, {
    refetchQueries: () => [{query: GET_PEAK_LIST_AND_ALL_MOUNTAINS, variables: { id: peakListId }}],
  });
  const [changePeakListName] = useMutation<SuccessResponse, ChangeNameVariables>(CHANGE_PEAK_LIST_NAME);
  const [changePeakListShortName] = useMutation<SuccessResponse, ChangeShortNameVariables>(CHANGE_PEAK_LIST_SHORT_NAME);
  const [adjustPeakListVariant] = useMutation<SuccessResponse, ChangeVariantVariables>(CHANGE_PEAK_LIST_VARIANT);
  const [changePeakListParent] = useMutation<SuccessResponse, ChangeParentVariables>(CHANGE_PEAK_LIST_PARENT);

  let name: React.ReactElement | null;
  let shortName: React.ReactElement | null;
  let mountains: React.ReactElement | null;
  let type: React.ReactElement | null;
  let parent: React.ReactElement | null;
  let selectedMountains: React.ReactElement[] | null;
  let selectedStatesLi: React.ReactElement[] | null;
  if (loading === true) {
    name = null;
    shortName = null;
    selectedMountains = null;
    selectedStatesLi = null;
    mountains = (<p>Loading</p>);
    type = null;
    parent = null;
  } else if (error !== undefined) {
    name = null;
    shortName = null;
    selectedMountains = null;
    selectedStatesLi = null;
    mountains = null;
    type = null;
    parent = null;
    console.error(error);
  } else if (data !== undefined) {
    const {
      peakList,
    } = data;
    if (editingName === false) {
      const setEditNameToTrue = () => {
        setEditingName(true);
        setInputNameValue(data.peakList.name);
      };
      name = (
        <NameInactive>
          <NameText value={data.peakList.name} readOnly={true}/>
          <ButtonSecondary onClick={setEditNameToTrue}>Edit Name</ButtonSecondary>
        </NameInactive>
      );
    } else if (editingName === true) {
      const handleNameSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changePeakListName({variables: { id: peakListId, newName: inputNameValue}});
        setEditingName(false);
      };
      name = (
        <NameActive>
          <EditNameForm onSubmit={handleNameSubmit}>
            <NameInput value={inputNameValue} onChange={(e) => setInputNameValue(e.target.value)} />
            <UpdateButton type='submit' disabled={inputNameValue === ''}>Update</UpdateButton>
          </EditNameForm>
          <ButtonSecondary onClick={() => setEditingName(false)}>Cancel</ButtonSecondary>
        </NameActive>
      );
    } else {
      name = null;
    }
    selectedMountains = null;
    selectedStatesLi = null;
    if (editingShortName === false) {
      const setEditShortNameToTrue = () => {
        setEditingShortName(true);
        setInputShortNameValue(data.peakList.shortName);
      };
      shortName = (
        <NameInactive>
          <NameText value={data.peakList.shortName} readOnly={true}/>
          <ButtonSecondary onClick={setEditShortNameToTrue}>Edit ShortName</ButtonSecondary>
        </NameInactive>
      );
    } else if (editingShortName === true) {
      const handleShortNameSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changePeakListShortName({variables: { id: peakListId, newShortName: inputShortNameValue}});
        setEditingShortName(false);
      };
      shortName = (
        <NameActive>
          <EditNameForm onSubmit={handleShortNameSubmit}>
            <NameInput value={inputShortNameValue} onChange={(e) => setInputShortNameValue(e.target.value)} />
            <UpdateButton type='submit' disabled={inputShortNameValue === ''}>Update</UpdateButton>
          </EditNameForm>
          <ButtonSecondary onClick={() => setEditingShortName(false)}>Cancel</ButtonSecondary>
        </NameActive>
      );
    } else {
      shortName = null;
    }

    const sortedSelectedStates = peakList.states ? sortBy(peakList.states, ['name']) : [];
    selectedStatesLi = sortedSelectedStates.map(state => <li key={state.id}>{state.name}</li>);

    const currentMountainList = mountainReqLevel === MountainReqLevel.required
      ? data.peakList.mountains : data.peakList.optionalMountains;

    const sortedMountains = sortBy(data.mountains, ['name']);
    const mountainList = sortedMountains.map(mountain => {
      if (mountain.name.toLowerCase().includes(searchQuery.toLowerCase())) {

        const addItemAndState = (itemId: string) => {
          const { state } = mountain;
          const addItem = mountainReqLevel === MountainReqLevel.optional
            ? addOptionalMountainToPeakList : addItemToPeakList;
          addItem({ variables: {listId: peakListId, itemId}});
          if (state && state.id) {
            if (peakList.states && peakList.states.find(st => st.id === state.id) === undefined) {
              addStateToPeakList({ variables: {listId: peakListId, stateId: state.id}});
            }
          }
        };
        const removeItemAndState = (itemId: string) => {
          const { state } = mountain;
          const removeItem = mountainReqLevel === MountainReqLevel.optional
            ? removeOptionalMountainFromPeakList : removeItemFromPeakList;
          removeItem({ variables: {listId: peakListId, itemId}});
          const newSelectedMountains = peakList.mountains.filter(mtn => mtn.id !== itemId);
          const stateExists = newSelectedMountains.find(mtn => {
            if (mtn && mtn.state && mtn.state.id && state && state.id) {
              return mtn.state.id === state.id;
            } else {
              return false;
            }
          });
          if (stateExists === undefined) {
            removeStateFromPeakList({ variables: {listId: peakListId, stateId: state.id}});
          }
        };

        return (
          <Checkbox
            key={mountain.id + mountainReqLevel}
            id={mountain.id}
            name={mountain.name + ' ' + mountain.state.abbreviation + ' ' + mountain.elevation}
            defaultChecked={
              (currentMountainList.filter(peakListMountain => peakListMountain.id === mountain.id).length > 0)
            }
            removeItemFromPeakList={removeItemAndState}
            addItemToPeakList={addItemAndState}
          />
        );
      } else {
        return null;
      }
    });
    mountains = <>{mountainList}</>;
    const sortedSelectedMountains = sortBy(currentMountainList, ['name']);
    selectedMountains = sortedSelectedMountains.map(
      mountain => <li key={'selected-' + mountain.id}>{mountain.name}</li>);
    const updateType = (value: string) => {
      let newType: PeakListVariants;
      if (value === 'standard') {
        newType = PeakListVariants.standard;
      } else if (value === 'winter') {
        newType = PeakListVariants.winter;
      } else if (value === 'fourSeason') {
        newType = PeakListVariants.fourSeason;
      } else if (value === 'grid') {
        newType = PeakListVariants.grid;
      } else {
        return;
      }
      adjustPeakListVariant({variables: {id: peakList.id, type: newType}});
    };
    type = (
      <div>
        <label>Set list type</label>
        <SelectBox
          value={`${peakList.type || ''}`}
          onChange={e => updateType(e.target.value)}
        >
          <option value={PeakListVariants.standard}>{PeakListVariants.standard}</option>
          <option value={PeakListVariants.winter}>{PeakListVariants.winter}</option>
          <option value={PeakListVariants.fourSeason}>{PeakListVariants.fourSeason}</option>
          <option value={PeakListVariants.grid}>{PeakListVariants.grid}</option>
        </SelectBox>
      </div>
    );
    const initialParent = peakList.parent === null ? '' : peakList.parent.id;
    const setPeakListParent = (value: string) => {
      if (value === '') {
        changePeakListParent({ variables: {id: peakListId, parent: null} });
      } else {
        changePeakListParent({ variables: {id: peakListId, parent: value} });
      }
    };
    const parentOptions = listDatum !== undefined ? listDatum.peakLists.map(list => (
        <option value={list.id} key={list.id}>{list.name} - {list.type}</option>
      ),
    ) : null;
    parent = (
      <div>
        <label>Set list parent (optional)</label>
        <SelectBox
          value={`${initialParent}`}
          onChange={e => setPeakListParent(e.target.value)}
        >
          <option value=''>Parent (none)</option>
          {parentOptions}
        </SelectBox>
      </div>
    );
  } else {
    name = null;
    shortName = null;
    selectedMountains = null;
    selectedStatesLi = null;
    mountains = null;
    type = null;
    parent = null;
  }

  const filterMountains = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <EditPanel onCancel={cancel}>
        {name}
        {shortName}
        {type}
        {parent}
        <SubNav>
          <NavButtonLink
            onClick={() => setMountainReqLevel(MountainReqLevel.required)}
            style={{
              fontWeight: mountainReqLevel === MountainReqLevel.required ? 600 : 400,
            }}
          >
            Required Peaks
          </NavButtonLink>
          <NavButtonLink
            onClick={() => setMountainReqLevel(MountainReqLevel.optional)}
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
              initialQuery={searchQuery}
            />
            {mountains}
          </CheckboxContainer>
          <SelectedItemsContainer>
            <strong>Selected Mountains</strong>
            <ol>
              {selectedMountains}
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
    </EditPanel>
  );

};

export default EditPeakList;
