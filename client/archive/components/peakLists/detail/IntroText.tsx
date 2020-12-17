import { GetString } from 'fluent-react/compat';
import React from 'react';
import {
  PeakListVariants,
} from '../../../types/graphQLTypes';
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
  getFluentString: GetString;
  listName: string;
  shortName: string;
  numberOfPeaks: number;
  isStateOrRegion: 'state' | 'region';
  stateRegionName: string;
  highestMountain: {name: string, elevation: number};
  smallestMountain: {name: string, elevation: number};
}

export const getSentences = (input: Input) => {
  const {
    type, parent, getFluentString,
    listName, numberOfPeaks, isStateOrRegion, stateRegionName, highestMountain, smallestMountain,
    shortName,
  } = input;

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
    firstParagraph = getFluentString('peak-list-detail-list-standard-para-1', {
      'list-name': listName,
      'number-of-peaks': '' + numberOfPeaks,
      'state-or-region': isStateOrRegion.toString(),
      'state-region-name': stateRegionName,
      'highest-mountain-name': highestMountain.name,
      'highest-mountain-elevation': '' + highestMountain.elevation,
      'smallest-mountain-name': smallestMountain.name,
      'smallest-mountain-elevation': '' + smallestMountain.elevation,
      'type': type,
    });
    secondParagraph = getFluentString('peak-list-detail-list-standard-para-2', {
      'list-name': listName,
    });
    thirdParagraph = '';
  }
  if (type === PeakListVariants.winter) {
    firstParagraph = !parent ? firstParagraph : getFluentString('peak-list-detail-list-winter-has-parent-para-1', {
      'list-name': listName,
      'short-name': shortName,
      'parent-list-name': parent.name,
      'number-of-peaks': '' + numberOfPeaks,
      'state-region-name': stateRegionName,
      'highest-mountain-name': highestMountain.name,
      'highest-mountain-elevation': '' + highestMountain.elevation,
      'smallest-mountain-name': smallestMountain.name,
      'smallest-mountain-elevation': '' + smallestMountain.elevation,
      'min-elevation-rounded': getElevationToLowest500(smallestMountain.elevation).toString(),
    });
    const winterIsOver = month > 2;
    secondParagraph = getFluentString('peak-list-detail-list-winter-para-2', {
      'list-name': listName,
      'short-name': shortName,
      'current-or-upcoming': winterIsOver ? 'upcoming' : 'current',
      'solstice': winterIsOver || month === 11 ? thisYearsSeasons.firstDayOfWinter : lastYearsSeasons.firstDayOfWinter,
      'equinox': winterIsOver || month === 11 ? nextYearsSeasons.firstDayOfSpring : thisYearsSeasons.firstDayOfSpring,
    });
    thirdParagraph = getFluentString('peak-list-detail-list-winter-para-3', {
      'list-name': listName,
    });
  } else if (type === PeakListVariants.fourSeason) {
    firstParagraph = !parent ? firstParagraph : getFluentString('peak-list-detail-list-4-season-has-parent-para-1', {
      'list-name': listName,
      'short-name': shortName,
      'parent-list-name': parent.name,
      'number-of-peaks': '' + numberOfPeaks,
      'state-region-name': stateRegionName,
      'highest-mountain-name': highestMountain.name,
      'highest-mountain-elevation': '' + highestMountain.elevation,
      'smallest-mountain-name': smallestMountain.name,
      'smallest-mountain-elevation': '' + smallestMountain.elevation,
      'min-elevation-rounded': getElevationToLowest500(smallestMountain.elevation).toString(),
    });
    secondParagraph = getFluentString('peak-list-detail-list-4-season-para-2', {
      'list-name': listName,
      'short-name': shortName,
      'current-year': currentYear.toString(),
      'first-day-of-spring': thisYearsSeasons.firstDayOfSpring,
      'first-day-of-summer': thisYearsSeasons.firstDayOfSummer,
      'first-day-of-fall': thisYearsSeasons.firstDayOfFall,
      'first-day-of-winter': thisYearsSeasons.firstDayOfWinter,
    });
    thirdParagraph = getFluentString('peak-list-detail-list-4-season-para-3', {
      'list-name': listName,
    });
  } else if (type === PeakListVariants.grid) {
    firstParagraph = !parent ? firstParagraph : getFluentString('peak-list-detail-list-grid-has-parent-para-1', {
      'list-name': listName,
      'short-name': shortName,
      'parent-list-name': parent.name,
      'number-of-peaks': '' + numberOfPeaks,
      'total-ascents': '' + (numberOfPeaks * 12),
      'state-region-name': stateRegionName,
      'min-elevation-rounded': getElevationToLowest500(smallestMountain.elevation).toString(),
    });
    secondParagraph = getFluentString('peak-list-detail-list-grid-para-2', {
      'list-name': listName,
    });
    thirdParagraph = getFluentString('peak-list-detail-list-grid-para-3', {
      'list-name': listName,
    });
  }
  return { firstParagraph, secondParagraph, thirdParagraph };
};

const IntroText = (props: Input) => {
  const {firstParagraph, secondParagraph, thirdParagraph} = getSentences({...props});
  return (
    <>
      <p>{firstParagraph}</p>
      <p>{secondParagraph}</p>
      <p>{thirdParagraph}</p>
    </>
  );
};

export default IntroText;
