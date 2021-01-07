import noop from 'lodash/noop';
import React from 'react';
import MountainIcon from '../../../../../../assets/images/icons/mountain-highlighted.svg';
import TentIcon from '../../../../../../assets/images/icons/tent-highlighted.svg';
import TrailIcon from '../../../../../../assets/images/icons/trail-highlighted.svg';
import {ItemType} from '../../interactions';
import PopupTitle from './PopupTitle';

interface Props {
  title: string;
  subtitle: string;
  itemType: ItemType;
}

const HoveredPopup = ({title, subtitle, itemType}: Props) => {
  let imgSrc: string;
  if (itemType === ItemType.mountain) {
    imgSrc = MountainIcon;
  } else if (itemType === ItemType.trail) {
    imgSrc = TrailIcon;
  } else if (itemType === ItemType.campsite) {
    imgSrc = TentIcon;
  } else {
    imgSrc = MountainIcon;
  }

  return (
    <>
      <PopupTitle
        title={title}
        subtitle={subtitle}
        onClick={noop}
        imgSrc={imgSrc}
      />
    </>
  );
};

export default HoveredPopup;
