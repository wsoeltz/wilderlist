import {
  Campsite,
} from '../../../utilities/getCampsites';
import {
  TrailDifficulty,
  TrailType,
} from '../../../utilities/getTrails';
import {
  VariableDate,
} from '../../peakLists/detail/getCompletionDates';

export interface Coordinate {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  elevation: number;
}

export interface Trail extends Coordinate {
  url: string;
  mileage: number;
  type: TrailType;
  summary: string;
  difficulty: TrailDifficulty;
  location: string;
  image: string;
  conditionStatus: string;
  conditionDetails: string;
  conditionDate: Date;
  highPoint: number;
  lowPoint: number;
}

export type CoordinateWithDates = Coordinate & {completionDates?: VariableDate | null};

export interface DestinationDatum {
  key: string;
  latitude: number;
  longitude: number;
}

export enum PopupDataTypes {
  Coordinate = 'Coordinate',
  OtherMountain = 'OtherMountain',
  Trail = 'Trail',
  Campsite = 'Campsite',
}

export type PopupData = (
  {
    type: PopupDataTypes.Coordinate;
    data: CoordinateWithDates;
  } |
  {
    type: PopupDataTypes.OtherMountain;
    data: CoordinateWithDates;
  } | {
    type: PopupDataTypes.Trail;
    data: Trail;
  } | {
    type: PopupDataTypes.Campsite;
    data: Campsite;
  }
);
