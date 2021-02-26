import React from 'react';
import AllItems from './AllItems';
import DescriptionAndNotes from './DescriptionAndNotes';
import Header from './Header';

interface Props {
  id: string;
}

const PeakListDetail = (props: Props) => {
  const { id } = props;

  return (
    <>
      <Header
        peakListId={id}
      />
      <DescriptionAndNotes
        peakListId={id}
      />
      <AllItems
        peakListId={id}
      />
    </>
  );

};

export default PeakListDetail;
