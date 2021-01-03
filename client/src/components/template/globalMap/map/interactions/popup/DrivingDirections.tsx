import React from 'react';

interface Props {
  id: string;
}

const DrivingDirections = ({id}: Props) => {
  return (
    <>
      <div>Driving Directions for Mountain {id}</div>
    </>
  );
};

export default DrivingDirections;
