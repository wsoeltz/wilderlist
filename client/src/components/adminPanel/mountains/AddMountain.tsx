import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { State } from '../../../types/graphQLTypes';
import { AddMountainVariables } from '../AdminMountains';

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

interface Props {
  addMountain: (variables: AddMountainVariables) => void;
  cancel: () => void;
}

const AddMountain = (props: Props) => {
  const { addMountain, cancel } = props;

  const [name, setName] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [elevation, setElevation] = useState<number | null>(null);
  const [prominence, setProminence] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<State['id'] | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (name !== '' && latitude !== null && longitude !== null
      && elevation !== null && prominence !== null && selectedState !== null) {
      addMountain({
        name,
        latitude,
        longitude,
        elevation,
        prominence,
        state: selectedState,
      });
    }
    cancel();
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
        <option key={state.id} value={state.id}>
          {state.name}
        </option>
      );
    });
    states = (
      <select
        value={`${selectedState || ''}`}
        onChange={e => setSelectedState(e.target.value)}
      >
        <option value='' key='empty-option-to-select'></option>
        {stateList}
      </select>
    );
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
          placeholder='Name'
        />
        <input
          value={`${longitude || ''}`}
          onChange={e => setLongitude(parseFloat(e.target.value))}
          placeholder='longitude'
          type='number'
        />
        <input
          value={`${latitude || ''}`}
          onChange={e => setLatitude(parseFloat(e.target.value))}
          placeholder='latitude'
          type='number'
        />
        <input
          value={`${elevation || ''}`}
          onChange={e => setElevation(parseFloat(e.target.value))}
          placeholder='elevation'
          type='number'
        />
        <input
          value={`${prominence || ''}`}
          onChange={e => setProminence(parseFloat(e.target.value))}
          placeholder='prominence'
          type='number'
        />
        <fieldset>
          <ul>
            {states}
          </ul>
        </fieldset>
        <button type='submit' disabled={
          name === '' || longitude === null || isNaN(longitude) ||
          latitude === null || isNaN(latitude) || elevation === null ||
          isNaN(elevation) || prominence === null || isNaN(prominence) ||
          selectedState === null || selectedState === ''}
        >
          Add Mountain
        </button>
      </form>
    </div>
  );

};

export default AddMountain;
