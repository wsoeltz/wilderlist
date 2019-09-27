import { ApolloError } from 'apollo-boost';
import React, {useState} from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { RegionDatum, SuccessResponse } from '../AdminRegions';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteRegion: (id: string) => void;
  editRegion: (id: string) => void;
}

const ListRegions = (props: Props) => {
  const {loading, error, data, deleteRegion, editRegion} = props;

  const [regionToDelete, setRegionToDelete] = useState<RegionDatum | null>(null);

  const closeAreYouSureModal = () => {
    setRegionToDelete(null);
  };
  const confirmRemove = () => {
    if (regionToDelete !== null) {
      deleteRegion(regionToDelete.id);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = regionToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete region ' + regionToDelete.name + '? This cannot be undone.'}
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
    const { regions } = data;
    const regionElms = regions.map(region => {
      const stateElms = region.states.map(({name}) => name + ', ');
      return (
        <li key={region.id}>
          <strong><LinkButton
            onClick={() => editRegion(region.id)}
          >{region.name}</LinkButton></strong>
          <button
            onClick={() => setRegionToDelete(region)}
          >
            Delete
          </button>
          <div>
            <small>{stateElms}</small>
          </div>
        </li>
      );
    });
    return(
      <>
        {regionElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListRegions;
