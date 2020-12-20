import { ApolloError, gql, useMutation } from '@apollo/client';
import React, {useState} from 'react';
import {
  LinkButton,
  lowWarningColorDark,
  warningColor,
} from '../../../styling/styleUtils';
import { CreatedItemStatus, Mountain, User } from '../../../types/graphQLTypes';
import sendGenericEmail from '../../../utilities/sendGenericEmail';
import {
  FLAG_MOUNTAIN,
  FlagSuccessResponse,
  FlagVariables,
} from '../../mountains/create/MountainForm';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { SuccessResponse } from '../AdminMountains';
import { ListItem } from '../sharedStyles';

const UPDATE_MOUNTAIN_STATUS = gql`
  mutation($id: ID!, $status: CreatedItemStatus) {
    mountain: updateMountainStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

interface StatusSuccessResponse {
  mountain: null | {
    id: Mountain['id'];
    status: Mountain['status'];
  };
}

interface StatusVariables {
  id: string;
  status: CreatedItemStatus | null;
}

export const UPDATE_MOUNTAIN_PERMISSIONS = gql`
  mutation($id: ID!, $mountainPermissions: Int) {
    user: updateMountainPermissions
    (id: $id, mountainPermissions: $mountainPermissions) {
      id
      email
      mountainPermissions
    }
  }
`;

export interface PermissionsSuccessResponse {
  user: null | {
    id: User['id'];
    mountainPermissions: User['mountainPermissions'];
    email: User['email'];
  };
}

export interface PermissionsVariables {
  id: string;
  mountainPermissions: number | null;
}

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

  const [updateMountainStatus] = useMutation<StatusSuccessResponse, StatusVariables>(UPDATE_MOUNTAIN_STATUS);
  const [updateMountainPermissions] =
    useMutation<PermissionsSuccessResponse, PermissionsVariables>(
      UPDATE_MOUNTAIN_PERMISSIONS);
  const [updateMountainFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_MOUNTAIN);

  const approveMountain =
    (mountainId: string, mountainName: string,
     author: PermissionsSuccessResponse['user']) => {
    if (mountainId && author && author.id && author.mountainPermissions !== -1) {
      updateMountainStatus({variables: {
        id: mountainId, status: CreatedItemStatus.accepted,
      }});
      const newPermission = author.mountainPermissions === null
        ? 1 : author.mountainPermissions + 1;
      updateMountainPermissions({variables: {
        id: author.id, mountainPermissions: newPermission,
      }});
      if (author.email !== null) {
        const subject = newPermission > 5
          // tslint:disable-next-line:max-line-length
          ? 'You now have full permissions to add mountains'
          // tslint:disable-next-line:max-line-length
          : mountainName + ' has been approved';
        const content = newPermission > 5
          // tslint:disable-next-line:max-line-length
          ? '<p>Thank you for your accurate contributions to the Wilderlist database! As a result of multiple, accurate additions, you have been granted full permissions to add mountains. Your submissions will no longer appear as "pending" when you add them. Happy hiking!</p>'
          // tslint:disable-next-line:max-line-length
          : '<p>Thank you for your submission to Wilderlist. Your mountain has now been approved.</p>';
        sendGenericEmail({
          emailList: [author.email],
          subject,
          title: mountainName + ' has been approved',
          content,
          ctaText: 'View ' + mountainName + ' on Wilderlist',
          ctaLink: 'https://www.wilderlist.app/mountain/' + mountainId,
        });
      }
    }
  };

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
              [<LinkButton
                onClick={() => approveMountain(
                  mountain.id, mountain.name, mountain.author,
                )}
              >
                Approve Mountain
              </LinkButton>]
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
