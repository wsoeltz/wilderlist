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
import GhostPeakListCard from './GhostPeakListCard';
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const variables = {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: 4,
    userId,
    selectionArray: [],
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
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostPeakListCard key={i} />);
    }
    list = <>{loadingCards}</>;
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
