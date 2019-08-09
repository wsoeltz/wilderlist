import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Mountain, State } from '../../../types/graphQLTypes';
import { EditMountainVariables } from '../AdminMountains';

const GET_MOUNTAIN_AND_ALL_STATES = gql`
  query GetMountainAndAllStates($id: ID!) {
    mountain(id: $id) {
      id
      name
      latitude
      longitude
      elevation
      prominence
      state {
        id
        name
      }
    }

    states {
      id
      name
    }
  }
`;

interface SuccessResponse {
  mountain: Mountain;
  states: Array<{
    id: State['id'];
    name: State['name'];
  }>;
}

interface Variables {
  id: string;
}

interface Props {
  mountainId: string;
  editMountain: (variables: EditMountainVariables) => void;
  cancel: () => void;
}

const EditMountain = (props: Props) => {
  const { mountainId, editMountain, cancel } = props;

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
      editMountain({
        id: mountainId,
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

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_MOUNTAIN_AND_ALL_STATES, {
    variables: { id: mountainId },
  });

  useEffect(() => {
    if (data !== undefined) {
      const { mountain } = data;
      if (mountain) {
        setName(mountain.name);
        setLatitude(mountain.latitude);
        setLongitude(mountain.longitude);
        setElevation(mountain.elevation);
        setProminence(mountain.prominence);
        if (mountain.state) {
          setSelectedState(mountain.state.id);
        }
      }
    }
  }, [data]);

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
          Update Mountain
        </button>
      </form>
    </div>
  );

};

export default EditMountain;
