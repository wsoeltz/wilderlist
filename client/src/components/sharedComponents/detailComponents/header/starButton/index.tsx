import React from 'react';
import {CoreItem} from '../../../../../types/itemTypes';
import StarMountainButton from './StarMountainButton';

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
      <StarMountainButton
        id={id}
        name={name}
      />
    );
  } else if (type === CoreItem.campsite) {
    return (
      <StarMountainButton
        id={id}
        name={name}
      />
    );
  } else {
    return null;
  }
};

export default StarButtonWrapper;
