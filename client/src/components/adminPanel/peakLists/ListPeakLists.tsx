import { ApolloError } from 'apollo-boost';
import React, {useState} from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { PeakListDatum, SuccessResponse } from '../AdminPeakLists';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deletePeakList: (id: string) => void;
  editPeakList: (id: string) => void;
}

const ListStates = (props: Props) => {
  const {loading, error, data, deletePeakList, editPeakList} = props;

  const [peakListToDelete, setPeakListToDelete] = useState<PeakListDatum | null>(null);

  const closeAreYouSureModal = () => {
    setPeakListToDelete(null);
  };
  const confirmRemove = () => {
    if (peakListToDelete !== null) {
      deletePeakList(peakListToDelete.id);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = peakListToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete peakList ' + peakListToDelete.name + '? This cannot be undone.'}
      confirmText={'Confirm'}
      cancelText={'Cancel'}
    />
  );

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { peakLists } = data;
    const peakListElms = peakLists.map(peakList => {
      const { type, parent } = peakList;
      let parentCopy: React.ReactElement<any> | null;
      if (parent !== null) {
        parentCopy = (
          <div>
            <small>
              Parent list: {parent.name} ({parent.type})
            </small>
          </div>
        );
      } else {
        parentCopy = null;
      }
      return (
        <li key={peakList.id}>
          <strong><LinkButton
            onClick={() => editPeakList(peakList.id)}
          >{peakList.name} ({peakList.shortName})</LinkButton></strong>
          <button
            onClick={() => setPeakListToDelete(peakList)}
          >
            Delete
          </button>
          {parentCopy}
          <div>
            <small>
              {type}
            </small>
          </div>
        </li>
      );
    });
    return(
      <>
        {peakListElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListStates;
