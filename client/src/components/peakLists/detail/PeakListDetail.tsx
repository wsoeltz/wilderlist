import React from 'react';
import AllItems from './AllItems';
import DescriptionAndNotes from './DescriptionAndNotes';
import Header from './Header';
import { ListPrivacy } from '../../../types/graphQLTypes';
import {useBasicListDetails} from '../../../queries/lists/useBasicListDetails';
import useCurrentUser from '../../../hooks/useCurrentUser';
import PageNotFound from '../../sharedComponents/404';

interface Props {
  id: string;
}

const PeakListDetail = (props: Props) => {
  const { id } = props;
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const {data} = useBasicListDetails(id, userId);

  if (data && data.peakList && data.peakList.privacy === ListPrivacy.Private &&
      (!user || !data.peakList.author || user._id !== data.peakList.author.id)) {
    return <PageNotFound />;
  }

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
