/* tslint:disable:await-promise */
/* tslint:disable:max-line-length */
import {
  Mountain as IMountain,
  PeakList as IPeakList,
  PeakListVariants,
  State as IState,
} from '../graphql/graphQLTypes';
import { Mountain } from '../graphql/schema/queryTypes/mountainType';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';
import { State } from '../graphql/schema/queryTypes/stateType';
import { failIfValidOrNonExhaustive } from '../graphql/Utils';

// This should always reflect the routes found in
// cient/src/routing/routes.ts
// Commented out routes are left as a reference. They
// are not needed for server side meta data as they
// can only be accessed via logging in, and thus cannot
// be found on Google or shared on social

export enum Routes {
  Login = '/',
  // Dashboard = '/',
  // DashboardWithPeakListDetail = '/dashboard/list/:peakListId',
  ListsWithDetail = '/lists/:id',
  ListDetail = '/list/:id',
  ListDetailWithMountainDetail = '/list/:id/mountain/:mountainId',
  MountainSearchWithDetail = '/mountains/:id',
  MountainDetail = '/mountain/:id',
  // CreateMountain = '/create-mountain',
  // EditMountain = '/edit-mountain/:id',
  // CreateList = '/create-list',
  // EditList = '/edit-list/:id',
  // FriendsWithProfile = '/users/:id',
  // UserProfile = '/user/:id',
  // UserSettings = '/user-settings',
  // OtherUserPeakList = '/user/:id/list/:peakListId',
  // OtherUserPeakListDetail = '/detail/user/:friendId/list/:peakListId',
  // OtherUserPeakListCompare = '/user/:id/compare/:peakListId',
  // ComparePeakListWithMountainDetail = 'compare/user/:id/list/:peakListId/mountain/:mountainId',
  // ComparePeakListIsolated = '/compare/user/:id/list/:peakListId',
  // Admin = '/admin',
  // AdminRegions = '/admin/regions',
  // AdminStates = '/admin/states',
  // AdminMountains = '/admin/mountains',
  // AdminPeakLists = '/admin/lists',
  // AdminUsers = '/admin/users',
  PrivacyPolicy = '/privacy-policy',
  TermsOfUse = '/terms-of-use',
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
    return '';
  }
};

function toDegreesMinutesAndSeconds(coordinate: number) {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return `${degrees}° ${minutes}&apos; ${seconds}&quot;`;
}

const convertDMS = (lat: number, lng: number) => {
    const latitude = toDegreesMinutesAndSeconds(lat);
    const latitudeCardinal = lat >= 0 ? 'N' : 'S';

    const longitude = toDegreesMinutesAndSeconds(lng);
    const longitudeCardinal = lng >= 0 ? 'E' : 'W';

    return { lat: `${latitude} ${latitudeCardinal}`, long: `${longitude} ${longitudeCardinal}`};
};

export const getMtnDescription = (mtn: IMountain, state: IState | null) => {
  const {lat, long} = convertDMS(mtn.latitude, mtn.longitude);
  const stateText = state && state.name
    ? ` in the state of ${state.name}` : '';
  return `${mtn.name} stands at an elevation of ${mtn.elevation}ft and is located at ${lat}, ${long}${stateText}. Look up trail maps, current weather, and trip reports for ${mtn.name}.`;
};

export const getListDescription = (list: IPeakList) => {
  const { type } = list;
  if (type === PeakListVariants.standard) {
    return `Look up maps, current weather, and trip reports for all ${list.mountains.length} mountains in the ${list.name} (${list.shortName}).`;
  } else if (type === PeakListVariants.winter) {
    return `Look up maps, current weather, and trip reports for the ${list.name} (${list.shortName}) in the Winter.`;
  } else if (type === PeakListVariants.fourSeason) {
    return `Plan and track your 4-Season ascents on the mountains of the ${list.name} (${list.shortName}) with trail maps, weather and trip reports, and robust tracking tools.`;
  } else if (type === PeakListVariants.grid) {
    return `The 12-month Grid, the ultimate hiking challenge. Plan and track your ascents as you work towards the ${list.name} Grid with trail maps, weather and trip reports, and robust tracking tools.`;
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid PeakListVariants ' + type);
    return '';
  }
};
