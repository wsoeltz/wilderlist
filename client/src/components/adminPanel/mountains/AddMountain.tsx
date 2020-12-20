import { gql, useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { State } from '../../../types/graphQLTypes';
import { UserContext } from '../../App';
import { AddMountainVariables } from '../AdminMountains';
import {
  CreateButton,
  EditPanel,
  NameActive,
  NameInput,
  SelectBox,
} from '../sharedStyles';

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

  const user = useContext(UserContext);

  const [name, setName] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [elevation, setElevation] = useState<number | null>(null);
  const [prominence, setProminence] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<State['id'] | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (name !== '' && latitude !== null && longitude !== null
      && elevation !== null && selectedState !== null && user && user._id) {
      addMountain({
        name,
        latitude,
        longitude,
        elevation,
        prominence,
        state: selectedState,
        author: user._id,
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
          Add Mountain
        </CreateButton>
      </form>
    </EditPanel>
  );
};

export default AddMountain;
