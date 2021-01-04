import React from 'react';
import {CampsiteDatum} from '../../../queries/campsites/useGeoNearCampsites';
import { NoResults } from '../../../styling/styleUtils';
import CampsiteCard from './CampsiteCard';

interface Props {
  campsiteData: CampsiteDatum[];
  noResultsText: string;
}

const ListCampsites = (props: Props) => {
  const {
    campsiteData, noResultsText,
  } = props;

  if (campsiteData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const campsites = campsiteData.map(campsite => (
    <CampsiteCard
      key={campsite.id}
      campsite={campsite}
    />
  ));

  return (
    <>
      {campsites}
    </>
  );
};

export default ListCampsites;
