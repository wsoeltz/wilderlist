import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFluent from '../../hooks/useFluent';
import useGetStatsData from '../../queries/compound/stats/useTotals';
import {useUsersPeakLists} from '../../queries/lists/getUsersPeakLists';
import {
  DottedSegment,
} from '../../styling/styleUtils';
import {
  PeakListVariants,
} from '../../types/graphQLTypes';
import {DateObject, parseDate} from '../../utilities/dateUtils';
import PeakProgressBar from '../peakLists/list/PeakProgressBar';
import LoadingSimple, {LoadingContainer} from '../sharedComponents/LoadingSimple';
import HikingListCompleteSVG from './d3Viz/icons/hiking-list-complete.svg';
import HikingListProgressSVG from './d3Viz/icons/hiking-list-progress.svg';
import ProgressLineChart from './fastChartVisualization/ProgressLineChart';
import {elevationGoals} from './goals';
import {
  LargeStyledNumber,
  TwoColumns,
} from './styling';

const Progress = () => {
  const getString = useFluent();
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const lists = useUsersPeakLists({userId});
  const stats = useGetStatsData();

  if (lists.loading || stats.loading) {
    return <LoadingContainer><LoadingSimple /></LoadingContainer>;
  } else if (lists.error !== undefined) {
    console.error(lists.error);
    return (
      <>
        <DottedSegment>
          {getString('global-error-retrieving-data')}
        </DottedSegment>
        <DottedSegment />
      </>
    );
  } else if (stats.error !== undefined) {
    console.error(stats.error);
    return (
      <>
        <DottedSegment>
          {getString('global-error-retrieving-data')}
        </DottedSegment>
        <DottedSegment />
      </>
    );
  } else if (lists.data !== undefined && stats.data !== undefined && stats.data.totals) {
    const {user: {peakLists}} = lists.data;
    const {mountains} = stats.data.totals;

    let totalCompletedTrips: number = 0;
    let totalRequiredTrips: number = 0;
    let numFinishedList: number = 0;
    peakLists.forEach(list => {
      if (list) {
        const {numCompletedTrips} = list;
        let required: number;
        if (list.type === PeakListVariants.fourSeason) {
          required = list.numMountains * 4;
        } else if (list.type === PeakListVariants.grid) {
          required = list.numMountains * 12;
        } else {
          required = list.numMountains;
        }
        totalRequiredTrips += required;
        totalCompletedTrips += numCompletedTrips;
        if (numCompletedTrips === required) {
          numFinishedList++;
        }
      }
    });
    const percentOfAllLists = parseFloat((totalCompletedTrips / totalRequiredTrips * 100).toFixed(1));

    const allElevationDates: Array<DateObject & {elevation: number}> = [];
    if (mountains && mountains.length) {
      mountains.forEach(({mountain, dates}) => {
        if (mountain && dates.length) {
          dates.forEach(d => {
            if (d) {
              const dateObject = parseDate(d);
              allElevationDates.push({...dateObject, elevation: mountain.elevation});
            }
          });
        }
      });
    }
    const sortedElevationDates = sortBy(allElevationDates, ['dateAsNumber']);
    const elevationDataPoints: Array<{date: Date, value: number}> = [];
    const groupedElevationDates = groupBy(sortedElevationDates, 'dateAsNumber');
    let totalElevationSoFar = 0;
    Object.entries(groupedElevationDates).forEach((val) => {
      let totalElevationForDay: number = 0;
      val[1].forEach(({elevation}) => {
        totalElevationForDay += elevation;
      });
      totalElevationSoFar += totalElevationForDay;
      const {day, month, year} = val[1][0];
      const date = new Date(year, month - 1, day);
      if (date instanceof Date && !isNaN(date as any)) {
        elevationDataPoints.push({date, value: totalElevationSoFar});
      }
    });

    return (
      <>
        <DottedSegment style={{border: 'none'}}>
          <TwoColumns>
            <LargeStyledNumber
              value={peakLists.length}
              label={getString('stats-your-lists-pursued', {count: peakLists.length})}
              svg={HikingListProgressSVG}
            />
            <LargeStyledNumber
              value={numFinishedList}
              label={getString('stats-your-lists-complete', {count: numFinishedList})}
              svg={HikingListCompleteSVG}
            />
          </TwoColumns>
          <PeakProgressBar
            variant={PeakListVariants.grid}
            completed={percentOfAllLists}
            total={100}
            id={'stats-all-lists-percent'}
          />
        </DottedSegment>
        <DottedSegment>
          <ProgressLineChart
            data={elevationDataPoints}
            goals={elevationGoals}
            units={'ft'}
            title={getString('stats-total-lifetime-elevation')}
            disclaimer={getString('stats-total-lifetime-context-note')}
          />
        </DottedSegment>
      </>
    );
  } else {
    return null;
  }

};

export default Progress;
