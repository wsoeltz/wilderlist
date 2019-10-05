import { ApolloError } from 'apollo-boost';
import React, {useState} from 'react';
import { Mountain } from '../../../types/graphQLTypes';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { SuccessResponse } from '../AdminMountains';
import { ListItem } from '../sharedStyles';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteMountain: (id: string) => void;
  editMountain: (id: string) => void;
  searchQuery: string;
}

const ListMountains = (props: Props) => {
  const {loading, error, data, deleteMountain, editMountain, searchQuery} = props;

  const [mountainToDelete, setMountainToDelete] = useState<Mountain | null>(null);

  const closeAreYouSureModal = () => {
    setMountainToDelete(null);
  };
  const confirmRemove = () => {
    if (mountainToDelete !== null) {
      deleteMountain(mountainToDelete.id);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = mountainToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete mountain ' + mountainToDelete.name + '? This cannot be undone.'}
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
    const { mountains } = data;
    const mountainElms = mountains.map(mountain => {
      if (mountain.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        const { state } = mountain;
        const content = (
          <small>
            Elevation: <strong>{mountain.elevation}</strong>,
            Latitude: <strong>{mountain.latitude}</strong>,
            Longitude: <strong>{mountain.longitude}</strong>,
            Prominence: <strong>{mountain.prominence}</strong>,
            State: <strong>{state !== null ? state.name : 'N/A'}</strong>
          </small>
        );
        return (
          <ListItem
            key={mountain.id}
            title={mountain.name + ' - ' + (state !== null ? state.abbreviation : 'N/A')}
            content={content}
            onEdit={() => editMountain(mountain.id)}
            onDelete={() => setMountainToDelete(mountain)}
          />
        );
      } else {
        return null;
      }
    });
    return(
      <>
        {mountainElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListMountains;
