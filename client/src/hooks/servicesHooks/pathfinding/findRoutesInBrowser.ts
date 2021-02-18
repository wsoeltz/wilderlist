import getPathFinder from './getPathfinder';
import {RoutesToPointInput} from '../../../routing/services';
// import {asyncForEach} from '../../../Utils';
import uniqBy from 'lodash/uniqBy';
// import {
//   FeatureCollection,
// } from './simpleCache';
import Parallel from 'paralleljs';

const {lineString, featureCollection} = require('@turf/helpers');
// const {getElevationForLine} = require('../../utilities/getElevation');
const distance = require('@turf/distance').default;
const length = require('@turf/length').default;

interface Input {
  geojson: any[];
  destinations: any[];
  lng: number;
  lat: number;
  destinationType?: RoutesToPointInput['destination'];
}

const mergeAndResolve = (paths: any[], resolve: any) => {
  const pathsWithElevation: any[] = [];
  paths.forEach(p => {
      const routeLength = length(p, {units: 'miles'});    
      // const elevationData = await getElevationForLine(p.geometry.coordinates, true, true);
      const properties = {
        ...p.properties,
        routeLength,
        // elevationGain: elevationData.elevationGain,
        // elevationLoss: elevationData.elevationLoss,
        // elevationMin: elevationData.minElevation,
        // elevationMax: elevationData.maxElevation,
        // avgSlope: elevationData.averageSlopeAngle,
        // maxSlope: elevationData.maxSlope,
        // minSlope: elevationData.minSlope,
      }
      const geometry = {
        ...p.geometry,
        // coordinates: elevationData.elevationLine
      }
      pathsWithElevation.push({
        ...p,
        geometry,
        properties,
      })
    }
  );
  resolve(featureCollection(pathsWithElevation));
}

const findRoutesInBrower = (input: Input) => {
  const {geojson, destinations, lng, lat, destinationType} = input;
  const totalDestinations = destinations.length;
  let pathsChecked = 0;
  const paths: any[] = [];

  return new Promise((resolve) => {
    const {pathFinder, nearestPointInNetwork} = getPathFinder(geojson);
    const endPoint = nearestPointInNetwork([lng, lat]);
    const distanceFromActualToGraphPoint = distance([ lng, lat ], endPoint, {units: 'miles'});
    if (distanceFromActualToGraphPoint < 0.1) {
      destinations.forEach(p => {
        
        const startPoint = nearestPointInNetwork(p.location);
        const startPointDistanceToActualPoint = distance(p.location, startPoint, {units: 'miles'});

        const thread = new Parallel({
          start: startPoint,
          end: endPoint,
          shouldSearch: destinationType === 'parking' || startPointDistanceToActualPoint < 0.15,
        });
        // const thread = new Parallel('thread data');

        thread.require(pathFinder);

        const findPath = (data: any) => {
          const {start, end, shouldSearch} = data;
          if (shouldSearch) {
            return pathFinder.findPath(start, end);
          } else {
            return null;
          }
        }
        // Spawn a remote job (we'll see more on how to use then later)
        thread.spawn(findPath as any)
        .then((path: any) => {
          console.log(path)
          if (path) {
            if (path && path.path && path.path.length > 1) {
              const trails = uniqBy(path.edgeDatas.map(({reducedEdge}: any) => reducedEdge), 'id');
              const line = destinationType !== 'parking' ? path.path.reverse() : path.path;
              paths.push(lineString(line, {trails, destination: p}))
            }
          }
          pathsChecked++;
          if (pathsChecked >= totalDestinations) {
            mergeAndResolve(paths, resolve);
          }
        }, error => {{
          console.error(error)
          pathsChecked++;
          if (pathsChecked >= totalDestinations) {
            mergeAndResolve(paths, resolve);
          }
        }});
      });
    } else {
      resolve({
        type: 'FeatureCollection',
        features: [],
      });
    }

    // resolve(featureCollection(pathsWithElevation) as FeatureCollection);
  })
}

export default findRoutesInBrower;
