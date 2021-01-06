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
  id: string;
  push: (url: string) => void;
  itemType: ItemType;
  getString: GetString;
}

const ClickedPopup = (props: Props) => {
  const {
    title, subtitle, push, id, itemType, location, getString,
  } = props;
  const onClick = () => {
    if (itemType === ItemType.mountain) {
      push(mountainDetailLink(id));
    } else if (itemType === ItemType.campsite) {
      push(campsiteDetailLink(id));
    } else if (itemType === ItemType.trail) {
      push(trailDetailLink(id));
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
          id={id}
          itemType={itemType}
          getString={getString}
        />
      </div>
    </>
  );
};

export default ClickedPopup;
