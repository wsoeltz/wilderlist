import React from 'react';
import Content from './Content';
import Header from './Header';

interface Props {
  id: string;
}

const CampsiteDetail = (props: Props) => {
  const { id } = props;

  return (
    <>
      <Header id={id} />
      <Content id={id} />
    </>
  );
};

export default CampsiteDetail;
