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

interface PointInfoInput {
  coord: Coordinate;
  state?: boolean;
  county?: boolean;
  elevation?: boolean;
}

export const getPointInfoURL = ({coord, state, county, elevation}: PointInfoInput) => {
  const includeState = state ? `&state=true` : '';
  const includeCounty = county ? `&county=true` : '';
  const includeElevation = elevation ? `&elevation=true` : '';
  return `${baseUrl}${ServicesRoutes.pointInfo}` +
    `?lat=${coord[1].toFixed(6)}&lng=${coord[0].toFixed(6)}${includeState}${includeCounty}${includeElevation}`;
};

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
    altCoordsParam = `&alt_lat=${altCoord[1]}&alt_lng=${altCoord[0]}`;
  }
  const destinationParam = destination ? `&destination=${destination}` : '';
  return `${baseUrl}${ServicesRoutes.routesToPoint}` +
    `?lat=${coord[1]}&lng=${coord[0]}${altCoordsParam}${destinationParam}`;
};

export interface DirectionToParkingInput {
  start: Coordinate;
  end: Coordinate;
  considerDirect?: boolean;
  totalResults?: number;
}
export const getDirectionToParkingURL = ({start, end, considerDirect, totalResults}: DirectionToParkingInput) => {
  const direct = considerDirect ? `&direct=true` : '';
  const limit = totalResults ? `&limit=${totalResults}` : '';
  return `${baseUrl}${ServicesRoutes.directionsToParking}` +
    `?lat1=${start[1].toFixed(4)}&lng1=${start[0].toFixed(4)}&lat2=${end[1].toFixed(4)}&lng2=${end[0].toFixed(4)}${direct}${limit}`;
};

export interface SnowReportInput {
  coord: Coordinate;
  stateAbbr: string;
}
export const getSnowReportURL = ({coord, stateAbbr}: SnowReportInput) => {
  return `${baseUrl}${ServicesRoutes.snowReport}` +
    `?lat=${coord[1]}&lng=${coord[0]}&state_abbr=${stateAbbr}`;
};

export const getLineElevationUrl = () => {
  return `${baseUrl}${ServicesRoutes.lineElevation}`;
};
