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
  SingleColumn,
  TwoColumns,
  LargeStyledNumber,
  ContributionsCard,
  CardRoot,
  AverageTimeCard,
  TopFourValuesList,
  ContextNote,
} from './styling';
import DataViz, {
  VizType
} from './d3Viz';
import { RouteComponentProps, withRouter } from 'react-router';
import {mountainDetailLink} from '../../routing/Utils';
import PeakProgressBar from '../peakLists/list/PeakProgressBar';

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
            name
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

interface Props extends RouteComponentProps {
  userId: string;
}

const Stats = (props: Props) => {
  const { userId, history } = props;

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
    const allStateNames: Array<{abbreviation: string, name: string}> = [];
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
            const {state} = mountain;
            if (state) {
              const {abbreviation, name} = state;
              allStates.push(state.abbreviation);
              allStateNames.push({abbreviation, name});
            }
          });
          mountainsWithDates.push(mountainWithDates);
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

    let topHikedPeaksData: Array<{label: string, value: number, onClick: () => void}> =[];
    topPeaks.forEach(({mountain, dates}) => {
      if (mountain && dates.length) {
        topHikedPeaksData.push({
          label: mountain.name, value: dates.length,
          onClick: () => history.push(mountainDetailLink(mountain.id)),
        });
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
    const startDate = sortedDates[0] && !isNaN(sortedDates[0].day) ? (
      sortedDates[0].day + '/' + sortedDates[0].month + '/' + sortedDates[0].year
    ) : undefined;

    const groupedStates = countBy(allStates);
    const allStatesCountObj: Array<{stateAbbr: string, count: number}> = [];
    Object.entries(groupedStates).forEach((val) => {
      allStatesCountObj.push({stateAbbr: val[0], count: val[1]});
    });
    const sortedStates = sortBy(allStatesCountObj, ['count'])
      .reverse()
      .map(({stateAbbr, count}) => {
        const targetVal = allStateNames.find(({abbreviation}) => abbreviation === stateAbbr);
        const name = targetVal !== undefined ? targetVal.name : '';
        return {label: stateAbbr, value: count, name};
      });

    const groupedYears = countBy(allYears);
    const allYearsCountObj: Array<{year: string, count: number}> = [];
    Object.entries(groupedYears).forEach((val) => {
      allYearsCountObj.push({year: val[0], count: val[1]});
    });
    const sortedYears = sortBy(allYearsCountObj, ['count'])
      .reverse()
      .slice(0, 4)
      .map(({year, count}) => ({label: year, count}));

    const sortedSeasons = sortBy(topHikedSeasons, ['count'])
      .reverse()
      .map(({season, count}) => ({label: season, count}));

    const elevationDataPoints: Array<{date: Date, value: number}> = [];
    const groupedElevationDates = groupBy(sortedDates, 'dateAsNumber');
    let totalElevationSoFar = 0;
    Object.entries(groupedElevationDates).forEach((val) => {
      let totalElevationForDay: number = 0;
      val[1].forEach(({elevation}) => {
        totalElevationForDay += elevation;
      });
      totalElevationSoFar += totalElevationForDay;
      const {day, month, year} = val[1][0];
      elevationDataPoints.push({date: new Date(year, month - 1, day), value: totalElevationSoFar});
    });

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
            label={'total overall ascents'}
          />
          <LargeStyledNumber
            value={uniqueMountains}
            label={'total unique mountains ascended'}
          />
        </TwoColumns>
        <TwoColumns>
          <div>
            <SectionTitle>{'Most Hiked Mountains'}</SectionTitle>
            <CardRoot>
              <DataViz
                id='top-12-peaks-hiked'
                vizType={VizType.HorizontalBarChart}
                data={topHikedPeaksData}
              />
            </CardRoot>
          </div>
          <div>
            <SectionTitle>{'Most Hiked Months'}</SectionTitle>
            <CardRoot>
              <DataViz
                id='top-months-hiked'
                vizType={VizType.HorizontalBarChart}
                data={sortedMonthsData}
              />
            </CardRoot>
          </div>
        </TwoColumns>
        <SingleColumn>
          <SectionTitle>{'Your Wilderlist Contributions'}</SectionTitle>
          <ContributionsCard
            tripReports={totalAuthoredTripReports}
            mountains={totalAuthoredMountains}
            lists={totalAuthoredPeakLists}
            getFluentString={getFluentString}
          />
        </SingleColumn>
        <SingleColumn>
          <SectionTitle>{'Time Between Hikes'}</SectionTitle>
          <AverageTimeCard
            avgTime={avgTimeBetweenHikes}
            startDate={startDate}
            getFluentString={getFluentString}
          />
          <ContextNote>Average time is calculated based on the time between recorded <em>full dates</em>, starting with your first recorded date on Wilderlist to your last.</ContextNote>
        </SingleColumn>
        <SingleColumn>
          <SectionTitle>{'Hiking Break Down by Top States'}</SectionTitle>
          <CardRoot>
            <DataViz
              id='top-states-hiked'
              vizType={VizType.BubbleChart}
              data={sortedStates}
            />
          </CardRoot>
        </SingleColumn>
        <TwoColumns>
          <div>
            <SectionTitle>{'Top Hiked Years'}</SectionTitle>
            <TopFourValuesList
              val1={sortedYears[0]}
              val2={sortedYears[1]}
              val3={sortedYears[2]}
              val4={sortedYears[3]}
              getFluentString={getFluentString}
            />
          </div>
          <div>
            <SectionTitle>{'Top Hiked Seasons'}</SectionTitle>
            <TopFourValuesList
              val1={sortedSeasons[0]}
              val2={sortedSeasons[1]}
              val3={sortedSeasons[2]}
              val4={sortedSeasons[3]}
              getFluentString={getFluentString}
            />
          </div>
        </TwoColumns>
        <SingleColumn>
          <SectionTitle>{'Total Lifetime elevation'}</SectionTitle>
          <CardRoot>
            <DataViz
              id='total-elevation-reached'
              vizType={VizType.LineChart}
              data={elevationDataPoints}
            />
          </CardRoot>
          <ContextNote>
            Lifetime Elevation is calculated based on the total elevation of each peak hiked for a given day. Wilderlist does not currently take into account prominence or elevation gain.
          </ContextNote>
        </SingleColumn>
        <SectionTitle>{'Your Lists'}</SectionTitle>
        <TwoColumns>
          <LargeStyledNumber
            value={peakLists.length}
            label={'lists being pursued'}
          />
          <LargeStyledNumber
            value={numFinishedList}
            label={'lists completed'}
          />
        </TwoColumns>
        <SectionTitle>{'Percentage Complete For All Lists'}</SectionTitle>
        <SingleColumn>
          <CardRoot>
            <PeakProgressBar
              variant={PeakListVariants.standard}
              completed={percentOfAllLists}
              total={100}
              id={'stats-all-lists-percent'}
            />
          </CardRoot>
        </SingleColumn>
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

export default withRouter(Stats);
