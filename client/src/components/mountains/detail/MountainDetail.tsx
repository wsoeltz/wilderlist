import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, { useContext } from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { CaltopoLink, GoogleMapsLink } from '../../../routing/externalLinks';
import { lightBorderColor, PlaceholderText } from '../../../styling/styleUtils';
import { Mountain, PeakList, Region, State, User } from '../../../types/graphQLTypes';
import { convertDMS, mobileSize } from '../../../Utils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Map from '../../sharedComponents/map';
import AscentsList from './AscentsList';
import IncludedLists from './IncludedLists';
import LocalTrails from './LocalTrails';
import {
  ContentItem,
  ItemTitle,
} from './sharedStyling';
import WeatherReport from './WeatherReport';

const titleWidth = 150; // in px
const smallScreenSize = 560; // in px

const ItemTitleShort = styled(ItemTitle)`
  width: ${titleWidth}px;

  @media(max-width: ${smallScreenSize}px) {
    width: auto;
    margin-right: 0.7rem;
  }
`;

const HorizontalContentItem = styled(ContentItem)`
  display: flex;
  align-items: center;
`;

const LocationLinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
`;

const ExternalMapsButtons = styled.div`
  margin-left: 1rem;

  @media(max-width: ${smallScreenSize}px) {
    display: flex;
    flex-direction: column;
  }
`;

const LatLongContainer = styled.div`
  @media(max-width: ${smallScreenSize}px) {
    display: flex;
    flex-direction: column;
  }
  @media (min-width: ${mobileSize}px) and (max-width: 1490px) {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }
`;

const Divider = styled.div`
  display: inline-block;
  height: 1rem;
  width: 1px;
  background-color: ${lightBorderColor};
  margin: 0 0.4rem;

  @media(max-width: ${smallScreenSize}px) {
    display: none;
  }
`;

const GET_MOUNTAIN_DETAIL = gql`
  query getMountain($id: ID!, $userId: ID) {
    mountain(id: $id) {
      id
      name
      elevation
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
    }>;
  };
  user: null | {
    id: User['name'];
    mountains: User['mountains'];
  };
}

interface QueryVariables {
  id: string;
  userId: string | null;
}

interface Props {
  userId: string | null;
  id: string;
}

const MountainDetail = (props: Props) => {
  const { userId, id } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_DETAIL, {
    variables: { id, userId },
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
    const { mountain, user } = data;
    if (!mountain) {
      return (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const { name, elevation, state, lists, latitude, longitude } = mountain;
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

      const {lat, long} = convertDMS(latitude, longitude);
      return (
        <>
          <h1>{name}</h1>
          <Map
            id={id}
            coordinates={[mountain]}
            key={`map-id-${id}`}
          />
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-elevation')}:</ItemTitleShort>
            <strong>{elevation}ft</strong>
          </HorizontalContentItem>
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-location')}:</ItemTitleShort>
            <LocationLinksContainer>
              <LatLongContainer>
                <strong>{lat},</strong> <strong>{long}</strong>
              </LatLongContainer>
              <ExternalMapsButtons>
                <GoogleMapsLink lat={latitude} long={longitude} />
                <Divider />
                <CaltopoLink lat={latitude} long={longitude} />
              </ExternalMapsButtons>
            </LocationLinksContainer>
          </HorizontalContentItem>
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('global-text-value-state')}:</ItemTitleShort>
            <strong>{state.name}</strong>
          </HorizontalContentItem>
          {regionsContent}
          <WeatherReport
            latitude={latitude}
            longitude={longitude}
          />
          <LocalTrails
            mountainName={mountain.name}
            latitude={latitude}
            longitude={longitude}
          />
          <IncludedLists
            getFluentString={getFluentString}
            mountainId={id}
            mountainName={name}
            numLists={lists.length}
          />
          <AscentsList
            completedDates={completedDates}
            userId={userId}
            mountainId={id}
            mountainName={name}
            getFluentString={getFluentString}
          />
        </>
      );
    }
  } else {
    return null;
  }
};

export default MountainDetail;
