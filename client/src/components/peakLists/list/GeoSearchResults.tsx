import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {useAddPeakListToUser} from '../../../queries/lists/addRemovePeakListsToUser';
import {CompactPeakListDatum} from '../../../queries/lists/getGeoNearPeakLists';
import {CardPeakListDatum} from '../../../queries/lists/getUsersPeakLists';
import ListPeakLists, { ViewMode } from './ListPeakLists';

type Props  = {
  viewMode: ViewMode.Card;
  peakListData: CardPeakListDatum[];
} | {
  viewMode: ViewMode.Compact;
  peakListData: CompactPeakListDatum[];
};

const GeoSearchResults = (props: Props) => {
  const getString = useFluent();
  const user = useCurrentUser();
  const userId = user ? user._id : null;

  const addPeakListToUser = useAddPeakListToUser();
  const beginList = userId ? (peakListId: string) => addPeakListToUser({variables: {userId,  peakListId}}) : null;

  return (
    <ListPeakLists
      viewMode={props.viewMode}
      peakListData={props.peakListData as any}
      listAction={beginList}
      actionText={getString('peak-list-detail-text-begin-list')}
      profileId={undefined}
      noResultsText={getString('global-text-value-no-results-found')}
      showTrophies={false}
    />
  );
};

export default GeoSearchResults;
