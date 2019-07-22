export interface Region {
  id: string;
  name: string;
  states: State[];
}

export interface State {
  id: string;
  name: string;
  regions: Region[];
  mountains: Mountain[];
}

export interface Mountain {
  id: string;
  name: string;
  state: State;
  lists: List[];
}

export interface List {
  id: string;
  name: string;
  items: Mountain[];
}

export interface User {
  id: string;
  name: string;
  friends: User[];
  lists: List[];
}
