const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import { useMutation, useQuery } from '@apollo/client';
import orderBy from 'lodash/orderBy';
import React from 'react';
import styled from 'styled-components';
import useFluent from '../../../hooks/useFluent';
import useMapCenter from '../../../hooks/useMapCenter';
import usePrevious from '../../../hooks/usePrevious';
import {refetchUsersLists} from '../../../queries/getUsersPeakLists';
import {
  SectionTitleH3,
} from '../../../styling/styleUtils';
import {
  ADD_PEAK_LIST_TO_USER,
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
  GEO_NEAR_PEAK_LISTS,
  SuccessResponse,
  Variables,
} from './index';
import ListPeakLists, {ViewMode} from './ListPeakLists';

const Background = styled.div`
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.04);
`;

interface Props {
  userId: string;
}

const SuggestedLists = (props: Props) => {
  const {userId} = props;

  const getString = useFluent();
  const [longitude, latitude] = useMapCenter();

  const variables = {
      latitude: parseFloat(latitude.toFixed(2)),
      longitude: parseFloat(longitude.toFixed(2)),
      limit: 20,
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
    list = null;
  } else if (error !== undefined) {
    console.error(error);
    list = null;
  } else if (dataToUse !== undefined) {
    const { peakLists } = dataToUse;
    if (!peakLists) {
      list = null;
    } else {

      const mapCenter = point([longitude, latitude]);
      const sortedPeakLists = orderBy(peakLists.filter(p => !p.isActive).map(p => ({
        ...p,
        distance: Math.round(distance(mapCenter, point(p.center)) / 200) * 200,
      })), ['numUsers', 'distance'], ['desc', 'asc']).slice(0, 4);
      if (sortedPeakLists.length === 0) {
        list = null;
      } else {
        list = (
          <Background>
            <SectionTitleH3>{getString('dashboard-suggested-lists')}</SectionTitleH3>
            <ListPeakLists
              viewMode={ViewMode.Card}
              peakListData={sortedPeakLists}
              listAction={beginList}
              actionText={getString('peak-list-detail-text-begin-list')}
              profileId={undefined}
              noResultsText={''}
              showTrophies={false}
              queryRefetchArray={[{query: GEO_NEAR_PEAK_LISTS, variables}]}
            />
          </Background>
        );
      }
    }
  } else {
    list = null;
  }

  return (
    <>
      {list}
    </>
  );
};

export default SuggestedLists;
