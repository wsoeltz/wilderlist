const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import { gql, useMutation, useQuery } from '@apollo/client';
import orderBy from 'lodash/orderBy';
import React from 'react';
import Helmet from 'react-helmet';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import useMapCenter from '../../../hooks/useMapCenter';
import usePrevious from '../../../hooks/usePrevious';
import {refetchUsersLists} from '../../../queries/getUsersPeakLists';
import { listDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import { PeakList, User } from '../../../types/graphQLTypes';
import GhostMountainCard from '../../mountains/list/GhostMountainCard';
import ListPeakLists, { CompactPeakListDatum, ViewMode } from './ListPeakLists';

export const GEO_NEAR_PEAK_LISTS = gql`
  query SearchPeakLists(
    $latitude: Float!,
    $longitude: Float!,
    $limit: Int!,
  ) {
    peakLists: geoNearPeakLists(
      latitude: $latitude,
      longitude: $longitude,
      limit: $limit,
    ) {
      id
      name
      shortName
      type
      center
      numMountains
      numUsers
      numCompletedAscents
      latestAscent
      isActive
      stateOrRegionString
      parent {
        id
        type
      }
      children {
        id
        type
      }
      siblings {
        id
        type
      }
    }
  }
`;

export interface SuccessResponse {
  peakLists: CompactPeakListDatum[];
}

export interface Variables {
  latitude: number;
  longitude: number;
  limit: number;
}

export const ADD_PEAK_LIST_TO_USER = gql`
  mutation addPeakListToUser($userId: ID!, $peakListId: ID!) {
    addPeakListToUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        numCompletedAscents(userId: $userId)
        latestAscent(userId: $userId)
        isActive(userId: $userId)
      }
    }
  }
`;

export type AddRemovePeakListSuccessResponse = null | {
  id: User['id'];
  peakLists: {
    id: PeakList['id'];
  };
};

export interface AddRemovePeakListVariables {
  userId: string | null;
  peakListId: string;
}

const PeakListPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;

  const getString = useFluent();

  const [longitude, latitude] = useMapCenter();

  const variables = {
      latitude: parseFloat(latitude.toFixed(2)),
      longitude: parseFloat(longitude.toFixed(2)),
      limit: 15,
    };

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GEO_NEAR_PEAK_LISTS, {
    variables,
  });

  const prevData = usePrevious(data);
  let dataToUse: SuccessResponse | undefined;
  if (data !== undefined) {
    dataToUse = data;
  } else if (prevData !== undefined) {
    dataToUse = prevData;
  } else {
    dataToUse = undefined;
  }

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER, {
      refetchQueries: () => [
        {query: GEO_NEAR_PEAK_LISTS, variables},
        refetchUsersLists({userId}),
      ],
    });
  const beginList = userId ? (peakListId: string) => addPeakListToUser({variables: {userId,  peakListId}}) : null;

  let list: React.ReactElement<any> | null;
  if (loading === true && dataToUse === undefined) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostMountainCard key={i} />);
    }
    list = <>{loadingCards}</>;
  } else if (error !== undefined) {
    console.error(error);
    list =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (dataToUse !== undefined) {
    const { peakLists } = dataToUse;
    if (!peakLists) {
      list = (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const mapCenter = point([longitude, latitude]);
      const sortedPeakLists = orderBy(peakLists.map(p => ({
        ...p,
        distance: Math.round(distance(mapCenter, point(p.center)) / 100) * 100,
        percent: Math.round(p.numCompletedAscents / p.numMountains * 100),
      })), ['distance', 'percent', 'numUsers'], ['asc', 'desc', 'desc']);
      list = (
        <ListPeakLists
          viewMode={ViewMode.Compact}
          peakListData={sortedPeakLists}
          listAction={beginList}
          actionText={getString('peak-list-detail-text-begin-list')}
          profileId={undefined}
          noResultsText={getString('global-text-value-no-results-found')}
          showTrophies={false}
          queryRefetchArray={[{query: GEO_NEAR_PEAK_LISTS, variables}]}
        />
      );
    }
  } else {
    list =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  const metaDescription = getString('meta-data-peak-list-search-description');

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-list-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getString('meta-data-list-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + listDetailLink('search')} />
      </Helmet>
      <div>
        {list}
      </div>
    </>
  );
};

export default PeakListPage;
