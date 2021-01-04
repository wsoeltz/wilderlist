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
  Campsite,
  PeakListVariants,
} from '../../../types/graphQLTypes';
import WeatherReport from '../../mountains/detail/WeatherReport';
import MapRenderProp from '../../sharedComponents/MapRenderProp';

interface Props {
  campsite: {
    id: Campsite['id'];
    name: Campsite['name'];
    type: Campsite['type'];
    location: Campsite['location'];
  };
}

const Content = (props: Props) => {
  const  {
    campsite: {location},
    campsite,
  } = props;

  const getString = useFluent();

  const [longitude, latitude] = location;

  return (
    <>
      <DetailBoxTitle>
        <BasicIconInText icon={faCloudSun} />
        {getString('weather-forecast-weather')}
      </DetailBoxTitle>
      <DetailBox>
        <InlineSectionContainer>
          <WeatherReport
            latitude={latitude}
            longitude={longitude}
          />
        </InlineSectionContainer>
      </DetailBox>
      <MapRenderProp
        id={campsite.id}
        type={PeakListVariants.standard}
        campsites={[{...campsite, campedCount: 0}]}
        center={location}
      />
    </>
  );
};

export default Content;
