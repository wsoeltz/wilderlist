import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { PlaceholderText } from '../../../styling/styleUtils';
import { Mountain, PeakList, User } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Header from '../detail/Header';
import {
  MountainDatum,
  PeakListDatum,
  StateDatum,
} from '../detail/PeakListDetail';
import ComparisonTable from './ComparisonTable';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID!, $friendId: ID!) {
    peakList(id: $id) {
      id
      name
      shortName
      type
      parent {
        id
      }
      states {
        id
        name
        regions {
          id
          name
          states {
            id
          }
        }
      }
      mountains {
        id
        name
        latitude
        longitude
        elevation
      }
    }
    user(id: $friendId) {
      id
      name
      peakLists {
        id
        type
        mountains {
          id
        }
      }
      mountains {
        mountain {
          id
        }
        dates
      }
    }
    me: user(id: $userId) {
      id
      name
      peakLists {
        id
        type
        mountains {
          id
        }
      }
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  peakLists: Array<{
    id: PeakList['id'];
    type: PeakList['type'];
    mountains: Array<{
      id: Mountain['id'];
    }>;
  }>;
  mountains: User['mountains'];
}

interface SuccessResponse {
  peakList: PeakListDatum;
  user: UserDatum;
  me: UserDatum;
}

interface Variables {
  id: string;
  userId: string;
  friendId: string;
}

interface Props {
  userId: string;
  friendId: string;
  peakListId: string;
}

const ComparePeakListPage = (props: Props) => {
  const { userId, friendId, peakListId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST, {
    variables: { id: peakListId, userId, friendId },
  });
  if (loading === true) {
    return <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { peakList, user, me } = data;
    if (!peakList || !user || !me) {
      return (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const mountains: MountainDatum[] = peakList.mountains !== null ? peakList.mountains : [];
      const userCompletedAscents = user.mountains !== null ? user.mountains : [];
      const myCompletedAscents = me.mountains !== null ? me.mountains : [];
      const statesArray: StateDatum[] = peakList.states && peakList.states.length ? [...peakList.states] : [];

      return (
        <>
          <Header
            user={me}
            mountains={mountains}
            peakList={peakList}
            completedAscents={myCompletedAscents}
            comparisonUser={user}
            comparisonAscents={userCompletedAscents}
            statesArray={statesArray}
          />
          <ComparisonTable
            user={user}
            me={me}
            mountains={mountains}
          />
        </>
      );
    }
  } else {
    return (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }
};

export default ComparePeakListPage;
