import { useMutation, useQuery } from '@apollo/react-hooks';
import { faAlignLeft, faEdit, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext, useState} from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
  FORMAT_STATE_REGION_FOR_TEXT,
} from '../../../contextProviders/getFluentLocalizationContext';
import usePrevious from '../../../hooks/usePrevious';
import { setPeakListOgImageUrl } from '../../../routing/routes';
import { listDetailLink, userProfileLink } from '../../../routing/Utils';
import {
  BasicIconInText,
  Block,
  ButtonPrimaryLink,
  DetailBox,
  DetailBoxTitle,
  lightBorderColor,
  LinkButton,
  PlaceholderText,
  PreFormattedDiv,
  PreFormattedParagraph,
  ResourceItem,
  ResourceList,
  SectionTitle,
} from '../../../styling/styleUtils';
import {
  Mountain,
  PeakList,
  PeakListVariants,
  State,
  User,
} from '../../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
  isValidURL,
} from '../../../Utils';
import { UserContext } from '../../App';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Map, {Props as MapProps} from '../../sharedComponents/map';
import {
  fiveColorScale,
  fiveSymbolScale,
  thirteenColorScale,
  thirteenSymbolScale,
  twoColorScale,
  twoSymbolScale,
} from '../../sharedComponents/map/colorScaleColors';
import MapZoomScrollText from '../../sharedComponents/map/MapZoomScrollText';
import MountainColorScale from '../../sharedComponents/map/MountainColorScale';
import Tooltip from '../../sharedComponents/Tooltip';
import UserNote from '../../sharedComponents/UserNote';
import { getType, isState } from '../Utils';
import getCompletionDates from './getCompletionDates';
import Header from './Header';
import IntroText from './IntroText';
import MountainTable, {topOfPageBuffer} from './MountainTable';

const peakListDetailMapKey = 'peakListDetailMapKey';
const localstorageShowMajorTrailsPeakListKey = 'localstorageShowMajorTrailsPeakListKey';
const localstorageShowCampsitesPeakListKey = 'localstorageShowCampsitesPeakListKey';
const localstorageShowYourLocationPeakListKey = 'localstorageShowYourLocationPeakListKey';
const localstorageShowNearbyMountainsPeakListKey = 'localstorageShowNearbyMountainsPeakListKey';

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

const ButtonPrimaryLinkSmall = styled(ButtonPrimaryLink)`
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
      description
      optionalPeaksDescription
      parent {
        id
        name
        type
      }
      children {
        id
        name
        type
      }
      siblings {
        id
        name
        type
      }
      author {
        id
      }
      resources {
        title
        url
      }
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
      optionalMountains {
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
      stateOrRegionString
    }
    user(id: $userId) {
      id
      name
      permissions
      peakListPermissions
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

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
  elevation: Mountain['elevation'];
  state: {
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null;
}

interface ListVariantDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  type: PeakList['type'];
}

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  description: PeakList['description'];
  optionalPeaksDescription: PeakList['optionalPeaksDescription'];
  resources: PeakList['resources'];
  mountains: MountainDatum[] | null;
  optionalMountains: MountainDatum[] | null;
  stateOrRegionString: PeakList['stateOrRegionString'];
  parent: null | ListVariantDatum;
  children: null | ListVariantDatum[];
  siblings: null | ListVariantDatum[];
  author: null | { id: User['id'] };
}

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  peakLists: Array<{
    id: PeakList['id'];
  }>;
  mountains: User['mountains'];
  peakListPermissions?: User['peakListPermissions'];
  permissions: User['permissions'];
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

export const getColorScale = (type: PeakListVariants, getFluentString: GetString) => {
  let colorScaleTitle: string | undefined;
  let colorScaleColors: string[];
  let colorScaleSymbols: string[];
  let colorScaleLabels: string[];
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    colorScaleTitle = getFluentString('map-mountains-colored');
    colorScaleColors = twoColorScale;
    colorScaleSymbols = twoSymbolScale;
    colorScaleLabels = [
      getFluentString('global-text-value-not-done'),
      getFluentString('global-text-value-done'),
    ];
  } else if (type === PeakListVariants.fourSeason) {
    colorScaleTitle = getFluentString('map-number-of-seasons');
    colorScaleColors = fiveColorScale;
    colorScaleSymbols = fiveSymbolScale;
    colorScaleLabels = [
      getFluentString('map-no-seasons'),
      getFluentString('map-all-seasons'),
    ];
  } else if (type === PeakListVariants.grid) {
    colorScaleTitle = getFluentString('map-number-of-months');
    colorScaleColors = thirteenColorScale;
    colorScaleSymbols = thirteenSymbolScale;
    colorScaleLabels = [
      getFluentString('map-no-months'),
      getFluentString('map-all-months'),
    ];
  } else {
    colorScaleTitle = undefined;
    colorScaleColors = [];
    colorScaleSymbols = [];
    colorScaleLabels = [];
    failIfValidOrNonExhaustive(type, 'Invalid peak list type ' + type);
  }
  return {
    colorScaleTitle,
    colorScaleColors,
    colorScaleSymbols,
    colorScaleLabels,
  };
};

interface Props {
  userId: string | null;
  id: string;
  mountainId: string | undefined;
  queryRefetchArray?: Array<{query: any, variables: any}>;
  setOwnMetaData?: boolean;
}

const PeakListDetail = (props: Props) => {
  const { userId, id, mountainId, queryRefetchArray, setOwnMetaData } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const me = useContext(UserContext);
  const isOtherUser = (me && userId) && (me._id !== userId) ? true : false;

  const localstorageMajorTrailsVal = localStorage.getItem(localstorageShowMajorTrailsPeakListKey);
  const localstorageCampsitesVal = localStorage.getItem(localstorageShowCampsitesPeakListKey);
  const localstorageYourLocationVal = localStorage.getItem(localstorageShowYourLocationPeakListKey);
  const localstorageOtherMountainsVal = localStorage.getItem(localstorageShowNearbyMountainsPeakListKey);
  const defaultMajorTrails = localstorageMajorTrailsVal === 'true' ? true : false;
  const defaultCampsites = localstorageCampsitesVal === 'true' ? true : false;
  const defaultYourLocation = localstorageYourLocationVal === 'true' ? true : false;
  const defaultOtherMountainsOn = localstorageOtherMountainsVal === 'true' ? true : false;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST, {
    variables: { id, userId },
  });

  const prevData = usePrevious(data);

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const [addPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(ADD_PEAKLIST_NOTE);
  const [editPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(EDIT_PEAKLIST_NOTE);

  let header: React.ReactElement<any> | null;
  let body: React.ReactElement<any> | null;
  let mapProps: MapProps = {
    mountainId: mountainId ? mountainId : null,
    peakListId: id,
    userId: me && me._id ? me._id : null,
    isOtherUser,
    otherUserId: isOtherUser && userId ? userId : undefined,
    completedAscents: [],
    coordinates: [],
    colorScaleColors: [],
    colorScaleSymbols: [],
    showNearbyTrails: true,
    showYourLocation: true,
    showOtherMountains: true,
    showCampsites: true,
    defaultLocationOn: defaultYourLocation,
    defaultMajorTrailsOn: defaultMajorTrails,
    defaultCampsitesOn: defaultCampsites,
    defaultOtherMountainsOn,
  };
  if (loading === true) {
    header = <LoadingSpinner />;
    body = null;
    if (prevData && prevData.peakList && prevData.user) {
      const {user, peakList} = prevData;
      const userMountains = (user && user.mountains) ? user.mountains : [];
      const {
        type,
      } = peakList;
      const requiredMountains: MountainDatum[] =
        peakList && peakList.mountains ? peakList.mountains : [];
      const optionalMountains: MountainDatum[] =
        peakList && peakList.optionalMountains ? peakList.optionalMountains : [];

      const requiredMountainsWithDates = requiredMountains.map(mountain => {
        const completionDates = getCompletionDates({type, mountain, userMountains});
        return {...mountain, completionDates};
      });

      const optionalMountainsWithDates = optionalMountains.map(mountain => {
        const completionDates = getCompletionDates({type, mountain, userMountains});
        return {...mountain, completionDates};
      });

      const {
        colorScaleColors, colorScaleSymbols,
      } = getColorScale(type, getFluentString);

      const allMountainsWithDates = [...requiredMountainsWithDates, ...optionalMountainsWithDates];
      mapProps = {
        mountainId: mountainId ? mountainId : null,
        peakListId: id,
        coordinates: allMountainsWithDates,
        highlighted: [],
        completedAscents: userMountains,
        userId: me && me._id ? me._id : null,
        isOtherUser,
        otherUserId: isOtherUser && userId ? userId : undefined,
        colorScaleColors,
        colorScaleSymbols,
        showNearbyTrails: true,
        showYourLocation: true,
        showOtherMountains: true,
        showCampsites: true,
        defaultLocationOn: defaultYourLocation,
        defaultMajorTrailsOn: defaultMajorTrails,
        defaultCampsitesOn: defaultCampsites,
        defaultOtherMountainsOn,
      };
    }
  } else if (error !== undefined) {
    console.error(error);
    header =  (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
  } else if (data !== undefined) {
    const { peakList, user } = data;
    if (!peakList) {
      return (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        type, description, optionalPeaksDescription, resources, parent,
        stateOrRegionString,
      } = peakList;
      const requiredMountains: MountainDatum[] = peakList.mountains ? peakList.mountains : [];
      const optionalMountains: MountainDatum[] = peakList.optionalMountains ? peakList.optionalMountains : [];

      let paragraphText: React.ReactElement<any>;
      if (description && description.length) {
        paragraphText = <p>{description}</p>;
      } else if (requiredMountains && requiredMountains.length) {
        const isStateOrRegion = isState(stateOrRegionString) === true ? 'state' : 'region';
        const mountainsSortedByElevation = sortBy(requiredMountains, ['elevation']).reverse();
        paragraphText = (
          <IntroText
            getFluentString={getFluentString}
            listName={peakList.name}
            numberOfPeaks={requiredMountains.length}
            isStateOrRegion={isStateOrRegion}
            stateRegionName={FORMAT_STATE_REGION_FOR_TEXT(stateOrRegionString)}
            highestMountain={mountainsSortedByElevation[0]}
            smallestMountain={mountainsSortedByElevation[mountainsSortedByElevation.length - 1]}
            type={type}
            parent={parent}
            shortName={peakList.shortName}
          />
        );
      } else {
        paragraphText = (
          <p>
            {getFluentString('peak-list-detail-list-overview-empty', {'list-name': peakList.name})}
          </p>
        );
      }

      let resourcesList: React.ReactElement<any> | null;
      if (resources && resources.length) {
        const resourcesArray: Array<React.ReactElement<any>> = [];
        resources.forEach(resource => {
          if (resource.title.length && resource.url.length && isValidURL(resource.url)) {
            resourcesArray.push(
              <ResourceItem key={resource.url + resource.title}>
                <a href={resource.url} target='_blank' rel='noopener noreferrer'>{resource.title}</a>
              </ResourceItem>,
            );
          }
        });
        if (id === '5d8952e6d9d8254dd40b7627' && isOtherUser === false) { // id for the NH48
          resourcesArray.push(
            <ResourceItem
              key={'grid-trigger-modal-for-exports'}
              onClick={() => setIsExportModalOpen(true)}
            >
              <LinkButton>{getFluentString('peak-list-export-grid-special-link')}</LinkButton>
            </ResourceItem>,
          );
        }
        resourcesList = resourcesArray.length ? (
          <>
            <SectionTitle>
              {getFluentString('global-text-value-external-resources')}
            </SectionTitle>
            <ResourceList>
              {resourcesArray}
            </ResourceList>
          </>
        ) : null;
      } else {
        resourcesList = null;
      }

      const {
        colorScaleTitle, colorScaleColors, colorScaleSymbols, colorScaleLabels,
      } = getColorScale(type, getFluentString);

      const userMountains = (user && user.mountains) ? user.mountains : [];

      const requiredMountainsWithDates = requiredMountains.map(mountain => {
        const completionDates = getCompletionDates({type, mountain, userMountains});
        return {...mountain, completionDates};
      });

      const optionalMountainsWithDates = optionalMountains.map(mountain => {
        const completionDates = getCompletionDates({type, mountain, userMountains});
        return {...mountain, completionDates};
      });

      const allMountainsWithDates = [...requiredMountainsWithDates, ...optionalMountainsWithDates];

      const activeMountain = allMountainsWithDates.find(mtn => mtn.id === mountainId);
      const highlightedMountain = activeMountain ? [activeMountain] : undefined;

      const friendHeader = isOtherUser === true && user !== null ? (
         <FriendHeader>
          <Text>
            {getFluentString('peak-list-detail-friend-viewing-list')}
            {' '}
            <Link to={userProfileLink(user.id)}>{user.name}</Link>
          </Text>
          <ButtonPrimaryLinkSmall to={listDetailLink(peakList.id)}>
            {getFluentString('peak-list-detail-friend-view-your-progress-button')}
          </ButtonPrimaryLinkSmall>
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

      const optionalMountainsText = optionalPeaksDescription && optionalPeaksDescription.length
        ? optionalPeaksDescription : getFluentString('peak-list-detail-text-optional-mountains-desc');

      const optionalMountainsTable = optionalMountainsWithDates.length > 0 ? (
        <>
          <h2>{getFluentString('peak-list-detail-text-optional-mountains')}</h2>
          <PreFormattedParagraph>{optionalMountainsText}</PreFormattedParagraph>
          <MountainTable
            user={user}
            mountains={optionalMountainsWithDates}
            type={type}
            peakListId={peakList.id}
            peakListShortName={peakList.shortName}
            isOtherUser={isOtherUser}
            showImportExport={false}
            isExportModalOpen={isExportModalOpen}
            setIsExportModalOpen={setIsExportModalOpen}
          />
        </>
      ) : null;

      let title: string;
      if (isOtherUser === true && user !== null) {
        title = user.name + ' | ' + peakList.name;
      } else if (activeMountain !== undefined) {
        title = peakList.name + ' | ' + activeMountain.name;
      } else {
        title = peakList.name;
      }

      let areaText: string;
      if (stateOrRegionString === 'Across the US') {
        areaText = ' across the US';
      } else if (stateOrRegionString) {
        areaText = ' throughout ' + stateOrRegionString;
      } else {
        areaText = '';
      }

      const metaDescription = getFluentString('meta-data-peak-list-detail-description', {
        'list-name': peakList && peakList.name ? peakList.name : '',
        'type': peakList.type,
        'num-mountains': peakList && peakList.mountains ? peakList.mountains.length : 0,
        'list-short-name': peakList && peakList.shortName ? peakList.shortName : '',
        'state-or-region-string': areaText,
      });

      const metaData = setOwnMetaData === true ? (
        <Helmet>
          <title>{getFluentString('meta-data-detail-default-title', {
            title, type: peakList.type,
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
          <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + listDetailLink(id)} />
          <meta property='og:image' content={setPeakListOgImageUrl(id)} />
        </Helmet>
      ) : null;

      mapProps = {
        mountainId: mountainId ? mountainId : null,
        peakListId: peakList.id,
        coordinates: allMountainsWithDates,
        highlighted: highlightedMountain,
        completedAscents: userMountains,
        userId: me && me._id ? me._id : null,
        isOtherUser,
        otherUserId: isOtherUser && userId ? userId : undefined,
        colorScaleColors,
        colorScaleSymbols,
        showNearbyTrails: true,
        showYourLocation: true,
        showOtherMountains: true,
        showCampsites: true,
        defaultLocationOn: defaultYourLocation,
        defaultMajorTrailsOn: defaultMajorTrails,
        defaultCampsitesOn: defaultCampsites,
        defaultOtherMountainsOn,
      };

      header = (
        <>
          {metaData}
          {friendHeader}
          <Header
            user={user}
            mountains={requiredMountains}
            peakList={peakList}
            completedAscents={userMountains}
            isOtherUser={isOtherUser}
            queryRefetchArray={queryRefetchArray}
          />
          <DetailBoxTitle>
            <BasicIconInText icon={faMapMarkedAlt} />
            {getFluentString('map-list-title', {'short-name': peakList.name})}
            <MapZoomScrollText />
          </DetailBoxTitle>
          <MountainColorScale
              colorScaleColors={colorScaleColors}
              colorScaleSymbols={colorScaleSymbols}
              colorScaleLabels={colorScaleLabels}
              colorScaleTitle={colorScaleTitle}
          />
        </>
      );

      body = (
        <>
          <Block>
            <DetailBoxTitle>
              <BasicIconInText icon={faAlignLeft} />
              {getFluentString('global-text-value-description')}
            </DetailBoxTitle>
            <DetailBox>
              <PreFormattedDiv>
                {paragraphText}
              </PreFormattedDiv>
              {resourcesList}
            </DetailBox>
          </Block>
          <DetailBoxTitle>
            <BasicIconInText icon={faEdit} />
            {getFluentString('user-notes-title')}
            <small style={{marginLeft: '0.4rem'}}>({getFluentString('global-text-value-private')})</small>
            <Tooltip
              explanation={getFluentString('user-notes-tooltip')}
            />
          </DetailBoxTitle>
          <DetailBox>
            <UserNote
              placeholder={notesPlaceholderText}
              defaultValue={defaultNoteText}
              onSave={saveNote}
              key={defaultNoteText}
            />
          </DetailBox>
          <MountainTable
            user={user}
            mountains={requiredMountainsWithDates}
            type={type}
            peakListId={peakList.id}
            peakListShortName={peakList.shortName}
            isOtherUser={isOtherUser}
            showImportExport={true}
            queryRefetchArray={queryRefetchArray}
            isExportModalOpen={isExportModalOpen}
            setIsExportModalOpen={setIsExportModalOpen}
          />
          {optionalMountainsTable}
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
      <div style={{visibility: loading ? 'hidden' : undefined}}>
        <Map
          {...mapProps}
          localstorageKeys={{
            majorTrail: localstorageShowMajorTrailsPeakListKey,
            campsites: localstorageShowCampsitesPeakListKey,
            yourLocation: localstorageShowYourLocationPeakListKey,
            otherMountains: localstorageShowNearbyMountainsPeakListKey,
          }}
          key={peakListDetailMapKey}
        />
      </div>
      {body}
    </>
  );

};

export default PeakListDetail;