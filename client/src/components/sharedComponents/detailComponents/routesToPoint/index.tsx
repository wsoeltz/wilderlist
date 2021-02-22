import orderBy from 'lodash/orderBy';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useRoutesToPoint from '../../../../hooks/servicesHooks/pathfinding/useRoutesToPoint';
import useFluent from '../../../../hooks/useFluent';
import {RoutesToPointInput} from '../../../../routing/services';
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
  SmallLink,
  Subtext,
} from '../../../../styling/styleUtils';
import {Coordinate} from '../../../../types/graphQLTypes';
import {CoreItem} from '../../../../types/itemTypes';
import {slopeToSteepnessClass} from '../../../../utilities/trailUtils';
import LoadingSimple from '../../LoadingSimple';
import Title from './Title';

interface Props {
  coordinate: Coordinate;
  item: CoreItem;
  altCoordinate?: Coordinate;
  destination?: RoutesToPointInput['destination'];
}

const RoutesToPoint = (props: Props) => {
  const {coordinate, altCoordinate, destination, item} = props;
  const getString = useFluent();
  const {loading, error, data} = useRoutesToPoint({
    lat: coordinate[1],
    lng: coordinate[0],
    altLat: altCoordinate ? altCoordinate[1] : undefined,
    altLng: altCoordinate ? altCoordinate[0] : undefined,
    destination,
  });
  if (loading) {
    let loadingText: string;
    if (destination === 'campsites') {
      loadingText = getString('global-text-value-loading-campsites');
    } else if (destination === 'mountains') {
      loadingText = getString('global-text-value-loading-mountains');
    } else {
      loadingText = getString('global-text-value-loading-routes');
    }
    return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <CenteredHeader>
              <LoadingSimple />
              {loadingText}...
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
  } else if (data !== undefined) {
    if (data.features.length) {
      const sortedRoutes = orderBy(data.features, ['properties.routeLength']);
      const routes = sortedRoutes.map(({properties}, i) => {
        const {routeLength, elevationGain, elevationLoss, avgSlope, trails} = properties;
        let elevationDetails: React.ReactElement<any> | null;
        if (elevationGain !== undefined && elevationGain !== null &&
            elevationLoss !== undefined && elevationLoss !== null &&
            avgSlope !== undefined && avgSlope !== null) {
          elevationDetails = (
            <>
              <InlineColumns>
                <Subtext>
                  <SimpleTitle>{getString('global-text-value-elevation')}:</SimpleTitle>
                </Subtext>
                <Subtext>
                  <strong>↑</strong> {Math.round(elevationGain) + 'ft'}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <strong>↓</strong> {Math.round(elevationLoss) + 'ft'}
                </Subtext>
              </InlineColumns>

              <InlineColumns>
                <Subtext>
                  <SimpleTitle>{getString('global-text-value-incline')}:</SimpleTitle>
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
          <HorizontalBlock key={'route-to-summit-' + i + properties.destination._id}>
            <BlockHeader>
              <Title
                item={item}
                trails={trails}
                destination={properties.destination}
                destinationType={destination}
              />
            </BlockHeader>
            <Details>
              <InlineColumns>
                <Subtext>
                  <SimpleTitle>{getString('global-text-value-length')}:</SimpleTitle>
                </Subtext>
                <Subtext>
                  <strong>{parseFloat(routeLength.toFixed(1))}</strong> {getString('global-text-value-miles-to', {
                    type: item,
                  })}
                </Subtext>
              </InlineColumns>
              {elevationDetails}
            </Details>
            <Details>
              <SmallLink to={'#'}>
                {getString('global-text-value-view-route')}
              </SmallLink>
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
            <CenteredHeader>
              {getString('global-text-value-no-routes-to', {type: item})}
            </CenteredHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
      );
    }
  } else {
    return null;
  }

};

export default RoutesToPoint;
