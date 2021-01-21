import React from 'react';
import {CoreItem} from '../../../../types/itemTypes';
import {BasicRootRight} from '../styleUtils';
import MountainNote from './MountainNote';

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
