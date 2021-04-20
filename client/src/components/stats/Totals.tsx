import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../hooks/useFluent';
import useGetStatsData from '../../queries/compound/stats/useTotals';
import {
  DottedSegment,
} from '../../styling/styleUtils';
import {DateObject, parseDate} from '../../utilities/dateUtils';
import {getSeason, Seasons} from '../../Utils';
import LoadingSimple, {LoadingContainer} from '../sharedComponents/LoadingSimple';
import CountyTreemap from './fastChartVisualization/CountyTreemap';
import SeasonsAndYears from './fastChartVisualization/SeasonsAndYears';
import Top10 from './fastChartVisualization/Top10';
import TotalVsUnique from './fastChartVisualization/TotalVsUnique';

interface Trip extends DateObject {
  season: Seasons | undefined;
  county: string;
  state: string;
}

const Totals = () => {
  const { loading, error, data } = useGetStatsData();

  const getString = useFluent();

  if (loading) {
    return <LoadingContainer><LoadingSimple /></LoadingContainer>;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <>
        <DottedSegment>
          {getString('global-error-retrieving-data')}
        </DottedSegment>
        <DottedSegment />
      </>
    );
  } else if (data !== undefined && data.totals !== null) {
    const {mountains, trails, campsites} = data.totals;
    const allMountains: Array<{id: string, name: string, numDates: number}> = [];
    let totalMountains: number = 0;
    const allTrails: Array<{id: string, name: string, numDates: number}> = [];
    let totalTrails: number = 0;
    const allCampsites: Array<{id: string, name: string, numDates: number}> = [];
    let totalCampsites: number = 0;
    const allDatesNotUnique: Trip[] = [];

    if (mountains && mountains.length) {
      mountains.forEach(({mountain, dates}) => {
        if (mountain && dates.length) {
          allMountains.push({
            id: mountain.id,
            name: mountain.name,
            numDates: dates.length,
          });
          totalMountains += dates.length;
          const county = mountain.locationText ? mountain.locationText.split(',').shift() : null;
          const state = mountain.locationTextShort && mountain.locationTextShort.length === 2
            ? mountain.locationTextShort : null;
          if (county && state) {
            dates.forEach(d => {
              if (d) {
                const dateObject = parseDate(d);
                const season = getSeason(dateObject.year, dateObject.month, dateObject.day);
                allDatesNotUnique.push({...dateObject, county, state, season});
              }
            });
          }
        }
      });
    }
    if (trails && trails.length) {
      trails.forEach(({trail, dates}) => {
        if (trail && dates.length) {
          const trailLength = trail.trailLength ? trail.trailLength : 0;
          const trailLengthDisplay = trailLength < 0.1
            ? Math.round(trailLength * 5280) + 'ft'
            : parseFloat(trailLength.toFixed(1)) + 'mi';
          let name = trail.name + ', ' + trailLengthDisplay;
          if (name === null || name === undefined) {
            const formattedType = upperFirst(getString('global-formatted-trail-type', {
              type: trail.type,
            }));
            name = formattedType + ', ' + trailLengthDisplay;
          }
          allTrails.push({
            id: trail.id,
            name,
            numDates: dates.length,
          });
          totalTrails += dates.length;
          const county = trail.locationText ? trail.locationText.split(',').shift() : null;
          const state = trail.locationTextShort && trail.locationTextShort.length === 2
            ? trail.locationTextShort : null;
          if (county && state) {
            dates.forEach(d => {
              if (d) {
                const dateObject = parseDate(d);
                const season = getSeason(dateObject.year, dateObject.month, dateObject.day);
                allDatesNotUnique.push({...dateObject, county, state, season});
              }
            });
          }
        }
      });
    }
    if (campsites && campsites.length) {
      campsites.forEach(({campsite, dates}) => {
        if (campsite && dates.length) {
          let name = campsite.name;
          if (name === null || name === undefined) {
            const formattedType = upperFirst(getString('global-formatted-campsite-type', {
              type: campsite.type,
            }));
            name = formattedType;
          }
          allCampsites.push({
            id: campsite.id,
            name,
            numDates: dates.length,
          });
          totalCampsites += dates.length;
          const county = campsite.locationText ? campsite.locationText.split(',').shift() : null;
          const state = campsite.locationTextShort && campsite.locationTextShort.length === 2
            ? campsite.locationTextShort : null;
          if (county && state) {
            dates.forEach(d => {
              if (d) {
                const dateObject = parseDate(d);
                const season = getSeason(dateObject.year, dateObject.month, dateObject.day);
                allDatesNotUnique.push({...dateObject, county, state, season});
              }
            });
          }
        }
      });
    }

    const allTripsUniqueByDate = uniqBy(allDatesNotUnique, 'dateAsNumber');
    const tripsGroupedBySeason = groupBy(allTripsUniqueByDate, 'season');
    const tripsGroupedByYear = groupBy(allTripsUniqueByDate, 'year');
    const tripCountsPerYear: Array<{year: number, count: number}> = [];
    for (const key in tripsGroupedByYear) {
      if (tripsGroupedByYear[key] !== undefined) {
        const year = parseInt(key, 10);
        if (!isNaN(year)) {
          tripCountsPerYear.push({
            year,
            count: tripsGroupedByYear[key].length,
          });
        }
      }
    }

    return (
      <>
        <DottedSegment style={{border: 'none'}}>
          <TotalVsUnique
            totalMountains={totalMountains}
            uniqueMountains={allMountains.length}
            totalTrails={totalTrails}
            uniqueTrails={allTrails.length}
            totalCampsites={totalCampsites}
            uniqueCampsites={allCampsites.length}
          />
        </DottedSegment>
        <DottedSegment>
          <SeasonsAndYears
            summer={tripsGroupedBySeason.summer ? tripsGroupedBySeason.summer.length : 0}
            fall={tripsGroupedBySeason.fall ? tripsGroupedBySeason.fall.length : 0}
            winter={tripsGroupedBySeason.winter ? tripsGroupedBySeason.winter.length : 0}
            spring={tripsGroupedBySeason.spring ? tripsGroupedBySeason.spring.length : 0}
            years={tripCountsPerYear}
          />
        </DottedSegment>
        <DottedSegment>
          <CountyTreemap
            data={allDatesNotUnique}
          />
        </DottedSegment>
        <DottedSegment>
          <Top10
            allMountains={allMountains}
            allTrails={allTrails}
            allCampsites={allCampsites}
          />
        </DottedSegment>
      </>
    );
  }

  return null;
};

export default Totals;
