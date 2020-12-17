// This should always reflect the routes found on the server at
// src/routing/index.ts

export enum Routes {
  Login = '/',
  Dashboard = '/',
  DashboardWithPeakListDetail = '/dashboard/list/:peakListId',
  ListsWithDetail = '/lists/:id',
  ListDetail = '/list/:id',
  ListDetailWithMountainDetail = '/list/:id/mountain/:mountainId',
  MountainSearchWithDetail = '/mountains/:id',
  MountainDetail = '/mountain/:id',
  CreateMountain = '/create-mountain',
  EditMountain = '/edit-mountain/:id',
  CreateList = '/create-list',
  EditList = '/edit-list/:id',
  FriendsWithProfile = '/users/:id',
  UserProfile = '/user/:id',
  UserSettings = '/user-settings',
  OtherUserPeakList = '/user/:id/list/:peakListId',
  OtherUserPeakListMountains = '/user/:id/list/:peakListId/mountain/:mountainId',
  OtherUserPeakListDetail = '/detail/user/:friendId/list/:peakListId',
  OtherUserPeakListCompare = '/user/:id/compare/:peakListId',
  ComparePeakListWithMountainDetail = '/compare/user/:id/list/:peakListId/mountain/:mountainId',
  ComparePeakListIsolated = '/compare/user/:id/list/:peakListId',
  Admin = '/admin',
  AdminRegions = '/admin/regions',
  AdminStates = '/admin/states',
  AdminMountains = '/admin/mountains',
  AdminPeakLists = '/admin/lists',
  AdminUsers = '/admin/users',
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