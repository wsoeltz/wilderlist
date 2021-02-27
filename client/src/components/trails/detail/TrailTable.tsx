import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useTrailSegments} from '../../../queries/trails/useTrailSegments';
import useUsersProgress from '../../../queries/users/useUsersProgress';
import {trailDetailLink} from '../../../routing/Utils';
import {PeakListVariants} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import getDates from '../../peakLists/detail/getDates';
import ItemTable from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import LoadingSimple, {LoadingContainer} from '../../sharedComponents/LoadingSimple';
import MapRenderProp from '../../sharedComponents/MapRenderProp';

interface Props {
  id: string;
}

const Content = (props: Props) => {
  const  {id} = props;
  const getString = useFluent();
  const {loading, data} = useTrailSegments(id);
  const usersProgress = useUsersProgress();

  const progressTrails = usersProgress.data && usersProgress.data.progress && usersProgress.data.progress.trails
    ? usersProgress.data.progress.trails : [];

  const completionFieldKeys = [
    {
      displayKey: 'hikedDisplayValue',
      sortKey: 'hikedSortValue',
      label: 'Hiked On',
    },
  ];
  const stringDateFields = [
    {
      displayKey: 'hikedStringValue',
      sortKey: null,
      label: 'Hiked On',
    },
  ];

  if (loading || usersProgress.loading) {
    return (
      <LoadingContainer>
        <LoadingSimple />
      </LoadingContainer>
    );
  } else if (data && data.trail) {
    const trails = data.trail.children.map(t => {
      const formattedType = upperFirst(getString('global-formatted-trail-type', {type: t.type}));
      const name = t.name ? t.name : formattedType;
      const trailLength = t.trailLength ? parseFloat(t.trailLength.toFixed(1)) : 0;
      const trailLengthDisplay = getString('directions-driving-distance', {miles: trailLength});
      const avgSlopeDisplay = t.avgSlope ? parseFloat(t.avgSlope.toFixed(1)) + '°' : '0°';
      const {dates, completedCount} = getDates({
        type: PeakListVariants.standard,
        item: t,
        field: CoreItem.trail,
        userItems: progressTrails,
        completionFieldKeys,
        stringDateFields,
      });
      return {
        ...t,
        name,
        line: t.line,
        center: t.center,
        formattedType,
        trailLength,
        trailLengthDisplay,
        avgSlopeDisplay,
        hikedCount: completedCount,
        destination: trailDetailLink(t.id),
        ...dates,
      };
    });

    return (
      <>
        <ItemTable
          showIndex={true}
          items={trails}
          dataFieldKeys={[
            {
              displayKey: 'locationTextShort',
              sortKey: 'locationTextShort',
              label: getString('global-text-value-state'),
            }, {
              displayKey: 'trailLengthDisplay',
              sortKey: 'trailLength',
              label: getString('global-text-value-length'),
            }, {
              displayKey: 'avgSlopeDisplay',
              sortKey: 'avgSlope',
              label: getString('global-text-value-incline'),
            },
          ]}
          completionFieldKeys={completionFieldKeys}
          actionFieldKeys={[]}
          type={CoreItem.trail}
          variant={PeakListVariants.standard}
        />
        <MapRenderProp
          id={data.trail.id}
          trails={trails}
        />
      </>
    );
  } else {
    return null;
  }

};

export default Content;
