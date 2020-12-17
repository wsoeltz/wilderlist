import { PeakListVariants } from '../../../types/graphQLTypes';
import {
  VariableDate,
} from '../../peakLists/detail/getCompletionDates';
import {CoordinateWithDates, PopupDataTypes} from './types';

const startColor = '#dc4900';
const endColor = '#145500';

export const twoColorScale: [string, string] = [
  startColor,
  endColor,
];
export const fiveColorScale: [string, string, string, string, string] = [
  startColor,
  '#cb9e00',
  '#99b900',
  '#4a8900',
  endColor,
];
export const thirteenColorScale:
  [string, string, string, string, string, string, string, string, string, string, string, string, string] = [
  startColor,
  '#d37700',
  '#ce9200',
  '#cb9e00',
  '#c8aa00',
  '#c5b500',
  '#b5bf00',
  '#99b900',
  '#8ab100',
  '#7ca900',
  '#629900',
  '#4a8900',
  endColor,
];

export const legendColorScheme = {
  primary: '#216ba5',
  secondary: '#848484',
};

const startSymbol = 'mountain-perc-0';
const endSymbol = 'mountain-perc-100';

export const twoSymbolScale: [string, string] = [
  startSymbol,
  endSymbol,
];
export const fiveSymbolScale: [string, string, string, string, string] = [
  startSymbol,
  'mountain-perc-25',
  'mountain-perc-50',
  'mountain-perc-75',
  endSymbol,
];
export const thirteenSymbolScale:
  [string, string, string, string, string, string, string, string, string, string, string, string, string] = [
  startSymbol,
  'mountain-perc-8',
  'mountain-perc-17',
  'mountain-perc-25',
  'mountain-perc-33',
  'mountain-perc-42',
  'mountain-perc-50',
  'mountain-perc-58',
  'mountain-perc-67',
  'mountain-perc-75',
  'mountain-perc-83',
  'mountain-perc-92',
  endSymbol,
];

export const legendSymbolScheme = {
  primary: 'mountain-highlighted',
  secondary: 'mountain-default',
};

interface ImageAndIconInput {
  colorScaleColors: string[];
  colorScaleSymbols: string[];
  point: CoordinateWithDates;
  createOrEditMountain: boolean | undefined;
  highlighted: undefined | CoordinateWithDates[];
  popUpDataType: PopupDataTypes.Coordinate | PopupDataTypes.OtherMountain;
  addRemoveEnabled?: boolean;
}
export const getImageAndIcon = (input: ImageAndIconInput): {circleColor: string, iconImage: string} => {
  const {
    colorScaleColors,
    point, createOrEditMountain, highlighted,
    colorScaleSymbols, popUpDataType, addRemoveEnabled,
  } = input;

  let circleColor: string;
  let iconImage: string;

  const {completionDates} = point;

  if (addRemoveEnabled) {
    if (popUpDataType === PopupDataTypes.Coordinate) {
      circleColor = legendColorScheme.primary;
      iconImage = legendSymbolScheme.primary;
    } else {
      circleColor = legendColorScheme.secondary;
      iconImage = legendSymbolScheme.secondary;
    }
  } else if (colorScaleColors.length === 0) {
    circleColor = legendColorScheme.primary;
    iconImage = legendSymbolScheme.primary;
  } else if (completionDates === null || completionDates === undefined) {
    if (createOrEditMountain === true && highlighted && highlighted.length &&
      (point.latitude === highlighted[0].latitude && point.longitude === highlighted[0].longitude)) {
      circleColor = colorScaleColors[1];
      iconImage = colorScaleSymbols[1];
    } else {
      circleColor = colorScaleColors[0];
      iconImage = colorScaleSymbols[0];
    }
  } else if (completionDates.type === PeakListVariants.standard) {
    circleColor = completionDates.standard !== undefined ? colorScaleColors[1] : colorScaleColors[0];
    iconImage = completionDates.standard !== undefined ? colorScaleSymbols[1] : colorScaleSymbols[0];
  } else if (completionDates.type === PeakListVariants.winter) {
    circleColor = completionDates.winter !== undefined ? colorScaleColors[1] : colorScaleColors[0];
    iconImage = completionDates.winter !== undefined ? colorScaleSymbols[1] : colorScaleSymbols[0];
  } else if (completionDates.type === PeakListVariants.fourSeason) {
    let completionCount: number = 0;
    Object.keys(completionDates).forEach(function(season: keyof VariableDate) {
      if (season !== 'type' && completionDates[season] !== undefined) {
        completionCount += 1;
      }
    });
    circleColor = colorScaleColors[completionCount];
    iconImage = colorScaleSymbols[completionCount];
  } else if (completionDates.type === PeakListVariants.grid) {
    let completionCount: number = 0;
    Object.keys(completionDates).forEach(function(month: keyof VariableDate) {
      if (month !== 'type' && completionDates[month] !== undefined) {
        completionCount += 1;
      }
    });
    circleColor = colorScaleColors[completionCount];
    iconImage = colorScaleSymbols[completionCount];
  } else {
    circleColor = colorScaleColors[1];
    iconImage = colorScaleSymbols[1];
  }

  return {circleColor, iconImage};
};
