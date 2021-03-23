import { gql, useQuery } from '@apollo/client';
import { FriendStatus, User } from '../../types/graphQLTypes';
import { CardPeakListDatum } from '../lists/getUsersPeakLists';

const GET_USER = gql`
  query getUser($userId: ID!, $profileId: ID!) {
    user(id: $profileId) {
      id
      name
      email
      redditId
      profilePictureUrl
      hideEmail
      hideProfilePicture
      peakLists {
        id
        name
        shortName
        type
        locationText
        parent {
          id
        }
        bbox
        numMountains
        numTrails
        numCampsites
        privacy
        numCompletedTrips(userId: $profileId)
        numCompletedAscents(userId: $profileId)
        numCompletedTrails(userId: $profileId)
        numCompletedCampsites(userId: $profileId)
        latestTrip(userId: $profileId)
        isActive(userId: $profileId)
      }
    }
    me: user(id: $userId) {
      id
      friends {
        user {
          id
        }
        status
      }
    }
  }
`;

export interface UserDatum {
  id: User['name'];
  name: User['name'];
  email: User['email'];
  redditId: User['redditId'];
  hideEmail: User['hideEmail'];
  hideProfilePicture: User['hideProfilePicture'];
  profilePictureUrl: User['profilePictureUrl'];
  peakLists: CardPeakListDatum[];
}

interface QuerySuccessResponse {
  user: UserDatum;
  me: {
    id: string;
    friends: Array<{
      user: {
        id: User['id'];
      }
      status: FriendStatus;
    }>,
  };
}

interface QueryVariables {
  userId: string;
  profileId: string;
}

export const useUserProfile = (profileId: string, userId: string) =>
  useQuery<QuerySuccessResponse, QueryVariables>(GET_USER, {
    variables: { profileId, userId },
  });
