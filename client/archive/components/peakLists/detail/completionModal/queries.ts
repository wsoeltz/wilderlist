import gql from 'graphql-tag';
import {
  TripReport,
  User,
} from '../../../../types/graphQLTypes';

export const GET_FRIENDS = gql`
  query getFriends($userId: ID) {
    user(id: $userId) {
      id
      friends {
        user {
          id
          name
        }
        status
      }
    }
  }
`;

export interface FriendsDatum {
  user: {
    id: User['id'];
    friends: User['friends'];
  };
}

export const ADD_MOUNTAIN_COMPLETION = gql`
  mutation addMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    addMountainCompletion(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export const REMOVE_MOUNTAIN_COMPLETION = gql`
  mutation removeMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    removeMountainCompletion(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export interface MountainCompletionSuccessResponse {
  id: User['id'];
  mountains: User['mountains'];
}

export interface MountainCompletionVariables {
  userId: string;
  mountainId: string;
  date: string;
}

export const ADD_ASCENT_NOTIFICATIONS = gql`
  mutation addAscentNotifications(
    $userId: ID!,
    $friendId: ID!,
    $mountainIds: [ID],
    $date: String!
    ) {
    addAscentNotifications(
      userId: $userId,
      friendId: $friendId,
      mountainIds: $mountainIds,
      date: $date
    ) {
      id
    }
  }
`;

export interface AscentNotificationsVariables {
  userId: string;
  mountainIds: string[];
  date: string;
  friendId: string;
}

const addTripReportVariableDeclerations = `
  $date: String!,
  $author: ID!,
  $mountains: [ID],
  $users: [ID],
  $notes: String,
  $link: String,
  $mudMinor: Boolean,
  $mudMajor: Boolean,
  $waterSlipperyRocks: Boolean,
  $waterOnTrail: Boolean,
  $leavesSlippery: Boolean,
  $iceBlack: Boolean,
  $iceBlue: Boolean,
  $iceCrust: Boolean,
  $snowIceFrozenGranular: Boolean,
  $snowIceMonorailStable: Boolean,
  $snowIceMonorailUnstable: Boolean,
  $snowIcePostholes: Boolean,
  $snowMinor: Boolean,
  $snowPackedPowder: Boolean,
  $snowUnpackedPowder: Boolean,
  $snowDrifts: Boolean,
  $snowSticky: Boolean,
  $snowSlush: Boolean,
  $obstaclesBlowdown: Boolean,
  $obstaclesOther: Boolean,
`;
const addTripReportVariableParameters = `
  date: $date,
  author: $author,
  mountains: $mountains,
  users: $users,
  notes: $notes,
  link: $link,
  mudMinor: $mudMinor,
  mudMajor: $mudMajor,
  waterSlipperyRocks: $waterSlipperyRocks,
  waterOnTrail: $waterOnTrail,
  leavesSlippery: $leavesSlippery,
  iceBlack: $iceBlack,
  iceBlue: $iceBlue,
  iceCrust: $iceCrust,
  snowIceFrozenGranular: $snowIceFrozenGranular,
  snowIceMonorailStable: $snowIceMonorailStable,
  snowIceMonorailUnstable: $snowIceMonorailUnstable,
  snowIcePostholes: $snowIcePostholes,
  snowMinor: $snowMinor,
  snowPackedPowder: $snowPackedPowder,
  snowUnpackedPowder: $snowUnpackedPowder,
  snowDrifts: $snowDrifts,
  snowSticky: $snowSticky,
  snowSlush: $snowSlush,
  obstaclesBlowdown: $obstaclesBlowdown,
  obstaclesOther: $obstaclesOther,
`;

export const ADD_TRIP_REPORT = gql`
  mutation addTripReport( ${addTripReportVariableDeclerations} ) {
    tripReport: addTripReport( ${addTripReportVariableParameters} ) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
      }
      users {
        id
        name
      }
      notes
      link
      mudMinor
      mudMajor
      waterSlipperyRocks
      waterOnTrail
      leavesSlippery
      iceBlack
      iceBlue
      iceCrust
      snowIceFrozenGranular
      snowIceMonorailStable
      snowIceMonorailUnstable
      snowIcePostholes
      snowMinor
      snowPackedPowder
      snowUnpackedPowder
      snowDrifts
      snowSticky
      snowSlush
      obstaclesBlowdown
      obstaclesOther
    }
  }
`;

export interface AddTripReportVariables {
  date: TripReport['date'];
  author: string;
  mountains: string[];
  users: string[];
  notes: TripReport['notes'];
  link: TripReport['link'];
  mudMinor: TripReport['mudMinor'];
  mudMajor: TripReport['mudMajor'];
  waterSlipperyRocks: TripReport['waterSlipperyRocks'];
  waterOnTrail: TripReport['waterOnTrail'];
  leavesSlippery: TripReport['leavesSlippery'];
  iceBlack: TripReport['iceBlack'];
  iceBlue: TripReport['iceBlue'];
  iceCrust: TripReport['iceCrust'];
  snowIceFrozenGranular: TripReport['snowIceFrozenGranular'];
  snowIceMonorailStable: TripReport['snowIceMonorailStable'];
  snowIceMonorailUnstable: TripReport['snowIceMonorailUnstable'];
  snowIcePostholes: TripReport['snowIcePostholes'];
  snowMinor: TripReport['snowMinor'];
  snowPackedPowder: TripReport['snowPackedPowder'];
  snowUnpackedPowder: TripReport['snowUnpackedPowder'];
  snowDrifts: TripReport['snowDrifts'];
  snowSticky: TripReport['snowSticky'];
  snowSlush: TripReport['snowSlush'];
  obstaclesBlowdown: TripReport['obstaclesBlowdown'];
  obstaclesOther: TripReport['obstaclesOther'];
}
export interface AddTripReportSuccess {
  tripReport: TripReport;
}

export const EDIT_TRIP_REPORT = gql`
  mutation editTripReport( $id: ID!, ${addTripReportVariableDeclerations} ) {
    tripReport: editTripReport( id: $id, ${addTripReportVariableParameters} ) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
      }
      users {
        id
        name
      }
      notes
      link
      mudMinor
      mudMajor
      waterSlipperyRocks
      waterOnTrail
      leavesSlippery
      iceBlack
      iceBlue
      iceCrust
      snowIceFrozenGranular
      snowIceMonorailStable
      snowIceMonorailUnstable
      snowIcePostholes
      snowMinor
      snowPackedPowder
      snowUnpackedPowder
      snowDrifts
      snowSticky
      snowSlush
      obstaclesBlowdown
      obstaclesOther
    }
  }
`;

export interface EditTripReportVariables extends AddTripReportVariables {
  id: TripReport['id'];
}

export const DELETE_TRIP_REPORT = gql`
  mutation deleteTripReport($id: ID!) {
    tripReport: deleteTripReport(id: $id) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
      }
      users {
        id
        name
      }
      notes
      link
      mudMinor
      mudMajor
      waterSlipperyRocks
      waterOnTrail
      leavesSlippery
      iceBlack
      iceBlue
      iceCrust
      snowIceFrozenGranular
      snowIceMonorailStable
      snowIceMonorailUnstable
      snowIcePostholes
      snowMinor
      snowPackedPowder
      snowUnpackedPowder
      snowDrifts
      snowSticky
      snowSlush
      obstaclesBlowdown
      obstaclesOther
    }
  }
`;

export interface DeleteTripReportVariables {
  id: TripReport['id'];
}
