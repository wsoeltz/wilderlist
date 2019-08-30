import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { sortBy } from 'lodash';
import React, { useState } from 'react';
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
  InputBase,
} from '../../styling/styleUtils';
import { Mountain, PeakList, Region, State, User } from '../../types/graphQLTypes';
import {
  ADD_PEAK_LIST_TO_USER,
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
} from '../peakLists';
import MountainLogo from '../peakLists/mountainLogo';
import { getStatesOrRegion } from '../peakLists/PeakListCard';
import Modal from '../sharedComponents/Modal';
import { convertFieldsToDate } from '../../Utils';

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

const MountainTable = styled.div`
  display: grid;
`;

const MountainName = styled.div`
  grid-column: 1;
`;

const MountainElevation = styled.div`
  grid-column: 2;
`;

const MountainProminence = styled.div`
  grid-column: 3;
`;

const MountainButton = styled.div`
  grid-column: 4;
`;

const MountainColumnTitleName = styled(MountainName)`

`;
const MountainColumnTitleElevation = styled(MountainElevation)`

`;
const MountainColumnTitleProminence = styled(MountainProminence)`

`;
const MountainColumnTitleButton = styled(MountainButton)`

`;

const DateInputContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 5fr 7fr;
  grid-column-gap: 1rem;
`;

const DayInput = styled(InputBase)`
  grid-column: 2;
  text-align: center;
`;
const MonthInput = styled(InputBase)`
  grid-column: 1;
  text-align: center;
`;
const YearInput = styled(InputBase)`
  grid-column: 3;
  text-align: center;
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
      mountains {
        mountain {
          id
        }
        dates
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
// const REMOVE_MOUNTAIN_COMPLETION = gql`
//   mutation removeMountainCompletion(
//     $userId: ID!,
//     $mountainId: ID!,
//     $date: String!
//     ) {
//     removeMountainCompletion(
//       userId: $userId,
//       mountainId: $mountainId,
//       date: $date
//     ) {
//       id
//       mountains {
//         mountain {
//           id
//         }
//         dates
//       }
//     }
//   }
// `;

interface MountainCompletionSuccessResponse {
  id: User['id'];
  mountains: User['mountains'];
}

interface MountainCompletionVariables {
  userId: string;
  mountainId: string;
  date: string;
}

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
    mountains: User['mountains'];
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
  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
  // const [removeMountainCompletion] =
    // useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
   const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
   const [completionDay, setCompletionDay] = useState<string>('');
   const [completionMonth, setCompletionMonth] = useState<string>('');
   const [completionYear, setCompletionYear] = useState<string>('');

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
    const mountainsByElevation = sortBy(mountains, mountain => mountain.elevation).reverse();
    const mountainRows = mountainsByElevation.map(mountain => {
      let peakCompletedContent: React.ReactElement<any> | null;
      if (user !== undefined && user !== null) {
        if (user.mountains !== undefined && user.mountains !== null) {
          const isCompleted = user.mountains.find((completedMountain) => completedMountain.mountain.id === mountain.id);
          if (isCompleted === undefined) {
            peakCompletedContent = (
              <ButtonSecondary onClick={() => setEditMountainId(mountain.id)}>
                Mark done
              </ButtonSecondary>
            );
          } else {
            peakCompletedContent = (
              <em>Completed on {isCompleted.dates[0]}</em>
            );
          }
        } else {
          peakCompletedContent = (
            <ButtonSecondary onClick={() => setEditMountainId(mountain.id)}>
              Mark done
            </ButtonSecondary>
          );
        }
      } else {
        peakCompletedContent = null;
      }

      return (
        <React.Fragment key={mountain.id}>
          <MountainName>{mountain.name}</MountainName>
          <MountainElevation>{mountain.elevation}</MountainElevation>
          <MountainProminence>{mountain.prominence}</MountainProminence>
          <MountainButton>
            {peakCompletedContent}
          </MountainButton>
        </React.Fragment>
      );
    });

    const validateAndAddMountainCompletion = (mountainId: Mountain['id']) => {
      const year = convertFieldsToDate(completionDay, completionMonth, completionYear);
      if (year.error !== undefined) {
        console.error(year.error);
      } else {
        addMountainCompletion({ variables: {userId, mountainId, date: year.date}});
        closeEditMountainModalModal();
      }
    }

    const closeEditMountainModalModal = () => {
      setEditMountainId(null)
      setCompletionDay('');
      setCompletionMonth('');
      setCompletionYear('');
    };
    const editMountainModal = editMountainId === null ? null : (
      <Modal
        onClose={closeEditMountainModalModal}
        width={'300px'}
        height={'300px'}
      >
        <DateInputContainer>
          <MonthInput
            placeholder='MM'
            value={completionMonth}
            onChange={e => setCompletionMonth(e.target.value)}
            type='number'
          />
          <DayInput
            placeholder='DD'
            value={completionDay}
            onChange={e => setCompletionDay(e.target.value)}
            type='number'
          />
          <YearInput
            placeholder='YYYY'
            value={completionYear}
            onChange={e => setCompletionYear(e.target.value)}
            type='number'
          />
        </DateInputContainer>
        <ButtonSecondary onClick={closeEditMountainModalModal}>
          Cancel
        </ButtonSecondary>
        <ButtonPrimary onClick={() => validateAndAddMountainCompletion(editMountainId)}>
          Mark Complete
        </ButtonPrimary>
      </Modal>
    );

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
            <MountainTable>
              <MountainColumnTitleName>Mountain</MountainColumnTitleName>
              <MountainColumnTitleElevation>Elevation</MountainColumnTitleElevation>
              <MountainColumnTitleProminence>Prominence</MountainColumnTitleProminence>
              <MountainColumnTitleButton>Completed</MountainColumnTitleButton>
              {mountainRows}
            </MountainTable>
          </ContentBody>
        </ContentLeftLarge>
        <ContentRightSmall>
          <ContentBody>
            selected mountain content
          </ContentBody>
        </ContentRightSmall>

        {editMountainModal}
      </>
    );
  } else {
    return null;
  }
};

export default withRouter(PeakListDetailPage);
