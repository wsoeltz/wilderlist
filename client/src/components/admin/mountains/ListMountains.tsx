import { ApolloError, gql, useMutation } from '@apollo/client';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {
  useUpdateMountainFlag,
} from '../../../queries/mountains/flagMountain';
import {mountainDetailLink, userProfileLink} from '../../../routing/Utils';
import {
  LinkButton,
  lowWarningColorDark,
  warningColor,
} from '../../../styling/styleUtils';
import { CreatedItemStatus, Mountain, User } from '../../../types/graphQLTypes';
import sendGenericEmail from '../../../utilities/sendGenericEmail';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { ListItem } from '../sharedStyles';
import { SuccessResponse } from './';

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
  searchQuery: string;
}

const ListMountains = (props: Props) => {
  const {loading, error, data, deleteMountain, searchQuery} = props;

  const [mountainToDelete, setMountainToDelete] = useState<Mountain | null>(null);

  const [updateMountainStatus] = useMutation<StatusSuccessResponse, StatusVariables>(UPDATE_MOUNTAIN_STATUS);
  const [updateMountainPermissions] =
    useMutation<PermissionsSuccessResponse, PermissionsVariables>(
      UPDATE_MOUNTAIN_PERMISSIONS);
  const updateMountainFlag = useUpdateMountainFlag();

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
          // eslint-disable-next-line max-len
          ? 'You now have full permissions to add mountains'
          // eslint-disable-next-line max-len
          : mountainName + ' has been approved';
        const content = newPermission > 5
          // eslint-disable-next-line max-len
          ? '<p>Thank you for your accurate contributions to the Wilderlist database! As a result of multiple, accurate additions, you have been granted full permissions to add mountains. Your submissions will no longer appear as "pending" when you add them. Happy hiking!</p>'
          // eslint-disable-next-line max-len
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
        let flag: React.ReactElement<any> | null;
        if (mountain.flag) {
          const [flagText, flagUserData] = mountain.flag.split('__USERID__');
          const flagUser = flagUserData ? flagUserData.split('__USERNAME__') : null;
          const flaggedBy = flagUser && flagUser.length === 2 ? (
            <Link to={userProfileLink(flagUser[0])}>{flagUser[1]}</Link>
          ) : 'Unknown';
          flag = (
            <div style={{marginTop: '1rem', color: warningColor}}>
              Flagged for: <strong>{flagText}</strong>
              <small style={{marginLeft: '1rem'}}>
                [<LinkButton
                  onClick={() => clearFlag(mountain.id)}
                >
                  Clear flag
                </LinkButton>]
              </small>
              <br />
              <small>Flagged by {flaggedBy}</small>
            </div>
          );
        } else {
          flag = null;
        }
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
              State: <strong>{state !== null ? state.name : 'N/A'}</strong>
              <br />Author: &nbsp;
              <Link to={mountain.author !== null ? userProfileLink(mountain.author.id) : '#'}>
                <strong>{mountain.author !== null ? mountain.author.name : 'N/A'}</strong>
              </Link>
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
            onDelete={() => setMountainToDelete(mountain)}
            titleColor={titleColor}
            url={mountainDetailLink(mountain.id)}
          />
        );
      } else {
        return null;
      }
    });
    const noItemsText = mountains.length ? null : <p style={{textAlign: 'center'}}>No items</p>;
    return(
      <>
        {noItemsText}
        {mountainElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListMountains;
