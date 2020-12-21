import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { Mountain, PermissionTypes, State } from '../../../types/graphQLTypes';
import { EditMountainVariables } from '../AdminMountains';
import {
  CreateButton,
  EditPanel,
  NameActive,
  NameInput,
  SelectBox,
} from '../sharedStyles';

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
      author {
        id
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

  const user = useCurrentUser();

  const [name, setName] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [elevation, setElevation] = useState<number | null>(null);
  const [prominence, setProminence] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<State['id'] | null>(null);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_MOUNTAIN_AND_ALL_STATES, {
    variables: { id: mountainId },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const authorId =
      data && data.mountain && data.mountain.author && data.mountain.author.id
      ? data.mountain.author.id : null;
    if (name !== '' && latitude !== null && longitude !== null
      && elevation !== null && selectedState !== null && (
        user && (authorId === user._id || user.permissions === PermissionTypes.admin)
      )) {
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
      <div>
        <label>Select State</label>
        <SelectBox
          value={`${selectedState || ''}`}
          onChange={e => setSelectedState(e.target.value)}
        >
          <option value='' key='empty-option-to-select'></option>
          {stateList}
        </SelectBox>
      </div>
    );
  } else {
    states = null;
  }

  const prominenceValue = () => {
    if (prominence) {
      return `${prominence}`;
    } else if (prominence === 0) {
      return '0';
    } else {
      return '';
    }
  };

  return (
    <EditPanel onCancel={cancel}>
      <form
        onSubmit={handleSubmit}
      >
      <NameActive>
          <label>Name</label>
          <NameInput
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Name'
          />
          <label>Latitude</label>
          <NameInput
            value={`${latitude || ''}`}
            onChange={e => setLatitude(parseFloat(e.target.value))}
            placeholder='latitude'
            type='number'
          />
          <label>Longitude</label>
          <NameInput
            value={`${longitude || ''}`}
            onChange={e => setLongitude(parseFloat(e.target.value))}
            placeholder='longitude'
            type='number'
          />
          <label>Elevation</label>
          <NameInput
            value={`${elevation || ''}`}
            onChange={e => setElevation(parseFloat(e.target.value))}
            placeholder='elevation'
            type='number'
          />
          <label>Prominence</label>
          <NameInput
            value={prominenceValue()}
            onChange={e => setProminence(parseFloat(e.target.value))}
            placeholder='prominence'
            type='number'
          />
        </NameActive>
        {states}
        <CreateButton type='submit' disabled={
          name === '' || longitude === null || isNaN(longitude) ||
          latitude === null || isNaN(latitude) || elevation === null ||
          isNaN(elevation) || selectedState === null || selectedState === ''}
        >
          Update Mountain
        </CreateButton>
      </form>
    </EditPanel>
  );

};

export default EditMountain;
