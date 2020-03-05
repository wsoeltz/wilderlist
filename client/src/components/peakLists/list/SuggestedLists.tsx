import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
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

const getSelectionArray = (state: string) => {
  // list selection arrays
  if (state === 'NH') {
  // FOR NH
    return [
      '5d8907d8db07d0b23d6c0d71', // NH48
      '5db9dd9a2d4ef1001786a43f', // 52WAV
      '5d8d8bc8ac1095001788bbcb', // NH100
    ];
  } else if (state === 'MA') {
  // FOR MA
    return [
      '5d8907d8db07d0b23d6c0d71', // NH48
      '5d8cb3d65a452f00176cf801', // NE67
      '5db9dd4c2d4ef1001786a43e', // ADK46
    ];
  } else if (state === 'VT') {
  // FOR ME or VT
    // NE67
    // NE100
    // NH48
    return [
      '5d8cb3d65a452f00176cf801', // NE67
      '5d8d2e6b5a452f00176cf80f', // NE100
      '5d8907d8db07d0b23d6c0d71', // NH48
    ];
  } else if (state === 'NY') {
  // FOR NY
    return [
      '5db9dd4c2d4ef1001786a43e', // ADK46
      '5db9de0d2d4ef1001786a440', // NY4k Catskills (coming soon)
      '5db9de782d4ef1001786a442', // NE111
    ];
  } else {
    // ELSE same as MA
    return [
      '5d8907d8db07d0b23d6c0d71', // NH48
      '5d8cb3d65a452f00176cf801', // NE67
      '5db9dd4c2d4ef1001786a43e', // ADK46
    ];
  }
};

const Background = styled.div`
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.04);
`;

interface Props {
  userId: string;
  usersState: string;
}

const SuggestedLists = (props: Props) => {
  const {userId, usersState} = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const variables = {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: 4,
    userId,
    selectionArray: getSelectionArray(usersState),
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
        if (peakList.isActive === false) {
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
              actionText={'Begin List'}
              profileId={undefined}
              noResultsText={''}
              showTrophies={false}
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
