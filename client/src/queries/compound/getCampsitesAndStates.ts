import { gql, useQuery } from '@apollo/client';
import {campsiteQuery, CampsiteSuccessResponse} from '../campsites/addRemoveCampsite';
import {StateDatum} from '../states/useStates';

const GET_MOUNTAIN_AND_STATES = gql`
  query getCampsite($id: ID) {
    campsite(id: $id) {
      ${campsiteQuery}
    }
    states {
      id
      name
      abbreviation
    }
  }
`;

interface QuerySuccessResponse extends CampsiteSuccessResponse {
  states: null | StateDatum[];
}

export const useCampsiteAndAllStates = ({id}: {id: string | null}) =>
  useQuery<QuerySuccessResponse, {id: string | null}>(GET_MOUNTAIN_AND_STATES,
    {variables: { id },
  });
