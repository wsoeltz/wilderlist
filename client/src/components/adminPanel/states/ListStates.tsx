import { ApolloError } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import React, {useState} from 'react';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { StateDatum, SuccessResponse } from '../AdminStates';
import { ListItem } from '../sharedStyles';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteState: (id: string) => void;
  editState: (id: string) => void;
  searchQuery: string;
}

const ListStates = (props: Props) => {
  const {loading, error, data, deleteState, editState, searchQuery} = props;

  const [stateToDelete, setStateToDelete] = useState<StateDatum | null>(null);

  const closeAreYouSureModal = () => {
    setStateToDelete(null);
  };
  const confirmRemove = () => {
    if (stateToDelete !== null) {
      deleteState(stateToDelete.id);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = stateToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete state ' + stateToDelete.name + '? This cannot be undone.'}
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
    const { states } = data;
    const sortedStates = sortBy(states, ['name']);
    const stateElms = sortedStates.map(state => {
      if ((state.name.toLowerCase() + state.abbreviation.toLowerCase()).includes(searchQuery.toLowerCase())) {
        const regionElms = state.regions.map(({name}) => name + ', ');
        return (
          <ListItem
            key={state.id}
            title={`${state.name} (${state.abbreviation})`}
            content={regionElms}
            onEdit={() => editState(state.id)}
            onDelete={() => setStateToDelete(state)}
          />
        );
      } else {
        return null;
      }
    });
    return(
      <>
        {stateElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListStates;
