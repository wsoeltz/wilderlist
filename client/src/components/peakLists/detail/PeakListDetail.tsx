import React from 'react';
import DescriptionAndNotes from './DescriptionAndNotes';
import Header from './Header';
import ItemsTables from './ItemsTables';

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
      <ItemsTables
        peakListId={id}
      />
    </>
  );

};

export default PeakListDetail;
