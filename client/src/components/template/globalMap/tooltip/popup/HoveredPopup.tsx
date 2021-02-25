import noop from 'lodash/noop';
import React from 'react';
import MountainIcon from '../../../../../../assets/images/icons/mountain-highlighted.svg';
import TentIcon from '../../../../../../assets/images/icons/tent-highlighted.svg';
import TrailIcon from '../../../../../../assets/images/icons/trail-highlighted.svg';
import {CoreItems} from '../../../../../types/itemTypes';
import PopupTitle from './PopupTitle';

interface Props {
  title: string;
  subtitle: string;
  itemType: CoreItems;
}

const HoveredPopup = ({title, subtitle, itemType}: Props) => {
  let imgSrc: string;
  if (itemType === CoreItems.mountains) {
    imgSrc = MountainIcon;
  } else if (itemType === CoreItems.trails) {
    imgSrc = TrailIcon;
  } else if (itemType === CoreItems.campsites) {
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
