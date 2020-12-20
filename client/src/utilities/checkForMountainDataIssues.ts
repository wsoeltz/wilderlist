/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import { captureMessage } from '@sentry/react';
import axios from 'axios';
import { Mountain } from '../types/graphQLTypes';

interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
  elevation: Mountain['elevation'];
}

const removeCommonWords = (word: string) => [
    'hill',
    'mountain',
    'peak',
    'mount',
  ].indexOf(word) === -1;

const checkMountainForDataIssues = async ({name, id, latitude, longitude, elevation}: MountainDatum) => {
  try {
    const nearbyMountains: any = await axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `
            query getNearbyMountains {
            mountains: nearbyMountains(
              latitude: ${latitude},
              longitude: ${longitude},
              latDistance: 0.01,
              longDistance: 0.01,
              limit: 50,
            ) {
              id
              name
            }
          }
          `,
      },
    });
    if (nearbyMountains && nearbyMountains.data && nearbyMountains.data.data &&
        nearbyMountains.data.data.mountains && nearbyMountains.data.data.mountains.length) {
      const possibleDuplicates: string[] = [];
      const regex = new RegExp(name.toLowerCase().split(' ').filter(removeCommonWords).join('|'));
      nearbyMountains.data.data.mountains.forEach((mtn: MountainDatum) => {
        if (regex.test(mtn.name.toLowerCase()) && mtn.id !== id) {
          possibleDuplicates.push(mtn.name + '|' + mtn.id);
        }
      });
      if (possibleDuplicates.length) {
        const message =
          `Possible duplicates of ${name}|${id} : ${possibleDuplicates.join(' - ')}`;
        console.error(message);
        captureMessage(message);
      }
    }

    const elevDistance = 0.0009;

    const actualElevation = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude}&y=${latitude}&units=Feet&output=json`,
    );
    const nearbyElevation1 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude + elevDistance}&y=${latitude}&units=Feet&output=json`,
    );
    const nearbyElevation2 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude - elevDistance}&y=${latitude}&units=Feet&output=json`,
    );
    const nearbyElevation3 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude + elevDistance}&y=${latitude + elevDistance}&units=Feet&output=json`,
    );
    const nearbyElevation4 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude - elevDistance}&y=${latitude + elevDistance}&units=Feet&output=json`,
    );
    const nearbyElevation5 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude + elevDistance}&y=${latitude - elevDistance}&units=Feet&output=json`,
    );
    const nearbyElevation6 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude - elevDistance}&y=${latitude - elevDistance}&units=Feet&output=json`,
    );
    const nearbyElevation7 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude}&y=${latitude + elevDistance}&units=Feet&output=json`,
    );
    const nearbyElevation8 = await axios.get(
      `https://nationalmap.gov/epqs/pqs.php?x=${longitude}&y=${latitude - elevDistance}&units=Feet&output=json`,
    );

    const nearbyElevations = [
      nearbyElevation1,
      nearbyElevation2,
      nearbyElevation3,
      nearbyElevation4,
      nearbyElevation5,
      nearbyElevation6,
      nearbyElevation7,
      nearbyElevation8,
    ];

    if (actualElevation && actualElevation.data && actualElevation.data.USGS_Elevation_Point_Query_Service &&
        actualElevation.data.USGS_Elevation_Point_Query_Service.Elevation_Query &&
        actualElevation.data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation
      ) {
      const actualElevationValue = actualElevation.data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation;
      let incorrectElevation: number | undefined;
      nearbyElevations.forEach(r => {
        if (r && r.data && r.data.USGS_Elevation_Point_Query_Service &&
            r.data.USGS_Elevation_Point_Query_Service &&
            r.data.USGS_Elevation_Point_Query_Service.Elevation_Query &&
            r.data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation &&
            r.data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation > actualElevationValue
          ) {
          incorrectElevation = r.data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation;
        }
      });
      if (incorrectElevation) {
          const message = (
            `Possible incorrect elevation of ${name}|${id} : ${elevation}(ORIG) vs ${actualElevationValue}(ACT) vs ${incorrectElevation}(NEW)`
          );
          console.error(message);
          captureMessage(message);
      }
    }

  } catch (err) {
    console.error(err);
    captureMessage(err);
  }
};

export default checkMountainForDataIssues;
