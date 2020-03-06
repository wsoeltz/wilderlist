import { useQuery } from '@apollo/react-hooks';
import axios from 'axios';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import publicIp from 'public-ip';
import React, {useContext, useEffect, useState} from 'react';
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
import {
  ButtonPrimaryLink,
  PlaceholderText,
  SectionTitleH3,
} from '../../styling/styleUtils';
import { User } from '../../types/graphQLTypes';
import { mobileSize } from '../../Utils';
import { AppContext } from '../App';
import PeakListDetail from '../peakLists/detail/PeakListDetail';
import { ViewMode } from '../peakLists/list';
import ListPeakLists, { CardPeakListDatum } from '../peakLists/list/ListPeakLists';
import SuggestedLists from '../peakLists/list/SuggestedLists';
import BackButton from '../sharedComponents/BackButton';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
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

  const [usersState, setUsersState] = useState<string | undefined>(undefined);
  useEffect(() => {
    const getUsersIpLocation = async () => {
      try {
        const key = process.env.REACT_APP_GEO_PLUGIN_API_KEY;
        const ip = await publicIp.v4();
        const res = await axios.get(
          `https://ssl.geoplugin.net/json.gp?k=${key}&ip=${ip}`,
        );
        if (res && res.data && res.data.geoplugin_regionCode) {
          setUsersState(res.data.geoplugin_regionCode);
        } else {
          setUsersState('unknown');
        }
      } catch (e) {
        console.error(e);
        setUsersState('unknown');
      }
    };
    getUsersIpLocation();
  });

  const {
    loading: listLoading,
    error: listsError,
    data: listsData,
  } = useQuery<PeakListsSuccessResponse, Variables>(GET_USERS_PEAK_LISTS, {
    variables: { userId },
  });

  let peakListsList: React.ReactElement<any> | null;
  if (listLoading === true) {
    peakListsList = <LoadingSpinner />;
  } else if (listsError !== undefined) {
    console.error(listsError);
    peakListsList = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>);
  } else if (listsData !== undefined) {
    const { user } = listsData;
    const { peakLists } = user;
    const suggestedLists = peakLists.length < 3 && usersState !== undefined
      ? <SuggestedLists userId={userId} usersState={usersState} /> : null;
    if (peakLists.length === 0) {
      peakListsList = (
        <div>
          <SectionTitleH3>{
            getFluentString('user-profile-lists-in-progress')}
          </SectionTitleH3>
          <p>
            {getFluentString('dashboard-empty-state-no-active-lists-text')}
          </p>
          <p style={{textAlign: 'center'}}>
            <PlaceholderButton
              to={searchListDetailLink('search')}
            >
              {getFluentString('dashboard-empty-state-no-active-lists-button')}
            </PlaceholderButton>
          </p>
          {suggestedLists}
        </div>
      );
    } else {
      const usersLists = peakLists.map(peakList => peakList.id);
      peakListsList = (
        <>
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
          {suggestedLists}
        </>
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
