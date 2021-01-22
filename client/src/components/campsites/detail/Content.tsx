import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  Campsite,
} from '../../../types/graphQLTypes';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {CoreItem} from '../../../types/itemTypes';
import TripsNotesAndReports from '../../sharedComponents/detailComponents/TripsNotesAndReports';
import Weather from '../../sharedComponents/detailComponents/weather';

interface Props {
  campsite: {
    id: Campsite['id'];
    name: Campsite['name'];
    type: Campsite['type'];
    location: Campsite['location'];
  };
  stateAbbreviation: string;
}

const Content = (props: Props) => {
  const  {
    campsite: {location, type},
    campsite, stateAbbreviation,
  } = props;

  const getString = useFluent();

  const name = campsite.name ? campsite.name : getString('global-formatted-campsite-type', {type})

  return (
    <>
      <Weather
        forecastTabs={[
          {title: getString('weather-forecast-weather'), location},
        ]}
        snowReport={{location, stateAbbr: stateAbbreviation}}
      />
      <TripsNotesAndReports
        id={campsite.id}
        name={name}
        item={CoreItem.campsite}
      />
      <MapRenderProp
        id={campsite.id}
        campsites={[campsite]}
        center={location}
      />
    </>
  );
};

export default Content;
