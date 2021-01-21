import { faCloudSun } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  DetailBox,
  InlineSectionContainer,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  DetailBoxTitle,
} from '../../../styling/styleUtils';
import {
  Mountain,
  PeakList,
  State,
  User,
} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import TripsNotesAndReports from '../../sharedComponents/detailComponents/TripsNotesAndReports';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import IncludedLists from './IncludedLists';
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
    setOwnMetaData, mountain: {location, name, id, state, lists},
    mountain,
  } = props;

  const getString = useFluent();

  const stateAbbreviation = state && state.abbreviation ? state.abbreviation : '';

  const [longitude, latitude] = location;

  return (
    <>
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
      <TripsNotesAndReports
        id={id}
        name={name}
        item={CoreItem.mountain}
      />
      <IncludedLists
        mountainDatum={mountain}
        numLists={lists.length}
        setMetaDescription={setOwnMetaData}
      />
      <MapRenderProp
        id={mountain.id}
        mountains={[mountain]}
        center={mountain.location}
      />
    </>
  );
};

export default Content;
