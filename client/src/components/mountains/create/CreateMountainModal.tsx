import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { PlaceholderText } from '../../../styling/styleUtils';
import { State } from '../../../types/graphQLTypes';
import { MountainDatum } from '../../peakLists/create/MountainSelectionModal';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import {
  ADD_MOUNTAIN,
  AddMountainVariables,
  BaseMountainVariables,
  MountainSuccessResponse,
} from './';
import MountainForm, {
  InitialMountainDatum,
} from './MountainForm';

const GET_STATES = gql`
  query getStates {
    states {
      id
      name
      abbreviation
    }
  }
`;

interface QuerySuccessResponse {
  states: Array<{
    id: State['id'];
    name: State['name'];
    abbreviation: State['abbreviation'];
  }>;
}

export interface Props {
  onSuccess: (mountain: MountainDatum) => void;
  onCancel: () => void;
}

const CreateMountainModal = (props: Props) => {
  const { onCancel, onSuccess } = props;
  const user = useCurrentUser();

  const getString = useFluent();

  const {loading, error, data} = useQuery<QuerySuccessResponse>(GET_STATES);
  const [addMountain] = useMutation<MountainSuccessResponse, AddMountainVariables>(ADD_MOUNTAIN);

  let modalContent: React.ReactElement<any> | null;
  if (!user) {
    modalContent = (
      <PlaceholderText>
        {getString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (user.mountainPermissions === -1) {
    modalContent = (
      <PlaceholderText>
        {getString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    modalContent = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    modalContent = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const states = data.states && data.states.length ? data.states : [];

    const initialMountain: InitialMountainDatum = {
      id: '',
      name: '',
      latitude: '',
      longitude: '',
      elevation: '',
      state: null,
      flag: null,
      description: '',
      resources: [],
    };

    const onSubmit = async (input: BaseMountainVariables) => {
      try {
        if (user && user._id) {
          const res = await addMountain({variables: {...input, author: user._id}});
          if (res && res.data && res.data.mountain) {
            onSuccess(res.data.mountain);
          }
        }
      } catch (e) {
        console.error(e);
      }
      onCancel();
    };
    modalContent = (
      <MountainForm
        states={states}
        initialData={initialMountain}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onSubmitAndAddAnother={null}
      />
    );
  } else {
    modalContent = null;
  }

  return (
    <Modal
      onClose={onCancel}
      width={'750px'}
      height={'auto'}
      actions={null}
      contentStyles={{paddingBottom: 0}}
    >
      {modalContent}
    </Modal>
  );
};

export default CreateMountainModal;
