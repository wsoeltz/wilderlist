import orderBy from 'lodash/orderBy';
import partition from 'lodash/partition';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import useRoutesToPoint from '../../../../hooks/servicesHooks/pathfinding/useRoutesToPoint';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
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
import {TrailType} from '../../../../types/graphQLTypes';
import {CoreItem, MapItem} from '../../../../types/itemTypes';
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
  const mapContext = useMapContext();

  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearExternalHoveredPopup();
    }
  };
  useEffect(() => {
    return () => {
      if (mapContext.intialized) {
        mapContext.clearExternalHoveredPopup();
      }
    };
  }, [mapContext]);

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
            {getString('global-text-value-no-routes-to', {type: item})}
          </CenteredHeader>
        </EmptyBlock>
      </HorizontalScrollContainer>
    );
  } else if (data !== undefined) {
    if (data.features.length) {
      const sortedRoutes = orderBy(data.features, ['properties.routeLength']);
      const routes = sortedRoutes.map(({properties, geometry}, i) => {
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

        const numericDistance = routeLength < 0.1
          ? Math.round(routeLength * 5280)
          : parseFloat(routeLength.toFixed(1));
        const distanceUnit = routeLength < 0.1
          ? getString('global-text-value-feet-to', {feet: numericDistance, type: item})
          : getString('global-text-value-miles-to', {miles: numericDistance, type: item});

        const subtitle = `${numericDistance} ${distanceUnit}`;

        const onMouseEnter = () => {
          if (mapContext.intialized) {
           let title: string;
           let iconType: CoreItem | MapItem;
           if (!destination || destination === 'parking') {
              if (trails && trails.length) {
                const uniqueTrails = uniqBy(trails.filter(t => t.name), 'name');
                const [justTrails, justRoads] =
                  partition(uniqueTrails, t => t.type && t.type !== TrailType.road && t.type !== TrailType.dirtroad);
                const topTrailsString = justTrails.length
                  ? justTrails.slice(0, 2).map(t => t.name).join(', ___')
                  : justRoads.slice(0, 2).map(t => t.name).join(', ___');
                if (topTrailsString.length) {
                  const nameComponents = topTrailsString.split('___').map((t) => t);
                  const remaining = uniqueTrails.length - nameComponents.length;
                  if (remaining) {
                    nameComponents.push(` & ${remaining} ${getString('global-text-value-others', {count: remaining})}`);
                  }
                  title = nameComponents.join('');
                } else {
                  title = trails.length + ' trails';
                }
              } else if (properties.destination.name) {
                title = properties.destination.name;
              } else if (properties.destination.type) {
                title = properties.destination.type.split('_').join(' ');
              } else {
                title = trails.length + ' trails';
              }
              title = `via ${title}`;
              iconType = MapItem.route;
            } else {
              const formattedType =
                upperFirst(getString('global-formatted-anything-type', {type: properties.destination.type}));
              iconType = item === CoreItem.trail && destination === 'mountains' ? CoreItem.mountain : item;
              if (properties.destination.name) {
                title = properties.destination.name;
              } else {
                title = formattedType;
              }
            }

           mapContext.setExternalHoveredPopup(
              title,
              iconType,
              subtitle,
              properties.destination.location,
              geometry.coordinates,
            );
          }
        };

        return (
          <HorizontalBlock key={'route-to-summit-' + i + properties.destination._id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
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
                  <strong>{numericDistance}</strong> {distanceUnit}
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
