export enum Routes {
  Login = '/',
  Dashboard = '/',
  Lists = '/lists',
  ListsWithDetail = '/lists/:id',
  ListDetail = '/list/:id',
  ListDetailWithMountainDetail = '/list/:id/mountain/:mountainId',
  MountainDetail = '/mountain/:id',
  Friends = '/users',
  FriendsWithProfile = '/users/:id',
  UserProfile = '/user/:id',
  ComparePeakList = '/user/:id/list/:peakListId',
  ComparePeakListWithMountainDetail = '/user/:id/list/:peakListId/mountain/:mountainId',
  ComparePeakListIsolated = '/compare/user/:id/list/:peakListId',
  Admin = '/admin',
  AdminRegions = '/admin/regions',
  AdminStates = '/admin/states',
  AdminMountains = '/admin/mountains',
  AdminPeakLists = '/admin/lists',
  AdminUsers = '/admin/users',
}
