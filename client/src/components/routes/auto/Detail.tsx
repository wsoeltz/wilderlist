const getBbox = require('@turf/bbox').default;
const getLength = require('@turf/length').default;
const {lineString} = require('@turf/helpers');
import {
  faChartLine,
  faHiking,
  faShoePrints,
} from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useRouteDetail, {Input} from '../../../hooks/servicesHooks/pathfinding/useRouteDetail';
import useFluent from '../../../hooks/useFluent';
import {Routes} from '../../../routing/routes';
import {
  Column,
  ItemTitle,
  LoadableText,
  TopLevelColumns,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  SmallSemiBold,
} from '../../../styling/styleUtils';
import {Coordinate, TrailType} from '../../../types/graphQLTypes';
import {AutoItem, CoreItem} from '../../../types/itemTypes';
import {slopeToSteepnessClass} from '../../../utilities/trailUtils';
import PageNotFound from '../../sharedComponents/404';
import SimpleHeader from '../../sharedComponents/detailComponents/header/SimpleHeader';
import getTitle from '../../sharedComponents/detailComponents/routesToPoint/getTitle';
import LoadingSimple, {LoadingContainer} from '../../sharedComponents/LoadingSimple';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import MoreInformation from './moreInformationPanel';
import SegmentBreakdown from './segmentBreakdown';

interface Props extends Input {
  sourceDatum: {
    id: string;
    name: string;
    elevation?: number;
    location: Coordinate;
    itemType: CoreItem;
  };
  sourceRoute: Routes;
}

const Detail = ({sourceDatum, sourceRoute, ...input}: Props) => {
  const {loading, error, data} = useRouteDetail(input);
  const getString = useFluent();

  let title: string = '----';
  let subtitle: string = '----';
  let routeLengthText: string = '----';
  let inclineEl: React.ReactElement<any> = <>----</>;
  let details: React.ReactElement<any> | null;
  if (loading) {
    title = '----';
    subtitle = '----';
    details = <LoadingContainer style={{height: '3rem'}}><LoadingSimple /></LoadingContainer>;
  } else if (error) {
    return <PageNotFound />;
  } else if (data && data.features[0]) {
    const feature = data.features[0];
    const {
      destination, routeLength, avgSlope, trailSegments,
    } = feature.properties;
    const generated = getTitle({
      item: sourceDatum.itemType, // this does not matter
      feature,
      getString,
    });
    subtitle = generated.title;
    let destinationName: string;
    const formattedType =
      upperFirst(getString('global-formatted-anything-type', {type: destination.type}));
    if (destination.name) {
      destinationName = destination.name;
    } else {
      destinationName = formattedType;
    }
    if (sourceRoute === Routes.AutoRouteDetailParkingToMountain) {
      title = getString('detail-route-title', {destination: sourceDatum.name, source: destinationName});
    } else {
      title = getString('detail-route-title', {destination: destinationName, source: sourceDatum.name});
    }
    routeLengthText = routeLength < 0.1
      ? getString('distance-feet-formatted', {feet: Math.round(routeLength * 5280)}) // miles to feet conversion
      : getString('directions-driving-distance', {miles: parseFloat(routeLength.toFixed(1))});

    inclineEl = avgSlope !== undefined && avgSlope !== null ? (
      <SmallSemiBold>
        {upperFirst(slopeToSteepnessClass(avgSlope))},
        &nbsp;&nbsp;
        {parseFloat(avgSlope.toFixed(1))}°
      </SmallSemiBold>
    ) : <>----</>;
    const bbox = getBbox(feature);
    const trailsForMap = trailSegments.map(t => {
      const trailName = t.properties.name ? t.properties.name :
        upperFirst(getString('global-formatted-anything-type', {type: t.properties.type}));
      const simplifiedLine = t.geometry.coordinates.map(([lng, lat]) => [lng, lat]) as Coordinate[];
      const trailLength = getLength(lineString(simplifiedLine), {units: 'miles'});
      const trailLengthText = trailLength < 0.1
        ? ''
        : parseFloat(trailLength.toFixed(1)).toString();
      return {
        name: trailName,
        type: t.properties.type ? t.properties.type as TrailType : TrailType.path,
        id: t.properties.id,
        line: simplifiedLine,
        trailLengthText,
      };
    });
    details = (
      <>
        <MoreInformation
          id={sourceDatum.id}
          title={title}
          feature={feature}
        />
        <SegmentBreakdown
          sourceDatum={sourceDatum}
          sourceRoute={sourceRoute}
          segements={feature.properties.trailSegments}
          destination={destination}
        />
        <MapRenderProp
          id={sourceDatum.id + destination._id}
          trails={trailsForMap}
          bbox={bbox}
          showTrailMileage={true}
        />
      </>
    );

  } else {
    return <PageNotFound />;
  }
  return (
    <>
      <SimpleHeader
        id={sourceDatum.id}
        loading={loading}
        title={title}
        subtitle={subtitle}
        customIcon={false}
        icon={faHiking}
        authorId={null}
        type={AutoItem.route}
      />
      <TopLevelColumns>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faShoePrints} />
            {getString('global-text-value-length')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              {routeLengthText}
            </SmallSemiBold>
          </LoadableText>
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faChartLine} />
            {getString('global-text-value-average-incline')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            {inclineEl}
          </LoadableText>
        </Column>
      </TopLevelColumns>
      {details}
    </>
  );
};

export default Detail;
