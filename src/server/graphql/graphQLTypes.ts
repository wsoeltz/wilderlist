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
  state: State;
  latitude: number;
  longitude: number;
  elevation: number;
  prominence: number | null;
  lists: List[];
}

export interface List {
  id: string;
  name: string;
  items: Mountain[];
  users: User[];
}

export interface User {
  id: string;
  googleId: string;
  name: string;
  friends: User[];
  lists: List[];
}
