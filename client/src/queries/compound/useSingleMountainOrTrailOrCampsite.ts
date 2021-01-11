import { QueryResult } from '@apollo/client';
import {useCampsiteDetail} from '../campsites/useCampsiteDetail';
import {useMountainDetail} from '../mountains/useMountainDetail';
import {useTrailDetail} from '../trails/useTrailDetail';

const useNoop = (): QueryResult => ({loading: undefined, error: undefined, data: undefined} as any);

export enum QueryType {
  Mountain = 'mountain',
  Trail = 'trail',
  Campsite = 'campsite',
}

const getHook = (type: QueryType | null) => {
  if (type === QueryType.Mountain) {
    return useMountainDetail;
  }
  if (type === QueryType.Trail) {
    return useTrailDetail;
  }
  if (type === QueryType.Campsite) {
    return useCampsiteDetail;
  }
  return useNoop;
};

interface Output {
  loading: boolean;
  error: any | undefined;
  data: any | undefined;
}

export const useSingleMountainOrTrailOrCampsite = (type: QueryType | null, id: string | null): Output => {
 return getHook(type)(id) as any;
};
