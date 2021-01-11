import queryString from 'query-string';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  QueryType,
  useSingleMountainOrTrailOrCampsite,
} from '../../../queries/compound/useSingleMountainOrTrailOrCampsite';
import { Routes } from '../../../routing/routes';
import { AddTripReportLinkParams } from '../../../routing/Utils';
import { PlaceholderText } from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import NewAscentReport from './NewAscentReport';

const AddTripReport = () => {
  const getString = useFluent();
  const user = useCurrentUser();
  const {goBack, location, push} = useHistory();
  const {
    refpath, mountain, trail, campsite, listtype, month, season,
  } = queryString.parse(location.search) as AddTripReportLinkParams;

  let id: string | null;
  let type: QueryType | null;
  if (mountain) {
    id = mountain;
    type = QueryType.Mountain;
  } else if (trail) {
    id = trail;
    type = QueryType.Trail;
  } else if (campsite) {
    id = campsite;
    type = QueryType.Campsite;
  } else {
    id = null;
    type = null;
  }

  const {loading, error, data} = useSingleMountainOrTrailOrCampsite(type, id);

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
      const initialMountain = data && data.mountain ? [data.mountain] : [];
      if (listtype && listtype === PeakListVariants.fourSeason && season) {
        return (
          <NewAscentReport
            initialMountainList={initialMountain}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={listtype}
            season={season}
            queryRefetchArray={[]}
          />
        );
      }
      if (listtype && listtype === PeakListVariants.grid && month) {
        return (
          <NewAscentReport
            initialMountainList={initialMountain}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={listtype}
            month={month}
            queryRefetchArray={[]}
          />
        );
      } else {
        const variant = listtype === PeakListVariants.winter ? listtype : PeakListVariants.standard;
        return (
          <NewAscentReport
            initialMountainList={initialMountain}
            onClose={onClose}
            onSave={onSave}
            userId={user._id}
            variant={variant}
            queryRefetchArray={[]}
          />
        );
      }
    }

  } else {
    return null;
  }
};

export default AddTripReport;
