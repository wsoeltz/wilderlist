import { Types } from 'mongoose';
import React from 'react';
import {useParams} from 'react-router-dom';
import ListOfLists from '../list';
import PeakListDetail from './PeakListDetail';

const PeakListDetailPage = () => {
  const { id, peakListId }: any = useParams();

  const listId = Types.ObjectId.isValid(peakListId) ? peakListId : id;

  if (listId === 'search') {
    return <ListOfLists />;
  } else {
    return <PeakListDetail id={listId} />;
  }

};

export default PeakListDetailPage;
