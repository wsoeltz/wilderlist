import { DocumentNode, gql, useMutation} from '@apollo/client';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  TripReport,
  User,
} from '../../types/graphQLTypes';
import {
  refetchGeoNearPeakLists,
  useGeoNearVariables,
} from '../lists/getGeoNearPeakLists';
import {
  refetchUsersPeakLists,
} from '../lists/getUsersPeakLists';
import {
  refetchLatestTripReports,
} from './useLatestTripReports';

const ADD_MOUNTAIN_COMPLETION = gql`
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

const REMOVE_MOUNTAIN_COMPLETION = gql`
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

const ADD_TRAIL_COMPLETION = gql`
  mutation addTrailCompletion(
    $userId: ID!,
    $trailId: ID!,
    $date: String!
    ) {
    addTrailCompletion(
      userId: $userId,
      trailId: $trailId,
      date: $date
    ) {
      id
      trails {
        trail {
          id
        }
        dates
      }
    }
  }
`;

const REMOVE_TRAIL_COMPLETION = gql`
  mutation removeTrailCompletion(
    $userId: ID!,
    $trailId: ID!,
    $date: String!
    ) {
    removeTrailCompletion(
      userId: $userId,
      trailId: $trailId,
      date: $date
    ) {
      id
      trails {
        trail {
          id
        }
        dates
      }
    }
  }
`;

export interface TrailCompletionSuccessResponse {
  id: User['id'];
  trails: User['trails'];
}

export interface TrailCompletionVariables {
  userId: string;
  trailId: string;
  date: string;
}

const ADD_CAMPSITE_COMPLETION = gql`
  mutation addCampsiteCompletion(
    $userId: ID!,
    $campsiteId: ID!,
    $date: String!
    ) {
    addCampsiteCompletion(
      userId: $userId,
      campsiteId: $campsiteId,
      date: $date
    ) {
      id
      trails {
        trail {
          id
        }
        dates
      }
    }
  }
`;

const REMOVE_CAMPSITE_COMPLETION = gql`
  mutation removeCampsiteCompletion(
    $userId: ID!,
    $campsiteId: ID!,
    $date: String!
    ) {
    removeCampsiteCompletion(
      userId: $userId,
      campsiteId: $campsiteId,
      date: $date
    ) {
      id
      trails {
        trail {
          id
        }
        dates
      }
    }
  }
`;

export interface CampsiteCompletionSuccessResponse {
  id: User['id'];
  campsites: User['campsites'];
}

export interface CampsiteCompletionVariables {
  userId: string;
  campsiteId: string;
  date: string;
}

const ADD_ASCENT_NOTIFICATIONS = gql`
  mutation addAscentNotifications(
    $userId: ID!,
    $friendId: ID!,
    $mountainIds: [ID],
    $trailIds: [ID],
    $campsiteIds: [ID],
    $date: String!
    ) {
    addAscentNotifications(
      userId: $userId,
      friendId: $friendId,
      mountainIds: $mountainIds,
      trailIds: $trailIds,
      campsiteIds: $campsiteIds,
      date: $date
    ) {
      id
    }
  }
`;

export interface AscentNotificationsVariables {
  userId: string;
  mountainIds: string[];
  trailIds: string[];
  campsiteIds: string[];
  date: string;
  friendId: string;
}

const addTripReportVariableDeclerations = `
  $date: String!,
  $author: ID!,
  $mountains: [ID],
  $trails: [ID],
  $campsites: [ID],
  $users: [ID],
  $privacy: String,
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
  trails: $trails,
  campsites: $campsites,
  users: $users,
  privacy: $privacy,
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

const ADD_TRIP_REPORT = gql`
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
      trails {
        id
        name
        type
      }
      campsites {
        id
        name
        type
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
  trails: string[];
  campsites: string[];
  users: string[];
  privacy: TripReport['privacy'];
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

const EDIT_TRIP_REPORT = gql`
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
      trails {
        id
        name
        type
      }
      campsites {
        id
        name
        type
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

const ADD_EDIT_TRIP_REPORT = gql`
  mutation addEditTripReport(
    $id: ID,
    $date: String,
    $author: ID!,
    $mountains: [ID],
    $trails: [ID],
    $campsites: [ID],
    $users: [ID],
    $privacy: String,
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
    $originalDate: String,
    $originalMountains: [ID],
    $originalTrails: [ID],
    $originalCampsites: [ID],
    $emails: [String],
  ) {
    tripReport: addEditTripReport(
      id: $id,
      date: $date,
      author: $author,
      mountains: $mountains,
      trails: $trails,
      campsites: $campsites,
      users: $users,
      privacy: $privacy,
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
      originalDate: $originalDate,
      originalMountains: $originalMountains,
      originalTrails: $originalTrails,
      originalCampsites: $originalCampsites,
      emails: $emails,
    ) {
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
      trails {
        id
        name
        type
      }
      campsites {
        id
        name
        type
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

export interface AddEditTripReportVariables {
  id: TripReport['id'] | null;
  date: TripReport['date'] | null;
  author: string;
  mountains: string[];
  trails: string[];
  campsites: string[];
  users: string[];
  privacy: TripReport['privacy'];
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
  // additional inputs not directly in TripReport:
  originalDate: string | null;
  originalMountains: string[]; // includes both original mountains and new mountains
  originalTrails: string[]; // includes both original trails and new trails
  originalCampsites: string[]; // includes both original campsites and new campsites
  emails: string[];
}

const DELETE_TRIP_REPORT = gql`
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
      trails {
        id
        name
        type
      }
      campsites {
        id
        name
        type
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

export const useTripReportMutaions = (mountain: string | null, pageNumber: number) => {
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;
  const geoNearVariables = useGeoNearVariables();
  const refetchArray: Array<{query: DocumentNode, variables: any}> = [refetchGeoNearPeakLists(geoNearVariables)];
  if (mountain && pageNumber) {
    refetchArray.push(refetchLatestTripReports(mountain, pageNumber));
  }
  if (userId) {
    refetchArray.push(refetchUsersPeakLists({userId}));
  }
  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION, {
      refetchQueries: refetchArray,
  });

  const [removeMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(REMOVE_MOUNTAIN_COMPLETION, {
      refetchQueries: refetchArray,
  });

  const [addTrailCompletion] =
    useMutation<TrailCompletionSuccessResponse, TrailCompletionVariables>(ADD_TRAIL_COMPLETION, {
      refetchQueries: refetchArray,
  });

  const [removeTrailCompletion] =
    useMutation<TrailCompletionSuccessResponse, TrailCompletionVariables>(REMOVE_TRAIL_COMPLETION, {
      refetchQueries: refetchArray,
  });

  const [addCampsiteCompletion] =
    useMutation<CampsiteCompletionSuccessResponse, CampsiteCompletionVariables>(ADD_CAMPSITE_COMPLETION, {
      refetchQueries: refetchArray,
  });

  const [removeCampsiteCompletion] =
    useMutation<CampsiteCompletionSuccessResponse, CampsiteCompletionVariables>(REMOVE_CAMPSITE_COMPLETION, {
      refetchQueries: refetchArray,
  });

  const [addTripReport] =
    useMutation<AddTripReportSuccess, AddTripReportVariables>(ADD_TRIP_REPORT, {
      refetchQueries: refetchArray,
  });

  const [editTripReport] =
    useMutation<AddTripReportSuccess, EditTripReportVariables>(EDIT_TRIP_REPORT, {
      refetchQueries: refetchArray,
  });

  const [addEditTripReport] =
    useMutation<AddTripReportSuccess, AddEditTripReportVariables>(ADD_EDIT_TRIP_REPORT, {
      refetchQueries: refetchArray,
  });

  const [deleteTripReport] =
    useMutation<AddTripReportSuccess, DeleteTripReportVariables>(DELETE_TRIP_REPORT, {
      refetchQueries: refetchArray,
  });

  return {
    addMountainCompletion,
    removeMountainCompletion,
    addTrailCompletion,
    removeTrailCompletion,
    addCampsiteCompletion,
    removeCampsiteCompletion,
    addTripReport,
    editTripReport,
    addEditTripReport,
    deleteTripReport,
  };
};

export const useAddAscentNotifications = () => {
  const [addAscentNotifications] =
    useMutation<{id: string}, AscentNotificationsVariables>(ADD_ASCENT_NOTIFICATIONS);
  return addAscentNotifications;
};
