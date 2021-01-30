import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  Mountain,
  PeakList,
  State,
  User,
} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import TripsNotesAndReports from '../../sharedComponents/detailComponents/TripsNotesAndReports';
import Weather from '../../sharedComponents/detailComponents/weather';
import MapRenderProp from '../../sharedComponents/MapRenderProp';

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
    mountain: {location, name, id, state},
    mountain,
  } = props;

  const getString = useFluent();

  const stateAbbreviation = state && state.name ? state.name : '';

  return (
    <>
      <Weather
        forecastTabs={[
          {title: getString('weather-forecast-summit-weather'), location},
        ]}
        snowReport={{location, stateAbbr: stateAbbreviation}}
      />
      <TripsNotesAndReports
        id={id}
        name={name}
        item={CoreItem.mountain}
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
