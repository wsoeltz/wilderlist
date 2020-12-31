import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {useCompareAllMountains} from '../../../queries/lists/useCompareAllMountains';
import { PlaceholderText } from '../../../styling/styleUtils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import { MountainDatumLite } from './ComparisonRow';
import ComparisonTable from './ComparisonTable';

interface Props {
  userId: string;
  id: string;
}

const CompareAllMountains = (props: Props) => {
  const { userId, id } = props;

  const getString = useFluent();

  const {loading, error, data} = useCompareAllMountains(userId, id);
  if (loading === true) {
    return <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const {
      user, me,
    } = data;
    const allMountains: MountainDatumLite[] = [];
    me.peakLists.forEach(peakList => {
      let mountains: MountainDatumLite[];
      const { parent } = peakList;
      if (parent !== null && parent.mountains !== null) {
        mountains = parent.mountains;
      } else if (peakList.mountains !== null) {
        mountains = peakList.mountains;
      } else {
        mountains = [];
      }
      mountains.forEach(mountain => {
        if (allMountains.findIndex(({id: currentId}) => mountain.id === currentId) === -1) {
          allMountains.push(mountain);
        }
      });
    });
    user.peakLists.forEach(peakList => {
      let mountains: MountainDatumLite[];
      const { parent } = peakList;
      if (parent !== null && parent.mountains !== null) {
        mountains = parent.mountains;
      } else if (peakList.mountains !== null) {
        mountains = peakList.mountains;
      } else {
        mountains = [];
      }
      mountains.forEach(mountain => {
        if (allMountains.findIndex(({id: currentId}) => mountain.id === currentId) === -1) {
          allMountains.push(mountain);
        }
      });
    });
    return (
      <>
        <Helmet>
          <title>{getString('meta-data-compare-all-title', {
            user: user.name,
          })}</title>
        </Helmet>
        <h1>Compare all ascents</h1>
        <ComparisonTable
          user={user}
          me={me}
          mountains={allMountains}
        />
      </>
    );
  } else {
    return null;
  }
};

export default CompareAllMountains;
