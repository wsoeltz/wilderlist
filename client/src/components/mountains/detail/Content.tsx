import { MutationFunction } from '@apollo/client';
import { faCloudSun, faEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  BasicIconInText,
  DetailBox as DetailBoxBase,
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
import UserNote from '../../sharedComponents/UserNote';
import AscentsList from './AscentsList';
import IncludedLists from './IncludedLists';
import {
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';
import TripReports from './TripReports';
import SnowDepth from './weather/snowDepth';
import WeatherReport from './WeatherReport';

const InlineSectionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailBox = styled(DetailBoxBase)`
  margin-bottom: 2rem;
`;

const NotesTitle = styled(ItemTitle)`
  margin-bottom: 0.5rem;
`;

export interface MountainNoteSuccess {
  user: {
    id: User['id'];
    mountainNote: User['mountainNote'];
  };
}

export interface MountainNoteVariables {
  userId: string;
  mountainId: string;
  text: string;
}

interface Props {
  setOwnMetaData: boolean;
  user: null | {
    id: User['name'];
    mountains: User['mountains'];
    mountainNote: User['mountainNote'];
  };
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
  addMountainNote: MutationFunction<MountainNoteSuccess, MountainNoteVariables>;
  editMountainNote: MutationFunction<MountainNoteSuccess, MountainNoteVariables>;
}

const Content = (props: Props) => {
  const  {
    user, setOwnMetaData,
    mountain: {location, name, id, description, resources, state, lists},
    mountain, addMountainNote, editMountainNote,
  } = props;

  const getString = useFluent();

  const stateAbbreviation = state && state.abbreviation ? state.abbreviation : '';

  const [longitude, latitude] = location;

  const mountainNote = user && user.mountainNote ? user.mountainNote : null;
  const defaultNoteText = mountainNote && mountainNote.text ? mountainNote.text : '';
  const notesPlaceholderText = getString('user-notes-placeholder', {name});

  const saveNote = (text: string) => {
    if (user) {
      if (mountainNote === null) {
        addMountainNote({variables: {userId: user.id, mountainId: id, text}});
      } else {
        editMountainNote({variables: {userId: user.id, mountainId: id, text}});
      }
    }
  };

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
          <UserNote
            placeholder={notesPlaceholderText}
            defaultValue={defaultNoteText}
            onSave={saveNote}
            key={defaultNoteText}
          />
        </InlineSectionContainer>
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
