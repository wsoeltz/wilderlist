import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { PeakListVariants, Region } from '../../../types/graphQLTypes';
import { AddPeakListVariables } from '../AdminPeakLists';

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
    id: Region['id'];
    name: Region['name'];
  }>;
}

interface CheckboxProps {
  name: string;
  id: string;
  toggleItem: (id: string, checked: boolean) => void;
  startChecked: boolean;
}

const Checkbox = ({name, id, toggleItem, startChecked}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(startChecked);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    toggleItem(id, checkedWillBe);
  };

  return (
    <>
      <input
        type='checkbox'
        value={id}
        id={`state-checkbox-${id}`}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={`state-checkbox-${id}`}>{name}</label>
    </>
  );

};

interface Props {
  addPeakList: (input: AddPeakListVariables) => void;
  cancel: () => void;
}

const AddPeakList = (props: Props) => {
  const { addPeakList, cancel } = props;

  const [name, setName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [selectedMountains, setSelectedMountains] = useState<Array<Region['id']>>([]);
  const [type, setType] = useState<PeakListVariants | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (type !== null) {
      addPeakList({
        name, shortName, mountains: selectedMountains,
        type,
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

  const toggleMountainListItem = (id: string, checked: boolean) => {
    if (checked === true) {
      setSelectedMountains([...selectedMountains, id]);
    } else if (checked === false) {
      setSelectedMountains(selectedMountains.filter(idInList => idInList !== id));
    }
  };

  const {loading, error, data} = useQuery<SuccessResponse>(GET_MOUNTAINS);

  let mountains: React.ReactElement | null;
  if (loading === true) {
    mountains = (<p>Loading</p>);
  } else if (error !== undefined) {
    mountains = null;
    console.error(error);
  } else if (data !== undefined) {
    const mountainList = data.mountains.map(mountain => {
      return (
        <li key={mountain.id}>
          <Checkbox
            id={mountain.id}
            name={mountain.name}
            toggleItem={toggleMountainListItem}
            startChecked={false}
          />
        </li>
      );
    });
    mountains = <>{mountainList}</>;
  } else {
    mountains = null;
  }
  return (
    <div>
      <button onClick={cancel}>Cancel</button>
      <form
        onSubmit={handleSubmit}
      >
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Name'
        />
        <input
          value={shortName}
          onChange={e => setShortName(e.target.value)}
          placeholder='shortName'
        />

        <select
          value={`${type || ''}`}
          onChange={e => setStringToPeakListVariant(e.target.value)}
        >
          <option value={PeakListVariants.standard}>{PeakListVariants.standard}</option>
          <option value={PeakListVariants.winter}>{PeakListVariants.winter}</option>
          <option value={PeakListVariants.fourSeason}>{PeakListVariants.fourSeason}</option>
          <option value={PeakListVariants.grid}>{PeakListVariants.grid}</option>
        </select>
        <fieldset>
          Mountains
          <ul>
            {mountains}
          </ul>
        </fieldset>
        <button type='submit' disabled={name === '' || shortName === ''}>Add Peak List</button>
      </form>
    </div>
  );

};

export default AddPeakList;
