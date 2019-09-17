import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, { useContext } from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  lightBaseColor,
  lightBorderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { PlaceholderText } from '../../../styling/styleUtils';
import { Mountain, PeakList, Region, State, User } from '../../../types/graphQLTypes';
import { convertDMS } from '../../../Utils';
import Map from '../../sharedComponents/map';
import AscentsList from './AscentsList';

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

export const BasicListItem = styled.div`
  font-size: 0.9rem;
`;

export const AscentListItem = styled(BasicListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-basis: 1;

  &:hover {
    background-color: ${lightBorderColor};
  }
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

interface Props {
  userId: string;
  id: string;
}

const MountainDetail = (props: Props) => {
  const { userId, id } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_LIST, {
    variables: { id, userId },
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
          <Map
            id={id}
            coordinates={[mountain]}
          />
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
            <AscentsList
              completedDates={completedDates}
              userId={userId}
              mountainId={id}
              mountainName={name}
            />
          </VerticalContentItem>
        </>
      );
    }
  } else {
    return null;
  }
};

export default MountainDetail;
