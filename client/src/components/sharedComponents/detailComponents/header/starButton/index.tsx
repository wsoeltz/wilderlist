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
    return null;
  } else if (type === CoreItem.campsite) {
    return null;
  } else {
    return null;
  }
};

export default StarButtonWrapper;
