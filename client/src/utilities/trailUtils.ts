const {lineString} = require('@turf/helpers');
import togpx from 'togpx';
import {Coordinate, CoordinateWithElevation} from '../types/graphQLTypes';

enum SteepnessClass {
  Level = 'flat',
  NearlyLevel = 'nearly flat',
  VeryGentleSlope = 'very gentle',
  GentleSlope = 'gentle',
  ModerateSlope = 'moderate',
  StrongSlope = 'moderately steep',
  VeryStrongSlope = 'steep',
  ExtremeSlope = 'very steep',
  SteepSlope = 'extremely steep',
  VerySteepSlope = 'extremely steep',
}

export const slopeToSteepnessClass = (slope: number) => {
  if (slope < 0.5) {
    return SteepnessClass.Level;
  } else if (slope < 1.1) {
    return SteepnessClass.NearlyLevel;
  } else if (slope < 3) {
    return SteepnessClass.VeryGentleSlope;
  } else if (slope < 5) {
    return SteepnessClass.GentleSlope;
  } else if (slope < 8) {
    return SteepnessClass.ModerateSlope;
  } else if (slope < 13) {
    return SteepnessClass.StrongSlope;
  } else if (slope < 18) {
    return SteepnessClass.VeryStrongSlope;
  } else if (slope < 25) {
    return SteepnessClass.ExtremeSlope;
  } else if (slope < 35) {
    return SteepnessClass.SteepSlope;
  } else {
    return SteepnessClass.VerySteepSlope;
  }
};

interface GPXInput {
  name: string;
  line: Array<Coordinate | CoordinateWithElevation>;
  url: string;
}

export const downloadGPXString = ({name, line, url}: GPXInput) => {
  const strippedLine = line.map(([lng, lat]) => [lng, lat]);
  const geojson = lineString(strippedLine, {name, url});
  const gpx = togpx(geojson, {
    creator: 'Wilderlist',
    metadata: {
      copyright: 'Wilderlist, Open Street Map',
      source: 'https://wilderlist.app/',
      time: new Date(),
    },
    featureTitle: () => name,
    featureLink: () => url,
  });

  const filename = name + '.gpx';
  const link = document.createElement('a');
  const blob = new Blob([gpx], {type: 'text/plain'});

  link.setAttribute('href', window.URL.createObjectURL(blob));
  link.setAttribute('download', filename);

  link.dataset.downloadurl = ['text/plain', link.download, link.href].join(':');
  link.draggable = true;
  link.classList.add('dragout');

  link.click();
  link.remove();
};
