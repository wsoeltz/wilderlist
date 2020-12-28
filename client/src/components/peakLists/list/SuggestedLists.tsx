import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import useFluent from '../../../hooks/useFluent';
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


  const {loading, error, data} = useQuery<CardSuccessResponse, Variables>(SEARCH_PEAK_LISTS, {variables: {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: 5,
    userId,
    variant: null,
    state: '',
  }});

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER, {
      refetchQueries: () => [
        {query: SEARCH_PEAK_LISTS, variables: {
          searchQuery: '',
          pageNumber: 1,
          nPerPage: 5,
          userId,
          variant: null,
          state: '',
        }},
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
            <SectionTitleH3>{getString('dashboard-suggested-lists')}</SectionTitleH3>
            <ListPeakLists
              viewMode={ViewMode.Card}
              peakListData={peakListData}
              listAction={beginList}
              actionText={getString('peak-list-detail-text-begin-list')}
              profileId={undefined}
              noResultsText={''}
              showTrophies={false}
              queryRefetchArray={[{query: SEARCH_PEAK_LISTS, variables: {
                searchQuery: '',
                pageNumber: 1,
                nPerPage: 5,
                userId,
                variant: null,
                state: '',
              }}]}
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
