export interface Region {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  regions: Region[];
}

export interface Mountain {
  id: string;
  name: string;
  state: State;
}

export interface List {
  id: string;
  name: string;
  items: Mountain[];
}