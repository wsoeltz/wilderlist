import { ApolloError, gql, useMutation } from '@apollo/client';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {
  useUpdateCampsiteFlag,
} from '../../../queries/campsites/flagCampsite';
import {campsiteDetailLink, userProfileLink} from '../../../routing/Utils';
import {
  LinkButton,
  lowWarningColorDark,
  warningColor,
} from '../../../styling/styleUtils';
import { Campsite, CreatedItemStatus, User } from '../../../types/graphQLTypes';
import sendGenericEmail from '../../../utilities/sendGenericEmail';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { ListItem } from '../sharedStyles';
import { SuccessResponse } from './';

const UPDATE_CAMPSITE_STATUS = gql`
  mutation($id: ID!, $status: CreatedItemStatus) {
    campsite: updateCampsiteStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

interface StatusSuccessResponse {
  campsite: null | {
    id: Campsite['id'];
    status: Campsite['status'];
  };
}

interface StatusVariables {
  id: string;
  status: CreatedItemStatus | null;
}

export const UPDATE_CAMPSITE_PERMISSIONS = gql`
  mutation($id: ID!, $campsitePermissions: Int) {
    user: updateCampsitePermissions
    (id: $id, campsitePermissions: $campsitePermissions) {
      id
      email
      campsitePermissions
    }
  }
`;

export interface PermissionsSuccessResponse {
  user: null | {
    id: User['id'];
    campsitePermissions: User['campsitePermissions'];
    email: User['email'];
  };
}

export interface PermissionsVariables {
  id: string;
  campsitePermissions: number | null;
}

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteCampsite: (id: string) => void;
  searchQuery: string;
}

const ListCampsites = (props: Props) => {
  const {loading, error, data, deleteCampsite, searchQuery} = props;

  const [campsiteToDelete, setCampsiteToDelete] = useState<Campsite | null>(null);

  const [updateCampsiteStatus] = useMutation<StatusSuccessResponse, StatusVariables>(UPDATE_CAMPSITE_STATUS);
  const [updateCampsitePermissions] =
    useMutation<PermissionsSuccessResponse, PermissionsVariables>(
      UPDATE_CAMPSITE_PERMISSIONS);
  const updateCampsiteFlag = useUpdateCampsiteFlag();

  const approveCampsite =
    (campsiteId: string, campsiteName: string,
     author: PermissionsSuccessResponse['user']) => {
    if (campsiteId && author && author.id && author.campsitePermissions !== -1) {
      updateCampsiteStatus({variables: {
        id: campsiteId, status: CreatedItemStatus.accepted,
      }});
      const newPermission = author.campsitePermissions === null
        ? 1 : author.campsitePermissions + 1;
      updateCampsitePermissions({variables: {
        id: author.id, campsitePermissions: newPermission,
      }});
      if (author.email !== null) {
        const subject = newPermission > 5
          // eslint-disable-next-line max-len
          ? 'You now have full permissions to add campsites'
          // eslint-disable-next-line max-len
          : campsiteName + ' has been approved';
        const content = newPermission > 5
          // eslint-disable-next-line max-len
          ? '<p>Thank you for your accurate contributions to the Wilderlist database! As a result of multiple, accurate additions, you have been granted full permissions to add campsites. Your submissions will no longer appear as "pending" when you add them. Happy hiking!</p>'
          // eslint-disable-next-line max-len
          : '<p>Thank you for your submission to Wilderlist. Your campsite has now been approved.</p>';
        sendGenericEmail({
          emailList: [author.email],
          subject,
          title: campsiteName + ' has been approved',
          content,
          ctaText: 'View ' + campsiteName + ' on Wilderlist',
          ctaLink: 'https://www.wilderlist.app/campsite/' + campsiteId,
        });
      }
    }
  };

  const clearFlag = (campsiteId: string) => {
    if (campsiteId) {
      updateCampsiteFlag({variables: {id: campsiteId, flag: null}});
    }
  };

  const closeAreYouSureModal = () => {
    setCampsiteToDelete(null);
  };
  const confirmRemove = () => {
    if (campsiteToDelete !== null) {
      deleteCampsite(campsiteToDelete.id);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = campsiteToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete campsite ' + campsiteToDelete.name + '? This cannot be undone.'}
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
    const { campsites } = data;
    const campsiteElms = campsites.map(campsite => {
      if (campsite.name && campsite.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        const { state } = campsite;
        let flag: React.ReactElement<any> | null;
        if (campsite.flag) {
          const [flagText, flagUserData] = campsite.flag.split('__USERID__');
          const flagUser = flagUserData ? flagUserData.split('__USERNAME__') : null;
          const flaggedBy = flagUser && flagUser.length === 2 ? (
            <Link to={userProfileLink(flagUser[0])}>{flagUser[1]}</Link>
          ) : 'Unknown';
          flag = (
            <div style={{marginTop: '1rem', color: warningColor}}>
              Flagged for: <strong>{flagText}</strong>
              <small style={{marginLeft: '1rem'}}>
                [<LinkButton
                  onClick={() => clearFlag(campsite.id)}
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
        const campsiteName = campsite && campsite.name ? campsite.name : 'Unamed campsite';
        const status = campsite.status === CreatedItemStatus.pending ? (
          <div style={{marginBottom: '1rem', color: lowWarningColorDark}}>
            <strong>STATUS PENDING</strong>
            <small style={{marginLeft: '1rem'}}>
              [<LinkButton
                onClick={() => approveCampsite(
                  campsite.id, campsiteName, campsite.author,
                )}
              >
                Approve Campsite
              </LinkButton>]
            </small>
          </div>
        ) : null;
        const content = (
          <>
            {status}
            <small>
              Elevation: <strong>{campsite.elevation}</strong>,
              State: <strong>{state !== null ? state.name : 'N/A'}</strong>
              <br />Author: &nbsp;
              <Link to={campsite.author !== null ? userProfileLink(campsite.author.id) : '#'}>
                <strong>{campsite.author !== null ? campsite.author.name : 'N/A'}</strong>
              </Link>
            </small>
            {flag}
          </>
        );
        let titleColor: string | undefined;
        if (campsite.flag !== null) {
          titleColor = warningColor;
        } else if (campsite.status === CreatedItemStatus.pending) {
          titleColor = lowWarningColorDark;
        } else {
          titleColor = undefined;
        }
        return (
          <ListItem
            key={campsite.id}
            title={campsiteName + ' - ' + (state !== null ? state.abbreviation : 'N/A')}
            content={content}
            onDelete={() => setCampsiteToDelete(campsite)}
            titleColor={titleColor}
            url={campsiteDetailLink(campsite.id)}
          />
        );
      } else {
        return null;
      }
    });
    const noItemsText = campsites.length ? null : <p style={{textAlign: 'center'}}>No items</p>;
    return(
      <>
        {noItemsText}
        {campsiteElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListCampsites;
