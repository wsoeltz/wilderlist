import { useMutation, useQuery } from '@apollo/react-hooks';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { CaltopoLink, GoogleMapsLink } from '../../../routing/externalLinks';
import { editMountainLink, mountainDetailLink } from '../../../routing/Utils';
import {
  BasicIconInText,
  ButtonSecondaryLink,
  GhostButton,
  lightBorderColor,
  LinkButton,
  lowWarningColorDark,
  PlaceholderText,
  PreFormattedParagraph,
  ResourceItem,
  ResourceList,
} from '../../../styling/styleUtils';
import {
  CreatedItemStatus,
  Mountain,
  PeakList,
  PeakListVariants,
  PermissionTypes,
  Region,
  State,
  User,
} from '../../../types/graphQLTypes';
import getDrivingDistances from '../../../utilities/getDrivingDistances';
import { convertDMS, mobileSize } from '../../../Utils';
import {
  isValidURL,
} from '../../../Utils';
import {
  VariableDate,
} from '../../peakLists/detail/getCompletionDates';
import { getDates } from '../../peakLists/Utils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Map from '../../sharedComponents/map';
import {
  twoColorScale,
} from '../../sharedComponents/map/colorScaleColors';
import UserNote from '../../sharedComponents/UserNote';
import AscentsList from './AscentsList';
import FlagModal from './FlagModal';
import IncludedLists from './IncludedLists';
import LocalTrails from './LocalTrails';
import {
  ContentItem,
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';
import TripReports from './TripReports';
import WeatherReport from './WeatherReport';

const mountainDetailMapKey = 'mountainDetailMapKey';

const MountainNameHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
`;

const Subtitle = styled.em`
  color: ${lowWarningColorDark};
`;

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
      description
      resources {
        title
        url
      }
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
      author {
        id
      }
      status
    }
    user(id: $userId) {
      id
      permissions
      mountains {
        mountain {
          id
        }
        dates
      }
      mountainNote(mountainId: $id) {
        id
        text
      }
      mountainPermissions
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
    description: Mountain['description'];
    resources: Mountain['resources'];
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
    author: null | { id: User['id'] };
    status: Mountain['status'];
  };
  user: null | {
    id: User['name'];
    permissions: User['permissions'];
    mountains: User['mountains'];
    mountainNote: User['mountainNote'];
    mountainPermissions: User['mountainPermissions'];
  };
}

interface QueryVariables {
  id: string;
  userId: string | null;
}

const ADD_MOUNTAIN_NOTE = gql`
  mutation($userId: ID!, $mountainId: ID!, $text: String!) {
    user: addMountainNote(
      userId: $userId,
      mountainId: $mountainId,
      text: $text
    ) {
      id
      mountainNote(mountainId: $mountainId) {
        id
        text
      }
    }
  }
`;

const EDIT_MOUNTAIN_NOTE = gql`
  mutation($userId: ID!, $mountainId: ID!, $text: String!) {
    user: editMountainNote(
      userId: $userId,
      mountainId: $mountainId,
      text: $text
    ) {
      id
      mountainNote(mountainId: $mountainId) {
        id
        text
      }
    }
  }
`;

interface MountainNoteSuccess {
  user: {
    id: User['id'];
    mountainNote: User['mountainNote'];
  };
}

interface MountainNoteVariables {
  userId: string;
  mountainId: string;
  text: string;
}

const localStorageShowDrivingTimesVariable = 'localStorageShowDrivingTimesVariable';

interface Props {
  userId: string | null;
  id: string;
  setOwnMetaData?: boolean;
}

const MountainDetail = (props: Props) => {
  const { userId, id, setOwnMetaData } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_DETAIL, {
    variables: { id, userId },
  });

  const [addMountainNote] = useMutation<MountainNoteSuccess, MountainNoteVariables>(ADD_MOUNTAIN_NOTE);
  const [editMountainNote] = useMutation<MountainNoteSuccess, MountainNoteVariables>(EDIT_MOUNTAIN_NOTE);

  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
  const closeFlagModal = () => setIsFlagModalOpen(false);

  const [usersLocation, setUsersLocation] = useState<{
    error: string | undefined, latitude: number | undefined, longitude: number | undefined,
  } | undefined>(undefined);
  const [mountainLocation, setMountainLocation] = useState<{latitude: number, longitude: number} | undefined>();

  const localShowDrivingDirectionsVariable = localStorage.getItem(localStorageShowDrivingTimesVariable);
  const initialShowDrivingDrivingDirectionsVariable = localShowDrivingDirectionsVariable === 'true' ? true : false;
  const [showDrivingDirections, setShowDrivingDirections] =
    useState<boolean>(initialShowDrivingDrivingDirectionsVariable);
  const [drivingDistance, setDrivingDistance] =
    useState<{hours: number, minutes: number, miles: number} | null | 'loading'>(null);

  useEffect(() => {
    if (showDrivingDirections === true) {
      const onSuccess = ({coords: {latitude, longitude}}: Position) => {
        setUsersLocation({latitude, longitude, error: undefined});
        localStorage.setItem(localStorageShowDrivingTimesVariable, 'true');
      };
      const onError = () => {
        setUsersLocation({latitude: undefined, longitude: undefined, error: 'Unable to retrieve your location'});
      };
      if (!navigator.geolocation) {
        setUsersLocation({
          latitude: undefined, longitude: undefined, error: 'Geolocation is not supported by your browser',
        });
      } else {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }
    } else {
      localStorage.setItem(localStorageShowDrivingTimesVariable, 'false');
    }
  }, [showDrivingDirections]);

  useEffect(() => {
    if (usersLocation !== undefined &&
        usersLocation.latitude !== undefined &&
        usersLocation.longitude !== undefined &&
        mountainLocation !== undefined) {
      getDrivingDistances(
        usersLocation.latitude, usersLocation.longitude,
        mountainLocation.latitude, mountainLocation.longitude)
      .then(res => setDrivingDistance(res))
      .catch(err => console.error(err));
    }
  }, [usersLocation, mountainLocation]);

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
      const {
        name, elevation, state, lists, latitude, longitude,
        author, status, resources,
      } = mountain;

      if (mountainLocation === undefined ||
          mountainLocation.latitude !== latitude ||
          mountainLocation.longitude !== longitude
        ) {
        setMountainLocation({latitude, longitude});
      }

      const title = status === CreatedItemStatus.pending ? (
        <div>
          <Title style={{marginBottom: 0}}>{name}</Title>
          <Subtitle>{getFluentString('mountain-detail-pending-approval')}</Subtitle>
        </div>
      ) : (
        <Title>{name}</Title>
      );

      const userMountains = (user && user.mountains) ? user.mountains : [];
      const completedDates = userMountains.find(
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === id);

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
      const completionDates: VariableDate | null = completedDates !== undefined && completedDates.dates.length ? {
        type: PeakListVariants.standard,
        standard: getDates(completedDates.dates)[0],
      } : null;

      const mountainNote = user && user.mountainNote ? user.mountainNote : null;
      const defaultNoteText = mountainNote && mountainNote.text ? mountainNote.text : '';
      const notesPlaceholderText = getFluentString('user-notes-placeholder', {name: mountain.name});

      const saveNote = (text: string) => {
        if (user && mountain) {
          if (mountainNote === null) {
            addMountainNote({variables: {userId: user.id, mountainId: mountain.id, text}});
          } else {
            editMountainNote({variables: {userId: user.id, mountainId: mountain.id, text}});
          }
        }
      };

      let actionButton: React.ReactElement<any> | null;
      if (!user) {
        actionButton = null;
      } else {
        actionButton = (author && author.id && author.id === userId
                  && user.mountainPermissions !== -1) || user.permissions === PermissionTypes.admin ? (
          <ButtonSecondaryLink to={editMountainLink(mountain.id)}>
            {getFluentString('global-text-value-edit')}
          </ButtonSecondaryLink>
        ) : (
          <GhostButton onClick={() => setIsFlagModalOpen(true)}>
            <BasicIconInText icon={faFlag} />
            {getFluentString('global-text-value-flag')}
          </GhostButton>
        );
      }

      const flagModal = isFlagModalOpen === false ? null : (
        <FlagModal
          onClose={closeFlagModal}
          mountainId={mountain.id}
          mountainName={mountain.name}
        />
      );

      const description = mountain.description && mountain.description.length ? (
        <VerticalContentItem>
          <PreFormattedParagraph>
            {mountain.description}
          </PreFormattedParagraph>
        </VerticalContentItem>
      ) : null;

      let resourcesList: React.ReactElement<any> | null;
      if (resources && resources.length) {
        const resourcesArray: Array<React.ReactElement<any>> = [];
        resources.forEach(resource => {
          if (resource.title.length && resource.url.length && isValidURL(resource.url)) {
            resourcesArray.push(
              <ResourceItem key={resource.url + resource.title}>
                <a href={resource.url}>{resource.title}</a>
              </ResourceItem>,
            );
          }
        });
        resourcesList = resourcesArray.length ? (
          <>
            <ItemTitle>
              {getFluentString('global-text-value-external-resources')}
            </ItemTitle>
            <VerticalContentItem>
              <ResourceList>
                {resourcesArray}
              </ResourceList>
            </VerticalContentItem>
          </>
        ) : null;
      } else {
        resourcesList = null;
      }

      let drivingDistanceContent: React.ReactElement<any>;
      if (showDrivingDirections === false) {
        drivingDistanceContent = (
          <LinkButton
            onClick={() => {
              setShowDrivingDirections(true);
              setDrivingDistance('loading');
            }}
          >
            {getFluentString('mountain-detail-enable-driving-distances')}
          </LinkButton>
        );
      } else {
        let drivingDistanceText: React.ReactElement<any>;
        if (usersLocation && usersLocation.error !== undefined) {
          drivingDistanceText = <em>{usersLocation.error}</em>;
        } else if (drivingDistance === 'loading') {
          drivingDistanceText = (
            <em>
              {getFluentString('global-text-value-loading')}...
            </em>
          );
        } else if (usersLocation === undefined || mountainLocation === undefined) {
          drivingDistanceText = <em>{getFluentString('mountain-detail-driving-error-location')}</em>;
        } else if (drivingDistance === null) {
          drivingDistanceText = <em>{getFluentString('mountain-detail-driving-error-direction')}</em>;
        } else {
          drivingDistanceText = (
            <a href={
                'https://www.google.com/maps' +
                  `?saddr=${usersLocation.latitude},${usersLocation.longitude}` +
                  `&daddr=${mountainLocation.latitude},${mountainLocation.longitude}`
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              {getFluentString('mountain-detail-driving-distance', {
                hours: drivingDistance.hours,
                minutes: drivingDistance.minutes,
                miles: drivingDistance.miles,
              })}
            </a>
          );
        }
        drivingDistanceContent = (
          <>{drivingDistanceText}</>
        );
      }

      const metaDescription = getFluentString('meta-data-mountain-detail-description', {
        name, lat, long, elevation, state: state && state.name ? state && state.name : 'none',
      });

      const metaData = setOwnMetaData === true ? (
        <Helmet>
          <title>{getFluentString('meta-data-detail-default-title', {
            title: `${name}, ${state.name}`,
          })}</title>
          <meta
            name='description'
            content={metaDescription}
          />
          <meta property='og:title' content='Wilderlist' />
          <meta
            property='og:description'
            content={metaDescription}
          />
          <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + mountainDetailLink(id)} />
        </Helmet>
      ) : null;

      return (
        <>
          {metaData}
          <MountainNameHeader>
            {title}
            <div>
              {actionButton}
            </div>
          </MountainNameHeader>
          <Map
            id={id}
            coordinates={[{...mountain, completionDates}]}
            userId={userId}
            colorScaleColors={twoColorScale}
            colorScaleLabels={[
              getFluentString('global-text-value-not-done'),
              getFluentString('global-text-value-done'),
            ]}
            key={mountainDetailMapKey}
          />
          {description}
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
          <HorizontalContentItem>
            <ItemTitleShort>{getFluentString('mountain-detail-driving-distance-title')}:</ItemTitleShort>
            {drivingDistanceContent}
          </HorizontalContentItem>
          {regionsContent}
          <WeatherReport
            latitude={latitude}
            longitude={longitude}
          />
          <TripReports
            mountainId={id}
            mountainName={mountain.name}
            userId={userId}
          />
          {resourcesList}
          <LocalTrails
            mountainName={mountain.name}
            latitude={latitude}
            longitude={longitude}
            state={state.name}
          />
          <IncludedLists
            getFluentString={getFluentString}
            mountainId={id}
            mountainName={name}
            numLists={lists.length}
          />
          <ContentItem>
            <UserNote
              placeholder={notesPlaceholderText}
              defaultValue={defaultNoteText}
              onSave={saveNote}
              key={defaultNoteText}
            />
          </ContentItem>
          <AscentsList
            completedDates={completedDates}
            userId={userId}
            mountainId={id}
            mountainName={name}
            getFluentString={getFluentString}
          />
          {flagModal}
        </>
      );
    }
  } else {
    return null;
  }
};

export default MountainDetail;
