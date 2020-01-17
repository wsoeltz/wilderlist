import { ApolloError } from 'apollo-boost';
import React, {useState} from 'react';
import { Mountain, CreatedItemStatus } from '../../../types/graphQLTypes';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { SuccessResponse } from '../AdminMountains';
import { ListItem } from '../sharedStyles';
import {
  LinkButton,
  lowWarningColorDark,
  warningColor,
} from '../../../styling/styleUtils';
import { useMutation } from '@apollo/react-hooks';
import {
  FLAG_MOUNTAIN,
  FlagSuccessResponse,
  FlagVariables,
} from '../../mountains/create/MountainForm';

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

  const [updateMountainFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_MOUNTAIN);

  const clearFlag = (mountainId: string) => {
    if (mountainId) {
      updateMountainFlag({variables: {id: mountainId, flag: null}});
    }
  };

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
        const flag = mountain.flag === null ? null : (
          <div style={{marginTop: '1rem', color: warningColor}}>
            Flagged for: <strong>{mountain.flag.toUpperCase()}</strong>
            <small style={{marginLeft: '1rem'}}>
              [<LinkButton
                onClick={() => clearFlag(mountain.id)}
              >
                Clear flag
              </LinkButton>]
            </small>
          </div>
        );
        const status = mountain.status === CreatedItemStatus.pending ? (
          <div style={{marginBottom: '1rem', color: lowWarningColorDark}}>
            <strong>STATUS PENDING</strong>
            <small style={{marginLeft: '1rem'}}>
              [<LinkButton>Approve Mountain</LinkButton>]
            </small>
          </div>
        ) : null;
        const content = (
          <>
            {status}
            <small>
              Elevation: <strong>{mountain.elevation}</strong>,
              Latitude: <strong>{mountain.latitude}</strong>,
              Longitude: <strong>{mountain.longitude}</strong>,
              Prominence: <strong>{mountain.prominence}</strong>,
              State: <strong>{state !== null ? state.name : 'N/A'}</strong>
            </small>
            {flag}
          </>
        );
        let titleColor: string | undefined;
        if (mountain.flag !== null) {
          titleColor = warningColor;
        } else if (mountain.status === CreatedItemStatus.pending) {
          titleColor = lowWarningColorDark;
        } else {
          titleColor = undefined;
        }
        return (
          <ListItem
            key={mountain.id}
            title={mountain.name + ' - ' + (state !== null ? state.abbreviation : 'N/A')}
            content={content}
            onEdit={() => editMountain(mountain.id)}
            onDelete={() => setMountainToDelete(mountain)}
            titleColor={titleColor}
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
