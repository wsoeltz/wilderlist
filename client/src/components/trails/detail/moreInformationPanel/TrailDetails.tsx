import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useLineStringElevation from '../../../../hooks/servicesHooks/elevation/useLineStringElevation';
import useFluent from '../../../../hooks/useFluent';
import {useBasicTrailDetail} from '../../../../queries/trails/useBasicTrailDetail';
import {
  CenteredHeader,
  CollapsedScrollContainer,
  EmptyBlock,
  HorizontalScrollContainer,
} from '../../../../styling/sharedContentStyles';
import {slopeToSteepnessClass} from '../../../../utilities/trailUtils';
import ClassificationBlock from '../../../sharedComponents/detailComponents/classificationBlock';
import DetailBlock, {DetailDatum} from '../../../sharedComponents/detailComponents/detailBlock';
import LoadingSimple from '../../../sharedComponents/LoadingSimple';

interface Props {
  id: string;
}

const TrailDetails = (props: Props) => {
  const {id} = props;
  const getString = useFluent();
  const {loading, error, data} = useBasicTrailDetail(id);
  const elevation = useLineStringElevation({
    lineId: id,
    line: data && data.trail && data.trail.line ? data.trail.line : null,
    includeIncline: true,
    includeMinMax: true,
  });
  if (loading || elevation.loading) {
    return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <CenteredHeader>
              <LoadingSimple />
              {getString('global-text-value-loading')}...
            </CenteredHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
    );
  } else if (error !== undefined) {
    console.error(error);
    return (
      <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
        <EmptyBlock>
          <CenteredHeader>
            {getString('global-error-retrieving-data')}
          </CenteredHeader>
        </EmptyBlock>
      </HorizontalScrollContainer>
    );
  } else if (data !== undefined && data.trail && elevation.data) {
    const information: DetailDatum[] = [];
    if (elevation.data.max_slope !== undefined) {
      const max_slope = parseFloat(elevation.data.max_slope.toFixed(1));
      information.push({
        label: getString('global-text-value-max-incline'),
        value: `${upperFirst(slopeToSteepnessClass(max_slope))}, ${max_slope}°`,
      });
    }
    if (elevation.data.min_slope !== undefined) {
      const min_slope = parseFloat(elevation.data.min_slope.toFixed(1));
      information.push({
        label: getString('global-text-value-min-incline'),
        value: `${upperFirst(slopeToSteepnessClass(min_slope))}, ${min_slope}°`,
      });
    }
    if (data.trail.allowsBikes !== null) {
      information.push({
        label: getString('trail-detail-allows-bikes'),
        value: data.trail.allowsBikes,
      });
    }
    if (data.trail.allowsHorses !== null) {
      information.push({
        label: getString('trail-detail-allows-horses'),
        value: data.trail.allowsHorses,
      });
    }
    if (data.trail.waterCrossing !== null) {
      information.push({
        label: getString('trail-detail-water-crossing'),
        value: upperFirst(data.trail.waterCrossing),
      });
    }
    if (data.trail.skiTrail !== null) {
      information.push({
        label: getString('trail-detail-ski-trail'),
        value: data.trail.skiTrail,
      });
    }
    return (
      <CollapsedScrollContainer hideScrollbars={false} $noScroll={true}>
        <ClassificationBlock type={data.trail.type} />
        <DetailBlock title={getString('global-text-information')} data={information} />
      </CollapsedScrollContainer>
    );
  } else {
    return null;
  }

};

export default TrailDetails;
