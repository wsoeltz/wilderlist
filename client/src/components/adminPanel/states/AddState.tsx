import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Region } from '../../../types/graphQLTypes';

const GET_REGIONS = gql`
  query ListRegions{
    regions {
      id
      name
    }
  }
`;

interface SuccessResponse {
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
  }>;
}

interface CheckboxProps {
  name: string;
  id: string;
  toggleItem: (id: string, checked: boolean) => void;
}

const Checkbox = ({name, id, toggleItem}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(false);

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
  addState: (name: string, states: Array<Region['id']>) => void;
  cancel: () => void;
}

const AddState = (props: Props) => {
  const { addState, cancel } = props;

  const [name, setName] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<Array<Region['id']>>([]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    addState(name, selectedStates);
    cancel();
  };

  const toggleStateListItem = (id: string, checked: boolean) => {
    if (checked === true) {
      setSelectedStates([...selectedStates, id]);
    } else if (checked === false) {
      setSelectedStates(selectedStates.filter(idInList => idInList !== id));
    }
  };

  const {loading, error, data} = useQuery<SuccessResponse>(GET_REGIONS);

  let states: React.ReactElement | null;
  if (loading === true) {
    states = (<p>Loading</p>);
  } else if (error !== undefined) {
    states = null;
    console.error(error);
  } else if (data !== undefined) {
    const stateList = data.regions.map(region => {
      return (
        <li key={region.id}>
          <Checkbox
            id={region.id}
            name={region.name}
            toggleItem={toggleStateListItem}
          />
        </li>
      );
    });
    states = <>{stateList}</>;
  } else {
    states = null;
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
        />
        <fieldset>
          <ul>
            {states}
          </ul>
        </fieldset>
        <button type='submit' disabled={name === ''}>Add State</button>
      </form>
    </div>
  );

};

export default AddState;
