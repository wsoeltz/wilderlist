import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { PlaceholderText } from '../../../styling/styleUtils';
import { Mountain, PeakList, Region, State, User } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Map from '../../sharedComponents/map';
import { getStatesOrRegion } from '../list/PeakListCard';
import { isState } from '../Utils';
import Header from './Header';
import MountainTable from './MountainTable';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID) {
    peakList(id: $id) {
      id
      name
      shortName
      type
      mountains {
        id
        name
        latitude
        longitude
        elevation
        prominence
        state {
          id
          name
          regions {
            id
            name
            states {
              id
            }
          }
        }
      }
      parent {
        id
        mountains {
          id
          name
          latitude
          longitude
          elevation
          prominence
          state {
            id
            name
            regions {
              id
              name
              states {
                id
              }
            }
          }
        }
      }
    }
    user(id: $userId) {
      id
      name
      peakLists {
        id
      }
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
  elevation: Mountain['elevation'];
  prominence: Mountain['prominence'];
  state: {
    id: State['id'];
    name: State['name'];
    regions: Array<{
      id: Region['id'];
      name: Region['name'];
      states: Array<{
        id: State['id'],
      }>
    }>
  };
}

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  mountains: MountainDatum[] | null;
  parent: {
    id: PeakList['id'];
    mountains: MountainDatum[] | null;
  } | null;
}

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  peakLists: Array<{
    id: PeakList['id'];
  }>;
  mountains: User['mountains'];
}

interface SuccessResponse {
  peakList: PeakListDatum;
  user: UserDatum | null;
}

interface Variables {
  id: string;
  userId: string | null;
}

interface Props {
  userId: string | null;
  id: string;
}

const PeakListDetail = (props: Props) => {
  const { userId, id } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST, {
    variables: { id, userId },
  });
  if (loading === true) {
    return <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    return  (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { peakList, user } = data;
    if (!peakList) {
      return (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {parent, type} = peakList;
      let mountains: MountainDatum[];
      if (parent !== null && parent.mountains !== null) {
        mountains = parent.mountains;
      } else if (peakList.mountains !== null) {
        mountains = peakList.mountains;
      } else {
        mountains = [];
      }
      const completedAscents =
        user && user.mountains !== null ? user.mountains : [];
      const statesOrRegions = getStatesOrRegion(mountains, getFluentString);
      const isStateOrRegion = isState(statesOrRegions) === true ? 'state' : 'region';
      const mountainsSortedByElevation = sortBy(mountains, ['elevation']).reverse();
      const mountainsSortedByProminence = sortBy(mountains, ['prominence']).reverse();
      const highestAlsoMostProminent = mountainsSortedByElevation[0].id === mountainsSortedByProminence[0].id;
      const incompleteProminence =
        mountainsSortedByProminence[0].prominence === undefined || mountainsSortedByProminence[0].prominence === null;
      const paragraphText = getFluentString('peak-list-detail-list-overview-para-1', {
        'list-name': peakList.name,
        'number-of-peaks': mountains.length,
        'state-or-region': isStateOrRegion.toString(),
        'state-region-name': statesOrRegions,
        'highest-mountain-name': mountainsSortedByElevation[0].name,
        'highest-mountain-elevation': mountainsSortedByElevation[0].elevation,
        'incomplete-prominence': incompleteProminence.toString(),
        'highest-also-most-prominent': highestAlsoMostProminent.toString(),
        'most-prominent-peak-name': mountainsSortedByProminence[0].name,
        'most-prominent-value': mountainsSortedByProminence[0].prominence,
        'most-prominent-elevation': mountainsSortedByProminence[0].elevation,
        'smallest-mountain-name':
          mountainsSortedByElevation[mountainsSortedByElevation.length - 1].name,
        'smallest-mountain-elevation':
          mountainsSortedByElevation[mountainsSortedByElevation.length - 1].elevation,
      });
      return (
        <>
          <Header
            user={user}
            mountains={mountains}
            peakList={peakList}
            completedAscents={completedAscents}
          />
          <Map
            id={peakList.id}
            coordinates={mountains}
          />
          <p>
            {paragraphText}
          </p>
          <MountainTable
            user={user}
            mountains={mountains}
            type={type}
            peakListId={peakList.id}
          />
        </>
      );
    }
  } else {
    return (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }
};

export default PeakListDetail;
