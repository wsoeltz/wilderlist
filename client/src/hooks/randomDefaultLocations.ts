interface RandomLocationDatum {
  localCoordinates: {lat: number, lng: number};
  text: string;
  city: string;
  stateAbbreviation: string;
  stateId: string;
}

const randomLocations: RandomLocationDatum[] = [
  {
    localCoordinates: {lat: 44.2705, lng: -71.30325},
    text: 'Mount Washington, NH',
    city: 'Sargent\'s Purchase',
    stateAbbreviation: 'NH',
    stateId: '5d5db5e67285c2a4ff69b164',
  },
  {
    localCoordinates: {lat: 45.904354, lng: -68.921274},
    text: 'Mount Katahdin, ME',
    city: 'Northeast Piscataquis',
    stateAbbreviation: 'ME',
    stateId: '5d5db5f97285c2a4ff69b166',
  },
  {
    localCoordinates: {lat: 36.578581, lng: -118.291995},
    text: 'Mount Whitney, CA',
    city: 'Sequoia National Park',
    stateAbbreviation: 'CA',
    stateId: '5e62d6395bff660017daec45',
  },
  {
    localCoordinates: {lat: 45.373514, lng: -121.695919},
    text: 'Mount Hood, OR',
    city: 'Clackamas',
    stateAbbreviation: 'OR',
    stateId: '5e62d7475bff660017daec5e',
  },
  {
    localCoordinates: {lat: 46.852886, lng: -121.760374},
    text: 'Mount Rainier, WA',
    city: 'Mount Rainier National Park',
    stateAbbreviation: 'WA',
    stateId: '5e62d79c5bff660017daec65',
  },
  {
    localCoordinates: {lat: 35.764839, lng: -82.265122},
    text: 'Mount Mitchell, NC',
    city: 'Yancey County',
    stateAbbreviation: 'NC',
    stateId: '5d5ec2cf7a0cc7bc50393881',
  },
  {
    localCoordinates: {lat: 39.117751, lng: -106.445358},
    text: 'Mount Elbert, CO',
    city: 'Lake County',
    stateAbbreviation: 'CO',
    stateId: '5e62d63e5bff660017daec46',
  },
];

const randomDefaultLocations = () => randomLocations[Math.floor(Math.random() * randomLocations.length)];

export default randomDefaultLocations;
