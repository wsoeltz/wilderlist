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
