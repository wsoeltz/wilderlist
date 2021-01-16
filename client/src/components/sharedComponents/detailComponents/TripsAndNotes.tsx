import React from 'react';
import styled from 'styled-components/macro';
import LoggedTrips from './loggedTrips';
import UsersNotes from './usersNotes';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const TripsAndNotes = () => {
  return (
    <Root>
      <LoggedTrips
      />
      <UsersNotes
      />
    </Root>
  );
};

export default TripsAndNotes;
