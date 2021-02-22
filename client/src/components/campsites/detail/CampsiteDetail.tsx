import React from 'react';
import Header from './Header';

interface Props {
  id: string;
}

const CampsiteDetail = (props: Props) => {
  const { id } = props;

  return (
    <>
      <Header id={id} />
    </>
  );
};

export default CampsiteDetail;
