import React from 'react';
import { Mountain, PeakList, Region, State } from '../../types/graphQLTypes';
import PeakListCard from './PeakListCard';

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  mountains: Array<{
    id: Mountain['id'];
    state: {
      id: State['id'];
      name: State['name'];
      regions: Array<{
        id: Region['id'];
        name: Region['name'];
        states: Array<{
          id: State['id'],
        }>
      }>
    }
  }>;
}

interface Props {
  peakListData: PeakListDatum[];
}

const ListPeakLists = (props: Props) => {
  const {
    peakListData,
  } = props;
  if (peakListData.length === 0) {
    return <>No results found</>;
  }
  const peakLists = peakListData.map(peakList => {
    return (
      <PeakListCard
        peakList={peakList}
        key={peakList.id}
      />
    );
  });
  return (
    <>
      {peakLists}
    </>
  );
};

export default ListPeakLists;
