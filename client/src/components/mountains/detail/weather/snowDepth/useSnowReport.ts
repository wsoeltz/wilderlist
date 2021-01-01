import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import orderBy from 'lodash/sortBy';
import {useEffect, useState} from 'react';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import {getDistanceFromLatLonInMiles} from '../../../../../Utils';

export interface Input {
  latitude: number;
  longitude: number;
  stateAbbr: string;
}
interface RawSnowDatum {
  county: string;
  elev: string;
  ghcnid: string;
  lat: string;
  lon: string;
  state: {name: string};
  state_abbr: string;
  station_name: string;
  station_type: string;
  values: {[key: string]: string};
}

export enum AltValues {
  Trace = 'trace amounts',
  NoData = 'no data',
}

interface SnowValue {
  date: Date; value: number | AltValues;
}

interface CleanedSnowData {
  county: string;
  stationName: string;
  location: [number, number];
  distance: number;
  elevation: number;
  values: SnowValue[];
}

interface Output {
  loading: boolean;
  error: undefined | {message: string};
  data: undefined | {
    snowfall: CleanedSnowData;
    snowdepth: CleanedSnowData;
  };
}

const cacheSnowFall: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getSnowFall = axios.create({
  adapter: cacheSnowFall.adapter,
});

const cacheSnowDepth: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getSnowDepth = axios.create({
  adapter: cacheSnowDepth.adapter,
});

const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

const handleHyphens = (word: string) => word.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');

const isDirections = (word: string) => word.length <= 3 && word.match(/^[WENS]+$/g) && word !== 'NEW';

const useSnowReport = (input: Input) => {
  const currentUser = useCurrentUser();
  const [output, setOutput] = useState<Output>({loading: true, error: undefined, data: undefined});

  useEffect(() => {
    const {stateAbbr, latitude, longitude} = input;
    let ignoreResult: boolean = false;
    const fetchSnowReport = async () => {
      try {
        const today = new Date();
        let year = today.getFullYear();
        let month = (today.getMonth() + 1); // javascript months start at 0
        let day = today.getDate() - 1; // report should be for yesterday
        if (day === 0) {
          year = month === 1 ? year - 1 : year;
          month = month === 1 ? 12 : month - 1;
          day = daysInMonth(month, year);
        }
        const stringMonth = month < 10 ? `0${month}` : month.toString();
        const snowfallRes = await getSnowFall(
          `https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/${stateAbbr}-snowfall-${year}${stringMonth}.json`);
        const snowdepthRes = await getSnowDepth(
          `https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/${stateAbbr}-snow-depth-${year}${stringMonth}.json`);
        const sortedSnowFallStations = orderBy<RawSnowDatum>(snowfallRes.data.data, (d: RawSnowDatum) =>
          getDistanceFromLatLonInMiles({
            lat1: latitude,
            lon1: longitude,
            lat2: parseFloat(d.lat),
            lon2: parseFloat(d.lon),
          }),
        );
        const sortedSnowDepthStations = orderBy<RawSnowDatum>(snowdepthRes.data.data, (d: RawSnowDatum) =>
          getDistanceFromLatLonInMiles({
            lat1: latitude,
            lon1: longitude,
            lat2: parseFloat(d.lat),
            lon2: parseFloat(d.lon),
          }),
        );
        if (sortedSnowFallStations && sortedSnowFallStations[0] &&
            sortedSnowDepthStations && sortedSnowDepthStations[0]) {
          const snowfallValues: SnowValue[] = [];
          const snowdepthValues: SnowValue[] = [];
          let snowfallPrevMonth: undefined | RawSnowDatum;
          let snowdepthPrevMonth: undefined | RawSnowDatum;
          const prevMonthMaxDay = daysInMonth(month - 1, year);
          const prevMonth = month === 1 ? 12 : month - 1;
          const stringPrevMonth = prevMonth < 10 ? `0${prevMonth}` : (prevMonth).toString();
          const prevYear = prevMonth === 12 ? year - 1 : year;
          if (day < 7) {
            const prevSnowFall = await getSnowFall(
              `https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/${
                stateAbbr}-snowfall-${prevYear}${stringPrevMonth}.json`,
            );
            const prevSnowDepth = await getSnowDepth(
            `https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/${
              stateAbbr}-snow-depth-${prevYear}${stringPrevMonth}.json`,
            );
            snowfallPrevMonth = prevSnowFall.data.data[sortedSnowFallStations[0].ghcnid];
            snowdepthPrevMonth = prevSnowDepth.data.data[sortedSnowFallStations[0].ghcnid];
          }
          for (let i = day; i > day - 7; i--) {
            let snowfallValue: number | AltValues | undefined;
            let snowdepthValue: number | AltValues | undefined;
            let date: Date | undefined;
            if (i > 0) {
              date = new Date(`${year}-${month}-${i} 00:00`);
              if (sortedSnowFallStations[0].values[i] === 'M') {
                snowfallValue = AltValues.NoData;
              } else if (sortedSnowFallStations[0].values[i] === 'T') {
                snowfallValue = AltValues.Trace;
              } else if (!isNaN(parseFloat(sortedSnowFallStations[0].values[i]))) {
                snowfallValue = parseFloat(sortedSnowFallStations[0].values[i]);
              } else if (!sortedSnowFallStations[0].values[i] !== undefined) {
                snowfallValue = AltValues.NoData;
              }

              if (sortedSnowDepthStations[0].values[i] === 'M') {
                snowdepthValue = AltValues.NoData;
              } else if (sortedSnowDepthStations[0].values[i] === 'T') {
                snowdepthValue = AltValues.Trace;
              } else if (!isNaN(parseFloat(sortedSnowDepthStations[0].values[i]))) {
                snowdepthValue = parseFloat(sortedSnowDepthStations[0].values[i]);
              } else if (sortedSnowDepthStations[0].values[i] !== undefined) {
                snowdepthValue = AltValues.NoData;
              }

            } else if (snowfallPrevMonth && snowdepthPrevMonth && prevMonthMaxDay) {
              const prevDay = prevMonthMaxDay + i;
              date = new Date(`${prevYear}-${prevMonth}-${prevDay} 00:00`);
              if (snowfallPrevMonth.values[prevDay] === 'M') {
                snowfallValue = AltValues.NoData;
              } else if (snowfallPrevMonth.values[prevDay] === 'T') {
                snowfallValue = AltValues.Trace;
              } else if (!isNaN(parseFloat(snowfallPrevMonth.values[i]))) {
                snowfallValue = parseFloat(snowfallPrevMonth.values[i]);
              } else if (snowfallPrevMonth.values[i] !== undefined) {
                snowfallValue = AltValues.NoData;
              }

              if (snowdepthPrevMonth.values[prevDay] === 'M') {
                snowdepthValue = AltValues.NoData;
              } else if (snowdepthPrevMonth.values[prevDay] === 'T') {
                snowdepthValue = AltValues.Trace;
              } else if (!isNaN(parseFloat(snowdepthPrevMonth.values[i]))) {
                snowdepthValue = parseFloat(snowdepthPrevMonth.values[i]);
              } else if (snowdepthPrevMonth.values[i] !== undefined) {
                snowdepthValue = AltValues.NoData;
              }
            } else {
              snowfallValue = undefined;
              snowdepthValue = undefined;
              date = undefined;
            }
            if (snowfallValue !== undefined && snowdepthValue !== undefined && date !== undefined) {
              snowfallValues.push({
                date,
                value: snowfallValue,
              });
              snowdepthValues.push({
                date,
                value: snowdepthValue,
              });
            }
          }
          const snowfall: CleanedSnowData = {
            county: sortedSnowFallStations[0].county.charAt(0) +
              sortedSnowFallStations[0].county.slice(1).toLowerCase(),
            stationName: sortedSnowFallStations[0].station_name.split(' ')
              .map(word => !isDirections(word)
                ? handleHyphens(word.charAt(0) + word.slice(1).toLowerCase()) : word).join(' '),
            location: [parseFloat(sortedSnowFallStations[0].lon), parseFloat(sortedSnowFallStations[0].lat)],
            distance: getDistanceFromLatLonInMiles({
              lat1: latitude,
              lon1: longitude,
              lat2: parseFloat(sortedSnowFallStations[0].lat),
              lon2: parseFloat(sortedSnowFallStations[0].lon),
            }),
            elevation: parseInt(sortedSnowFallStations[0].elev, 10),
            values: snowfallValues,
          };
          const snowdepth: CleanedSnowData = {
            county: sortedSnowDepthStations[0].county.charAt(0) +
              sortedSnowDepthStations[0].county.slice(1).toLowerCase(),
            stationName: sortedSnowDepthStations[0].station_name.split(' ')
              .map(word => !isDirections(word)
                  ? handleHyphens(word.charAt(0) + word.slice(1).toLowerCase()) : word).join(' '),
            location: [parseFloat(sortedSnowDepthStations[0].lon), parseFloat(sortedSnowDepthStations[0].lat)],
            distance: getDistanceFromLatLonInMiles({
              lat1: latitude,
              lon1: longitude,
              lat2: parseFloat(sortedSnowDepthStations[0].lat),
              lon2: parseFloat(sortedSnowDepthStations[0].lon),
            }),
            elevation: parseInt(sortedSnowDepthStations[0].elev, 10),
            values: snowdepthValues,
          };
          if (ignoreResult) {
            console.warn('Snow report promise canceled for unmounted component');
            return undefined;
          }
          setOutput({loading: false, error: undefined, data: {snowfall, snowdepth}});
        } else {
          throw new Error('Unable to get snow report right now');
        }
      } catch (error) {
        console.error(error);
        if (!ignoreResult) {
          setOutput({loading: false, error, data: undefined});
        }
      }
    };
    if (currentUser !== null) {
      fetchSnowReport();
    }

    return () => {ignoreResult = true; };
  }, [input, currentUser]);

  return output;
};

export default useSnowReport;
