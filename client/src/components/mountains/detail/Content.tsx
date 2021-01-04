import { faCloudSun, faEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  DetailBox,
  InlineSectionContainer,
  NotesTitle,
  VerticalContentItem,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  DetailBoxTitle,
  PreFormattedParagraph,
  ResourceItem,
  ResourceList,
} from '../../../styling/styleUtils';
import {
  Mountain,
  PeakList,
  State,
  User,
} from '../../../types/graphQLTypes';
import {
  isValidURL,
} from '../../../Utils';
import Tooltip from '../../sharedComponents/Tooltip';
import AscentsList from './AscentsList';
import IncludedLists from './IncludedLists';
import MountainNote from './MountainNote';
import TripReports from './TripReports';
import SnowDepth from './weather/snowDepth';
import WeatherReport from './WeatherReport';

interface Props {
  setOwnMetaData: boolean;
  mountain: {
    id: Mountain['name'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
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
}

const Content = (props: Props) => {
  const  {
    setOwnMetaData, mountain: {location, name, id, description, resources, state, lists},
    mountain,
  } = props;

  const getString = useFluent();

  const stateAbbreviation = state && state.abbreviation ? state.abbreviation : '';

  const [longitude, latitude] = location;

  const descriptionEl = description && description.length ? (
    <div>
      <PreFormattedParagraph>
        {description}
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
            {getString('global-text-value-external-resources')}
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

  return (
    <>
      {descriptionEl}
      <DetailBoxTitle>
        <BasicIconInText icon={faCloudSun} />
        {getString('mountain-detail-weather-and-reports')}
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
            stateAbbr={stateAbbreviation}
          />
        </InlineSectionContainer>
        <TripReports
          mountainId={id}
          mountainName={name}
        />
      </DetailBox>
      <DetailBoxTitle>
        <BasicIconInText icon={faEdit} />
        {getString('mountain-detail-notes-and-ascents')}
      </DetailBoxTitle>
      <DetailBox>
        <InlineSectionContainer>
          <NotesTitle>
            {getString('user-notes-title')}
            <small style={{marginLeft: '0.4rem'}}>({getString('global-text-value-private')})</small>
            <Tooltip
              explanation={getString('user-notes-tooltip')}
            />
          </NotesTitle>
        </InlineSectionContainer>
        <MountainNote
          mountainId={mountain.id}
        />
        <AscentsList
          mountain={mountain}
        />
      </DetailBox>
      {resourcesList}
      <IncludedLists
        mountainDatum={mountain}
        numLists={lists.length}
        setMetaDescription={setOwnMetaData}
      />
    </>
  );
};

export default Content;
