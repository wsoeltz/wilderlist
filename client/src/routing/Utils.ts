import { Routes } from './routes';

export const listDetailLink = ((id: string) => Routes.ListDetail.replace(':id', id));
export const searchListDetailLink = ((id: string) => Routes.ListsWithDetail.replace(':id', id));
export const mountainDetailLink = ((id: string) => Routes.MountainDetail.replace(':id', id));
export const friendsWithUserProfileLink = ((id: string) => Routes.FriendsWithProfile.replace(':id', id));
export const userProfileLink = ((id: string) => Routes.UserProfile.replace(':id', id));
export const comparePeakListLink = ((friendId: string, peakListId: string) => {
  return Routes.ComparePeakList.replace(':id', friendId).replace(':peakListId', peakListId);
});
export const comparePeakListIsolatedLink = ((friendId: string, peakListId: string) => {
  return Routes.ComparePeakListIsolated.replace(':id', friendId).replace(':peakListId', peakListId);
});
export const listDetailWithMountainDetailLink = ((peakListId: string, mountainId: string) => {
  return Routes.ListDetailWithMountainDetail.replace(':id', peakListId).replace(':mountainId', mountainId);
});
export const compareAllPeaksListLink = ((id: string) => Routes.CompareAllPeaks.replace(':id', id));

export const preventNavigation = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};
