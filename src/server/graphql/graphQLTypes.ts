export interface Region {
  id: string;
  name: string;
  states: State[];
}

export interface State {
  id: string;
  name: string;
  abbreviation: string;
  regions: Region[];
  mountains: Mountain[];
  peakLists: PeakList[] | null;
}

export interface Mountain {
  id: string;
  name: string;
  state: State | null;
  latitude: number;
  longitude: number;
  elevation: number;
  prominence: number | null;
  lists: PeakList[];
}

export enum PeakListVariants {
  standard = 'standard',
  winter = 'winter',
  fourSeason = 'fourSeason',
  grid = 'grid',
}

export interface PeakList {
  id: string;
  name: string;
  shortName: string;
  type: PeakListVariants;
  parent: PeakList | null;
  mountains: Mountain[];
  users: User[];
  numUsers: number;
  searchString: string;
  states: State[] | null;
  children: PeakList[] | null;
}

export enum PermissionTypes {
  standard = 'standard',
  admin = 'admin',
}

export interface CompletedMountain {
  mountain: Mountain;
  dates: string[];
}

export enum FriendStatus {
  friends = 'friends',
  sent = 'sent',
  recieved = 'recieved',
}

export interface Friend {
  user: User;
  status: FriendStatus;
}

export interface AscentNotification {
  id: string;
  user: User | null;
  mountain: Mountain | null;
  date: string;
}

export interface User {
  _id: string;
  id: string;
  googleId: string | null;
  redditId: string | null;
  name: string;
  email: string | null;
  profilePictureUrl: string;
  friends: Friend[] | null;
  peakLists: PeakList[] | null;
  mountains: CompletedMountain[] | null;
  permissions: PermissionTypes;
  hideEmail: boolean | null;
  hideProfilePicture: boolean | null;
  hideProfileInSearch: boolean | null;
  disableEmailNotifications: boolean | null;
  ascentNotifications: AscentNotification[] | null;
}

export interface Conditions {
  mudMinor: boolean | null;
  mudMajor: boolean | null;
  waterSlipperyRocks: boolean | null;
  waterOnTrail: boolean | null;
  leavesSlippery: boolean | null;
  iceBlack: boolean | null;
  iceBlue: boolean | null;
  iceCrust: boolean | null;
  snowIceFrozenGranular: boolean | null;
  snowIceMonorailStable: boolean | null;
  snowIceMonorailUnstable: boolean | null;
  snowIcePostholes: boolean | null;
  snowMinor: boolean | null;
  snowPackedPowder: boolean | null;
  snowUnpackedPowder: boolean | null;
  snowDrifts: boolean | null;
  snowSticky: boolean | null;
  snowSlush: boolean | null;
  obstaclesBlowdown: boolean | null;
  obstaclesOther: boolean | null;
}

export interface TripReport extends Conditions {
  id: string;
  date: string;
  author: User;
  mountains: Mountain[];
  users: User[];
  notes: string | null;
  link: string | null;
}
