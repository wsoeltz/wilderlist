import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import {useUsersPeakLists} from '../../queries/lists/getUsersPeakLists';
import { listDetailLink } from '../../routing/Utils';
import {
  ButtonPrimaryLink,
  PlaceholderText,
  SectionTitleH3,
} from '../../styling/styleUtils';
import ListPeakLists, { ViewMode } from '../peakLists/list/ListPeakLists';
import SuggestedLists from '../peakLists/list/SuggestedLists';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';

const PlaceholderButton = styled(ButtonPrimaryLink)`
  font-style: normal;
`;

interface Props {
  userId: string;
}

const SavedLists = ({userId}: Props) => {
  const getString = useFluent();

  const {
    loading: listLoading,
    error: listsError,
    data: listsData,
  } = useUsersPeakLists({ userId });

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
    const suggestedLists = peakLists.length < 3
      ? <SuggestedLists /> : null;
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
              to={listDetailLink('search')}
            >
              {getString('dashboard-empty-state-no-active-lists-button')}
            </PlaceholderButton>
          </p>
          {suggestedLists}
        </div>
      );
    } else {
      peakListsList = (
        <>
          <ListPeakLists
            viewMode={ViewMode.Card}
            peakListData={peakLists}
            listAction={null}
            actionText={''}
            profileId={undefined}
            noResultsText={''}
            showTrophies={true}
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

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-dashboard-default-title')}</title>
      </Helmet>
      {peakListsList}
    </>
  );
};

export default SavedLists;
