import { ApolloError } from 'apollo-boost';
import React, {useState} from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import { Mountain } from '../../../types/graphQLTypes';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { SuccessResponse } from '../AdminMountains';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteMountain: (id: string) => void;
  editMountain: (id: string) => void;
}

const ListMountains = (props: Props) => {
  const {loading, error, data, deleteMountain, editMountain} = props;

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
      const { state } = mountain;
      return (
        <li key={mountain.id}>
          <strong><LinkButton
            onClick={() => editMountain(mountain.id)}
          >{mountain.name}</LinkButton></strong>
          <button
            onClick={() => setMountainToDelete(mountain)}
          >
            Delete
          </button>
          <div>
            <small>
              Elevation: {mountain.elevation},
              Latitude: {mountain.latitude},
              Longitude: {mountain.longitude},
              Prominence: {mountain.prominence},
              State: {state !== null ? state.name : 'N/A'},
            </small>
          </div>
        </li>
      );
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
