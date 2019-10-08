import React from 'react';
import { NoResults } from '../../../styling/styleUtils';
import {
  Mountain,
 } from '../../../types/graphQLTypes';
import MountainCard from './MountainCard';

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: Mountain['state'];
  elevation: Mountain['elevation'];
}

interface Props {
  mountainData: MountainDatum[];
  noResultsText: string;
}

const ListMountains = (props: Props) => {
  const {
    mountainData, noResultsText,
  } = props;

  if (mountainData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const mountains = mountainData.map(mountain => {
    return (
      <MountainCard
        key={mountain.id}
        mountain={mountain}
      />
    );
  });

  return (
    <>
      {mountains}
    </>
  );
};

export default ListMountains;
