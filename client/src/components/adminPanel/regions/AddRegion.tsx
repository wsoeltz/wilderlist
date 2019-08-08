import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { State } from '../../../types/graphQLTypes';

const GET_STATES = gql`
  query ListStates{
    states {
      id
      name
    }
  }
`;

interface SuccessResponse {
  states: Array<{
    id: State['id'];
    name: State['name'];
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
  addRegion: (name: string, states: Array<State['id']>) => void;
  cancel: () => void;
}

const AddRegion = (props: Props) => {
  const { addRegion, cancel } = props;

  const [name, setName] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<Array<State['id']>>([]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    addRegion(name, selectedStates);
    cancel();
  };

  const toggleStateListItem = (id: string, checked: boolean) => {
    if (checked === true) {
      setSelectedStates([...selectedStates, id]);
    } else if (checked === false) {
      setSelectedStates(selectedStates.filter(idInList => idInList !== id));
    }
  };

  const {loading, error, data} = useQuery<SuccessResponse>(GET_STATES);

  let states: React.ReactElement | null;
  if (loading === true) {
    states = (<p>Loading</p>);
  } else if (error !== undefined) {
    states = null;
    console.error(error);
  } else if (data !== undefined) {
    const stateList = data.states.map(state => {
      return (
        <li key={state.id}>
          <Checkbox
            id={state.id}
            name={state.name}
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
        <button type='submit' disabled={name === ''}>Add Region</button>
      </form>
    </div>
  );

};

export default AddRegion;
