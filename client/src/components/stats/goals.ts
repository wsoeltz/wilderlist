import SevenSummitsSVGURL from './d3Viz/icons/goals/elevation/7-Summits.svg';
import EverestSVGURL from './d3Viz/icons/goals/elevation/Everest.svg';
import ExosphereSVGURL from './d3Viz/icons/goals/elevation/Exosphere.svg';
import International_Space_StationSVGURL from './d3Viz/icons/goals/elevation/International_Space_Station.svg';
import Karman_LineSVGURL from './d3Viz/icons/goals/elevation/Karman_Line.svg';
import MesosphereSVGURL from './d3Viz/icons/goals/elevation/Mesosphere.svg';
import MoonSVGURL from './d3Viz/icons/goals/elevation/Moon.svg';
import Olympus_MonsSVGURL from './d3Viz/icons/goals/elevation/Olympus_Mons.svg';
import Ozone_LayerSVGURL from './d3Viz/icons/goals/elevation/Ozone_Layer.svg';
import StratosphereSVGURL from './d3Viz/icons/goals/elevation/Stratosphere.svg';
import ThermosphereSVGURL from './d3Viz/icons/goals/elevation/Thermosphere.svg';

export const elevationGoals: Array<{name: string, image: string, desc: string, value: number}> = [
  {
    name: 'Everest',
    image: EverestSVGURL,
    desc: 'Hike the cumulative elevation of the tallest mountain on Earth',
    value: 29_032,
  },
  {
    name: 'Olympus Mons',
    image: Olympus_MonsSVGURL,
    desc: 'Hike the cumulative elevation of the tallest mountain on Mars',
    value: 69_841,
  },
  {
    name: 'Ozone Layer',
    image: Ozone_LayerSVGURL,
    desc: 'Hike the cumulative altitude of the Ozone Layer, the part of the atmosphere that absorbs harmful ultraviolet light',
    value: 116_160,
  },
  {
    name: 'Cumulative height of the 7-Summits',
    image: SevenSummitsSVGURL,
    desc: 'Hike the cumulative elevation of all of the highest mountains on each of the seven continents',
    value: 142_114,
  },
  {
    name: 'End of the Stratosphere',
    image: StratosphereSVGURL,
    desc: 'Hike the cumulative altitude of the stratosphere, where planes and jets fly within',
    value: 164_042,
  },
  {
    name: 'End of the Mesosphere',
    image: MesosphereSVGURL,
    desc: 'Hike the cumulative altitude of the mesosphere, home to the polar aurora and where most meteor showers are seen',
    value: 262_467,
  },
  {
    name: 'Kármán line',
    image: Karman_LineSVGURL,
    desc: 'Hike the cumulative altitude of the line at which "space" begins',
    value: 330_000,
  },
  {
    name: 'International Space Station',
    image: International_Space_StationSVGURL,
    desc: 'Hike the cumulative altitude of the height at which the ISS orbits the Earth',
    value: 1_341_120,
  },
  {
    name: 'Edge of the Thermosphere',
    image: ThermosphereSVGURL,
    desc: 'Hike the cumulative altitude of the thermosphere, the layer of atmosphere that most satellites are found',
    value: 2_296_700,
  },
  {
    name: 'Edge of the Exosphere',
    image: ExosphereSVGURL,
    desc: 'Hike the cumulative altitude of the exosphere, the absolute edge of Earth\'s atmosphere.',
    value: 623_390_000,
  },
  {
    name: 'The Moon',
    image: MoonSVGURL,
    desc: 'Hike the cumulative altitude of the Moon',
    value: 1_261_392_000,
  },
];

export const mileageGoals: Array<{name: string, image: string, desc: string, value: number}> = [
  {
    name: 'Long Trail',
    image: EverestSVGURL,
    desc: 'Hike the cumulative distance of the Long Trail in Vermont, the oldest long-distance trail in the USA',
    value: 272,
  },
  {
    name: 'Colorado Trail',
    image: EverestSVGURL,
    desc: 'Hike the cumulative distance of the Colorado Trail in Colorado, built through the Rocky Mountains in 1973',
    value: 567,
  },
  {
    name: 'Pacific Northwest Trail (PNT)',
    image: EverestSVGURL,
    desc: 'Hike the cumulative distance of the PNT, spanning from Montana to the Washington coast',
    value: 1_200,
  },
  {
    name: 'AT',
    image: EverestSVGURL,
    desc: 'Hike the cumulative distance of the Appalachian Trail',
    value: 2_190,
  },
  {
    name: 'PCT',
    image: EverestSVGURL,
    desc: 'Hike the cumulative distance of the Pacific Crest Trail Trail',
    value: 2650,
  },
  {
    name: 'CDT',
    image: EverestSVGURL,
    desc: 'Hike the cumulative distance of the Continental Divide Trail',
    value: 3_028,
  },
  {
    name: 'Africa',
    image: EverestSVGURL,
    desc: 'Hike the cumulative length of Africa (North to South)',
    value: 5_000,
  },
  {
    name: 'Circumference of the Moon',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of the Moon',
    value: 6_786,
  },
  {
    name: 'Triple Crown',
    image: EverestSVGURL,
    desc: 'Hike the cumulative distance of completing a Triple Crown (hiking the AT, PCT, and CDT)',
    value: 7_868,
  },
  {
    name: 'North and South America',
    image: EverestSVGURL,
    desc: 'Hike the cumulative length of North and South America (North to South)',
    value: 8_700,
  },
  {
    name: 'Circumference of Mercury',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Mercury',
    value: 9_522,
  },
  {
    name: 'Circumference of Mars',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Mars',
    value: 13_256,
  },
  {
    name: 'Longest walkable path on Earth',
    image: EverestSVGURL,
    desc: 'Hike the cumulative length of the longest walkable path on Earth. (from South Africa to northern Russia)',
    value: 14_000,
  },
  {
    name: 'Circumference of Venus',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Venus',
    value: 23_617,
  },
  {
    name: 'Circumference of Earth',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Earth',
    value: 24_901,
  },
  {
    name: 'Circumference of Neptune',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Neptune',
    value: 96_645,
  },
  {
    name: 'Circumference of Uranus',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Uranus',
    value: 99_739,
  },
  {
    name: 'Circumference of Saturn',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Saturn',
    value: 235_185,
  },
  {
    name: 'Circumference of Jupiter',
    image: EverestSVGURL,
    desc: 'Hike the cumulative circumference of Jupiter',
    value: 278_985,
  },
];

export const campedGoals: Array<{name: string, image: string, desc: string, value: number}> = [
  {
    name: '1 week',
    image: EverestSVGURL,
    desc: 'Spend a cumulative week sleeping in the woods',
    value: 7,
  },
  {
    name: 'Charles Darwin',
    image: EverestSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Darwin spent studying birds in the Galapagos',
    value: 35,
  },
  {
    name: 'Cheryl Strayed (Wild)',
    image: EverestSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Cheryl Strayed spent in her book \'Wild\'',
    value: 94,
  },
  {
    name: 'Christopher McCandless (Into the Wild)',
    image: EverestSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Christopher McCandless (from \'Into the Wild\')',
    value: 114,
  },
  {
    name: 'Grandma Gatewood (First Woman to Hike the AT)',
    image: EverestSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Grandma Gatewood\'s first trek of the Appalachian Trail',
    value: 146,
  },
  {
    name: 'Heather "Anish" Anderson\'s 1 year Triple Crown',
    image: EverestSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Anish\'s record setting 1 year Triple Crown (AT + PCT + CDT)',
    value: 251,
  },
  {
    name: '1 year',
    image: EverestSVGURL,
    desc: 'Spend a cumulative year sleeping in the woods',
    value: 365,
  },
  {
    name: 'Henry David Thoreau',
    image: EverestSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Thoreau spent living at Walden Pond',
    value: 730,
  },
  {
    name: 'Lewis and Clark',
    image: EverestSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Lewis and Clark spent on their expedition',
    value: 863,
  },
];
