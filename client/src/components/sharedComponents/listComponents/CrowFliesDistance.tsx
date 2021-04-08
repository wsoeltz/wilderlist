const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import {faCrow, faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {OriginLocation} from '../../../hooks/directions/useDirectionsOrigin';
import useFluent from '../../../hooks/useFluent';
import {
  BasicIconAtEndOfTextCompact,
  BasicIconInText,
  HelpUnderline,
  LinkButton,
  Subtext,
} from '../../../styling/styleUtils';
import {Coordinate} from '../../../types/graphQLTypes';
import Tooltip from '../Tooltip';

const Root = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  location: Coordinate;
  mapCenter: Coordinate;
  usersLocation: undefined | null | OriginLocation;
  changeUsersLocation: () => void;
}

const CrowFliesDistance = (props: Props) => {
  const {
    mapCenter, usersLocation, location,
    changeUsersLocation,
  } = props;
  const getString = useFluent();
  const start = usersLocation && usersLocation.coordinates
    ? point(usersLocation.coordinates, {name: usersLocation.name})
    : point(mapCenter, {name: 'map center'});
  const end = point(location);
  const crowFliesDistance = parseFloat(distance(start, end, {units: 'miles'}).toFixed(1));
  return (
    <Root>
      <BasicIconInText icon={faCrow} />
      <div>
        <Subtext>
          {getString('crow-flies-distance', {distance: crowFliesDistance, name: start.properties.name})}
          <LinkButton onClick={changeUsersLocation}>
            <BasicIconAtEndOfTextCompact icon={faPencilAlt} />
          </LinkButton>
        </Subtext>
        <div>
          <Tooltip
            explanation={getString('crow-flies-tooltip')}
          >
            <Subtext>
              <HelpUnderline>{getString('crow-flies')}</HelpUnderline>
            </Subtext>
          </Tooltip>
        </div>
      </div>
    </Root>
  );
};

export default CrowFliesDistance;
