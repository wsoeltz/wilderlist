import React from 'react';

interface Props {
  id: string;
}

const LastAscent = ({id}: Props) => {
  return (
    <>
      <div>Last Ascent for Mountain {id}</div>
    </>
  );
};

export default LastAscent;
