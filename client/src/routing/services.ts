import {Coordinate} from '../types/graphQLTypes';

const baseUrl = process.env.REACT_APP_SERVICES_API as string;

enum ServicesRoutes {
  pointInfo = '/api/point-info',
  lineElevation = '/api/line-elevation',
  directionsToPoint = '/api/directions-to-point',
  directionsToParking = '/api/directions-to-parking',
  weatherAtPoint = '/api/weather-at-point',
  weatherAtValley = '/api/weather-at-valley',
  localParking = '/api/local-parking',
  localLinestrings = '/api/local-linestrings',
  routesToPoint = '/api/routes-to-point',
}

export const getWeatherAtPointURL = ({coord, valley}: {coord: Coordinate, valley?: boolean}) => valley
  ? `${baseUrl}${ServicesRoutes.weatherAtValley}?lat=${coord[1]}&lng=${coord[0]}`
  : `${baseUrl}${ServicesRoutes.weatherAtPoint}?lat=${coord[1]}&lng=${coord[0]}`;
