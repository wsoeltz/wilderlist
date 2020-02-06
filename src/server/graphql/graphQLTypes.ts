export interface Region {
  id: string;
  name: string;
  states: Array<State | null>;
}

export interface State {
  id: string;
  name: string;
  abbreviation: string;
  regions: Array<Region | null>;
  mountains: Array<Mountain | null>;
  peakLists: Array<PeakList | null> | null;
  numPeakLists: number;
  numMountains: number;
}

export enum CreatedItemStatus {
  pending = 'pending',
  auto = 'auto',
  accepted = 'accepted',
}

export enum MountainFlag {
  location = 'location',
  elevation = 'elevation',
  state = 'state',
  duplicate = 'duplicate',
  data = 'data',
  abuse = 'abuse',
  other = 'other',
  deleteRequest = 'deleteRequest',
}

export interface Mountain {
  id: string;
  name: string;
  state: State | null;
  latitude: number;
  longitude: number;
  elevation: number;
  prominence: number | null;
  lists: Array<PeakList | null>;
  optionalLists: null | Array<PeakList | null>;
  author: User | null;
  status: CreatedItemStatus | null;
  flag: MountainFlag | null;

}

export enum PeakListVariants {
  standard = 'standard',
  winter = 'winter',
  fourSeason = 'fourSeason',
  grid = 'grid',
}

export interface ExternalResource {
  title: string;
  url: string;
}

export enum PeakListFlag {
  duplicate = 'duplicate',
  data = 'data',
  abuse = 'abuse',
  other = 'other',
  deleteRequest = 'deleteRequest',
}

export enum PeakListTier {
  casual = 'casual',
  advanced = 'advanced',
  expert = 'expert',
  mountaineer = 'mountaineer',
}

export interface PeakList {
  _id: string;
  id: string;
  name: string;
  shortName: string;
  description: string | null;
  optionalPeaksDescription: string | null;
  type: PeakListVariants;
  parent: PeakList | null;
  mountains: Array<Mountain | null>;
  optionalMountains: null | Array<Mountain | null>;
  users: Array<User | null>;
  numUsers: number;
  searchString: string;
  states: Array<State | null> | null;
  children: Array<PeakList | null> | null;
  siblings: Array<PeakList | null> | null;
  resources: ExternalResource[] | null;
  author: User | null;
  status: CreatedItemStatus | null;
  flag: PeakListFlag | null;
  tier: PeakListTier | null;
  numMountains: number;
  numCompletedAscents: number;
  latestAscent: string | null;
  isActive: boolean | null;
}

export enum PermissionTypes {
  standard = 'standard',
  admin = 'admin',
}

export interface CompletedMountain {
  mountain: Mountain | null;
  dates: string[];
}

export enum FriendStatus {
  friends = 'friends',
  sent = 'sent',
  recieved = 'recieved',
}

export interface Friend {
  user: User | null;
  status: FriendStatus;
}

export interface AscentNotification {
  id: string;
  user: User | null;
  mountain: Mountain | null;
  date: string;
}

export interface PeakListNote {
  id: string;
  peakList: PeakList | null;
  text: string;
}

export interface MountainNote {
  id: string;
  mountain: Mountain | null;
  text: string;
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
  peakLists: Array<PeakList | null> | null;
  mountains: CompletedMountain[] | null;
  permissions: PermissionTypes;
  hideEmail: boolean | null;
  hideProfilePicture: boolean | null;
  hideProfileInSearch: boolean | null;
  disableEmailNotifications: boolean | null;
  ascentNotifications: AscentNotification[] | null;
  peakListNotes: Array<PeakListNote | null> | null;
  peakListNote: PeakListNote | null;
  mountainNotes: Array<MountainNote | null> | null;
  mountainNote: MountainNote | null;
  mountainPermissions: number | null;
  peakListPermissions: number | null;
  latestAscent: CompletedMountain | null;
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
  author: User | null;
  mountains: Array<Mountain | null>;
  users: Array<User | null>;
  notes: string | null;
  link: string | null;
}
