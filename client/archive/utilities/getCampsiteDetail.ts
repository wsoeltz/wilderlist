import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

export interface CampsiteDetail {
  id: string;
  image: string | null;
  description: string | null;
  directions: string | null;
  contact: {
    phone: string | null;
    email: string | null;
    reservationUrl: string | null;
    mapUrl: string | null;
  };
}

const cache: any = setupCache({
  maxAge: 5 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
});

const getCampsites = axios.create({
  baseURL: '/api/recreationgovdetail',
  adapter: cache.adapter,
});

export default getCampsites;
