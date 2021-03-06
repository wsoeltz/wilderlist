import {faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import {useUsersPeakLists} from '../../queries/lists/getUsersPeakLists';
import { listDetailLink } from '../../routing/Utils';
import {
  BasicContentContainer,
  CenteredHeader,
  EmptyBlock,
  HorizontalScrollContainer,
} from '../../styling/sharedContentStyles';
import {
  CenterdLightTitle,
} from '../../styling/sharedContentStyles';
import {
  BasicIconInText,
  ButtonPrimaryLink,
  PlaceholderText,
} from '../../styling/styleUtils';
import ListPeakLists from '../peakLists/list/ListPeakLists';
import LoadingSimple from '../sharedComponents/LoadingSimple';
import AllSavedListItemsMapRenderProp from './AllSavedListItemsMapRenderProp';

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
    peakListsList = (
      <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
        <EmptyBlock>
          <CenteredHeader>
            <LoadingSimple />
            {getString('global-text-value-loading')}...
          </CenteredHeader>
        </EmptyBlock>
      </HorizontalScrollContainer>
    );
  } else if (listsError !== undefined) {
    console.error(listsError);
    peakListsList = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>);
  } else if (listsData !== undefined) {
    const { user } = listsData;
    const { peakLists } = user;
    if (peakLists.length === 0) {
      peakListsList = (
        <div>
          <CenterdLightTitle>
            <BasicIconInText icon={faCheckDouble} />
            {getString('user-profile-lists-in-progress')}
          </CenterdLightTitle>
          <BasicContentContainer>
            <p>
              {getString('dashboard-empty-state-no-active-lists-text')}
            </p>
          </BasicContentContainer>
          <p style={{textAlign: 'center'}}>
            <PlaceholderButton
              to={listDetailLink('search')}
            >
              {getString('dashboard-empty-state-no-active-lists-button')}
            </PlaceholderButton>
          </p>
        </div>
      );
    } else {
      peakListsList = (
        <>
          <ListPeakLists
            peakListData={peakLists}
            listAction={null}
            actionText={''}
            profileId={undefined}
            noResultsText={''}
            showTrophies={true}
          />
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
      <AllSavedListItemsMapRenderProp
        userId={userId}
      />
    </>
  );
};

export default SavedLists;
