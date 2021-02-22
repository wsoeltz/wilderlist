import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useBasicCampsiteDetails} from '../../../queries/campsites/useBasicCampsiteDetails';
import {CoreItem, CoreItems} from '../../../types/itemTypes';
import AppearsIn from '../../sharedComponents/detailComponents/appearsIn';
import TripsNotesAndReports from '../../sharedComponents/detailComponents/TripsNotesAndReports';
import Weather from '../../sharedComponents/detailComponents/weather';

interface Props {
  id: string;
}

const Content = (props: Props) => {
  const  {id} = props;
  const {loading, error, data} = useBasicCampsiteDetails(id);

  const getString = useFluent();

  if (loading) {
    return null;
  } else if (error !== undefined) {
    return <p>{error.message}</p>;
  } else if (data !== undefined && data.campsite) {
    const {campsite} = data;
    const {locationTextShort, location} = campsite;
    const formattedType = upperFirst(getString('global-formatted-campsite-type', {type: campsite.type}));
    const name = campsite.name ? campsite.name : formattedType;
    return (
      <>
        <Weather
          forecastTabs={[
            {title: getString('weather-forecast-weather'), location},
          ]}
          snowReport={{location, stateAbbr: locationTextShort}}
        />
        <TripsNotesAndReports
          id={campsite.id}
          name={name}
          item={CoreItem.campsite}
        />
        <AppearsIn
          id={campsite.id}
          name={name}
          field={CoreItems.campsites}
        />
      </>
    );
  } else {
    return null;
  }
};

export default Content;
