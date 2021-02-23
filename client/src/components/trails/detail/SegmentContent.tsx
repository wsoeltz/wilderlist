import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useBasicTrailDetail} from '../../../queries/trails/useBasicTrailDetail';
import {CoreItem, CoreItems} from '../../../types/itemTypes';
import AppearsIn from '../../sharedComponents/detailComponents/appearsIn';
import TripsNotesAndReports from '../../sharedComponents/detailComponents/TripsNotesAndReports';
import Weather from '../../sharedComponents/detailComponents/weather';
import RoutesAndDirections from './RoutesAndDirections';

interface Props {
  id: string;
}

const Content = (props: Props) => {
  const  {id} = props;
  const {data} = useBasicTrailDetail(id);

  const getString = useFluent();

  if (data && data.trail) {
    const {type, center, locationTextShort, line} = data.trail;
    const stateAbbr = locationTextShort && locationTextShort.length >= 2 ? locationTextShort.slice(0, 2) : null;
    const formattedType = upperFirst(getString('global-formatted-trail-type', {type}));
    const name = data.trail.name ? data.trail.name : formattedType;
    return (
      <>
        <Weather
          forecastTabs={[
            {title: getString('weather-forecast-weather-trail-center'), location: center},
          ]}
          snowReport={stateAbbr ? {location: center, stateAbbr} : undefined}
        />
        <RoutesAndDirections
          start={line[0]}
          center={center}
          end={line[line.length - 1]}
        />
        <TripsNotesAndReports
          id={id}
          name={name}
          item={CoreItem.trail}
        />
        <AppearsIn
          id={id}
          name={name}
          field={CoreItems.trails}
        />
      </>
    );
  }

  return null;
};

export default Content;
