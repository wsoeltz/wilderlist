import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../styling/Grid';
import { Mountain, PeakList, Region, State, User } from '../../types/graphQLTypes';
import Header from './Header';
import MountainTable from './MountainTable';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID!) {
    peakList(id: $id) {
      id
      name
      shortName
      type
      mountains {
        id
        name
        latitude
        longitude
        elevation
        prominence
        state {
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
      }
      parent {
        id
        mountains {
          id
          name
          latitude
          longitude
          elevation
          prominence
          state {
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
        }
      }
    }
    user(id: $userId) {
      id
      peakLists {
        id
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

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
  elevation: Mountain['elevation'];
  prominence: Mountain['prominence'];
  state: {
    id: State['id'];
    name: State['name'];
    regions: Array<{
      id: Region['id'];
      name: Region['name'];
      states: Array<{
        id: State['id'],
      }>
    }>
  };
}

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  mountains: MountainDatum[] | null;
  parent: {
    id: PeakList['id'];
    mountains: MountainDatum[] | null;
  } | null;
}

export interface UserDatum {
  id: User['id'];
  peakLists: Array<{
    id: PeakList['id'];
  }>;
  mountains: User['mountains'];
}

interface SuccessResponse {
  peakList: PeakListDatum;
  user: UserDatum;
}

interface Variables {
  id: string;
  userId: string;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const PeakListDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { id }: any = match.params;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST, {
    variables: { id, userId },
  });
  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const {
      peakList: {parent, type},
      peakList, user,
    } = data;
    let mountains: MountainDatum[];
    if (parent !== null && parent.mountains !== null) {
      mountains = parent.mountains;
    } else if (peakList.mountains !== null) {
      mountains = peakList.mountains;
    } else {
      mountains = [];
    }
    return (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <Header
              user={user}
              mountains={mountains}
              peakList={peakList}
            />
            <MountainTable
              user={user}
              mountains={mountains}
              type={type}
            />
          </ContentBody>
        </ContentLeftLarge>
        <ContentRightSmall>
          <ContentBody>
            selected mountain content
          </ContentBody>
        </ContentRightSmall>
      </>
    );
  } else {
    return null;
  }
};

export default withRouter(PeakListDetailPage);
