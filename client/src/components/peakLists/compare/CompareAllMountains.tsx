import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import { Mountain, PeakList, User } from '../../../types/graphQLTypes';
import { MountainDatumLite } from './ComparisonRow';
import ComparisonTable from './ComparisonTable';
import { GetString } from 'fluent-react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { PlaceholderText } from '../../../styling/styleUtils';

const GET_PEAK_LIST = gql`
  query getUserAndMe($userId: ID!, $friendId: ID!) {
    user(id: $friendId) {
      id
      name
      peakLists {
        id
        type
        mountains {
          id
          name
        }
        parent {
          id
          mountains {
            id
            name
          }
        }
      }
      mountains {
        mountain {
          id
          name
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
          name
        }
        parent {
          id
          mountains {
            id
            name
          }
        }
      }
      mountains {
        mountain {
          id
          name
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
      name: Mountain['name'];
    }>;
    parent: {
      id: PeakList['id'];
      mountains: Array<{
        id: Mountain['id'];
        name: Mountain['name'];
      }>;
    }
  }>;
  mountains: User['mountains'];
}

interface SuccessResponse {
  user: UserDatum;
  me: UserDatum;
}

interface Variables {
  userId: string;
  friendId: string;
}

interface Props {
  userId: string;
  id: string;
}

const CompareAllMountains = (props: Props) => {
  const { userId, id } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST, {
    variables: { userId, friendId: id },
  });
  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const {
      user, me,
    } = data;
    const allMountains: MountainDatumLite[] = [];
    me.peakLists.forEach(peakList => {
      let mountains: MountainDatumLite[];
      const { parent } = peakList;
      if (parent !== null && parent.mountains !== null) {
        mountains = parent.mountains;
      } else if (peakList.mountains !== null) {
        mountains = peakList.mountains;
      } else {
        mountains = [];
      }
      mountains.forEach(mountain => {
        if (allMountains.findIndex(({id: currentId}) => mountain.id === currentId) === -1) {
          allMountains.push(mountain);
        }
      });
    });
    user.peakLists.forEach(peakList => {
      let mountains: MountainDatumLite[];
      const { parent } = peakList;
      if (parent !== null && parent.mountains !== null) {
        mountains = parent.mountains;
      } else if (peakList.mountains !== null) {
        mountains = peakList.mountains;
      } else {
        mountains = [];
      }
      mountains.forEach(mountain => {
        if (allMountains.findIndex(({id: currentId}) => mountain.id === currentId) === -1) {
          allMountains.push(mountain);
        }
      });
    });
    return (
      <>
        <h1>Compare all ascents</h1>
        <ComparisonTable
          user={user}
          me={me}
          mountains={allMountains}
          peakListId={'all'}
        />
      </>
    );
  } else {
    return null;
  }
};

export default CompareAllMountains;
