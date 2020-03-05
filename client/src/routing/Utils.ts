import { Routes } from './routes';

export const listDetailLink = ((id: string) => Routes.ListDetail.replace(':id', id));
export const dashboardWithListDetailLink =
  ((id: string) => Routes.DashboardWithPeakListDetail.replace(':peakListId', id));
export const searchListDetailLink = ((id: string) => Routes.ListsWithDetail.replace(':id', id));
export const mountainDetailLink = ((id: string) => Routes.MountainDetail.replace(':id', id));
export const friendsWithUserProfileLink = ((id: string) => Routes.FriendsWithProfile.replace(':id', id));
export const userProfileLink = ((id: string) => Routes.UserProfile.replace(':id', id));
export const otherUserPeakListLink = ((friendId: string, peakListId: string) => {
  return Routes.OtherUserPeakList.replace(':id', friendId).replace(':peakListId', peakListId);
});
export const otherUserPeakListDetailLink = ((friendId: string, peakListId: string) => {
  return Routes.OtherUserPeakListDetail.replace(':friendId', friendId).replace(':peakListId', peakListId);
});
export const comparePeakListLink = ((friendId: string, peakListId: string) => {
  return Routes.OtherUserPeakListCompare.replace(':id', friendId).replace(':peakListId', peakListId);
});
export const comparePeakListIsolatedLink = ((friendId: string, peakListId: string) => {
  return Routes.ComparePeakListIsolated.replace(':id', friendId).replace(':peakListId', peakListId);
});
export const comparePeakListWithMountainDetailLink = ((friendId: string, peakListId: string, mountainId: string) => {
  return Routes.ComparePeakListWithMountainDetail
    .replace(':id', friendId)
    .replace(':peakListId', peakListId)
    .replace(':mountainId', mountainId);
});
export const friendsProfileWithPeakListWithMountainDetailLink =
  ((friendId: string, peakListId: string, mountainId: string) => {
  return Routes.OtherUserPeakListMountains
    .replace(':id', friendId)
    .replace(':peakListId', peakListId)
    .replace(':mountainId', mountainId);
});
export const listDetailWithMountainDetailLink = ((peakListId: string, mountainId: string) => {
  return Routes.ListDetailWithMountainDetail.replace(':id', peakListId).replace(':mountainId', mountainId);
});

export const searchMountainsDetailLink = ((id: string) => Routes.MountainSearchWithDetail.replace(':id', id));
export const editMountainLink = ((id: string) => Routes.EditMountain.replace(':id', id));
export const editPeakListLink = ((id: string) => Routes.EditList.replace(':id', id));

export const preventNavigation = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};
