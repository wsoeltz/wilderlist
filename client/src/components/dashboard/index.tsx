import { gql, useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useCallback, useContext, useState} from 'react';
import Helmet from 'react-helmet';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import { searchListDetailLink } from '../../routing/Utils';
import {
  ContentBody,
  ContentLeftLarge,
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
import { ViewMode } from '../peakLists/list';
import ListPeakLists, { CardPeakListDatum } from '../peakLists/list/ListPeakLists';
import SuggestedLists from '../peakLists/list/SuggestedLists';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import StandardSearch from '../sharedComponents/StandardSearch';

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

interface Props {
  userId: string;
}

const Dashboard = (props: Props) => {
  const { userId } = props;

  const history = useHistory();

  const searchPeakLists = (value: string) => {
    const url = searchListDetailLink('search') + '?query=' + value + '&page=1&origin=dashboard';
    history.push(url);
  };

  const getString = useFluent();

  const { windowWidth, usersLocation } = useContext(AppContext);

  const usersState = usersLocation.data
    ? usersLocation.data : undefined;

  const [ascentModalOpen, setAscentModalOpen] = useState<boolean>(false);
  const openAscentModal = useCallback(() => setAscentModalOpen(true), []);
  const closeAscentModal = useCallback(() => setAscentModalOpen(false), []);

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
        {getString('global-error-retrieving-data')}
      </PlaceholderText>);
  } else if (listsData !== undefined) {
    const { user } = listsData;
    const { peakLists } = user;
    const suggestedLists = peakLists.length < 3 && usersState !== undefined
      ? <SuggestedLists userId={userId} usersLocationData={usersState} /> : null;
    if (peakLists.length === 0) {
      peakListsList = (
        <div>
          <SectionTitleH3>{
            getString('user-profile-lists-in-progress')}
          </SectionTitleH3>
          <p>
            {getString('dashboard-empty-state-no-active-lists-text')}
          </p>
          <p style={{textAlign: 'center'}}>
            <PlaceholderButton
              to={searchListDetailLink('search')}
            >
              {getString('dashboard-empty-state-no-active-lists-button')}
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
            queryRefetchArray={[{query: GET_USERS_PEAK_LISTS, variables: { userId }}]}
          />
          {suggestedLists}
        </>
      );
    }
  } else {
    peakListsList = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  const addAscentButton = windowWidth < mobileSize ? (
    <AscentButtonRoot>
      <ButtonSecondary onClick={openAscentModal}>
        <FontAwesomeIcon icon='calendar-alt' /> {getString('map-add-ascent')}
      </ButtonSecondary>
    </AscentButtonRoot>
  ) : null;

  const addAscentModal = ascentModalOpen ? (
    <NewAscentReport
      initialMountainList={[]}
      closeEditMountainModalModal={closeAscentModal}
      userId={userId}
      variant={PeakListVariants.standard}
      queryRefetchArray={[{query: GET_USERS_PEAK_LISTS, variables: { userId }}]}
    />
  ) : null;

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-dashboard-default-title')}</title>
      </Helmet>
      <ContentLeftLarge>
        <SearchRoot>
          <StandardSearch
            placeholder={getString('global-text-value-search-hiking-lists')}
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
      {addAscentModal}
    </>
  );
};

export default Dashboard;
