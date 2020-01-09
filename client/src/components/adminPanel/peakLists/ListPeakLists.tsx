import { ApolloError } from 'apollo-boost';
import React, {useState} from 'react';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { PeakListDatum, SuccessResponse } from '../AdminPeakLists';
import { ListItem } from '../sharedStyles';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deletePeakList: (id: string) => void;
  editPeakList: (id: string) => void;
  searchQuery: string;
}

const ListStates = (props: Props) => {
  const {loading, error, data, deletePeakList, editPeakList, searchQuery} = props;

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
      if (peakList.searchString.toLowerCase().includes(searchQuery.toLowerCase())) {
        const { type, parent, states } = peakList;
        let parentCopy: React.ReactElement<any> | null;
        let stateCopy: React.ReactElement<any> | null;
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
        if (states !== null && states.length) {
          const stateElms = states.map(st => st.name + ', ');
          stateCopy = (
            <div>
              <small>
                States: {stateElms}
              </small>
            </div>
          );
        } else {
          stateCopy = null;
        }
        const content = (
          <>
            {parentCopy}
            {stateCopy}
          </>
        );
        return (
          <ListItem
            key={peakList.id}
            title={`${peakList.name} (${peakList.shortName}) - ${type}`}
            content={content}
            onEdit={() => editPeakList(peakList.id)}
            onDelete={() => setPeakListToDelete(peakList)}
          />
        );
      } else {
        return null;
      }
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
