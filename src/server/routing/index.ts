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

export const getMtnDescription = async (mtn: IMountain, state: IState | null) => {
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
    placeText = `on the ${listData.name}`;
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
  const stateText = state && state.abbreviation
    ? `, ${state.abbreviation}` : '';
  return `${mtn.name}${stateText} stands at ${mtn.elevation}ft high${additionalText}. Look up nearby trails, camping, driving directions, weather forecasts, and trip reports for ${mtn.name}.`;
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
