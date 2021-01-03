import React from 'react';
import {mountainDetailLink} from '../../../../../../routing/Utils';
import DrivingDirections from './DrivingDirections';
import LastAscent from './LastAscent';
import PopupTitle from './PopupTitle';

interface Props {
  title: string;
  subtitle: string;
  id: string;
  push: (url: string) => void;
}

const ClickedPopup = ({title, subtitle, id, push}: Props) => {
  const onClick = () => push(mountainDetailLink(id));
  return (
    <>
      <PopupTitle
        title={title}
        subtitle={subtitle}
        onClick={onClick}
      />
      <div className={'popup-main-content'}>
        <DrivingDirections id={id} />
        <LastAscent id={id} />
      </div>
    </>
  );
};

export default ClickedPopup;
