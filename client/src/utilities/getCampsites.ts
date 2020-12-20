import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

export enum Sources {
  RecrationGov = 'recreationgov',
  ReserveAmerica = 'reserveamerica',
}

export interface Campsite {
  id: string;
  source: Sources;
  contractCode: string | null;
  name: string;
  description: string | null;
  directions: string | null;
  fee: string | null;
  contact: {
    phone: string | null;
    email: string | null;
    reservationUrl: string | null;
    mapUrl: string | null;
  };
  latitude: number;
  longitude: number;
}

const cache: any = setupCache({
  maxAge: 5 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
});

const getCampsites = axios.create({
  /* eslint-disable max-len */
/* tslint:disable:max-line-length */
  baseURL: '/api/recreationgov?filter=campsites',
  adapter: cache.adapter,
});

export default getCampsites;
