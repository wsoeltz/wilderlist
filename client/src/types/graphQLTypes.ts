export interface Region {
  id: string;
  name: string;
  states: Array<State | null>;
}

export interface State {
  _id: string;
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

export type Longitude = number;
export type Latitude = number;
export type Elevation = number;
export type Coordinate = [Longitude, Latitude];
export type CoordinateWithElevation = [Longitude, Latitude, Elevation];

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
  flag: string | null;
  description: string | null;
  resources: ExternalResource[] | null;
  location: Coordinate;
  trailAccessible: boolean;
  locationText: string | null;
  locationTextShort: string | null;
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

export enum PeakListTier {
  casual = 'casual',
  advanced = 'advanced',
  expert = 'expert',
  mountaineer = 'mountaineer',
}

export enum ListPrivacy {
  Private = 'private',
  Public = 'public',
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
  trails: Array<Trail | null>;
  optionalTrails: null | Array<Trail | null>;
  campsites: Array<Campsite | null>;
  optionalCampsites: null | Array<Campsite | null>;
  users: Array<User | null>;
  numUsers: number;
  searchString: string;
  states: Array<State | null> | null;
  children: Array<PeakList | null> | null;
  siblings: Array<PeakList | null> | null;
  resources: ExternalResource[] | null;
  author: User | null;
  status: CreatedItemStatus | null;
  flag: string | null;
  tier: PeakListTier | null;
  numMountains: number;
  numTrails: number;
  numCampsites: number;
  numCompletedAscents: number;
  numCompletedTrails: number;
  numCompletedCampsites: number;
  numCompletedTrips: number;
  latestAscent: string | null;
  latestTrip: string | null;
  isActive: boolean | null;
  stateOrRegionString: string | null;
  center: Coordinate | null;
  bbox: [Longitude, Latitude, Longitude, Latitude] | null;
  classification: string | null;
  privacy: ListPrivacy | null;
  locationText: string | null;
  locationTextShort: string | null;
}

export enum TrailType {
  dirtroad = 'dirtroad',
  trail = 'trail',
  path = 'path',
  stairs = 'stairs',
  cycleway = 'cycleway',
  road = 'road',
  hiking = 'hiking',
  bridleway = 'bridleway',
  demandingMountainHiking = 'demanding_mountain_hiking',
  mountainHiking = 'mountain_hiking',
  herdpath = 'herdpath',
  alpineHiking = 'alpine_hiking',
  demandingAlpineHiking = 'demanding_alpine_hiking',
  difficultAlpineHiking = 'difficult_alpine_hiking',
  parentTrail = 'parent_trail',
}

export interface Trail {
  _id: string;
  id: string;
  name: string | null;
  osmId: number | null;
  relId: number | null;
  type: TrailType;
  states: Array<State | null> | null;
  line: Coordinate[];
  bbox: [Longitude, Latitude, Longitude, Latitude] | null;
  center: Coordinate;
  allowsBikes: boolean | null;
  allowsHorses: boolean | null;
  parents: Array<Trail | null> | null;
  children: Array<Trail | null> | null;
  waterCrossing: string | null;
  skiTrail: boolean | null;
  flag: string | null;
  locationText: string | null;
  locationTextShort: string | null;
  trailLength: number | null;
  avgSlope: number | null;
  childrenCount: number;
  latestTrip: string | null;
}

export interface Parking {
  _id: string;
  name: string | null;
  osmId: string | null;
  type: string | null;
  location: Coordinate;
}

export enum ParkingType {
  informationBoard = 'information_board',
  informationMap = 'information_map',
  picnicSite = 'picnic_site',
  park = 'park',
  trailhead = 'trailhead',
  parkingSpace = 'parking_space',
  intersection = 'intersection',
  parking = 'parking',
}

export enum CampsiteType {
  campSite = 'camp_site',
  caravanSite = 'caravan_site',
  weatherShelter = 'weather_shelter',
  campPitch = 'camp_pitch',
  leanTo = 'lean_to',
  wildernessHut = 'wilderness_hut',
  alpineHut = 'alpine_hut',
  basicHut = 'basic_hut',
  rockShelter = 'rock_shelter',
}

export enum CampsiteOwnership {
  private = 'private',
  federal = 'federal',
  state = 'state',
}

export enum CampsiteReservation {
  reservable = 'reservable',
  notReservable = 'not reservable',
  recommended = 'recommended',
  required = 'required',
}

export interface Campsite {
  _id: string;
  id: string;
  reserveamericaId: string | null;
  ridbId: string | null;
  osmId: string | null;
  name: string | null;
  location: Coordinate;
  state: State | null;
  website: string | null;
  type: CampsiteType;
  ownership: CampsiteOwnership | null;
  electricity: boolean | null;
  toilets: boolean | null;
  drinking_water: boolean | null;
  email: string | null;
  reservation: CampsiteReservation | string | null;
  showers: boolean | null;
  phone: string | null;
  fee: boolean | null;
  tents: boolean | null;
  capacity: number | null;
  internet_access: boolean | null;
  fire: boolean | null;
  maxtents: number | null;
  author: User | null;
  status: CreatedItemStatus | null;
  description: string | null;
  resources: ExternalResource[] | null;
  flag: string | null;
  elevation: number;
  locationText: string | null;
  locationTextShort: string;
}

export enum PermissionTypes {
  standard = 'standard',
  admin = 'admin',
}

export interface CompletedMountain {
  _id: string;
  mountain: Mountain | null;
  dates: string[];
}

export interface CompletedTrail {
  _id: string;
  trail: Trail | null;
  dates: string[];
}

export interface CompletedCampsite {
  _id: string;
  campsite: Campsite | null;
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

export interface TrailNotification {
  id: string;
  user: User | null;
  trail: Trail | null;
  date: string;
}

export interface CampsiteNotification {
  id: string;
  user: User | null;
  campsite: Campsite | null;
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

export interface TrailNote {
  id: string;
  trail: Trail | null;
  text: string;
}

export interface CampsiteNote {
  id: string;
  campsite: Campsite | null;
  text: string;
}

export interface User {
  _id: string;
  id: string;
  googleId: string | null;
  redditId: string | null;
  facebookId: string | null;
  name: string;
  email: string | null;
  profilePictureUrl: string;
  friends: Friend[] | null;
  friendRequests: Friend[] | null;
  peakLists: Array<PeakList | null> | null;
  savedMountains: Array<Mountain | null> | null;
  savedTrails: Array<Trail | null> | null;
  savedCampsites: Array<Campsite | null> | null;
  mountains: CompletedMountain[] | null;
  trails: CompletedTrail[] | null;
  campsites: CompletedCampsite[] | null;
  permissions: PermissionTypes;
  hideEmail: boolean | null;
  hideProfilePicture: boolean | null;
  hideProfileInSearch: boolean | null;
  disableEmailNotifications: boolean | null;
  ascentNotifications: AscentNotification[] | null;
  trailNotifications: TrailNotification[] | null;
  campsiteNotifications: CampsiteNotification[] | null;
  peakListNotes: Array<PeakListNote | null> | null;
  peakListNote: PeakListNote | null;
  mountainNotes: Array<MountainNote | null> | null;
  mountainNote: MountainNote | null;
  trailNote: TrailNote | null;
  campsiteNote: CampsiteNote | null;
  mountainPermissions: number | null;
  campsitePermissions: number | null;
  peakListPermissions: number | null;
  latestAscent: CompletedMountain | null;
  allInProgressMountains: Mountain[] | null;
  allInProgressTrails: Trail[] | null;
  allInProgressCampsites: Campsite[] | null;
  authoredMountains: Mountain[] | null;
  authoredPeakLists: PeakList[] | null;
  authoredTripReports: TripReport[] | null;
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

export enum TripReportPrivacy {
  Private = 'private',
  Public = 'public',
  Anonymous = 'anonymous',
}

export interface TripReport extends Conditions {
  id: string;
  date: string;
  parent: TripReport | null;
  author: User | null;
  mountains: Array<Mountain | null>;
  trails: Array<Trail | null>;
  campsites: Array<Campsite | null>;
  users: Array<User | null>;
  notes: string | null;
  link: string | null;
  privacy: TripReportPrivacy | null;
}
