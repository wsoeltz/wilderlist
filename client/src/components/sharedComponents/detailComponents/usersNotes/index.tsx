import React from 'react';
import {AggregateItem, CoreItem} from '../../../../types/itemTypes';
import {BasicRoot, BasicRootRight} from '../styleUtils';
import CampsiteNote from './CampsiteNote';
import MountainNote from './MountainNote';
import PeakListNote from './PeakListNote';
import TrailNote from './TrailNote';

interface Props {
  id: string;
  name: string;
  type: CoreItem | AggregateItem;
  isAlone?: boolean;
}

const UsersNotes = (props: Props) => {
  const {id, name, type, isAlone} = props;

  let output: React.ReactElement<any> | null;
  if (type === CoreItem.mountain) {
    output = <MountainNote key={id} id={id} name={name} />;
  } else if (type === CoreItem.trail) {
    output = <TrailNote key={id} id={id} name={name} />;
  } else if (type === CoreItem.campsite) {
    output = <CampsiteNote key={id} id={id} name={name} />;
  } else if (type === AggregateItem.list) {
    output = <PeakListNote key={id} id={id} name={name} />;
  } else {
    output = null;
  }
  const Root = isAlone ? BasicRoot : BasicRootRight;
  return (
    <Root>
      {output}
    </Root>
  );
};

export default UsersNotes;
