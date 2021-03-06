import queryString from 'query-string';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  useItemsFromIdLists,
} from '../../../queries/compound/getItemsFromIdLists';
import { Routes } from '../../../routing/routes';
import { EditTripReportLinkParams } from '../../../routing/Utils';
import { PlaceholderText } from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import {
  getDates,
} from '../../../utilities/dateUtils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import EditAscentReport from './EditAscentReport';

const EditTripReport = () => {
  const getString = useFluent();
  const user = useCurrentUser();
  const {goBack, location, push} = useHistory();
  const {
    refpath, mountains, trails, campsites, listtype, month, season,
    date,
  } = queryString.parse(location.search) as EditTripReportLinkParams;

  let mountainIds: string[] = [];
  let trailIds: string[] = [];
  let campsiteIds: string[] = [];
  if (mountains) {
    if (typeof mountains === 'string') {
      mountainIds = [mountains];
    } else {
      mountainIds = mountains;
    }
  }
  if (trails) {
    if (typeof trails === 'string') {
      trailIds = [trails];
    } else {
      trailIds = trails;
    }
  }
  if (campsites) {
    if (typeof campsites === 'string') {
      campsiteIds = [campsites];
    } else {
      campsiteIds = campsites;
    }
  }

  const {loading, error, data} = useItemsFromIdLists({mountainIds, trailIds, campsiteIds});

  const onSave = useCallback(() => {
    if (refpath) {
      push(refpath as string);
    } else {
      push(Routes.Dashboard);
    }
  }, [refpath, push]);

  const onClose = useCallback(() => {
    if (refpath) {
      push(refpath as string);
    } else {
      goBack();
    }
  }, [refpath, push, goBack]);

  if (user) {
    if (loading) {
      return <LoadingSpinner />;
    } else if (error) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const initialMountainList = data && data.mountains ? data.mountains : [];
      const initialTrailList = data && data.trails ? data.trails : [];
      const initialCampsiteList = data && data.campsites ? data.campsites : [];
      const dateObject = getDates([date]);
      return (
          <EditAscentReport
            date={dateObject[0]}
            initialMountainList={initialMountainList}
            initialTrailList={initialTrailList}
            initialCampsiteList={initialCampsiteList}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={listtype ? listtype : PeakListVariants.standard}
            season={season as any}
            month={month as any}
          />
        );
    }
  } else {
    return null;
  }
};

export default EditTripReport;
