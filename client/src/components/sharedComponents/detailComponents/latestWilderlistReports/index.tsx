import React from 'react';
import {BasicRoot} from '../styleUtils';
import TripReports from './TripReports';

interface Props {
  id: string;
  name: string;
}

const LatestWilderlistReports = (props: Props) => {
  const {id, name} = props;
  return (
    <BasicRoot>
      <TripReports
        mountainId={id}
        mountainName={name}
      />
    </BasicRoot>
  );
};

export default LatestWilderlistReports;
