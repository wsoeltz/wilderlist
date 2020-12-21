import { Types } from 'mongoose';
import React from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import PeakListDetail from './PeakListDetail';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {useParams} from 'react-router-dom';

const PeakListDetailPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id, friendId, peakListId }: any = useParams();

  const peakListUser = Types.ObjectId.isValid(friendId) ? friendId : userId;
  const listId = Types.ObjectId.isValid(peakListId) ? peakListId : id;

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          <PeakListDetail userId={peakListUser} id={listId} setOwnMetaData={true} />
        </ContentBody>
      </ContentLeftLarge>
    </>
  );
};

export default PeakListDetailPage;
