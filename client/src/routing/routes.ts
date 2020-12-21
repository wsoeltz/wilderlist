// This should always reflect the routes found on the server at
// src/routing/index.ts

export enum Routes {
  Landing = '/',

  Dashboard = '/dashboard',

  ListDetail = '/list/:id',
  MountainDetail = '/mountain/:id',

  CreateMountain = '/create-mountain',
  EditMountain = '/edit-mountain/:id',

  CreateList = '/create-list',
  EditList = '/edit-list/:id',

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
