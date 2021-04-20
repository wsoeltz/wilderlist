import React from 'react';
import {CoreItem} from '../../../../../types/itemTypes';
import StarCampsiteButton from './StarCampsiteButton';
import StarMountainButton from './StarMountainButton';
import StarTrailButton from './StarTrailButton';

interface Props {
  type: CoreItem;
  id: string;
  name: string;
  compact?: boolean;
}

const StarButtonWrapper = ({type, id, name, compact}: Props) => {
  if (type === CoreItem.mountain) {
    return (
      <StarMountainButton
        id={id}
        name={name}
        compact={compact}
      />
    );
  } else if (type === CoreItem.trail) {
    return (
      <StarTrailButton
        id={id}
        name={name}
        compact={compact}
      />
    );
  } else if (type === CoreItem.campsite) {
    return (
      <StarCampsiteButton
        id={id}
        name={name}
        compact={compact}
      />
    );
  } else {
    return null;
  }
};

export default StarButtonWrapper;
