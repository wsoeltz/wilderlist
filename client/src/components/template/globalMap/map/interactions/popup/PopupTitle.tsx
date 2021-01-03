import React from 'react';

interface TitleProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

const PopupTitle = ({title, subtitle, onClick}: TitleProps) => (
  <div className={'popup-title'}>
    <div>
    </div>
    <div>
      <button
        onClick={onClick}
      >
        {title}
      </button>
      <small>
        {subtitle}
      </small>
    </div>
  </div>
);

export default PopupTitle;
