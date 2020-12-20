import React from 'react';
import { NoResults } from '../../../styling/styleUtils';
import {
  Mountain, State,
 } from '../../../types/graphQLTypes';
import MountainCard from './MountainCard';

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'],
    name: State['name'],
  };
  elevation: Mountain['elevation'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
}

export interface MountainDatumWithDistance extends MountainDatum {
  distanceToUser: number | null;
  distanceToMapCenter: number | null;
}

interface Props {
  mountainData: MountainDatumWithDistance[];
  noResultsText: string;
}

const ListMountains = (props: Props) => {
  const {
    mountainData, noResultsText,
  } = props;

  if (mountainData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const mountains = mountainData.map(mountain => (
    <MountainCard
      key={mountain.id}
      mountain={mountain}
    />
  ));

  return (
    <>
      {mountains}
    </>
  );
};

export default ListMountains;
