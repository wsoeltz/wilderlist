import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../styling/Grid';
import {
  ButtonPrimary,
  ButtonSecondary,
} from '../../styling/styleUtils';
import { Mountain, PeakList, Region, State, User } from '../../types/graphQLTypes';
import {
  ADD_PEAK_LIST_TO_USER,
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
} from '../peakLists';
import MountainLogo from '../peakLists/mountainLogo';
import { getStatesOrRegion } from '../peakLists/PeakListCard';

const Header = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 150px;
  grid-template-rows: auto auto auto;
`;

const TitleContent = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BeginRemoveListButtonContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: right;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const ListInfo = styled.h3`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const LogoContainer = styled.div`
  grid-row: 2;
  grid-column: 1;
`;

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
    }
  }
`;
const REMOVE_PEAK_LIST_FROM_USER = gql`
  mutation removePeakListFromUser($userId: ID!, $peakListId: ID!) {
    removePeakListFromUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
      }
    }
  }
`;

interface MountainDatum {
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

interface PeakListDatum {
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

interface SuccessResponse {
  peakList: PeakListDatum;
  user: {
    id: User['id'];
    peakLists: Array<{
      id: PeakList['id'];
    }>;
  };
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
  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER);
  const [removePeakListFromUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(REMOVE_PEAK_LIST_FROM_USER);

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
      peakList: {name, parent, shortName, type},
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
    const usersLists = user.peakLists.map((list) => list.id);
    const active = usersLists.includes(peakList.id);
    const beginRemoveButton = active === false ? (
      <ButtonPrimary onClick={() => addPeakListToUser({variables: {userId,  peakListId: id}})}>
        Begin List
      </ButtonPrimary>
     ) : (
      <ButtonSecondary onClick={() => removePeakListFromUser({variables: {userId,  peakListId: id}})}>
        Remove List
      </ButtonSecondary>
     ) ;
    return (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <Header>
              <TitleContent>
                <Title>{name}</Title>
                <ListInfo>
                  {getStatesOrRegion(mountains)}
                </ListInfo>
                <ListInfo>
                  {mountains.length} Total Summits
                </ListInfo>
              </TitleContent>
              <LogoContainer>
                <MountainLogo
                  id={id}
                  title={name}
                  shortName={shortName}
                  variant={type}
                />
              </LogoContainer>
              <BeginRemoveListButtonContainer>
                {beginRemoveButton}
              </BeginRemoveListButtonContainer>
            </Header>
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
