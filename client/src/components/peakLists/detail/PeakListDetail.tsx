import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { listDetailLink } from '../../../routing/Utils';
import {
  ButtonPrimaryLink,
  lightBorderColor,
  PlaceholderText,
} from '../../../styling/styleUtils';
import { Mountain, PeakList, Region, State, User } from '../../../types/graphQLTypes';
import { UserContext } from '../../App';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Map from '../../sharedComponents/map';
import UserNote from '../../sharedComponents/UserNote';
import { getStatesOrRegion } from '../list/PeakListCard';
import { getType, isState } from '../Utils';
import getCompletionDates from './getCompletionDates';
import Header from './Header';
import MountainTable, {topOfPageBuffer} from './MountainTable';

const peakListDetailMapKey = 'peakListDetailMapKey';

export const friendHeaderHeight = 2.6; // in rem

const FriendHeader = styled.h3`
  height: ${friendHeaderHeight}rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 250;
  position: sticky;
  top: ${topOfPageBuffer}rem;
  background-color: #fff;
  border-bottom: 2px solid ${lightBorderColor};
  margin-top: 0;
`;

const Text = styled.div`
  flex-shrink: 1;
  margin-right: 1rem;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translate(0, 25%);
`;

const LinkButton = styled(ButtonPrimaryLink)`
  flex-shrink: 0;
  padding: 0.4rem;
  font-size: 0.7rem;
`;

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID) {
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
        state {
          id
          abbreviation
        }
      }
      states {
        id
        name
        abbreviation
        regions {
          id
          name
          states {
            id
          }
        }
      }
      parent {
        id
        states {
          id
          name
          abbreviation
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
          state {
            id
            abbreviation
          }
        }
      }
    }
    user(id: $userId) {
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
      peakListNote(peakListId: $id) {
        id
        text
      }
    }
  }
`;

export interface StateDatum {
  id: State['id'];
  name: State['name'];
  abbreviation: State['abbreviation'];
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
    states: Array<{
      id: State['id'],
    }>
  }>;
}

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
  elevation: Mountain['elevation'];
  state: {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
}

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  mountains: MountainDatum[] | null;
  states: StateDatum[] | null;
  parent: {
    id: PeakList['id'];
    mountains: MountainDatum[] | null;
    states: StateDatum[] | null;
  } | null;
}

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  peakLists: Array<{
    id: PeakList['id'];
  }>;
  mountains: User['mountains'];
}

interface UserDatumWithNote extends UserDatum {
  peakListNote: User['peakListNote'];
}

interface SuccessResponse {
  peakList: PeakListDatum;
  user: UserDatumWithNote | null;
}

interface Variables {
  id: string;
  userId: string | null;
}

const ADD_PEAKLIST_NOTE = gql`
  mutation($userId: ID!, $peakListId: ID!, $text: String!) {
    user: addPeakListNote(
      userId: $userId,
      peakListId: $peakListId,
      text: $text
    ) {
      id
      peakListNote(peakListId: $peakListId) {
        id
        text
      }
    }
  }
`;

const EDIT_PEAKLIST_NOTE = gql`
  mutation($userId: ID!, $peakListId: ID!, $text: String!) {
    user: editPeakListNote(
      userId: $userId,
      peakListId: $peakListId,
      text: $text
    ) {
      id
      peakListNote(peakListId: $peakListId) {
        id
        text
      }
    }
  }
`;

interface PeakListNoteSuccess {
  user: {
    id: User['id'];
    peakListNote: User['peakListNote'];
  };
}

interface PeakListNoteVariables {
  userId: string;
  peakListId: string;
  text: string;
}

interface Props {
  userId: string | null;
  id: string;
  mountainId: string | undefined;
}

const PeakListDetail = (props: Props) => {
  const { userId, id, mountainId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST, {
    variables: { id, userId },
  });

  const [addPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(ADD_PEAKLIST_NOTE);
  const [editPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(EDIT_PEAKLIST_NOTE);

  const renderProp = (me: User | null) => {
    let statesArray: StateDatum[] = [];
    if (loading === true) {
      return <LoadingSpinner />;
    } else if (error !== undefined) {
      console.error(error);
      return  (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else if (data !== undefined) {
      const { peakList, user } = data;
      if (!peakList) {
        return (
          <PlaceholderText>
            {getFluentString('global-error-retrieving-data')}
          </PlaceholderText>
        );
      } else {
        const {parent, type} = peakList;
        let mountains: MountainDatum[];
        if (parent !== null && parent.mountains !== null) {
          mountains = parent.mountains;
        } else if (peakList.mountains !== null) {
          mountains = peakList.mountains;
        } else {
          mountains = [];
        }
        const completedAscents =
          user && user.mountains !== null ? user.mountains : [];

        if (peakList.parent && peakList.parent.states && peakList.parent.states.length) {
          statesArray = [...peakList.parent.states];
        } else if (peakList.states && peakList.states.length) {
          statesArray = [...peakList.states];
        }

        let paragraphText: string;
        if (mountains && mountains.length) {
          const statesOrRegions = getStatesOrRegion(statesArray, getFluentString);
          const isStateOrRegion = isState(statesOrRegions) === true ? 'state' : 'region';
          const mountainsSortedByElevation = sortBy(mountains, ['elevation']).reverse();
          paragraphText = getFluentString('peak-list-detail-list-overview-para-1', {
            'list-name': peakList.name,
            'number-of-peaks': mountains.length,
            'state-or-region': isStateOrRegion.toString(),
            'state-region-name': statesOrRegions,
            'highest-mountain-name': mountainsSortedByElevation[0].name,
            'highest-mountain-elevation': mountainsSortedByElevation[0].elevation,
            'smallest-mountain-name':
              mountainsSortedByElevation[mountainsSortedByElevation.length - 1].name,
            'smallest-mountain-elevation':
              mountainsSortedByElevation[mountainsSortedByElevation.length - 1].elevation,
          });
        } else {
          paragraphText = getFluentString('peak-list-detail-list-overview-empty', {
            'list-name': peakList.name,
          });
        }

        const userMountains = (user && user.mountains) ? user.mountains : [];

        const mountainsWithDates = mountains.map(mountain => {
          const completionDates = getCompletionDates({type, mountain, userMountains});
          return {...mountain, completionDates};
        });

        const activeMountain = mountainsWithDates.find(mtn => mtn.id === mountainId);
        const highlightedMountain = activeMountain ? [activeMountain] : undefined;

        const isOtherUser = (me && user) && (me._id !== user.id) ? true : false;

        const friendHeader = isOtherUser === true && user !== null ? (
           <FriendHeader>
            <Text>
              {getFluentString('peak-list-detail-friend-viewing-list', {username: user.name})}
            </Text>
            <LinkButton to={listDetailLink(peakList.id)}>
              {getFluentString('peak-list-detail-friend-view-your-progress-button')}
            </LinkButton>
           </FriendHeader>
         ) : null;

        const peakListNote = user && user.peakListNote ? user.peakListNote : null;
        const defaultNoteText = peakListNote && peakListNote.text ? peakListNote.text : '';
        const notesPlaceholderText = getFluentString('user-notes-placeholder', {
          name: peakList.name + getType(type),
        });

        const saveNote = (text: string) => {
          if (user && peakList) {
            if (peakListNote === null) {
              addPeakListNote({variables: {userId: user.id, peakListId: peakList.id, text}});
            } else {
              editPeakListNote({variables: {userId: user.id, peakListId: peakList.id, text}});
            }
          }
        };

        return (
          <>
            {friendHeader}
            <Header
              user={user}
              mountains={mountains}
              peakList={peakList}
              completedAscents={completedAscents}
              statesArray={statesArray}
              isOtherUser={isOtherUser}
            />
            <Map
              id={peakList.id}
              coordinates={mountainsWithDates}
              highlighted={highlightedMountain}
              peakListType={type}
              userId={userId}
              isOtherUser={isOtherUser}
              key={peakListDetailMapKey}
            />
            <p>
              {paragraphText}
            </p>
            <UserNote
              placeholder={notesPlaceholderText}
              defaultValue={defaultNoteText}
              onSave={saveNote}
              key={defaultNoteText}
            />
            <MountainTable
              user={user}
              mountains={mountainsWithDates}
              type={type}
              peakListId={peakList.id}
              peakListShortName={peakList.shortName}
              isOtherUser={isOtherUser}
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

  return (
    <>
      <UserContext.Consumer
        children={renderProp}
      />
    </>
  );
};

export default PeakListDetail;
