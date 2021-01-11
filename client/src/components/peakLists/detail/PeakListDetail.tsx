import { faAlignLeft, faEdit, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import sortBy from 'lodash/sortBy';
import React, {useCallback, useEffect, useState} from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FORMAT_STATE_REGION_FOR_TEXT,
} from '../../../contextProviders/getFluentLocalizationContext';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import {
  useAddPeakListNote,
  useEditPeakListNote,
} from '../../../queries/lists/peakListNotes';
import {
  MountainDatum,
  usePeakListDetail,
} from '../../../queries/lists/usePeakListDetail';
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
  PeakListVariants,
} from '../../../types/graphQLTypes';
import { getType, isState } from '../../../utilities/dateUtils';
import {
  isValidURL,
} from '../../../Utils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import Tooltip from '../../sharedComponents/Tooltip';
import UserNote from '../../sharedComponents/UserNote';
import getCompletionDates from './getCompletionDates';
import Header from './Header';
import IntroText from './IntroText';
import MountainTable, {topOfPageBuffer} from './MountainTable';

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

interface Props {
  userId: string | null;
  id: string;
  setOwnMetaData?: boolean;
}

const PeakListDetail = (props: Props) => {
  const { userId, id, setOwnMetaData } = props;

  const getString = useFluent();
  const mapContext = useMapContext();

  const me = useCurrentUser();
  const isOtherUser = (me && userId) && (me._id !== userId) ? true : false;

  const {loading, error, data} = usePeakListDetail(id, userId);

  useEffect(() => {
    if (mapContext.intialized && data && data.peakList && data.peakList.bbox) {
      mapContext.setNewBounds(data.peakList.bbox);
    }
  }, [mapContext, data]);

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const openExportModal = useCallback(() => setIsExportModalOpen(true), []);

  const addPeakListNote = useAddPeakListNote();
  const editPeakListNote = useEditPeakListNote();

  let header: React.ReactElement<any> | null;
  let body: React.ReactElement<any> | null;
  if (loading === true) {
    header = <LoadingSpinner />;
    body = null;
  } else if (error !== undefined) {
    console.error(error);
    header =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
  } else if (data !== undefined) {
    const { peakList, user } = data;
    if (!peakList) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
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
            {getString('peak-list-detail-list-overview-empty', {'list-name': peakList.name})}
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
              onClick={openExportModal}
            >
              <LinkButton>{getString('peak-list-export-grid-special-link')}</LinkButton>
            </ResourceItem>,
          );
        }
        resourcesList = resourcesArray.length ? (
          <>
            <SectionTitle>
              {getString('global-text-value-external-resources')}
            </SectionTitle>
            <ResourceList>
              {resourcesArray}
            </ResourceList>
          </>
        ) : null;
      } else {
        resourcesList = null;
      }

      const userMountains = (user && user.mountains) ? user.mountains : [];

      const requiredMountainsWithDates = requiredMountains.map(mountain => {
        const completionDates = getCompletionDates({type, mountain, userMountains});
        return {...mountain, completionDates};
      });

      const optionalMountainsWithDates = optionalMountains.map(mountain => {
        const completionDates = getCompletionDates({type, mountain, userMountains});
        return {...mountain, completionDates};
      });

      const friendHeader = isOtherUser === true && user !== null ? (
         <FriendHeader>
          <Text>
            {getString('peak-list-detail-friend-viewing-list')}
            {' '}
            <Link to={userProfileLink(user.id)}>{user.name}</Link>
          </Text>
          <ButtonPrimaryLinkSmall to={listDetailLink(peakList.id)}>
            {getString('peak-list-detail-friend-view-your-progress-button')}
          </ButtonPrimaryLinkSmall>
         </FriendHeader>
       ) : null;

      const peakListNote = user && user.peakListNote ? user.peakListNote : null;
      const defaultNoteText = peakListNote && peakListNote.text ? peakListNote.text : '';
      const notesPlaceholderText = getString('user-notes-placeholder', {
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
        ? optionalPeaksDescription : getString('peak-list-detail-text-optional-mountains-desc');

      const optionalMountainsTable = optionalMountainsWithDates.length > 0 ? (
        <>
          <h2>{getString('peak-list-detail-text-optional-mountains')}</h2>
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

      const metaDescription = getString('meta-data-peak-list-detail-description', {
        'list-name': peakList && peakList.name ? peakList.name : '',
        'type': peakList.type,
        'num-mountains': peakList && peakList.mountains ? peakList.mountains.length : 0,
        'list-short-name': peakList && peakList.shortName ? peakList.shortName : '',
        'state-or-region-string': areaText,
      });

      const metaData = setOwnMetaData === true ? (
        <Helmet>
          <title>{getString('meta-data-detail-default-title', {
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

      const mountainsForMap = [...requiredMountainsWithDates, ...optionalMountainsWithDates].map(mtn => {
        let ascentCount: number;
        if (!mtn.completionDates) {
          ascentCount = 0;
        } else if (mtn.completionDates.type === PeakListVariants.standard && mtn.completionDates.standard) {
          ascentCount = 1;
        }  else if (mtn.completionDates.type === PeakListVariants.winter && mtn.completionDates.winter) {
          ascentCount = 1;
        } else if (mtn.completionDates.type === PeakListVariants.fourSeason ||
                   mtn.completionDates.type === PeakListVariants.grid) {
          ascentCount = 0;
          for (const key in mtn.completionDates) {
            if (mtn.completionDates.hasOwnProperty(key) && key !== 'type' &&
                // @ts-expect-error: This will always be a key of mtn.completionDates
                (mtn.completionDates[key] as any) !== undefined) {
              ascentCount++;
            }
          }
        } else {
          ascentCount = 0;
        }
        return {...mtn, ascentCount};
      });

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
          />
          <DetailBoxTitle>
            <BasicIconInText icon={faMapMarkedAlt} />
            {getString('map-list-title', {'short-name': peakList.name})}
          </DetailBoxTitle>
        </>
      );

      body = (
        <>
          <Block>
            <DetailBoxTitle>
              <BasicIconInText icon={faAlignLeft} />
              {getString('global-text-value-description')}
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
            {getString('user-notes-title')}
            <small style={{marginLeft: '0.4rem'}}>({getString('global-text-value-private')})</small>
            <Tooltip
              explanation={getString('user-notes-tooltip')}
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
            isExportModalOpen={isExportModalOpen}
            setIsExportModalOpen={setIsExportModalOpen}
          />
          {optionalMountainsTable}
          <MapRenderProp
            id={id}
            mountains={mountainsForMap}
            bbox={peakList.bbox}
            type={type}
          />
        </>
      );
    }
  } else {
    header = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
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

export default PeakListDetail;
