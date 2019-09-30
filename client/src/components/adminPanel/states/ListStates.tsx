import { ApolloError } from 'apollo-boost';
import React, {useState} from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { StateDatum, SuccessResponse } from '../AdminStates';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteState: (id: string) => void;
  editState: (id: string) => void;
}

const ListStates = (props: Props) => {
  const {loading, error, data, deleteState, editState} = props;

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
    const stateElms = states.map(state => {
      const regionElms = state.regions.map(({name}) => name + ', ');
      return (
        <li key={state.id}>
          <strong><LinkButton
            onClick={() => editState(state.id)}
          >{state.name} ({state.abbreviation})</LinkButton></strong>
          <button
            onClick={() => setStateToDelete(state)}
          >
            Delete
          </button>
          <div>
            <small>{regionElms}</small>
          </div>
        </li>
      );
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
