/* tslint:disable:await-promise */
/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import upperFirst from 'lodash/upperFirst';
import {
  Campsite as ICampsite,
  Mountain as IMountain,
  PeakList as IPeakList,
  PeakListVariants,
  Trail as ITrail,
} from '../graphql/graphQLTypes';
import { Mountain } from '../graphql/schema/queryTypes/mountainType';
import { Parking } from '../graphql/schema/queryTypes/parkingType';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';
import { State } from '../graphql/schema/queryTypes/stateType';
import {
  failIfValidOrNonExhaustive,
} from '../graphql/Utils';

// This should always reflect the routes found in
// cient/src/routing/routes.ts
// Commented out routes are left as a reference. They
// are not needed for server side meta data as they
// can only be accessed via logging in, and thus cannot
// be found on Google or shared on social

export enum Routes {
  Landing = '/',

  ListDetail = '/list/:id',
  MountainDetail = '/mountain/:id',
  CampsiteDetail = '/campsite/:id',
  TrailDetail = '/trail/:id',

  SummitView = '/summit-view/:lat/:lng/:altitude/:id',

  AutoRouteDetail = '/route-detail',
  AutoRouteDetailParkingToMountain = '/route-detail/mountain/:mountainId/start/:parkingId',
  AutoRouteDetailMountainToCampsite = '/route-detail/mountain/:mountainId/campsite/:campsiteId',
  AutoRouteDetailCampsiteToCampsite = '/route-detail/campsite/:campsiteId1/campsite/:campsiteId2',
  AutoRouteDetailTrailToMountain = '/route-detail/trail/:trailId/mountain/:mountainId',
  AutoRouteDetailTrailToCampsite = '/route-detail/trail/:trailId/campsite/:campsiteId',

  About = '/about',
  PrivacyPolicy = '/privacy-policy',
  TermsOfUse = '/terms-of-use',

  DEPRECATED_ListsWithDetail = '/lists/:id',
  DEPRECATED_ListDetailWithMountainDetail = '/list/:id/mountain/:mountainId',
  DEPRECATED_MountainSearchWithDetail = '/mountains/:id',
}

export const getListData = async (id: string) => {
  try {
    const res = await PeakList.findById(id);
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getMostPopularListsData = async (mtn: IMountain) => {
  try {
    const listIds = mtn.lists.map(val => (val as any).toString());
    const listRes: any = await PeakList.find({_id: {$in: listIds}})
                      .limit(1)
                      .sort({ numUsers: -1, name: 1 });

    if (listRes) {
      const mtnIds = listRes[0].mountains.map((val: any) => (val as any).toString());
      const mtnRes: any = await Mountain.find({_id: {$in: mtnIds}})
                      .sort({ elevation: -1, name: 1 });
      if (mtnRes) {
        return {name: listRes[0].name, mountains: mtnRes};
      }
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getMountainData = async (id: string) => {
  try {
    const res = await Mountain.findById(id);
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getStateData = async (id: string) => {
  try {
    const res = await State.findById(id);
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getParkingData = async (id: string) => {
  try {
    const res = await Parking.findById(id);
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getType = (type: PeakListVariants) => {
  if (type === PeakListVariants.standard) {
    return '';
  } else if (type === PeakListVariants.winter) {
    return ', Winter';
  } else if (type === PeakListVariants.fourSeason) {
    return ', 4-Season';
  } else if (type === PeakListVariants.grid) {
    return ', Grid';
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid PeakListVariants ' + type);
  }
};

const ordinalSuffix = ([input]: [number]): string => {
  const j = input % 10, k = input % 100;
  if (j === 1 && k !== 11) {
      return 'st';
  }
  if (j === 2 && k !== 12) {
      return 'nd';
  }
  if (j === 3 && k !== 13) {
      return 'rd';
  }
  return 'th';
};
const ordinalNumber = ([input]: [number]): string => {
  return input + ordinalSuffix([input]);
};

const formatOwnership = (ownership: string | null) => {
  switch (ownership) {
    case 'private':
      return 'privately run ';
    case 'federal':
      return 'federally run ';
    case 'state':
      return 'state run ';
    default:
      return '';
  }
};

export const formatType = (type: string) => {
  switch (type) {
    case 'camp_site':
      return 'campsite';
    case 'caravan_site':
      return 'campground';
    case 'weather_shelter':
      return 'weather shelter';
    case 'camp_pitch':
      return 'tentsite';
    case 'lean_to':
      return 'lean-to';
    case 'wilderness_hut':
      return 'wilderness hut';
    case 'alpine_hut':
      return 'alpine hut';
    case 'basic_hut':
      return 'basic hut';
    case 'rock_shelter':
      return 'rock shelter';
    case 'trail':
      return 'trail';
    case 'dirtroad':
      return 'dirt road';
    case 'path':
      return 'path';
    case 'stairs':
      return 'path';
    case 'cycleway':
      return 'bike trail';
    case 'road':
      return 'road';
    case 'hiking':
      return 'trail';
    case 'bridleway':
      return 'trail';
    case 'demanding_mountain_hiking':
      return 'trail';
    case 'mountain_hiking':
      return 'trail';
    case 'herdpath':
      return 'herd path';
    case 'alpine_hiking':
      return 'alpine trail';
    case 'demanding_alpine_hiking':
      return 'alpine trail';
    case 'difficult_alpine_hiking':
      return 'alpine trail';
    case 'parent_trail':
      return 'feature route';
    case 'information_board':
      return 'information board';
    case 'information_map':
      return 'information map';
    case 'picnic_site':
      return 'picnic site';
    case 'park':
      return 'park';
    case 'trailhead':
      return 'trailhead';
    case 'parking_space':
      return 'parking area';
    case 'parking':
      return 'parking lot';
    case 'intersection':
      return 'trail/road crossing';
    default:
      return 'point';
  }
};

function isVowel(c: string) {
    return ['a', 'e', 'i', 'o', 'u'].indexOf(c.toLowerCase()) !== -1;
}

export const getMtnDescription = async (mtn: IMountain) => {
  let listData: any | null;
  if (mtn.lists && mtn.lists.length) {
    listData = await getMostPopularListsData(mtn);
  } else {
    listData = null;
  }
  let mountainsList: any[];
  let placeText: string;
  if (listData) {
    mountainsList = listData.mountains;
    placeText = `on ${listData.name}`;
  } else {
    mountainsList = [];
    placeText = '';
  }
  const allStringIds: string[] = mountainsList.map((v: any) => v._id.toString());
  const position = allStringIds.indexOf((mtn as any)._id.toString());
  const percent = position / mountainsList.length;
  let positionText: string;
  if (position === 0) {
    positionText = 'largest';
  } else if (position + 1 === mountainsList.length) {
    positionText = 'smallest';
  } else if (percent > 0.7) {
    positionText = ordinalNumber([mountainsList.length - position]) + ' smallest';
  } else {
    positionText = ordinalNumber([position + 1]) + ' largest';
  }
  const additionalText = positionText && placeText ? ` and is the ${positionText} point ${placeText}` : '';
  return `${mtn.name} of ${mtn.locationText} stands at ${mtn.elevation}ft high${additionalText}. View trails, camping, directions, weather, and trip reports for ${mtn.name}.`;
};

export const getCampsiteDescription = (campsite: ICampsite) => {
  const formattedType = formatType(campsite.type);
  const name = campsite.name ? campsite.name : upperFirst(formattedType);
  const ownership = formatOwnership(campsite.ownership);
  const typeString = ownership + formattedType;
  const a = isVowel(typeString[0]) ? 'an' : 'a';
  return `${name} is ${a} ${typeString} in ${campsite.locationText}.`;
};

export const getTrailDescription = (trail: ITrail) => {
  const formattedType = formatType(trail.type ? trail.type : 'trail');
  const name = trail.name ? trail.name : upperFirst(formattedType);
  const trailLength = trail.trailLength ? trail.trailLength : 0;
  const numericDistance = trailLength < 0.1
    ? Math.round(trailLength * 5280)
    : parseFloat(trailLength.toFixed(1));
  const distanceUnit = trailLength < 0.1 ? 'ft' : 'mi';
  return `${name} is a ${numericDistance}${distanceUnit} long ${formattedType} in ${trail.locationText}.`;
};

export const getListDescription = (list: IPeakList) => {
  const { type } = list;
  if (type === PeakListVariants.standard) {
    return `Plan and track your trips on ${list.name} (${list.shortName}) with maps, trails, weather, trip reports, directions and more.`;
  } else if (type === PeakListVariants.winter) {
    return `Plan and track your trips of ${list.name} (${list.shortName}) in the winter with maps, weather, trip reports and directions.`;
  } else if (type === PeakListVariants.fourSeason) {
    return `Plan and track your 4-Season trips on ${list.name} (${list.shortName}) with trail maps, weather and trip reports, and robust tracking tools.`;
  } else if (type === PeakListVariants.grid) {
    return `The 12-month Grid, the ultimate hiking challenge. Plan and track your ascents as you work towards ${list.name} Grid with trail maps, weather and trip reports, and tracking tools.`;
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid PeakListVariants ' + type);
  }
};

export const getSummitViewDescription = (mtn: IMountain) =>
  `View a 360 degree interactive summit for ${mtn.name} (${mtn.locationText})`;

export const getAutoRouteTitle = (source: string, dest: string) =>
  `Hike to ${dest} from ${source} - Wilderlist`;
export const getAutoRouteDescription = (source: string, dest: string) =>
  `Explore maps, elevation profiles, weather reports and more for a hike to ${dest} from ${source}`;
