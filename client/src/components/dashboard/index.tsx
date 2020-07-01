import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { Routes } from '../../routing/routes';
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
  ButtonSecondary,
  PlaceholderText,
  SectionTitleH3,
} from '../../styling/styleUtils';
import { PeakListVariants, User } from '../../types/graphQLTypes';
import { mobileSize } from '../../Utils';
import { AppContext } from '../App';
import NewAscentReport from '../peakLists/detail/completionModal/NewAscentReport';
import PeakListDetail from '../peakLists/detail/PeakListDetail';
import { ViewMode } from '../peakLists/list';
import ListPeakLists, { CardPeakListDatum } from '../peakLists/list/ListPeakLists';
import SuggestedLists from '../peakLists/list/SuggestedLists';
import BackButton from '../sharedComponents/BackButton';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import StandardSearch from '../sharedComponents/StandardSearch';
import AllMountains from '../stats/AllMountains';

const SearchRoot = styled(SearchContainer)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
`;

const AscentButtonRoot = styled.div`
  display: flex;
  align-items: center;
`;

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
        stateOrRegionString
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

  const { windowWidth, usersLocation } = useContext(AppContext);

  const usersState = usersLocation && usersLocation.data && usersLocation.data.stateAbbreviation
    ? usersLocation.data.stateAbbreviation : undefined;

  const [ascentModalOpen, setAscentModalOpen] = useState<boolean>(false);

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
            queryRefetchArray={[{query: GET_USERS_PEAK_LISTS, variables: { userId }}]}
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

  const addAscentButton = windowWidth < mobileSize ? (
    <AscentButtonRoot>
      <ButtonSecondary onClick={() => setAscentModalOpen(true)}>
        <FontAwesomeIcon icon='calendar-alt' /> {getFluentString('map-add-ascent')}
      </ButtonSecondary>
    </AscentButtonRoot>
  ) : null;

  const addAscentModal = ascentModalOpen ? (
    <NewAscentReport
      initialMountainList={[]}
      closeEditMountainModalModal={() => setAscentModalOpen(false)}
      userId={userId}
      variant={PeakListVariants.standard}
      queryRefetchArray={[{query: GET_USERS_PEAK_LISTS, variables: { userId }}]}
    />
  ) : null;

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
        <BackButton
          onClick={() => history.push(Routes.Dashboard)}
          text={getFluentString('dashboard-back-to-dashboard')}
        />
      </ContentHeader>
    ) : null;

  return (
    <>
      <Helmet>
        <title>{getFluentString('meta-data-dashboard-default-title')}</title>
      </Helmet>
      <ContentLeftLarge>
        <SearchRoot>
          <StandardSearch
            placeholder={getFluentString('global-text-value-search-hiking-lists')}
            setSearchQuery={searchPeakLists}
            focusOnMount={false}
            initialQuery={''}
          />
          {addAscentButton}
        </SearchRoot>
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
      {addAscentModal}
    </>
  );
};

export default withRouter(Dashboard);
