import { GetString } from 'fluent-react/compat';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  PeakListVariants,
} from '../../../types/graphQLTypes';
import {
  CoreItem,
  CoreItems,
} from '../../../types/itemTypes';
import {
  getSolsticeAndEquinox,
} from '../../../Utils';

const getElevationToLowest500 = (elevation: number) => {
  if (elevation < 1000) {
    return Math.floor(elevation / 100) * 100;
  } else {
    return Math.floor(elevation / 500) * 500;
  }
};

interface Input {
  type: PeakListVariants;
  parent: {name: string} | null;
  listName: string;
  shortName: string;
  numberOfPeaks: number;
  numberOfTrails: number;
  numberOfCampsites: number;
  totalTrailLength: number;
  isStateOrRegion: 'state' | 'region';
  stateRegionName: string;
  highestMountain: {name: string, elevation: number} | undefined;
  smallestMountain: {name: string, elevation: number} | undefined;
}

const getSentences = (input: {getString: GetString } & Input) => {
  const {
    type, parent, getString,
    listName, numberOfPeaks, isStateOrRegion, stateRegionName, highestMountain, smallestMountain,
    shortName, numberOfTrails, numberOfCampsites, totalTrailLength,
  } = input;
  const allPointsArray: string[] = [];
  const allPointsNoCounts: string[] = [];
  if (numberOfPeaks) {
    allPointsNoCounts.push(CoreItems.mountains);
    allPointsArray.push(getString('global-item-count', {type: CoreItem.mountain, count: numberOfPeaks}));
  }
  if (numberOfTrails && totalTrailLength) {
    const trailLengthText = totalTrailLength < 0.1
      ? getString('distance-feet-formatted', {feet: Math.round(totalTrailLength * 5280)}) // miles to feet conversion
      : getString('directions-driving-distance', {miles: parseFloat(totalTrailLength.toFixed(1))});
    allPointsNoCounts.push(CoreItems.trails);
    allPointsArray.push(trailLengthText + ' ' + getString('global-of-trail', {
      type: CoreItem.trail,
      count: trailLengthText,
    }));
  }
  if (numberOfCampsites) {
    allPointsNoCounts.push(CoreItems.campsites);
    allPointsArray.push(getString('global-item-count', {type: CoreItem.campsite, count: numberOfCampsites}));
  }
  let mountainsTrailsCampsitesCount: string;
  let mountainsTrailsCampsitesNoCount: string;
  if (allPointsArray.length === 3) {
    mountainsTrailsCampsitesCount = allPointsArray[0] + ', ' + allPointsArray[1] + ' and ' + allPointsArray[2];
    mountainsTrailsCampsitesNoCount =
      allPointsNoCounts[0] + ', ' + allPointsNoCounts[1] + ' and ' + allPointsNoCounts[2];
  } else if (allPointsArray.length === 2) {
    mountainsTrailsCampsitesCount = allPointsArray[0] + ' and ' + allPointsArray[1];
    mountainsTrailsCampsitesNoCount = allPointsNoCounts[0] + ' and ' + allPointsNoCounts[1];
  } else if (allPointsArray.length === 1) {
    mountainsTrailsCampsitesCount = allPointsArray[0];
    mountainsTrailsCampsitesNoCount = allPointsNoCounts[0];
  } else {
    mountainsTrailsCampsitesCount = 'no points';
    mountainsTrailsCampsitesNoCount = '';
  }

  const date =  new Date();
  const currentYear = date.getFullYear();
  const month = date.getMonth();
  const lastYearsSeasons = getSolsticeAndEquinox(currentYear - 1);
  const thisYearsSeasons = getSolsticeAndEquinox(currentYear);
  const nextYearsSeasons = getSolsticeAndEquinox(currentYear + 1);

  let firstParagraph: string = '';
  let secondParagraph: string = '';
  let thirdParagraph: string = '';
  if (type === PeakListVariants.standard || !parent) {
    firstParagraph = getString('peak-list-detail-list-standard-para-1', {
      'list-name': listName,
      'mountains-trails-campsites': mountainsTrailsCampsitesCount,
      'state-or-region': isStateOrRegion.toString(),
      'state-region-name': stateRegionName,
    });
    if (highestMountain && smallestMountain) {
      firstParagraph = firstParagraph + ' ' +
        getString('peak-list-detail-list-standard-para-1-mountains', {
          'highest-mountain-name': highestMountain.name,
          'highest-mountain-elevation': '' + highestMountain.elevation,
          'smallest-mountain-name': smallestMountain.name,
          'smallest-mountain-elevation': '' + smallestMountain.elevation,
          type,
        });
    }
    secondParagraph = getString('peak-list-detail-list-standard-para-2', {
      'list-name': listName,
      'mountains-trails-campsites': mountainsTrailsCampsitesNoCount,
    });
    thirdParagraph = '';
  }
  if (type === PeakListVariants.winter) {
    firstParagraph = !parent ? firstParagraph : getString(
      'peak-list-detail-list-winter-has-parent-para-1', {
      'list-name': listName,
      'short-name': shortName,
      'parent-list-name': parent.name,
      'number-of-peaks': '' + numberOfPeaks,
      'state-region-name': stateRegionName,
      'mountains-trails-campsites': mountainsTrailsCampsitesCount,
      'mountains-trails-campsites-no-count': mountainsTrailsCampsitesNoCount,
    });
    if (highestMountain && smallestMountain) {
      firstParagraph = firstParagraph + ' ' + getString(
      'peak-list-detail-list-winter-has-parent-para-1-mountains', {
        'highest-mountain-name': highestMountain.name,
        'highest-mountain-elevation': '' + highestMountain.elevation,
        'smallest-mountain-name': smallestMountain.name,
        'smallest-mountain-elevation': '' + smallestMountain.elevation,
        'min-elevation-rounded': getElevationToLowest500(smallestMountain.elevation).toString(),
      });
    }
    const winterIsOver = month > 2;
    secondParagraph = getString('peak-list-detail-list-winter-para-2', {
      'list-name': listName,
      'current-or-upcoming': winterIsOver ? 'upcoming' : 'current',
      'solstice': winterIsOver || month === 11 ? thisYearsSeasons.firstDayOfWinter : lastYearsSeasons.firstDayOfWinter,
      'equinox': winterIsOver || month === 11 ? nextYearsSeasons.firstDayOfSpring : thisYearsSeasons.firstDayOfSpring,
      'mountains-trails-campsites-no-count': mountainsTrailsCampsitesNoCount,
    });
    thirdParagraph = getString('peak-list-detail-list-winter-para-3', {
      'list-name': listName,
    });
  } else if (type === PeakListVariants.fourSeason) {
    firstParagraph = !parent ? firstParagraph : getString(
      'peak-list-detail-list-4-season-has-parent-para-1', {
      'list-name': listName,
      'short-name': shortName,
      'parent-list-name': parent.name,
      'number-of-peaks': '' + numberOfPeaks,
      'state-region-name': stateRegionName,
      'mountains-trails-campsites': mountainsTrailsCampsitesCount,
      'mountains-trails-campsites-no-count': mountainsTrailsCampsitesNoCount,
    });
    if (highestMountain && smallestMountain) {
      firstParagraph = firstParagraph + ' ' + getString(
      'peak-list-detail-list-winter-has-parent-para-1-mountains', {
        'highest-mountain-name': highestMountain.name,
        'highest-mountain-elevation': '' + highestMountain.elevation,
        'smallest-mountain-name': smallestMountain.name,
        'smallest-mountain-elevation': '' + smallestMountain.elevation,
        'min-elevation-rounded': getElevationToLowest500(smallestMountain.elevation).toString(),
      });
    }
    secondParagraph = getString('peak-list-detail-list-4-season-para-2', {
      'list-name': listName,
      'current-year': currentYear.toString(),
      'first-day-of-spring': thisYearsSeasons.firstDayOfSpring,
      'first-day-of-summer': thisYearsSeasons.firstDayOfSummer,
      'first-day-of-fall': thisYearsSeasons.firstDayOfFall,
      'first-day-of-winter': thisYearsSeasons.firstDayOfWinter,
      'mountains-trails-campsites-no-count': mountainsTrailsCampsitesNoCount,
    });
    thirdParagraph = getString('peak-list-detail-list-4-season-para-3', {
      'list-name': listName,
    });
  } else if (type === PeakListVariants.grid) {
    firstParagraph = !parent || !highestMountain || !smallestMountain ? firstParagraph : getString(
      'peak-list-detail-list-grid-has-parent-para-1', {
      'list-name': listName,
      'short-name': shortName,
      'parent-list-name': parent.name,
      'number-of-peaks': '' + numberOfPeaks,
      'state-region-name': stateRegionName,
      'mountains-trails-campsites': mountainsTrailsCampsitesCount,
      'mountains-trails-campsites-no-count': mountainsTrailsCampsitesNoCount,
    });
    secondParagraph = getString('peak-list-detail-list-grid-para-2', {
      'list-name': listName,
      'mountains-trails-campsites-no-count': mountainsTrailsCampsitesNoCount,
    });
    thirdParagraph = getString('peak-list-detail-list-grid-para-3', {
      'list-name': listName,
    });
  }
  return { firstParagraph, secondParagraph, thirdParagraph };
};

const IntroText = (props: Input) => {
  const {
    type, parent, listName, shortName, numberOfPeaks, isStateOrRegion,
    stateRegionName, highestMountain, smallestMountain,
    numberOfTrails, numberOfCampsites, totalTrailLength,
  } = props;
  const getString = useFluent();
  const {firstParagraph, secondParagraph, thirdParagraph} = getSentences({
    getString, type, parent, listName, shortName, numberOfPeaks, isStateOrRegion,
    stateRegionName, highestMountain, smallestMountain,
    numberOfTrails, numberOfCampsites, totalTrailLength,
  });
  return (
    <>
      <p>{firstParagraph}</p>
      <p>{secondParagraph}</p>
      <p>{thirdParagraph}</p>
    </>
  );
};

export default IntroText;
