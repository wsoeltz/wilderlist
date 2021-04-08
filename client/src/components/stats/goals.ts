import AnishSVGURL from './d3Viz/icons/goals/days/Anish.svg';
import Charles_DarwinSVGURL from './d3Viz/icons/goals/days/Charles_Darwin.svg';
import Cheryl_StrayedSVGURL from './d3Viz/icons/goals/days/Cheryl_Strayed.svg';
import Christopher_McCandlessSVGURL from './d3Viz/icons/goals/days/Christopher_McCandless.svg';
import Grandma_GatewoodSVGURL from './d3Viz/icons/goals/days/Grandma_Gatewood.svg';
import Henry_David_ThoreauSVGURL from './d3Viz/icons/goals/days/Henry_David_Thoreau.svg';
import Lewis_and_ClarkSVGURL from './d3Viz/icons/goals/days/Lewis_and_Clark.svg';
import WeekSVGURL from './d3Viz/icons/goals/days/Week.svg';
import YearSVGURL from './d3Viz/icons/goals/days/Year.svg';
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
import AfricaSVGURL from './d3Viz/icons/goals/mileage/Africa.svg';
import Appalachian_TrailSVGURL from './d3Viz/icons/goals/mileage/Appalachian_Trail.svg';
import Colorado_TrailSVGURL from './d3Viz/icons/goals/mileage/Colorado_Trail.svg';
import Continental_Divide_TrailSVGURL from './d3Viz/icons/goals/mileage/Continental_Divide_Trail.svg';
import EarthSVGURL from './d3Viz/icons/goals/mileage/Earth.svg';
import Long_TrailSVGURL from './d3Viz/icons/goals/mileage/Long_Trail.svg';
import Longest_pathSVGURL from './d3Viz/icons/goals/mileage/Longest_path.svg';
import North_and_South_AmericaSVGURL from './d3Viz/icons/goals/mileage/North_and_South_America.svg';
import Pacific_Crest_TrailSVGURL from './d3Viz/icons/goals/mileage/Pacific_Crest_Trail.svg';
import Pacific_Northwest_TrailSVGURL from './d3Viz/icons/goals/mileage/Pacific_Northwest_Trail.svg';
import Triple_CrownSVGURL from './d3Viz/icons/goals/mileage/Triple_Crown.svg';

export const elevationGoals: Array<{name: string, image: string, desc: string, value: number}> = [
  {
    name: 'Everest',
    image: EverestSVGURL,
    desc: 'Stand at the cumulative elevation of the tallest mountain on Earth',
    value: 29_032,
  },
  {
    name: 'Olympus Mons',
    image: Olympus_MonsSVGURL,
    desc: 'Stand at the cumulative elevation of the tallest mountain on Mars',
    value: 69_841,
  },
  {
    name: 'Ozone Layer',
    image: Ozone_LayerSVGURL,
    desc: 'Stand at the cumulative altitude of the Ozone Layer, the part of the atmosphere that absorbs harmful ultraviolet light',
    value: 116_160,
  },
  {
    name: 'Cumulative height of the 7-Summits',
    image: SevenSummitsSVGURL,
    desc: 'Stand at the cumulative elevation of all of the highest mountains on each of the seven continents',
    value: 142_114,
  },
  {
    name: 'End of the Stratosphere',
    image: StratosphereSVGURL,
    desc: 'Stand at the cumulative altitude of the stratosphere, where planes and jets fly within',
    value: 164_042,
  },
  {
    name: 'End of the Mesosphere',
    image: MesosphereSVGURL,
    desc: 'Stand at the cumulative altitude of the mesosphere, home to the polar aurora and where most meteor showers are seen',
    value: 262_467,
  },
  {
    name: 'Kármán line',
    image: Karman_LineSVGURL,
    desc: 'Stand at the cumulative altitude of the line at which "space" begins',
    value: 330_000,
  },
  {
    name: 'International Space Station',
    image: International_Space_StationSVGURL,
    desc: 'Stand at the cumulative altitude of the height at which the ISS orbits the Earth',
    value: 1_341_120,
  },
  {
    name: 'Edge of the Thermosphere',
    image: ThermosphereSVGURL,
    desc:
      'Stand at the cumulative altitude of the thermosphere, the layer of atmosphere that most satellites are found',
    value: 2_296_700,
  },
  {
    name: 'Edge of the Exosphere',
    image: ExosphereSVGURL,
    desc: 'Stand at the cumulative altitude of the exosphere, the absolute edge of Earth\'s atmosphere.',
    value: 623_390_000,
  },
  {
    name: 'The Moon',
    image: MoonSVGURL,
    desc: 'Stand at the cumulative altitude of the Moon',
    value: 1_261_392_000,
  },
];

export const mileageGoals: Array<{name: string, image: string, desc: string, value: number}> = [
  {
    name: 'Long Trail',
    image: Long_TrailSVGURL,
    desc: 'Hike the cumulative distance of the Long Trail in Vermont, the oldest long-distance trail in the USA',
    value: 272,
  },
  {
    name: 'Colorado Trail',
    image: Colorado_TrailSVGURL,
    desc: 'Hike the cumulative distance of the Colorado Trail in Colorado, built through the Rocky Mountains in 1973',
    value: 567,
  },
  {
    name: 'Pacific Northwest Trail (PNT)',
    image: Pacific_Northwest_TrailSVGURL,
    desc: 'Hike the cumulative distance of the PNT, spanning from Montana to the Washington coast',
    value: 1_200,
  },
  {
    name: 'Appalachian Trail (AT)',
    image: Appalachian_TrailSVGURL,
    desc: 'Hike the cumulative distance of the Appalachian Trail',
    value: 2_190,
  },
  {
    name: 'Pacific Crest Trail (PCT)',
    image: Pacific_Crest_TrailSVGURL,
    desc: 'Hike the cumulative distance of the Pacific Crest Trail Trail',
    value: 2650,
  },
  {
    name: 'Continental Divide Trail (CDT)',
    image: Continental_Divide_TrailSVGURL,
    desc: 'Hike the cumulative distance of the Continental Divide Trail',
    value: 3_028,
  },
  {
    name: 'Africa',
    image: AfricaSVGURL,
    desc: 'Hike the cumulative length of Africa (North to South)',
    value: 5_000,
  },
  {
    name: 'Circumference of the Moon',
    image: MoonSVGURL,
    desc: 'Hike the cumulative circumference of the Moon',
    value: 6_786,
  },
  {
    name: 'Triple Crown',
    image: Triple_CrownSVGURL,
    desc: 'Hike the cumulative distance of completing a Triple Crown (hiking the AT, PCT, and CDT)',
    value: 7_868,
  },
  {
    name: 'North and South America',
    image: North_and_South_AmericaSVGURL,
    desc: 'Hike the cumulative length of North and South America (North to South)',
    value: 8_700,
  },
  {
    name: 'Longest walkable path on Earth',
    image: Longest_pathSVGURL,
    desc: 'Hike the cumulative length of the longest walkable path on Earth. (from South Africa to northern Russia)',
    value: 14_000,
  },
  {
    name: 'Circumference of Earth',
    image: EarthSVGURL,
    desc: 'Hike the cumulative circumference of Earth',
    value: 24_901,
  },
];

export const campedGoals: Array<{name: string, image: string, desc: string, value: number}> = [
  {
    name: '1 week',
    image: WeekSVGURL,
    desc: 'Spend a cumulative week sleeping in the woods',
    value: 7,
  },
  {
    name: 'Charles Darwin',
    image: Charles_DarwinSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Darwin spent studying birds in the Galapagos',
    value: 35,
  },
  {
    name: 'Cheryl Strayed (Wild)',
    image: Cheryl_StrayedSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Cheryl Strayed spent in her book \'Wild\'',
    value: 94,
  },
  {
    name: 'Christopher McCandless (Into the Wild)',
    image: Christopher_McCandlessSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Christopher McCandless (from \'Into the Wild\')',
    value: 114,
  },
  {
    name: 'Grandma Gatewood (First Woman to Hike the AT)',
    image: Grandma_GatewoodSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Grandma Gatewood\'s first trek of the Appalachian Trail',
    value: 146,
  },
  {
    name: 'Heather "Anish" Anderson\'s 1 year Triple Crown',
    image: AnishSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Anish\'s record setting 1 year Triple Crown (AT + PCT + CDT)',
    value: 251,
  },
  {
    name: '1 year',
    image: YearSVGURL,
    desc: 'Spend a cumulative year sleeping in the woods',
    value: 365,
  },
  {
    name: 'Henry David Thoreau (Walden)',
    image: Henry_David_ThoreauSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Thoreau spent living at Walden Pond',
    value: 730,
  },
  {
    name: 'Lewis and Clark',
    image: Lewis_and_ClarkSVGURL,
    desc: 'Spend a cumulative number of nights in the woods as Lewis and Clark spent on their expedition',
    value: 863,
  },
];
