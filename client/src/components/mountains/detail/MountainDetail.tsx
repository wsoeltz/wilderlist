import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  GhostButton,
  lightBaseColor,
  lightBorderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { PlaceholderText } from '../../../styling/styleUtils';
import { Mountain, PeakList, Region, State, User } from '../../../types/graphQLTypes';
import { convertDMS, convertFieldsToDate } from '../../../Utils';
import MountainCompletionModal, {
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../../peakLists/detail/MountainCompletionModal';
import {
  DateObject,
  formatDate,
  getDates,
} from '../../peakLists/Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';

const titleWidth = 150; // in px

const ItemTitle = styled.div`
  text-transform: uppercase;
  color: ${lightBaseColor};
  font-weight: ${semiBoldFontBoldWeight};
`;

const ItemTitleShort = styled(ItemTitle)`
  width: ${titleWidth}px;
`;

const ContentItem = styled.div`
  border-bottom: solid 1px ${lightBorderColor};
  padding: 0.5rem 0;
`;

const HorizontalContentItem = styled(ContentItem)`
  display: flex;
`;

const VerticalContentItem = styled(ContentItem)`
  margin-bottom: 0.5rem;
`;

const BasicListItem = styled.div`
  font-size: 0.9rem;
`;

const AscentListItem = styled(BasicListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-basis: 1;

  &:hover {
    background-color: ${lightBorderColor};
  }
`;

const AddAscentButton = styled(ButtonPrimary)`
  margin-top: 1rem;
`;

const GET_MOUNTAIN_LIST = gql`
  query getMountain($id: ID!, $userId: ID!) {
    mountain(id: $id) {
      id
      name
      elevation
      prominence
      latitude
      longitude
      state {
        id
        name
        regions {
          id
          name
        }
      }
      lists {
        id
        name
      }
    }
    user(id: $userId) {
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

interface QuerySuccessResponse {
  mountain: {
    id: Mountain['name'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    prominence: Mountain['prominence'];
    latitude: Mountain['latitude'];
    longitude: Mountain['longitude'];
    state: {
      id: State['id'];
      name: State['name'];
      regions: Array<{
        id: Region['id'];
        name: Region['name'];
      }>;
    };
    lists: Array<{
      id: PeakList['id'];
      name: PeakList['name'];
    }>;
  };
  user: {
    id: User['name'];
    mountains: User['mountains'];
  };
}

interface QueryVariables {
  id: string;
  userId: string;
}

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

interface Props {
  userId: string;
  id: string;
}

const getDateAsString = (date: DateObject) => {
  const day = isNaN(date.day) ? '' : date.day;
  const month = isNaN(date.month) ? '' : date.month;
  const year = isNaN(date.year) ? '' : date.year;
  const result = convertFieldsToDate(day.toString(), month.toString(), year.toString());
  if (result.error || result.date === undefined) {
    return '';
  }
  return result.date;
};

const MountainDetail = (props: Props) => {
  const { userId, id } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_LIST, {
    variables: { id, userId },
  });

  const [removeMountainCompletion] =
  useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(REMOVE_MOUNTAIN_COMPLETION);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  const editMountainModal = editMountainId === null ? null : (
    <MountainCompletionModal
      editMountainId={editMountainId}
      closeEditMountainModalModal={closeEditMountainModalModal}
      userId={userId}
    />
  );

  const [dateToRemove, setDateToRemove] = useState<DateObject | null>(null);

  const closeAreYouSureModal = () => {
    setDateToRemove(null);
  };

  const confirmRemove = () => {
    if (dateToRemove !== null) {
      removeMountainCompletion({ variables: { userId, mountainId: id, date: getDateAsString(dateToRemove)}});
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = dateToRemove === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={getFluentString('global-text-value-are-you-sure-modal')}
      text={getFluentString('mountain-detail-remove-ascent-modal-text', {
        date: formatDate(dateToRemove),
      })}
      confirmText={getFluentString('global-text-value-modal-confirm')}
      cancelText={getFluentString('global-text-value-modal-cancel')}
    />
  );

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
    const { mountain, user } = data;
    if (!mountain || !user) {
      return (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const { name, elevation, prominence, state, lists, latitude, longitude } = mountain;
      const userMountains = (user && user.mountains) ? user.mountains : [];
      const completedDates = userMountains.find(
        (completedMountain) => completedMountain.mountain.id === id);
      let completionContent: React.ReactElement<any> | null;
      if (completedDates && completedDates.dates.length) {
        const dates = getDates(completedDates.dates);
        const completionListItems = dates.map((date, index) => (
          <AscentListItem key={date.dateAsNumber + index.toString()}>
            <strong>{formatDate(date)}</strong>
            <GhostButton
              onClick={
                () => setDateToRemove(date)
              }
            >
              {getFluentString('mountain-detail-remove-ascent')}
            </GhostButton>
          </AscentListItem>
        ));
        completionContent = (
          <>
            {completionListItems}
            <AddAscentButton onClick={() => setEditMountainId(id)}>
              {getFluentString('mountain-detail-add-another-ascent')}
            </AddAscentButton>
            {areYouSureModal}
          </>
        );
      } else {
        completionContent = (
          <>
            <BasicListItem>{getFluentString('mountain-detail-no-ascents-text', {
              'mountain-name': name,
            })}</BasicListItem>
            <AddAscentButton onClick={() => setEditMountainId(id)}>
              {getFluentString('mountain-detail-add-ascent-date')}
            </AddAscentButton>
          </>
        );
      }

      const regions = state.regions.map((region, index) => {
        if (index === state.regions.length - 1 ) {
          return `${region.name}`;
        } else {
          return `${region.name}, `;
        }
      });

      const regionsContent = regions.length < 1 ? null : (
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-regions')}:</ItemTitleShort>
            <strong>{regions}</strong>
          </HorizontalContentItem>
        );

      const listsText = lists.map((list, index) => {
        if (index === lists.length - 1 ) {
          return <BasicListItem key={list.id}>{list.name}</BasicListItem>;
        } else {
          return <BasicListItem key={list.id}>{list.name}</BasicListItem>;
        }
      });

      const listsContent = listsText.length < 1 ? null : (
          <VerticalContentItem>
            <ItemTitle>{getFluentString('mountain-detail-lists-mountain-appears-on', {
              'mountain-name': name,
            })}</ItemTitle>
            {listsText}
          </VerticalContentItem>
        );
      const {lat, long} = convertDMS(latitude, longitude);
      return (
        <>
          <h1>{name}</h1>
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-elevation')}:</ItemTitleShort>
            <strong>{elevation}ft</strong>
          </HorizontalContentItem>
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-prominence')}:</ItemTitleShort>
            <strong>{prominence}ft</strong>
          </HorizontalContentItem>
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-location')}:</ItemTitleShort>
            <strong>{lat}, {long}</strong>
          </HorizontalContentItem>
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-state')}:</ItemTitleShort>
            <strong>{state.name}</strong>
          </HorizontalContentItem>
          {regionsContent}
          {listsContent}
          <VerticalContentItem>
            <ItemTitle>{getFluentString('global-text-value-ascent-dates')}:</ItemTitle>
            {completionContent}
          </VerticalContentItem>
          {editMountainModal}
        </>
      );
    }
  } else {
    return null;
  }
};

export default MountainDetail;
