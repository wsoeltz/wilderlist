import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

export enum TrailType {
  Trail = 'Trail',
  Connector = 'Connector',
  FeaturedHike = 'Hike',
}

export enum TrailDifficulty {
  Easy = 'green',
  EasyIntermediate = 'greenBlue',
  Intermediate = 'blue',
  IntermediateDifficult = 'blueBlack',
  Difficult = 'black',
  VeryDifficult = 'dblack',
}

export interface TrailsDatum {
  id: number;
  name: string;
  type: TrailType;
  summary: string;
  difficulty: TrailDifficulty;
  stars: number;
  starVotes: number;
  location: string;
  url: string;
  imgSqSmall: string;
  imgSmall: string;
  imgSmallMed: string;
  imgMedium: string;
  length: number;
  ascent: number;
  descent: number;
  high: number;
  low: number;
  longitude: number;
  latitude: number;
  conditionStatus: string;
  conditionDetails: string;
  conditionDate: string;
}

const cache: any = setupCache({
  maxAge: 5 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
});

const getTrails = axios.create({
  /* eslint-disable max-len */
/* tslint:disable:max-line-length */
  baseURL: `https://www.hikingproject.com/data/get-trails?key=${process.env.REACT_APP_HIKING_PROJECT_KEY}&sort=distance&maxResults=500`,
  adapter: cache.adapter,
});

export default getTrails;
