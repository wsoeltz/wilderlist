import {
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import orderBy from 'lodash/orderBy';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useDirectionsToParking from '../../../../hooks/servicesHooks/directions/useDirectionsToParking';
import useFluent from '../../../../hooks/useFluent';
import {
  BlockHeader,
  BlockTitle,
  CenteredHeader,
  Details,
  EmptyBlock,
  HorizontalBlock,
  InlineColumns,
  SimpleTitle,
} from '../../../../styling/sharedContentStyles';
import {
  BasicIconAtEndOfText,
  SmallExternalLink,
  Subtext,
} from '../../../../styling/styleUtils';
import {Coordinate} from '../../../../types/graphQLTypes';
import LoadingSimple from '../../LoadingSimple';

interface Props {
  start: Coordinate;
  end: Coordinate;
  considerDirect?: boolean;
  destinationName?: string;
}

const Destinations = ({start, end, considerDirect, destinationName}: Props) => {
  const {loading, error, data} = useDirectionsToParking({start, end, considerDirect});
  const getString = useFluent();
  if (loading) {
    return (
      <EmptyBlock>
        <CenteredHeader>
          <LoadingSimple />
        </CenteredHeader>
      </EmptyBlock>
    );
  } else if (error !== undefined) {
    console.error(error);
    const googleUrl = 'https://www.google.com/maps/search/?api=1&query=' +
    `${end[1]},${end[0]}`;
    return (
      <EmptyBlock>
        <CenteredHeader>
          {getString('directions-nothing-found')}
        </CenteredHeader>
        <Details>
          <SmallExternalLink href={googleUrl} target={'_blank'}>
            {getString('directions-open-in-google-maps')}
            <small><BasicIconAtEndOfText icon={faExternalLinkAlt} /></small>
          </SmallExternalLink>
        </Details>
      </EmptyBlock>
    );
  } else if (data !== undefined) {
    if (data.length) {
      const sortedDestinations = orderBy(data, ['hours', 'minutes', 'miles']);
      const routes = sortedDestinations.map((destination, i) => {
        const {hours, minutes, originLat, originLng, originName, originType} = destination;
        const miles = destination.miles < 10
          ? parseFloat(destination.miles.toFixed(2)) : Math.round(destination.miles);
        const googleUrl = 'https://www.google.com/maps' +
            `?saddr=${start[1]},${start[0]}` +
            `&daddr=${originLat},${originLng}`;
        const linkToRoute = (
        // const linkToRoute = !destination || destination === 'parking' ? null : (
          <Details>
            <SmallExternalLink href={googleUrl} target={'_blank'}>
              {getString('directions-open-in-google-maps')}
              <small><BasicIconAtEndOfText icon={faExternalLinkAlt} /></small>
            </SmallExternalLink>
          </Details>
        );
        const formattedType = getString('global-formatted-anything-type', {type: originType});
        let name = originName ? originName : upperFirst(formattedType);
        const subtitle = name === 'SOURCE' ? '' : getString('global-text-nearby') + ' ' + formattedType;
        if (name === 'SOURCE') {
          name = destinationName ? destinationName : 'Destination';
        }
        return (
          <HorizontalBlock
            key={
              'driving-to-parking-' + i + hours + minutes + miles + originName + originType + originLat + originLng
            }
          >
            <BlockHeader>
              <BlockTitle>{getString('global-text-value-to')}</BlockTitle>
              {name}
              <div>
                <small>{subtitle}</small>
              </div>
            </BlockHeader>
            <Details>
              <InlineColumns>
                <Subtext>
                  <SimpleTitle>{getString('global-text-value-duration')}:</SimpleTitle>
                </Subtext>
                <Subtext>
                  {getString('directions-driving-duration', {hours, minutes})}
                </Subtext>
              </InlineColumns>

              <InlineColumns>
                <Subtext>
                  <SimpleTitle>{getString('global-text-value-distance')}:</SimpleTitle>
                </Subtext>
                <Subtext>
                  {getString('directions-driving-distance', {miles})}
                </Subtext>
              </InlineColumns>
            </Details>
            {linkToRoute}
          </HorizontalBlock>
        );
      });
      return (
        <>
          {routes}
        </>
      );
    } else {
      const googleUrl = 'https://www.google.com/maps/search/?api=1&query=' +
      `${end[1]},${end[0]}`;
      return (
        <EmptyBlock>
          <CenteredHeader>
            {getString('directions-nothing-found')}
          </CenteredHeader>
          <Details>
          <SmallExternalLink href={googleUrl} target={'_blank'}>
            {getString('directions-open-in-google-maps')}
            <small><BasicIconAtEndOfText icon={faExternalLinkAlt} /></small>
          </SmallExternalLink>
        </Details>
        </EmptyBlock>
      );
    }
  } else {
    return null;
  }
};

export default Destinations;
