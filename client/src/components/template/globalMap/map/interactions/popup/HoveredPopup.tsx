import noop from 'lodash/noop';
import React from 'react';
import PopupTitle from './PopupTitle';

interface Props {
  title: string;
  subtitle: string;
}

const HoveredPopup = ({title, subtitle}: Props) => {
  return (
    <>
      <PopupTitle
        title={title}
        subtitle={subtitle}
        onClick={noop}
      />
    </>
  );
};

export default HoveredPopup;
