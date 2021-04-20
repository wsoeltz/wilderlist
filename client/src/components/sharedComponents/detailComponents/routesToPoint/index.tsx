import orderBy from 'lodash/orderBy';
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import useRoutesToPoint from '../../../../hooks/servicesHooks/pathfinding/useRoutesToPoint';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {RoutesToPointInput} from '../../../../routing/services';
import {autoRouteDetailLink} from '../../../../routing/Utils';
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
import getTitle from './getTitle';
import Title from './Title';

interface Props {
  id: string;
  coordinate: Coordinate;
  sourceType: CoreItem;
  item: CoreItem;
  altCoordinate?: Coordinate;
  destination?: RoutesToPointInput['destination'];
}

const RoutesToPoint = (props: Props) => {
  const {
    coordinate, altCoordinate, destination, item,
    id, sourceType,
  } = props;
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
  let url: string = '#';
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
      const routes = sortedRoutes.map((feature, i) => {
        const {properties, geometry} = feature;
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
          const {title, iconType} = getTitle({destination, item, feature, getString});
          mapContext.setExternalHoveredPopup(
              title,
              iconType,
              subtitle,
              properties.destination.location,
              geometry.coordinates,
            );
          }
        };

        let viewRouteText = getString('global-text-value-view-route');
        if (!destination || destination === 'parking') {
          url = autoRouteDetailLink.parkingToMountain(id, properties.destination._id);
          viewRouteText = getString('global-text-value-view-route-to-summit');
        } else if (destination === 'campsites') {
          if (sourceType === CoreItem.mountain) {
            url = autoRouteDetailLink.mountainToCampsite(id, properties.destination._id);
            viewRouteText = getString('global-text-value-view-route-to-campsite');
          } else if (sourceType === CoreItem.campsite) {
            url = autoRouteDetailLink.campsiteToCampsite(id, properties.destination._id);
            viewRouteText = getString('global-text-value-view-route-to-campsite');
          } else if (sourceType === CoreItem.trail) {
            url = autoRouteDetailLink.trailToCampsite(id, properties.destination._id);
            viewRouteText = getString('global-text-value-view-route-to-campsite');
          }
        } else if (destination === 'mountains') {
          url = autoRouteDetailLink.trailToMountain(id, properties.destination._id);
          viewRouteText = getString('global-text-value-view-route-to-summit');
        }

        return (
          <HorizontalBlock key={'route-to-summit-' + i + properties.destination._id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <BlockHeader>
              <Title
                id={id}
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
              <SmallLink to={url}>
                {viewRouteText}
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
