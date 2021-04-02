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
    desc: 'The tallest mountain on Earth',
    value: 29_032,
  },
  {
    name: 'Olympus Mons',
    image: Olympus_MonsSVGURL,
    desc: 'The tallest mountain on Mars',
    value: 69_841,
  },
  {
    name: 'Ozone Layer',
    image: Ozone_LayerSVGURL,
    desc: 'Thin part of Earth\'s atmosphere that absorbs almost all harmful ultraviolet light',
    value: 116_160,
  },
  {
    name: 'Cumulative height of the 7-Summits',
    image: SevenSummitsSVGURL,
    desc: 'The highest mountains on each of the seven continents',
    value: 142_114,
  },
  {
    name: 'End of the Stratosphere',
    image: StratosphereSVGURL,
    desc: 'Planes and jets fly within the stratosphere',
    value: 164_042,
  },
  {
    name: 'End of the Mesosphere',
    image: MesosphereSVGURL,
    desc: 'Most meteors burn up here. Home to the polar aurora',
    value: 262_467,
  },
  {
    name: 'Kármán line',
    image: Karman_LineSVGURL,
    desc: 'The line at which "space" begins',
    value: 330_000,
  },
  {
    name: 'International Space Station',
    image: International_Space_StationSVGURL,
    desc: 'The height at which the ISS orbits the Earth',
    value: 1_341_120,
  },
  {
    name: 'Edge of the Thermosphere',
    image: ThermosphereSVGURL,
    desc: 'The layer of atmosphere that most satellites are found',
    value: 2_296_700,
  },
  {
    name: 'Edge of the Exosphere',
    image: ExosphereSVGURL,
    desc: 'The absolute edge of Earth\'s atmosphere.',
    value: 623_390_000,
  },
  {
    name: 'The Moon',
    image: MoonSVGURL,
    desc: '',
    value: 1_261_392_000,
  },
];
