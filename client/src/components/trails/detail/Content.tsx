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
  PeakListVariants,
  Trail,
} from '../../../types/graphQLTypes';
import WeatherReport from '../../mountains/detail/WeatherReport';
import MapRenderProp from '../../sharedComponents/MapRenderProp';

interface Props {
  trail: {
    id: Trail['id'];
    name: Trail['name'];
    type: Trail['type'];
    center: Trail['center'];
    line: Trail['line'];
  };
}

const Content = (props: Props) => {
  const  {
    trail: {center},
    trail,
  } = props;

  const getString = useFluent();

  const [longitude, latitude] = center;

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
        id={trail.id}
        type={PeakListVariants.standard}
        center={center}
      />
    </>
  );
};

export default Content;
