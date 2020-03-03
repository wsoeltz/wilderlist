import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { searchListDetailLink } from '../../routing/Utils';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
  SearchContainer,
} from '../../styling/Grid';
import { ButtonPrimaryLink, PlaceholderText } from '../../styling/styleUtils';
import { User } from '../../types/graphQLTypes';
import { mobileSize } from '../../Utils';
import { AppContext } from '../App';
import PeakListDetail from '../peakLists/detail/PeakListDetail';
import { ViewMode } from '../peakLists/list';
import GhostPeakListCard from '../peakLists/list/GhostPeakListCard';
import ListPeakLists, { CardPeakListDatum } from '../peakLists/list/ListPeakLists';
import BackButton from '../sharedComponents/BackButton';
import StandardSearch from '../sharedComponents/StandardSearch';
import AllMountains from '../stats/AllMountains';

const PlaceholderButton = styled(ButtonPrimaryLink)`
  font-style: normal;
`;

export const GET_USERS_PEAK_LISTS = gql`
  query GetUsersFriends($userId: ID!) {
    user(id: $userId) {
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

interface PeakListsSuccessResponse {
  user: {
    id: User['id'];
    peakLists: CardPeakListDatum[];
  };
}

interface Variables {
  userId: string;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const Dashboard = (props: Props) => {
  const { userId, history, match } = props;
  const { peakListId }: any = match.params;

  const searchPeakLists = (value: string) => {
    const url = searchListDetailLink('search') + '?query=' + value + '&page=1&origin=dashboard';
    history.push(url);
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const { windowWidth } = useContext(AppContext);

  const {
    loading: listLoading,
    error: listsError,
    data: listsData,
  } = useQuery<PeakListsSuccessResponse, Variables>(GET_USERS_PEAK_LISTS, {
    variables: { userId },
  });

  let peakListsList: React.ReactElement<any> | null;
  if (listLoading === true) {
    const loadingListCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingListCards.push(<GhostPeakListCard key={i} />);
    }
    peakListsList = <>{loadingListCards}</>;
  } else if (listsError !== undefined) {
    console.error(listsError);
    peakListsList = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>);
  } else if (listsData !== undefined) {
    const { user } = listsData;
    const { peakLists } = user;
    if (peakLists.length === 0) {
      peakListsList = (
        <PlaceholderText>
          <div>
            <p>
              {getFluentString('dashboard-empty-state-no-active-lists-text')}
            </p>
            <p>
              <PlaceholderButton
                to={searchListDetailLink('search')}
              >
                {getFluentString('dashboard-empty-state-no-active-lists-button')}
              </PlaceholderButton>
            </p>
          </div>
        </PlaceholderText>
      );
    } else {
      const usersLists = peakLists.map(peakList => peakList.id);
      peakListsList = (
        <ListPeakLists
          viewMode={ViewMode.Card}
          peakListData={peakLists}
          userListData={usersLists}
          listAction={null}
          actionText={''}
          profileId={undefined}
          noResultsText={''}
          showTrophies={true}
          dashboardView={true}
        />
      );
    }
  } else {
    peakListsList = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  let rightSideContent: React.ReactElement<any> | null;
  if (windowWidth < mobileSize) {
    rightSideContent = null;
  } else if (peakListId !== undefined) {
    rightSideContent = (
      <PeakListDetail userId={userId} id={peakListId} mountainId={undefined}/>
    );
  }  else {
    rightSideContent = (
      <AllMountains
        userId={userId}
      />
    );
  }

  const rightSideUtility = peakListId !== undefined ? (
      <ContentHeader>
        <BackButton />
      </ContentHeader>
    ) : null;

  return (
    <>
      <Helmet>
        <title>{getFluentString('meta-data-dashboard-default-title')}</title>
      </Helmet>
      <ContentLeftLarge>
        <SearchContainer>
          <StandardSearch
            placeholder={getFluentString('global-text-value-search-hiking-lists')}
            setSearchQuery={searchPeakLists}
            focusOnMount={false}
            initialQuery={''}
          />
        </SearchContainer>
        <ContentBody>
          {peakListsList}
        </ContentBody>
      </ContentLeftLarge>
      <ContentRightSmall>
        {rightSideUtility}
        <ContentBody>
          {rightSideContent}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(Dashboard);
