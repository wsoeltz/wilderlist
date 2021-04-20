import React from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import LoggedTrips, {
  Props as LoggedTripsProps,
} from './loggedTrips';
import UsersNotes from './usersNotes';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;

  @media (max-width: 500px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;

  }
`;

export type Props = LoggedTripsProps;

const TripsAndNotes = (props: Props) => {
  const {id, name, item} = props;
  const user = useCurrentUser();

  const tripLogs = user ? (
    <LoggedTrips
      id={id}
      name={name}
      item={item}
    />
  ) : null;

  return (
    <Root style={user ? undefined : {gridTemplateColumns: 'auto'}}>
      {tripLogs}
      <UsersNotes
        id={id}
        name={name}
        type={item}
        isAlone={user ? undefined : true}
      />
    </Root>
  );
};

export default TripsAndNotes;
