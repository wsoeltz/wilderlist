import React from 'react';
import styled from 'styled-components/macro';
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
  return (
    <Root>
      <LoggedTrips
        id={id}
        name={name}
        item={item}
      />
      <UsersNotes
        id={id}
        name={name}
        type={item}
      />
    </Root>
  );
};

export default TripsAndNotes;
