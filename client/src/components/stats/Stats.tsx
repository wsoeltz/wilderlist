import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  PlaceholderText,
  SectionTitle,
} from '../../styling/styleUtils';
import {
  User,
  Mountain,
  PeakListVariants,
} from '../../types/graphQLTypes';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import { getDates, DateObject } from '../peakLists/Utils';
import {
  Months,
  getSeason,
  Seasons,
  roundPercentToSingleDecimal,
} from '../../Utils';
import {
  Root,
  TwoColumns,
  LargeStyledNumber,
  ThreeColumns,
} from './styling';
import DataViz, {
  VizType
} from './d3Viz';

const GET_DATA_FOR_STATS = gql`
  query GetDataForStats($userId: ID!) {
    user(id: $userId) {
      id
      mountains {
        mountain {
          id
          name
          elevation
          state {
            id
            abbreviation
          }
        }
        dates
      }
      authoredMountains {
        id
      }
      authoredPeakLists {
        id
      }
      authoredTripReports {
        id
      }
      peakLists {
        id
        numMountains
        numCompletedAscents(userId: $userId)
        type
      }
    }
  }
`;

interface SuccessResponse {
  user: {
    id: User['id'];
    mountains: User['mountains'];
    authoredMountains: User['authoredMountains'];
    authoredPeakLists: User['authoredPeakLists'];
    authoredTripReports: User['authoredTripReports'];
    peakLists: User['peakLists'];
  };
}

interface Variables {
  userId: string;
}

interface CompletedMountainWithDateObject {
  mountain: Mountain;
  dates: DateObject[];
}

interface Props {
  userId: string;
}

const Stats = (props: Props) => {
  const { userId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const { loading, error, data } = useQuery<SuccessResponse, Variables>(GET_DATA_FOR_STATS, {
    variables: { userId },
  });

  let output: React.ReactElement<any> | null;
  if (loading === true) {
    output = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    output = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>);
  } else if (data !== undefined) {
    const {
      user: {
        mountains, authoredMountains, authoredPeakLists, authoredTripReports,
      }, user,
    } = data;
    const peakLists = user.peakLists ? user.peakLists : [];
    let totalAscents = 0;
    let uniqueMountains = 0;
    const topHikedMonths: Array<{month: Months, count: number}> = [
      {month: Months.january, count: 0},
      {month: Months.february, count: 0},
      {month: Months.march, count: 0},
      {month: Months.april, count: 0},
      {month: Months.may, count: 0},
      {month: Months.june, count: 0},
      {month: Months.july, count: 0},
      {month: Months.august, count: 0},
      {month: Months.september, count: 0},
      {month: Months.october, count: 0},
      {month: Months.november, count: 0},
      {month: Months.december, count: 0},
    ];
    const topHikedSeasons: Array<{season: Seasons, count: number}> = [
      {season: Seasons.summer, count: 0},
      {season: Seasons.fall, count: 0},
      {season: Seasons.winter, count: 0},
      {season: Seasons.spring, count: 0},
    ];
    const allYears: number[] = [];
    const allStates: string[] = [];
    const mountainsWithDates: Array<{mountain: Mountain, dates: DateObject[]}> = [];
    const allDates: (DateObject & {elevation: number})[] = [];
    if (mountains) {
      mountains.forEach(({mountain, dates}) => {
        if (mountain && dates.length) {
          totalAscents += dates.length;
          uniqueMountains++;
          const mountainWithDates = {mountain, dates: getDates(dates)};
          mountainWithDates.dates.forEach(date => {
            const {day, month, year} = date;
            if (!isNaN(year)) {
              allYears.push(year);
            }
            if (!isNaN(month)) {
              topHikedMonths[month - 1].count++;
            }
            if (!isNaN(month) && !isNaN(year) && !isNaN(day)) {
              allDates.push({...date, elevation: mountain.elevation});
              const season = getSeason(year, month, day);
              if (season === Seasons.summer) {
                topHikedSeasons[0].count++;
              }
              if (season === Seasons.fall) {
                topHikedSeasons[1].count++;
              }
              if (season === Seasons.winter) {
                topHikedSeasons[2].count++;
              }
              if (season === Seasons.spring) {
                topHikedSeasons[3].count++;
              }
            }
          });
          mountainsWithDates.push(mountainWithDates);
          const {state} = mountain;
          if (state) {
            allStates.push(state.abbreviation);
          }
        }
      });
    }
    const sortedPeaks = sortBy(mountainsWithDates, ({dates}) => dates.length).reverse();
    const numTopPeaks = 12;
    let topPeaks: CompletedMountainWithDateObject[] = [];
    let i = 0;
    while (topPeaks.length < numTopPeaks && i < sortedPeaks.length) {
      const {mountain, dates} = sortedPeaks[i];
      // if mountains and dates exist
      if (mountain && dates.length > 0) {
        // filter new list with all peaks of equal number of dates
        const tiedMountains = sortedPeaks.filter((mtn) => mtn.dates.length === dates.length);
        // if list length will not exceed number of sorted peaks
        if (topPeaks.length + tiedMountains.length <= numTopPeaks) {
          // add them all
          topPeaks = [...topPeaks, ...tiedMountains];
          // set i equal to the point at which the array cut off
          // if i = 0 and l = 2, i = i + l = 2, so the next run through the loop
          // would start at n[2], which is correct. If i === 2 and l === 2, the
          // next run through the loop would start at n[4], which is correct
          i = i + tiedMountains.length;
        } else {
        // else
          // sort them by latest dates
          const sortedByLatestDates =
            sortBy(tiedMountains, mtn => sortBy(mtn.dates, ['dateAsNumber']).reverse()[0].dateAsNumber)
            .reverse();
          // slice the array to push the ones with the most recent dates
          const slicedArray = sortedByLatestDates.slice(0, numTopPeaks - topPeaks.length);
          topPeaks = [...topPeaks, ...slicedArray];
          // break the loop
          break;
        }
      } else {
      // else
        // inc i. Do not break the loop in case a mountain with many dates
        // has been deleted. This will allow the loop to go through until
        // it has exhausted all mountains in list
        i++;
      }
    }

    let topHikedPeaksData: Array<{label: string, value: number}> =[];
    topPeaks.forEach(({mountain, dates}) => {
      if (mountain && dates.length) {
        topHikedPeaksData.push({label: mountain.name, value: dates.length});
      }
    });
    topHikedPeaksData.reverse();

    const sortedMonthsData = sortBy(topHikedMonths, ['count'])
      .map(({month, count}) => ({label: month, value: count}))

    const totalAuthoredMountains = authoredMountains ? authoredMountains.length : 0;
    const totalAuthoredPeakLists = authoredPeakLists ? authoredPeakLists.length : 0;
    const totalAuthoredTripReports = authoredTripReports ? authoredTripReports.length : 0;

    const sortedDates = sortBy(allDates, ['dateAsNumber']);
    let totalTimesBetween: number = 0;
    sortedDates.forEach(({day, month, year}, i) => {
      if (sortedDates[i + 1]) {
        const date1 = new Date(year, month - 1, day);
        const date2 = new Date(sortedDates[i + 1].year, sortedDates[i + 1].month - 1, sortedDates[i].day);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalTimesBetween += diffDays;
      }
    });
    const avgTimeBetweenHikes = totalTimesBetween > 0 && sortedDates.length > 0
      ? totalTimesBetween/sortedDates.length : 0;
    const startDate = sortedDates[0] ? sortedDates[0].dateAsNumber : undefined;

    const groupedStates = countBy(allStates);
    const allStatesCountObj: Array<{stateAbbr: string, count: number}> = [];
    Object.entries(groupedStates).forEach((val) => {
      allStatesCountObj.push({stateAbbr: val[0], count: val[1]});
    });
    const sortedStates = sortBy(allStatesCountObj, ['count'])
      .reverse()
      .map(({stateAbbr, count}) => <li key={'top-peaks-list' + stateAbbr}>{stateAbbr} ({count})</li>);

    const groupedYears = countBy(allYears);
    const allYearsCountObj: Array<{year: string, count: number}> = [];
    Object.entries(groupedYears).forEach((val) => {
      allYearsCountObj.push({year: val[0], count: val[1]});
    });
    const sortedYears = sortBy(allYearsCountObj, ['count'])
      .reverse()
      .slice(0, 4)
      .map(({year, count}) => <li key={'top-peaks-list' + year}>{year} ({count})</li>);

    const sortedSeasonsElm = sortBy(topHikedSeasons, ['count'])
      .reverse()
      .map(({season, count}) => <li key={'top-peaks-list' + season}>{season} ({count})</li>);

    const elevationDataPoints: Array<{dateAsNumber: number, elevation: number}> = [];
    const groupedElevationDates = groupBy(sortedDates, 'dateAsNumber');
    Object.entries(groupedElevationDates).forEach((val) => {
      let totalElevationForDay: number = 0;
      val[1].forEach(({elevation}) => {
        totalElevationForDay += elevation;
      });
      elevationDataPoints.push({dateAsNumber: parseInt(val[0], 10), elevation: totalElevationForDay});
    });
    console.log(elevationDataPoints);

    let totalCompletedAscents: number = 0;
    let totalRequiredAscents: number = 0;
    let numFinishedList: number = 0;
    peakLists.forEach(list => {
      if (list) {
        const {numCompletedAscents} = list;
        let required: number;
        if (list.type === PeakListVariants.fourSeason) {
          required = list.numMountains * 4;
        } else if (list.type === PeakListVariants.grid) {
          required = list.numMountains * 12;
        } else {
          required = list.numMountains;
        }
        totalRequiredAscents += required;
        totalCompletedAscents += numCompletedAscents;
        if (numCompletedAscents === required) {
          numFinishedList++;
        }
      }
    });
    const percentOfAllLists = roundPercentToSingleDecimal(totalCompletedAscents, totalRequiredAscents);


    output = (
      <>
        <TwoColumns>
          <LargeStyledNumber
            value={totalAscents}
            labelTop={'total overall'}
            labelBottom={'ascents'}
          />
          <LargeStyledNumber
            value={uniqueMountains}
            labelTop={'total unique'}
            labelBottom={'mountains ascended'}
          />
        </TwoColumns>
        <TwoColumns>
          <div>
            <SectionTitle>{'Most Hiked Mountains'}</SectionTitle>
            <DataViz
              id='top-12-peaks-hiked'
              vizType={VizType.HorizontalBarChart}
              data={topHikedPeaksData}
            />
          </div>
          <div>
            <SectionTitle>{'Most Hiked Months'}</SectionTitle>
            <DataViz
              id='top-months-hiked'
              vizType={VizType.HorizontalBarChart}
              data={sortedMonthsData}
            />
          </div>
        </TwoColumns>
        <LargeStyledNumber
          value={totalAuthoredMountains + totalAuthoredPeakLists + totalAuthoredTripReports}
          labelTop={'total Wilderlist'}
          labelBottom={' Contributions'}
        />
        <ThreeColumns>
          <LargeStyledNumber
            value={totalAuthoredTripReports}
            labelTop={'Trip Reports'}
            labelBottom={'Written'}
          />
          <LargeStyledNumber
            value={totalAuthoredMountains}
            labelTop={'Mountains'}
            labelBottom={'Added'}
          />
          <LargeStyledNumber
            value={totalAuthoredPeakLists}
            labelTop={'Hiking Lists'}
            labelBottom={'Created'}
          />
        </ThreeColumns>
        <div>{`Average time between hikes (express as days, months, or years) ${avgTimeBetweenHikes} days = STYLED TIME NUMBERS since ${startDate}`}</div>
        <div>{`Hiking break down by state = BUBBLE CHART`}</div>
        <ol>{sortedStates}</ol>
        <div>{`Top 4 Most hiked YEARS`}</div>
        <ol>{sortedYears}</ol>
        <div>{`Most hiked SEASONS = STYLED NUMBERS/Text`}</div>
        <ol>{sortedSeasonsElm}</ol>
        <div>{`Total elevation timeline - SPARKLINE`}</div>
        <div>{`CALCULATED, in CONSOLE`}</div>
        <div>{`Total number of lists being pursued ${peakLists.length} && Total number of completed lists ${numFinishedList} = STYLED NUMBERS`}</div>
        <div>{`Percentage complete towards all your lists ${percentOfAllLists} = STYLED PERCENT`}</div>
      </>
    );
  } else {
    output = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  return (
    <Root>
      {output}
    </Root>
  );
};

export default Stats;
