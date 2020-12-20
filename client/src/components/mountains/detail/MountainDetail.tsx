import { gql, useMutation, useQuery } from '@apollo/client';
import { faCloudSun, faEdit, faFlag, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import React, { useContext, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { CaltopoLink, GoogleMapsLink } from '../../../routing/externalLinks';
import { setMountainOgImageUrl } from '../../../routing/routes';
import { editMountainLink, mountainDetailLink } from '../../../routing/Utils';
import {
  BasicIconInText,
  CompactGhostButton,
  CompactGhostButtonLink,
  DetailBox as DetailBoxBase,
  DetailBoxFooter,
  DetailBoxTitle,
  InlineTitle,
  lowWarningColorDark,
  placeholderColor,
  PlaceholderText,
  PreFormattedParagraph,
  ResourceItem,
  ResourceList,
} from '../../../styling/styleUtils';
import {
  CreatedItemStatus,
  Mountain,
  PeakList,
  PermissionTypes,
  State,
  User,
} from '../../../types/graphQLTypes';
import checkForMountainDataIssues from '../../../utilities/checkForMountainDataIssues';
import {
  convertDMS,
  isValidURL,
} from '../../../Utils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Tooltip from '../../sharedComponents/Tooltip';
import UserNote from '../../sharedComponents/UserNote';
import AscentsList from './AscentsList';
import FlagModal from './FlagModal';
import IncludedLists from './IncludedLists';
import LocalTrails from './LocalTrails';
import {
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';
import TripReports from './TripReports';
import SnowDepth from './weather/snowDepth';
import WeatherReport from './WeatherReport';

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

const Details = styled.h2`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 400;
`;

const smallScreenSize = 380; // in px

const ExternalMapsButtons = styled.div`
  margin-left: 1rem;

  @media(max-width: ${smallScreenSize}px) {
    display: flex;
    flex-direction: column;
  }
`;

const Divider = styled.div`
  display: inline-block;
  height: 1rem;
  width: 1px;
  background-color: ${placeholderColor};
  margin: 0 0.4rem;

  @media(max-width: ${smallScreenSize}px) {
    display: none;
  }
`;

const LocationBox = styled(DetailBoxFooter)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-bottom: 2rem;
`;

const LatLong = styled.div`
  white-space: nowrap;
  flex-shrink: 0;
`;

const InlineSectionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailBox = styled(DetailBoxBase)`
  margin-bottom: 2rem;
`;

const NotesTitle = styled(ItemTitle)`
  margin-bottom: 0.5rem;
`;

const GET_MOUNTAIN_DETAIL = gql`
  query getMountain($id: ID, $userId: ID) {
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
        abbreviation
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
  mountain: null | {
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
      abbreviation: State['abbreviation'];
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
  id: string | null;
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

interface Props {
  userId: string | null;
  id: string | null;
  setOwnMetaData?: boolean;
  peakListId: string | null;
  otherUserId?: string;
}

const MountainDetail = (props: Props) => {
  const { userId, id, setOwnMetaData} = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_DETAIL, {
    variables: { id, userId },
  });

  useEffect(() => {
    if (data && data.mountain) {
      checkForMountainDataIssues(data.mountain);
    }
  }, [data]);

  const [addMountainNote] = useMutation<MountainNoteSuccess, MountainNoteVariables>(ADD_MOUNTAIN_NOTE);
  const [editMountainNote] = useMutation<MountainNoteSuccess, MountainNoteVariables>(EDIT_MOUNTAIN_NOTE);

  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
  const closeFlagModal = () => setIsFlagModalOpen(false);

  let header: React.ReactElement<any> | null;
  let body: React.ReactElement<any> | null;
  if (id === null) {
    header = null;
    body = null;
  } else if (loading === true) {
    header = <LoadingSpinner />;
    body = null;
  } else if (error !== undefined) {
    console.error(error);
    header =  (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
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

      const {lat, long} = convertDMS(latitude, longitude);

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
          <CompactGhostButtonLink to={editMountainLink(mountain.id)}>
            {getFluentString('global-text-value-edit')}
          </CompactGhostButtonLink>
        ) : (
          <CompactGhostButton onClick={() => setIsFlagModalOpen(true)}>
            <BasicIconInText icon={faFlag} />
            {getFluentString('global-text-value-flag')}
          </CompactGhostButton>
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
        <div>
          <PreFormattedParagraph>
            {mountain.description}
          </PreFormattedParagraph>
        </div>
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
            <VerticalContentItem>
              <NotesTitle>
                {getFluentString('global-text-value-external-resources')}
              </NotesTitle>
              <ResourceList>
                {resourcesArray}
              </ResourceList>
            </VerticalContentItem>
          </>
        ) : null;
      } else {
        resourcesList = null;
      }

      const metaDescription = getFluentString('meta-data-mountain-detail-description', {
        name, elevation, state: state && state.abbreviation ? ', ' + state.abbreviation : '',
        additionaltext: '',
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
          <meta property='og:image' content={setMountainOgImageUrl(id)} />
        </Helmet>
      ) : null;

      header = (
        <>
          {metaData}
          <MountainNameHeader>
            {title}
            <div>
              {actionButton}
            </div>
          </MountainNameHeader>
          <Details>
            <span>{state.name}</span>
            <span>{elevation}ft</span>
          </Details>
          <DetailBoxTitle>
            <BasicIconInText icon={faMapMarkedAlt} />
            {getFluentString('map-mountain-title')}
          </DetailBoxTitle>
        </>
      );

      body = (
        <>
          <LocationBox>
            <LatLong>
              {getFluentString('global-text-value-location')}:{' '}
              <strong>{lat}</strong>, <strong>{long}</strong>
            </LatLong>
            <ExternalMapsButtons>
              <GoogleMapsLink lat={latitude} long={longitude} />
              <Divider />
              <CaltopoLink lat={latitude} long={longitude} />
            </ExternalMapsButtons>
          </LocationBox>
          {description}
          <DetailBoxTitle>
            <BasicIconInText icon={faCloudSun} />
            {getFluentString('mountain-detail-weather-and-reports')}
          </DetailBoxTitle>
          <DetailBox>
            <InlineSectionContainer>
              <WeatherReport
                latitude={latitude}
                longitude={longitude}
              />
            </InlineSectionContainer>
            <InlineSectionContainer>
              <SnowDepth
                latitude={latitude}
                longitude={longitude}
                stateAbbr={state.abbreviation}
              />
            </InlineSectionContainer>
            <TripReports
              mountainId={id}
              mountainName={mountain.name}
              userId={userId}
            />
          </DetailBox>
          <DetailBoxTitle>
            <BasicIconInText icon={faEdit} />
            {getFluentString('mountain-detail-notes-and-ascents')}
          </DetailBoxTitle>
          <DetailBox>
            <InlineSectionContainer>
              <NotesTitle>
                {getFluentString('user-notes-title')}
                <small style={{marginLeft: '0.4rem'}}>({getFluentString('global-text-value-private')})</small>
                <Tooltip
                  explanation={getFluentString('user-notes-tooltip')}
                />
              </NotesTitle>
              <UserNote
                placeholder={notesPlaceholderText}
                defaultValue={defaultNoteText}
                onSave={saveNote}
                key={defaultNoteText}
              />
            </InlineSectionContainer>
            <AscentsList
              completedDates={completedDates}
              userId={userId}
              mountain={mountain}
              getFluentString={getFluentString}
            />
          </DetailBox>
          <InlineTitle>{getFluentString('global-text-value-additional-resources')}</InlineTitle>
          {resourcesList}
          <LocalTrails
            mountainName={mountain.name}
            latitude={latitude}
            longitude={longitude}
            state={state.name}
          />
          <IncludedLists
            getFluentString={getFluentString}
            mountainDatum={mountain}
            numLists={lists.length}
            setMetaDescription={setOwnMetaData === true ? true : false}
          />
          {flagModal}
        </>
      );
    }
  } else {
    header = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
  }

  return (
    <>
      {header}
      {body}
    </>
  );
};

export default MountainDetail;
