import { gql, useQuery } from '@apollo/client';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {
  Campsite,
  CompletedCampsite,
  CompletedMountain,
  CompletedTrail,
  Mountain,
  Trail,
  User,
} from '../../../types/graphQLTypes';

const GET_TOTALS = gql`
  query getTotals($userId: ID) {
    totals: user(id: $userId) {
      id
      mountains {
        mountain {
          id
          name
          location
          locationText
          locationTextShort
        }
        dates
      }
      trails {
        trail {
          id
          name
          type
          trailLength
          line
          locationText
          locationTextShort
        }
        dates
      }
      campsites {
        campsite {
          id
          name
          type
          location
          locationText
          locationTextShort
        }
        dates
      }
    }
  }
`;

interface SuccessResponse {
  totals: null | {
    id: User['name'];
    mountains: null | Array<{
      mountain: null | {
        id: Mountain['id'];
        name: Mountain['name'];
        location: Mountain['locationText'];
        locationText: Mountain['locationText'];
        locationTextShort: Mountain['locationTextShort'];
      }
      dates: CompletedMountain['dates'],
    }>;
    trails: null | Array<{
      trail: null | {
        id: Trail['id'];
        name: Trail['name'];
        type: Trail['type'];
        trailLength: Trail['trailLength'];
        line: Trail['line'];
        locationText: Trail['locationText'];
        locationTextShort: Trail['locationTextShort'];
      }
      dates: CompletedTrail['dates'],
    }>;
    campsites: null | Array<{
      campsite: null | {
        id: Campsite['id'];
        name: Campsite['name'];
        type: Campsite['type'];
        location: Campsite['locationText'];
        locationText: Campsite['locationText'];
        locationTextShort: Campsite['locationTextShort'];
      }
      dates: CompletedCampsite['dates'],
    }>;
  };
}

interface Variables {
  userId: string | null;
}

const useTotals = (profileId?: string | null) => {
  const user = useCurrentUser();
  let userId = user && user._id ? user._id : null;
  if (profileId) {
    userId = profileId;
  }
  const response = useQuery<SuccessResponse, Variables>(GET_TOTALS, {
    variables: {
      userId,
    },
  });
  return response;
};

export default useTotals;
