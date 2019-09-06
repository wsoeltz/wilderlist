import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../styling/Grid';
import {
  MountainDatum,
  PeakListDatum,
  UserDatum,
} from '../peakListDetail';
import Header from '../peakListDetail/Header';
import ComparisonTable from './ComparisonTable';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID!, $friendId: ID!) {
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
    user(id: $friendId) {
      id
      name
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
    me: user(id: $userId) {
      id
      name
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

interface Props extends RouteComponentProps {
  userId: string;
}

const PeakListDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { friendId, peakListId }: any = match.params;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST, {
    variables: { id: peakListId, userId, friendId },
  });
  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const {
      peakList: {parent, type},
      peakList, user, me,
    } = data;
    let mountains: MountainDatum[];
    if (parent !== null && parent.mountains !== null) {
      mountains = parent.mountains;
    } else if (peakList.mountains !== null) {
      mountains = peakList.mountains;
    } else {
      mountains = [];
    }
    const userCompletedAscents = user.mountains !== null ? user.mountains : [];
    const myCompletedAscents = me.mountains !== null ? me.mountains : [];
    return (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <Header
              user={me}
              mountains={mountains}
              peakList={peakList}
              completedAscents={myCompletedAscents}
              comparisonUser={user}
              comparisonAscents={userCompletedAscents}
            />
            <ComparisonTable
              user={user}
              me={me}
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
