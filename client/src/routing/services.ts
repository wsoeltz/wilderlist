import {Coordinate} from '../types/graphQLTypes';

const baseUrl = process.env.REACT_APP_SERVICES_API as string;

enum ServicesRoutes {
  pointInfo = '/api/point-info',
  lineElevation = '/api/line-elevation',
  directionsToPoint = '/api/directions-to-point',
  directionsToParking = '/api/directions-to-parking',
  weatherAtPoint = '/api/weather-at-point',
  weatherAtValley = '/api/weather-at-valley',
  snowReport = '/api/snow-report',
  localParking = '/api/local-parking',
  localLinestrings = '/api/local-linestrings',
  routesToPoint = '/api/routes-to-point',
}

export const getWeatherAtPointURL = ({coord, valley}: {coord: Coordinate, valley?: boolean}) => valley
  ? `${baseUrl}${ServicesRoutes.weatherAtValley}?lat=${coord[1]}&lng=${coord[0]}`
  : `${baseUrl}${ServicesRoutes.weatherAtPoint}?lat=${coord[1]}&lng=${coord[0]}`;

export interface RoutesToPointInput {
  coord: Coordinate;
  altCoord?: Coordinate;
  destination?: 'parking' | 'campsites' | 'mountains';
}
export const getRoutesToPointURL = ({coord, altCoord, destination}: RoutesToPointInput) => {
  let altCoordsParam: string = '';
  if (altCoord) {
    altCoordsParam = `&lat=${altCoord[1]}&lng=${altCoord[0]}`;
  }
  const destinationParam = destination ? `&destination=${destination}` : '';
  return `${baseUrl}${ServicesRoutes.routesToPoint}` +
    `?lat=${coord[1]}&lng=${coord[0]}${altCoordsParam}${destinationParam}`;
};
export const getRoutesToPointRawDataURL = ({coord, altCoord, destination}: RoutesToPointInput) => {
  let altCoordsParam: string = '';
  if (altCoord) {
    altCoordsParam = `&lat=${altCoord[1]}&lng=${altCoord[0]}`;
  }
  const destinationParam = destination ? `&destination=${destination}` : '';
  return `${baseUrl}${ServicesRoutes.routesToPoint}` +
    `?raw=true&lat=${coord[1]}&lng=${coord[0]}${altCoordsParam}${destinationParam}`;
};

export interface DirectionToParkingInput {
  start: Coordinate;
  end: Coordinate;
  considerDirect?: boolean;
}
export const getDirectionToParkingURL = ({start, end, considerDirect}: DirectionToParkingInput) => {
  const direct = considerDirect ? `&direct=true` : '';
  return `${baseUrl}${ServicesRoutes.directionsToParking}` +
    `?lat1=${start[1]}&lng1=${start[0]}&lat2=${end[1]}&lng2=${end[0]}${direct}`;
};

export interface SnowReportInput {
  coord: Coordinate;
  stateAbbr: string;
}
export const getSnowReportURL = ({coord, stateAbbr}: SnowReportInput) => {
  return `${baseUrl}${ServicesRoutes.snowReport}` +
    `?lat=${coord[1]}&lng=${coord[0]}&state_abbr=${stateAbbr}`;
};
