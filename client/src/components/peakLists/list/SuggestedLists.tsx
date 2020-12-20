import { useMutation, useQuery } from '@apollo/client';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {LocationDatum} from '../../../hooks/useUsersLocation';
import {
  SectionTitleH3,
} from '../../../styling/styleUtils';
import { GET_ALL_USERS_MOUNTAINS } from '../../stats/AllMountains';
import {
  ADD_PEAK_LIST_TO_USER,
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
  CardSuccessResponse,
  SEARCH_PEAK_LISTS,
  Variables,
  ViewMode,
} from './index';
import ListPeakLists, {CardPeakListDatum} from './ListPeakLists';

const getSelectionArray = (state: string | null) => {
  // list selection arrays
  if (state === '5d5db5e67285c2a4ff69b164') {
  // FOR NH
    return [
      '5d8907d8db07d0b23d6c0d71', // NH48
      '5db9dd9a2d4ef1001786a43f', // 52WAV
      '5d8d8bc8ac1095001788bbcb', // NH100
    ];
  } else if (state === '5d5db5d37285c2a4ff69b163') {
  // FOR MA
    return [
      '5d8907d8db07d0b23d6c0d71', // NH48
      '5eee2c2f204aeb00173afbd3', // HOLYOKE
      '5f0a2220c9d74d0017173022', // Bluehills
      '5d8cb3d65a452f00176cf801', // NE67
      '5db9dd4c2d4ef1001786a43e', // ADK46
    ];
  } else if (state === '5d5db5f27285c2a4ff69b165') {
  // FOR ME or VT
    return [
      '5d8cb3d65a452f00176cf801', // NE67
      '5d8d2e6b5a452f00176cf80f', // NE100
      '5d8907d8db07d0b23d6c0d71', // NH48
    ];
  } else if (state === '5d5db6137285c2a4ff69b168') {
  // FOR NY
    return [
      '5db9dd4c2d4ef1001786a43e', // ADK46
      '5e62edb65bff660017daec9a', // Catskills
      '5db9de782d4ef1001786a442', // NE111
    ];
  } else {
    return [];
  }
};

const Background = styled.div`
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.04);
`;

interface Props {
  userId: string;
  usersLocationData: LocationDatum;
}

const SuggestedLists = (props: Props) => {
  const {userId, usersLocationData} = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const selectionArray = getSelectionArray(usersLocationData.stateId);

  const variables = selectionArray.length ? {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: 5,
    userId,
    variant: null,
    selectionArray,
    state: null,
  } : {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: 5,
    userId,
    variant: null,
    selectionArray: null,
    state: usersLocationData.stateId,
  };

  const {loading, error, data} = useQuery<CardSuccessResponse, Variables>(SEARCH_PEAK_LISTS, {variables });

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER, {
      refetchQueries: () => [
        {query: SEARCH_PEAK_LISTS, variables},
        {query: GET_ALL_USERS_MOUNTAINS, variables: { userId }},
      ],
    });
  const beginList = userId ? (peakListId: string) => addPeakListToUser({variables: {userId,  peakListId}}) : null;

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    list = null;
  } else if (error !== undefined) {
    console.error(error);
    list = null;
  } else if (data !== undefined) {
    const { peakLists } = data;
    if (!peakLists) {
      list = null;
    } else {
      const peakListData: CardPeakListDatum[] = [];
      peakLists.forEach(peakList => {
        if (peakList && peakList.isActive === false) {
          peakListData.push(peakList);
        }
      });
      if (peakListData.length === 0) {
        list = null;
      } else {
        list = (
          <Background>
            <SectionTitleH3>{getFluentString('dashboard-suggested-lists')}</SectionTitleH3>
            <ListPeakLists
              viewMode={ViewMode.Card}
              peakListData={peakListData}
              userListData={[]}
              listAction={beginList}
              actionText={getFluentString('peak-list-detail-text-begin-list')}
              profileId={undefined}
              noResultsText={''}
              showTrophies={false}
              queryRefetchArray={[{query: SEARCH_PEAK_LISTS, variables}]}
              dashboardView={true}
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
