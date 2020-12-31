import React from 'react';
import {MountainDatum} from '../../../queries/mountains/useGeoNearMountains';
import { NoResults } from '../../../styling/styleUtils';
import MountainCard from './MountainCard';

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
