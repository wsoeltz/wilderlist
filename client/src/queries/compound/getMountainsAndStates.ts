import { gql, useQuery } from '@apollo/client';
import {mountainQuery, MountainSuccessResponse} from '../mountains/addRemoveMountain';
import {StateDatum} from '../states/useStates';

const GET_MOUNTAIN_AND_STATES = gql`
  query getMountain($id: ID) {
    mountain(id: $id) {
      ${mountainQuery}
    }
    states {
      id
      name
      abbreviation
    }
  }
`;

interface QuerySuccessResponse extends MountainSuccessResponse {
  states: null | StateDatum[];
}

export const useMountainAndAllStates = ({id}: {id: string | null}) =>
  useQuery<QuerySuccessResponse, {id: string | null}>(GET_MOUNTAIN_AND_STATES,
    {variables: { id },
  });
