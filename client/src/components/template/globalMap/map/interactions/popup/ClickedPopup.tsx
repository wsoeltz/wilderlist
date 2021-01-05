import { GetString } from 'fluent-react/compat';
import React from 'react';
import {
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../../../../routing/Utils';
import {Coordinate} from '../../../../../../types/graphQLTypes';
import {ItemType} from '../../interactions';
import DrivingDirections from './DrivingDirections';
import LastTrip from './LastTrip';
import PopupTitle from './PopupTitle';

interface Props {
  title: string;
  subtitle: string;
  location: Coordinate;
  ids: string[];
  push: (url: string) => void;
  itemType: ItemType;
  getString: GetString;
}

const ClickedPopup = (props: Props) => {
  const {
    title, subtitle, ids, push, itemType, location, getString,
  } = props;
  const onClick = () => {
    if (itemType === ItemType.mountain) {
      push(mountainDetailLink(ids[0]));
    } else if (itemType === ItemType.campsite) {
      push(campsiteDetailLink(ids[0]));
    } else if (itemType === ItemType.trail) {
      push(trailDetailLink(ids[0]));
    }
  };
  return (
    <>
      <PopupTitle
        title={title}
        subtitle={subtitle}
        onClick={onClick}
      />
      <div className={'popup-main-content'}>
        <DrivingDirections
          getString={getString}
          destination={location}
        />
        <LastTrip
          id={ids[0]}
          itemType={itemType}
          getString={getString}
        />
      </div>
    </>
  );
};

export default ClickedPopup;
