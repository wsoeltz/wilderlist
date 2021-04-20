import {faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import React, {useEffect} from 'react';
import useFluent from '../../hooks/useFluent';
import useMapContext from '../../hooks/useMapContext';
import {CardPeakListDatum, useUsersPeakLists} from '../../queries/lists/getUsersPeakLists';
import { listDetailLink } from '../../routing/Utils';
import {
  BasicContentContainer,
  CenterdLightTitle,
  CenteredHeader,
  EmptyBlock,
  HorizontalScrollContainer,
} from '../../styling/sharedContentStyles';
import {
  BasicIconInText,
  ButtonPrimaryLink,
  PlaceholderText,
} from '../../styling/styleUtils';
import ListPeakLists from '../peakLists/list/ListPeakLists';
import LoadingSimple from '../sharedComponents/LoadingSimple';
import MapRenderProp from '../sharedComponents/MapRenderProp';
import AllSavedListItemsMapRenderProp from './AllSavedListItemsMapRenderProp';

interface Props {
  userId: string;
}

const SavedLists = ({userId}: Props) => {
  const getString = useFluent();
  const mapContext = useMapContext();

  useEffect(() => () => {
    if (mapContext.intialized) {
      mapContext.clearMap();
    }
  }, [mapContext]);

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
            <PlaceholderText dangerouslySetInnerHTML={{
              __html: getString('dashboard-empty-state-no-active-lists-text')}}
            />
          </BasicContentContainer>
          <p style={{textAlign: 'center'}}>
            <ButtonPrimaryLink
              to={listDetailLink('search')}
            >
              {getString('dashboard-empty-state-no-active-lists-button')}
            </ButtonPrimaryLink>
          </p>
          <MapRenderProp
            id={'dashboard-saved-lists-empty'}
          />
        </div>
      );
    } else {
      peakListsList = (
        <>
          <ListPeakLists
            peakListData={peakLists.filter(p => p) as CardPeakListDatum[]}
            profileId={undefined}
            noResultsText={''}
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
      {peakListsList}
      <AllSavedListItemsMapRenderProp
        userId={userId}
      />
    </>
  );
};

export default SavedLists;
