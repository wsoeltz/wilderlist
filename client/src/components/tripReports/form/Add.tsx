import queryString from 'query-string';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  useItemsFromIdLists,
} from '../../../queries/compound/getItemsFromIdLists';
import { Routes } from '../../../routing/routes';
import { AddTripReportLinkParams } from '../../../routing/Utils';
import { PlaceholderText } from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import AscentReportFromNotification from './AscentReportFromNotification';
import NewAscentReport from './NewAscentReport';

const AddTripReport = () => {
  const getString = useFluent();
  const user = useCurrentUser();
  const {goBack, location, push} = useHistory();
  const {
    refpath, mountains, trails, campsites, listtype, month, season,
    notification, date, friends,
  } = queryString.parse(location.search) as AddTripReportLinkParams;

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

  const key = 'tripReportKey' + JSON.stringify({mountainIds, trailIds, campsiteIds});

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
      const initialUserList = friends
        ? (typeof friends === 'string' ? [friends] : friends)
        : [];
      if (notification === 'yes' && date) {
        return (
          <AscentReportFromNotification
            date={date}
            initialMountainList={initialMountainList}
            initialTrailList={initialTrailList}
            initialCampsiteList={initialCampsiteList}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={PeakListVariants.standard}
          />
        );
      }
      if (listtype && listtype === PeakListVariants.fourSeason && season) {
        return (
          <NewAscentReport
            key={key}
            date={date ? date : undefined}
            initialMountainList={initialMountainList}
            initialTrailList={initialTrailList}
            initialCampsiteList={initialCampsiteList}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={listtype}
            season={season}
            queryRefetchArray={[]}
            initialUserList={initialUserList}
          />
        );
      }
      if (listtype && listtype === PeakListVariants.grid && month) {
        return (
          <NewAscentReport
            key={key}
            date={date ? date : undefined}
            initialMountainList={initialMountainList}
            initialTrailList={initialTrailList}
            initialCampsiteList={initialCampsiteList}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={listtype}
            month={month}
            queryRefetchArray={[]}
            initialUserList={initialUserList}
          />
        );
      } else {
        const variant = listtype === PeakListVariants.winter ? listtype : PeakListVariants.standard;
        return (
          <NewAscentReport
            key={key}
            date={date ? date : undefined}
            initialMountainList={initialMountainList}
            initialTrailList={initialTrailList}
            initialCampsiteList={initialCampsiteList}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={variant}
            queryRefetchArray={[]}
            initialUserList={initialUserList}
          />
        );
      }
    }

  } else {
    return null;
  }
};

export default AddTripReport;
