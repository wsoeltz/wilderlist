import React from 'react';
import {CoreItem} from '../../../../types/itemTypes';
import {BasicRoot} from '../styleUtils';
import TripReports from './TripReports';

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
