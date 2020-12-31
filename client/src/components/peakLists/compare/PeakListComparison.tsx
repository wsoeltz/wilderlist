import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {useComparePeakList} from '../../../queries/lists/useComparePeakList';
import {
  MountainDatum,
} from '../../../queries/lists/usePeakListDetail';
import { PlaceholderText } from '../../../styling/styleUtils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Header from '../detail/Header';
import ComparisonTable from './ComparisonTable';

interface Props {
  userId: string;
  friendId: string;
  peakListId: string;
}

const ComparePeakListPage = (props: Props) => {
  const { userId, friendId, peakListId } = props;

  const getString = useFluent();

  const {loading, error, data} = useComparePeakList(peakListId, userId, friendId);
  if (loading === true) {
    return <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { peakList, user, me } = data;
    if (!peakList || !user || !me) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const mountains: MountainDatum[] = peakList.mountains !== null ? peakList.mountains : [];
      const userCompletedAscents = user.mountains !== null ? user.mountains : [];
      const myCompletedAscents = me.mountains !== null ? me.mountains : [];

      return (
        <>
          <Helmet>
            <title>{getString('meta-data-compare-peak-list-title', {
              title: peakList.name,
              type: peakList.type,
              user: user.name,
            })}</title>
          </Helmet>
          <Header
            user={me}
            mountains={mountains}
            peakList={peakList}
            completedAscents={myCompletedAscents}
            comparisonUser={user}
            comparisonAscents={userCompletedAscents}
          />
          <ComparisonTable
            user={user}
            me={me}
            mountains={mountains}
          />
        </>
      );
    }
  } else {
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }
};

export default ComparePeakListPage;
