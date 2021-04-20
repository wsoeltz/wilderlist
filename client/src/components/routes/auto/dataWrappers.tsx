import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {useParams} from 'react-router-dom';
import useFluent from '../../../hooks/useFluent';
import {useBasicCampsiteDetails} from '../../../queries/campsites/useBasicCampsiteDetails';
import {useBasicMountainDetails} from '../../../queries/mountains/useBasicMountainDetails';
import {useBasicTrailDetail} from '../../../queries/trails/useBasicTrailDetail';
import {Routes} from '../../../routing/routes';
import {CoreItem} from '../../../types/itemTypes';
import LoadingSimple from '../../sharedComponents/LoadingSimple';
import Detail from './Detail';

const Loading = () => (
  <div style={{display: 'flex', justifyContent: 'center', padding: '1rem'}}>
    <LoadingSimple />
  </div>
);

export const RouteDetailParkingToMountain = () => {
  const { mountainId, parkingId }: any = useParams();
  const {loading, error, data} = useBasicMountainDetails(mountainId ? mountainId : null);
  if (loading) {
    return <Loading />;
  } else if (error !== undefined) {
    return <p>{error.message}</p>;
  } else if (data !== undefined && data.mountain) {
    const {mountain} = data;
    const {id, name, elevation, location} = mountain;
    return (
      <Detail
        sourceDatum={{
          id, name, location, elevation,
          itemType: CoreItem.mountain,
        }}
        lat={location[1]}
        lng={location[0]}
        destinationId={parkingId}
        sourceRoute={Routes.AutoRouteDetailParkingToMountain}
      />
    );
  } else {
    return null;
  }
};

export const RouteDetailMountainToCampsite = () => {
  const { mountainId, campsiteId }: any = useParams();
  const {loading, error, data} = useBasicMountainDetails(mountainId ? mountainId : null);
  if (loading) {
    return <Loading />;
  } else if (error !== undefined) {
    return <p>{error.message}</p>;
  } else if (data !== undefined && data.mountain) {
    const {mountain} = data;
    const {id, name, elevation, location} = mountain;
    return (
      <Detail
        sourceDatum={{
          id, name, location, elevation,
          itemType: CoreItem.mountain,
        }}
        lat={location[1]}
        lng={location[0]}
        destination={'campsites'}
        destinationId={campsiteId}
        sourceRoute={Routes.AutoRouteDetailMountainToCampsite}
      />
    );
  } else {
    return null;
  }
};

export const RouteDetailCampsiteToCampsite = () => {
  const { campsiteId1, campsiteId2 }: any = useParams();
  const {loading, error, data} = useBasicCampsiteDetails(campsiteId1 ? campsiteId1 : null);
  const getString = useFluent();
  if (loading) {
    return <Loading />;
  } else if (error !== undefined) {
    return <p>{error.message}</p>;
  } else if (data !== undefined && data.campsite) {
    const {campsite} = data;
    const {id, elevation, location} = campsite;
    const formattedType = upperFirst(getString('global-formatted-campsite-type', {type: campsite.type}));
    const name = campsite.name ? campsite.name : formattedType;
    return (
      <Detail
        sourceDatum={{
          id, name, location, elevation,
          itemType: CoreItem.campsite,
        }}
        lat={location[1]}
        lng={location[0]}
        destination={'campsites'}
        destinationId={campsiteId2}
        sourceRoute={Routes.AutoRouteDetailCampsiteToCampsite}
      />
    );
  } else {
    return null;
  }
};

export const RouteDetailTrailToMountain = () => {
  const { trailId, mountainId }: any = useParams();
  const {loading, error, data} = useBasicTrailDetail(trailId ? trailId : null);
  const getString = useFluent();
  if (loading) {
    return <Loading />;
  } else if (error !== undefined) {
    return <p>{error.message}</p>;
  } else if (data !== undefined && data.trail) {
    const {trail} = data;
    const {id, line, center} = trail;
    const formattedType = upperFirst(getString('global-formatted-trail-type', {type: trail.type}));
    const name = trail.name ? trail.name : formattedType;
    return (
      <Detail
        sourceDatum={{
          id, name, location: center,
          itemType: CoreItem.trail,
        }}
        lat={line[0][1]}
        lng={line[0][0]}
        altLat={line[line.length - 1][1]}
        altLng={line[line.length - 1][0]}
        destination={'mountains'}
        destinationId={mountainId}
        sourceRoute={Routes.AutoRouteDetailTrailToMountain}
      />
    );
  } else {
    return null;
  }
};

export const RouteDetailTrailToCampsite = () => {
  const { trailId, campsiteId }: any = useParams();
  const {loading, error, data} = useBasicTrailDetail(trailId ? trailId : null);
  const getString = useFluent();
  if (loading) {
    return <Loading />;
  } else if (error !== undefined) {
    return <p>{error.message}</p>;
  } else if (data !== undefined && data.trail) {
    const {trail} = data;
    const {id, line, center} = trail;
    const formattedType = upperFirst(getString('global-formatted-trail-type', {type: trail.type}));
    const name = trail.name ? trail.name : formattedType;
    return (
      <Detail
        sourceDatum={{
          id, name, location: center,
          itemType: CoreItem.trail,
        }}
        lat={line[0][1]}
        lng={line[0][0]}
        altLat={line[line.length - 1][1]}
        altLng={line[line.length - 1][0]}
        destination={'campsites'}
        destinationId={campsiteId}
        sourceRoute={Routes.AutoRouteDetailTrailToCampsite}
      />
    );
  } else {
    return null;
  }
};
