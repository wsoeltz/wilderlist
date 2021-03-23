import localforage from 'localforage';
import {SearchResultType} from '../../../../types/itemTypes';
import {SearchResultDatum} from './Utils';

let searchHistory: SearchResultDatum[] = [];

const LOCALFORAGE_KEY = 'searchHistroyLocalForageKey';
localforage
  .getItem(LOCALFORAGE_KEY)
  .then((data: SearchResultDatum[] | undefined) => {
    if (data) {
      searchHistory = data;
    }
  })
  .catch(error => {
    console.error(error);
  });
export const yourLocationDatumId = 'YOUR_LOCATION_RESULT';
const yourLocationKeywords = 'your location my location this location here';
const yourLocationDatum: SearchResultDatum = {
  id: yourLocationDatumId,
  name: 'Your Location',
  distance: 0,
  coordinates: [-72, 41],
  type: SearchResultType.geolocation,
  locationName: '',
};

export const getLocalResults = (query: string): SearchResultDatum[] => {
  const yourLocationMatch = yourLocationKeywords.toLowerCase().includes(query.toLowerCase().trim())
    ? [yourLocationDatum]
    : [];
  const matchedSearchHistory = searchHistory
    .filter(({name}) => name
      .toLowerCase()
      .includes(query.toLowerCase().trim()))
    .slice(0, yourLocationMatch.length ? 5 : 6);
  return [...matchedSearchHistory, ...yourLocationMatch];
};

export const pushToLocalResults = (value: SearchResultDatum) => {
  searchHistory = searchHistory.filter(d => d.id !== value.id);
  if (value.id !== yourLocationDatumId) {
    searchHistory.unshift(({...value, history: true}));
  }
  if (searchHistory.length > 100) {
    searchHistory.pop();
  }
  localforage.setItem(LOCALFORAGE_KEY, searchHistory);
};
