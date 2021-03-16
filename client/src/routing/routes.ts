// This should always reflect the routes found on the server at
// src/routing/index.ts

export enum Routes {
  Landing = '/',

  Dashboard = '/dashboard',

  ListDetail = '/list/:id',
  SearchLists = '/list/search',

  MountainDetail = '/mountain/:id',
  SearchMountains = '/mountain/search',
  SummitView = '/summit-view/:lat/:lng/:altitude/:id',

  CampsiteDetail = '/campsite/:id',
  SearchCampsites = '/campsite/search',

  TrailDetail = '/trail/:id',
  SearchTrails = '/trail/search',

  CreateMountain = '/create-mountain',
  EditMountain = '/edit-mountain/:id',

  CreateList = '/create-list',
  EditList = '/edit-list/:id',

  AddTripReport = '/add-trip-report',
  EditTripReport = '/edit-trip-report',

  SearchUsers = '/user/search',
  UserProfile = '/user/:id',
  OtherUserPeakList = '/user/:id/list/:peakListId',
  ComparePeakListIsolated = '/compare/user/:id/list/:peakListId',

  UserSettings = '/user-settings',

  PrivacyPolicy = '/privacy-policy',
  TermsOfUse = '/terms-of-use',
  YourStats = '/your-stats',
  About = '/about',
}

export const defaultOgImageUrl = '/og-image/default/image.jpg';

const mountainOgImageUrl = '/og-image/mountain/:mountainId/image.jpg';
export const setMountainOgImageUrl = (id: string) => mountainOgImageUrl.replace(':mountainId', id);

const peakListOgImageUrl = '/og-image/peaklist/:peakListId/image.jpg';
export const setPeakListOgImageUrl = (id: string) => peakListOgImageUrl.replace(':peakListId', id);

const campsiteOgImageUrl = '/og-image/campsite/:campsiteId/image.jpg';
export const setCampsiteOgImageUrl = (id: string) => campsiteOgImageUrl.replace(':campsiteId', id);

const trailOgImageUrl = '/og-image/trail/:trailId/image.jpg';
export const setTrailOgImageUrl = (id: string) => trailOgImageUrl.replace(':trailId', id);
