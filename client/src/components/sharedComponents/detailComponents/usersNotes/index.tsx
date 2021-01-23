import React from 'react';
import {CoreItem} from '../../../../types/itemTypes';
import {BasicRootRight} from '../styleUtils';
import CampsiteNote from './CampsiteNote';
import MountainNote from './MountainNote';
import TrailNote from './TrailNote';

interface Props {
  id: string;
  name: string;
  type: CoreItem;
}

const UsersNotes = (props: Props) => {
  const {id, name, type} = props;

  let output: React.ReactElement<any> | null;
  if (type === CoreItem.mountain) {
    output = <MountainNote key={id} id={id} name={name} />;
  } else if (type === CoreItem.trail) {
    output = <TrailNote key={id} id={id} name={name} />;
  } else if (type === CoreItem.campsite) {
    output = <CampsiteNote key={id} id={id} name={name} />;
  } else {
    output = null;
  }

  return (
    <BasicRootRight>
      {output}
    </BasicRootRight>
  );
};

export default UsersNotes;
