import React from 'react';
import {TrailDatum} from '../../../queries/trails/useGeoNearTrails';
import { NoResults } from '../../../styling/styleUtils';
import TrailCard from './TrailCard';

interface Props {
  trailData: TrailDatum[];
  noResultsText: string;
}

const ListTrails = (props: Props) => {
  const {
    trailData, noResultsText,
  } = props;

  if (trailData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const trails = trailData.map(trail => (
    <TrailCard
      key={trail.id}
      trail={trail}
    />
  ));

  return (
    <>
      {trails}
    </>
  );
};

export default ListTrails;
