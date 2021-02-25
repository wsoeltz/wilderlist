import {faCar} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import React from 'react';
import {
  LinkButton,
} from '../../../../../styling/styleUtils';
import {Coordinate} from '../../../../../types/graphQLTypes';
import {
  Icon,
  Root,
} from './Utils';

interface Props {
  destination: Coordinate;
  getString: GetString;
}

const DrivingDirections = ({getString}: Props) => {
  return (
    <>
      <Root>
        <Icon icon={faCar} />
        <div>
          <LinkButton>{getString('map-get-directions')}</LinkButton>
        </div>
      </Root>
    </>
  );
};

export default DrivingDirections;
