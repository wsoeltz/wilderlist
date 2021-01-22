import React from 'react';
import {BasicRoot} from '../styleUtils';
import TripReports from './TripReports';
import {CoreItem} from '../../../../types/itemTypes';

interface Props {
  id: string;
  name: string;
  type: CoreItem;
}

const LatestWilderlistReports = (props: Props) => {
  const {id, name, type} = props;
  return (
    <BasicRoot>
      <TripReports
        id={id}
        name={name}
        type={type}
      />
    </BasicRoot>
  );
};

export default LatestWilderlistReports;
