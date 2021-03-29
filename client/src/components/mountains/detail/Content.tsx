import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useBasicMountainDetails} from '../../../queries/mountains/useBasicMountainDetails';
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
  const {loading, error, data} = useBasicMountainDetails(id);

  const getString = useFluent();

  if (loading) {
    return null;
  } else if (error !== undefined) {
    return <p>{error.message}</p>;
  } else if (data !== undefined && data.mountain) {
    const {mountain} = data;
    const {name, locationTextShort, location} = mountain;
    return (
      <>
        <Weather
          forecastTabs={[
            {title: getString('weather-forecast-summit-weather'), location},
            {title: getString('weather-forecast-valley-weather'), location, valley: true},
          ]}
          snowReport={locationTextShort ? {location, stateAbbr: locationTextShort} : undefined}
        />
        <RoutesAndDirections
          id={id}
          location={location}
        />
        <TripsNotesAndReports
          id={id}
          name={name}
          item={CoreItem.mountain}
        />
        <AppearsIn
          id={id}
          name={name}
          field={CoreItems.mountains}
        />
      </>
    );
  } else {
    return null;
  }
};

export default Content;
