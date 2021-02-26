import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';
import orderBy from 'lodash/orderBy';
import React from 'react';
import styled from 'styled-components/macro';
import {OriginLocation} from '../../../../../../hooks/directions/useDirectionsOrigin';
import useDirectionsToParking from '../../../../../../hooks/servicesHooks/directions/useDirectionsToParking';
import useFluent from '../../../../../../hooks/useFluent';
import {
  BasicIconAtEndOfText,
  lightBaseColor,
  LinkButton,
} from '../../../../../../styling/styleUtils';
import {Coordinate} from '../../../../../../types/graphQLTypes';
import SimpleTextLoading from '../../../../../sharedComponents/SimpleTextLoading';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  line-height: 1;
`;

const Time = styled.div`
  grid-column: 1;
  grid-row: 1;
`;

const From = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
  font-size: 0.85em;
  font-style: italic;
  color: ${lightBaseColor};
`;

const GoogleMapsLink = styled.div`
  grid-column: 2;
  grid-row: 1;
  font-size: 0.85em;
  text-align: right;
  display: flex;
  align-items: flex-end;
`;

interface Props {
  origin: OriginLocation;
  destination: Coordinate;
  considerDirect: boolean | undefined;
  changeOrigin: () => void;
}

const DirectionsText = (props: Props) => {
  const {destination, origin, considerDirect, changeOrigin} = props;
  const {loading, error, data} = useDirectionsToParking({
    start: origin.coordinates,
    end: destination,
    considerDirect,
    totalResults: 1,
  });
  const getString = useFluent();

  if (loading) {
    return <SimpleTextLoading />;
  } else if (error) {
    console.error(error);
    return (
      <div>{getString('directions-nothing-found')}</div>
    );
  } else if (data !== undefined) {
    const sortedDirections = orderBy(data, ['hours', 'minutes']);
    if (!sortedDirections.length) {
      return (
        <div>{getString('directions-nothing-found')}</div>
      );
    } else {
      const minTime = getString('directions-driving-duration', {
        hours: sortedDirections[0].hours,
        minutes: sortedDirections[0].minutes,
      });
      const maxTime = getString('directions-driving-duration', {
        hours: sortedDirections[sortedDirections.length - 1].hours,
        minutes: sortedDirections[sortedDirections.length - 1].minutes,
      });
      const timeRange = minTime === maxTime ? minTime : minTime + ' - ' + maxTime;
      const googleUrl = 'https://www.google.com/maps' +
        `?saddr=${origin.coordinates[1]},${origin.coordinates[0]}` +
        `&daddr=${sortedDirections[0].originLat},${sortedDirections[0].originLng}`;
      return (
        <Root>
          <Time>
            {timeRange}
          </Time>
          <From>
            {getString('global-text-value-from')} {origin.name}&nbsp;&nbsp;&nbsp;
            <LinkButton onClick={changeOrigin}>
              {getString('global-text-value-change')}
            </LinkButton>
          </From>
          <GoogleMapsLink>
            <a rel='noreferrer' href={googleUrl} target={'_blank'}>
              {getString('directions-google-maps')}
              <BasicIconAtEndOfText icon={faExternalLinkAlt} />
            </a>
          </GoogleMapsLink>
        </Root>
      );
    }
  } else {
    return (
      <div>{getString('directions-nothing-found')}</div>
    );
  }

};

export default DirectionsText;
