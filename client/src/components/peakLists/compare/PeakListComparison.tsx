import React, {useState} from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {useComparePeakList} from '../../../queries/lists/useComparePeakList';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import { ListPrivacy, PeakListVariants } from '../../../types/graphQLTypes';
import {
  getSeason,
  Months,
  monthsArray,
  Seasons,
} from '../../../Utils';
import PageNotFound from '../../sharedComponents/404';
import MapLegend from '../../sharedComponents/detailComponents/header/MapLegend';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import AllItems from './AllItems';
import Header from './Header';
import MonthOrSeasonSelectBox from './MonthOrSeasonSelectBox';

interface Props {
  userId: string;
  friendId: string;
  peakListId: string;
}

const ComparePeakListPage = (props: Props) => {
  const { userId, friendId, peakListId } = props;

  const getString = useFluent();
  const [monthOrSeason, setMonthOrSeason] = useState<Months | Seasons | null>(null);

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
      if (peakList.privacy === ListPrivacy.Private &&
          (!me || !data.peakList.author || me.id !== data.peakList.author.id)) {
        return <PageNotFound />;
      }
      let value: Months | Seasons | null;
      let dropdownBox: React.ReactElement<any> | null;

      if (peakList.type === PeakListVariants.standard || peakList.type === PeakListVariants.winter) {
        value = null;
        dropdownBox = null;
      } else if (peakList.type === PeakListVariants.fourSeason) {
        const today = new Date();
        const season = getSeason(today.getFullYear(), today.getMonth() + 1, today.getDate());
        value = monthOrSeason === null && season ? season : monthOrSeason;
        dropdownBox = value ? (
          <MonthOrSeasonSelectBox
            value={value}
            setValue={setMonthOrSeason}
            type={peakList.type}
          />
        ) : null;
      } else if (peakList.type === PeakListVariants.grid) {
        const today = new Date();
        const month = monthsArray[today.getMonth()];
        value = monthOrSeason === null ? month : monthOrSeason;
        dropdownBox = value ? (
          <MonthOrSeasonSelectBox
            value={value}
            setValue={setMonthOrSeason}
            type={peakList.type}
          />
        ) : null;
      } else {
        value = null;
        dropdownBox = null;
      }
      return (
        <>
          <Helmet>
            <title>{getString('meta-data-compare-peak-list-title', {
              title: peakList.name,
              type: peakList.type,
              user: user.name,
            })}</title>
          </Helmet>
          <MapLegend
            type={'comparison'}
            hasMountains={Boolean(peakList.numMountains)}
            hasTrails={Boolean(peakList.numTrails)}
            hasCampsites={Boolean(peakList.numCampsites)}
          />
          <Header
            peakListId={peakList.id}
            comparisonUserId={user.id}
            comparisonUserName={user.name}
          />
          {dropdownBox}
          <AllItems
            peakListId={peakList.id}
            showOnlyFor={value}
            secondaryUserId={user.id}
            secondaryUserName={user.name}
            primaryUserName={me.name}
            bbox={peakList.bbox}
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
