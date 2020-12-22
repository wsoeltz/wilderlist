import { Types } from 'mongoose';
import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import ListOfLists from '../list';
import PeakListDetail from './PeakListDetail';

const PeakListDetailPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id, friendId, peakListId }: any = useParams();

  const peakListUser = Types.ObjectId.isValid(friendId) ? friendId : userId;

  const listId = Types.ObjectId.isValid(peakListId) ? peakListId : id;

  if (listId === 'search') {
    return <ListOfLists />;
  } else {
    return <PeakListDetail userId={peakListUser} id={listId} setOwnMetaData={true} />;
  }

};

export default PeakListDetailPage;
