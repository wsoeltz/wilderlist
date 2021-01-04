import { GetString } from 'fluent-react/compat';
import React from 'react';
import {Coordinate} from '../../../../../../types/graphQLTypes';

interface Props {
  destination: Coordinate;
  getString: GetString;
}

const DrivingDirections = ({getString}: Props) => {
  return (
    <>
      <div>{getString('map-get-directions')}</div>
    </>
  );
};

export default DrivingDirections;
