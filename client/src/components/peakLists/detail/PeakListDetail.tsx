import React from 'react';
import DescriptionAndNotes from './DescriptionAndNotes';
import Header from './Header';

interface Props {
  userId: string | null;
  id: string;
  setOwnMetaData?: boolean;
}

const PeakListDetail = (props: Props) => {
  const { id, setOwnMetaData } = props;

  return (
    <>
      <Header
        peakListId={id}
        setOwnMetaData={setOwnMetaData}
      />
      <DescriptionAndNotes
        peakListId={id}
      />
    </>
  );

};

export default PeakListDetail;
