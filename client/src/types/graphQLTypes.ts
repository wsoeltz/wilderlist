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
  variants: {
    standard: boolean;
    winter: boolean;
    fourSeason: boolean;
    grid: boolean;
  };
  mountains: Mountain[];
  users: User[];
}

export enum PermissionTypes {
  standard = 'standard',
  admin = 'admin',
}

export interface User {
  id: string;
  googleId: string;
  name: string;
  friends: User[];
  peakLists: PeakList[];
  permissions: PermissionTypes;
}
