import orderBy from 'lodash/orderBy';
import partition from 'lodash/partition';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {Link} from 'react-router-dom';
import useRoutesToPoint from '../../../../hooks/servicesHooks/pathfinding/useRoutesToPoint';
import {
  BlockHeader,
  CenteredHeader,
  Details,
  EmptyBlock,
  HorizontalBlock,
  HorizontalScrollContainer,
  InlineColumns,
  SimpleTitle,
} from '../../../../styling/sharedContentStyles';
import {
  Subtext,
} from '../../../../styling/styleUtils';
import {Coordinate, TrailType} from '../../../../types/graphQLTypes';
import {slopeToSteepnessClass} from '../../../../utilities/trailUtils';
import LoadingSimple from '../../LoadingSimple';

interface Props {
  coordinate: Coordinate;
}

const RoutesToMe = ({coordinate}: Props) => {
  const {loading, error, data} = useRoutesToPoint({lat: coordinate[1], lng: coordinate[0]});
  if (loading) {
    return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <CenteredHeader>
              <LoadingSimple />
              Finding routes...
            </CenteredHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
    );
  } else if (error !== undefined) {
    return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <BlockHeader>
              There was an error
            </BlockHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
    );
  } else if (data !== undefined) {
    if (data.features.length) {
      const sortedRoutes = orderBy(data.features, ['properties.routeLength']);
      const routes = sortedRoutes.map(({properties}, i) => {
        const {routeLength, elevationGain, elevationLoss, avgSlope, destination, trails} = properties;
        let title: string | React.ReactElement<any>;
        if (trails && trails.length) {
          const uniqueTrails = uniqBy(trails.filter(t => t.name), 'name');
          const [justTrails, justRoads] =
            partition(uniqueTrails, t => t.type && t.type !== TrailType.road && t.type !== TrailType.dirtroad);
          const topTrailsString = justTrails.length
            ? justTrails.slice(0, 2).map(t => t.name).join(', ___')
            : justRoads.slice(0, 2).map(t => t.name).join(', ___');
          if (topTrailsString.length) {
            const nameComponents = topTrailsString.split('___').map((t, ii) => (
              <React.Fragment key={'trail-name' + destination._id + t + ii}>
                {t}
                <wbr />
              </React.Fragment>
            ));
            const remaining = uniqueTrails.length - nameComponents.length;
            if (remaining) {
              const s = remaining > 1 ? 's' : '';
              nameComponents.push((
                <React.Fragment key={'trail-name-others' + destination._id + remaining}>
                  <wbr />&nbsp;&amp; {remaining} other{s}
                </React.Fragment>
              ));
            }
            title = <>{nameComponents}</>;
          } else {
            title = trails.length + ' trails';
          }
        } else if (destination.name) {
          title = destination.name;
        } else if (destination.type) {
          title = destination.type.split('_').join(' ');
        } else {
          title = trails.length + ' trails';
        }
        let elevationDetails: React.ReactElement<any> | null;
        if (elevationGain && elevationLoss && avgSlope) {
          elevationDetails = (
            <>
              <InlineColumns>
                <Subtext>
                  <SimpleTitle>Elevation:</SimpleTitle>
                </Subtext>
                <Subtext>
                  <strong>↑</strong> {Math.round(elevationGain) + 'ft'}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <strong>↓</strong> {Math.round(elevationLoss) + 'ft'}
                </Subtext>
              </InlineColumns>

              <InlineColumns>
                <Subtext>
                  <SimpleTitle>Incline:</SimpleTitle>
                </Subtext>
                <Subtext>
                  {upperFirst(slopeToSteepnessClass(avgSlope))},
                  &nbsp;&nbsp;
                  {parseFloat(avgSlope.toFixed(1))}°
                </Subtext>
              </InlineColumns>
            </>
          );
        } else {
          elevationDetails = null;
        }
        return (
          <HorizontalBlock key={'route-to-summit-' + i + destination._id}>
            <BlockHeader>
              <Link to={'#'}><em>via</em> {title}</Link>
            </BlockHeader>
            <Details>
              <InlineColumns>
                <Subtext>
                  <SimpleTitle>Length:</SimpleTitle>
                </Subtext>
                <Subtext>
                  <strong>{parseFloat(routeLength.toFixed(1))}</strong> miles to summit
                </Subtext>
              </InlineColumns>
              {elevationDetails}
            </Details>
          </HorizontalBlock>
        );
      });
      return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={routes.length < 3}>
          {routes}
        </HorizontalScrollContainer>
      );
    } else {
      return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <BlockHeader>
              No routes to summit found
            </BlockHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
      );
    }
  } else {
    return null;
  }

};

export default RoutesToMe;
