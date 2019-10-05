import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import { Mountain, PeakListVariants } from '../../../types/graphQLTypes';
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
  SelectBox,
  SelectedItemsContainer,
  SelectionPanel,
} from '../sharedStyles';

const GET_MOUNTAINS = gql`
  query ListMountains{
    mountains {
      id
      name
    }
  }
`;

interface SuccessResponse {
  mountains: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
  }>;
}

interface CheckboxProps {
  name: string;
  id: string;
  toggleItem: (id: string, name: string, checked: boolean) => void;
  startChecked: boolean;
}

const Checkbox = ({name, id, toggleItem, startChecked}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(startChecked);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    toggleItem(id, name, checkedWillBe);
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
  name: Mountain['name'];
  id: Mountain['id'];
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
  const [selectedMountains, setSelectedMountains] = useState<MountainDatum[]>([]);
  const [type, setType] = useState<PeakListVariants>(PeakListVariants.standard);
  const [parent, setParent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (type !== null) {
      const selectedMountainIds = selectedMountains.map(({id}) => id);
      addPeakList({
        name, shortName, mountains: selectedMountainIds,
        type, parent,
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

  const toggleMountainListItem = (id: string, mountainName: string, checked: boolean) => {
    if (checked === true) {
      setSelectedMountains([...selectedMountains, {id, name: mountainName}]);
    } else if (checked === false) {
      setSelectedMountains(selectedMountains.filter(idInList => idInList.id !== id));
    }
  };

  const sortedSelectedMountains = sortBy(selectedMountains, ['name']);
  const selectedMountainsLi = sortedSelectedMountains.map(mountain => <li key={mountain.id}>{mountain.name}</li>);

  const {loading, error, data} = useQuery<SuccessResponse>(GET_MOUNTAINS);

  let mountains: React.ReactElement | null;
  if (loading === true) {
    mountains = (<p>Loading</p>);
  } else if (error !== undefined) {
    mountains = null;
    console.error(error);
  } else if (data !== undefined) {
    const sortedMountains = sortBy(data.mountains, ['name']);
    const mountainList = sortedMountains.map(mountain => {
      if (mountain.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return (
          <Checkbox
            key={mountain.id}
            id={mountain.id}
            name={mountain.name}
            toggleItem={toggleMountainListItem}
            startChecked={false}
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
    setSearchQuery(value);
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
              {selectedMountainsLi}
            </ol>
          </SelectedItemsContainer>
        </SelectionPanel>
        <CreateButton type='submit' disabled={name === '' || shortName === ''}>Add Peak List</CreateButton>
      </form>
    </EditPanel>
  );

};

export default AddPeakList;
