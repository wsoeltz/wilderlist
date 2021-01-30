import React from 'react';
import {CoreItem} from '../../../../../types/itemTypes';
import StarCampsiteButton from './StarCampsiteButton';
import StarMountainButton from './StarMountainButton';
import StarTrailButton from './StarTrailButton';

const StarButtonWrapper = ({type, id, name}: {type: CoreItem, id: string, name: string}) => {
  if (type === CoreItem.mountain) {
    return (
      <StarMountainButton
        id={id}
        name={name}
      />
    );
  } else if (type === CoreItem.trail) {
    return (
      <StarTrailButton
        id={id}
        name={name}
      />
    );
  } else if (type === CoreItem.campsite) {
    return (
      <StarCampsiteButton
        id={id}
        name={name}
      />
    );
  } else {
    return null;
  }
};

export default StarButtonWrapper;
