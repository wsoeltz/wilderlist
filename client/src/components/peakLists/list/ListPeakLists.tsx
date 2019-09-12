import React from 'react';
import { CompletedMountain, Mountain, PeakList, Region, State } from '../../../types/graphQLTypes';
import PeakListCard from './PeakListCard';
import styled from 'styled-components';
import { placeholderColor } from '../../../styling/styleUtils';

const NoResults = styled.div`
  font-style: italic;
  color: ${placeholderColor};
  text-align: center;
`;

interface MountainDatum {
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
  };
}

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  mountains: MountainDatum[] | null;
  parent: {
    id: PeakList['id'];
    mountains: MountainDatum[] | null;
  } | null;
}

interface Props {
  peakListData: PeakListDatum[];
  userListData: Array<PeakList['id']>;
  listAction: (peakListId: string) => void;
  actionText: string;
  completedAscents: CompletedMountain[];
  isCurrentUser: boolean;
  noResultsText: string;
}

const ListPeakLists = (props: Props) => {
  const {
    peakListData, userListData, listAction, actionText,
    completedAscents, isCurrentUser, noResultsText,
  } = props;

  if (peakListData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const peakLists = peakListData.map(peakList => {
    const active = userListData.includes(peakList.id);
    return (
      <PeakListCard
        peakList={peakList}
        active={active}
        listAction={listAction}
        actionText={actionText}
        completedAscents={completedAscents}
        isCurrentUser={isCurrentUser}
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
