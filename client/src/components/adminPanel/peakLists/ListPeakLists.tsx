import { ApolloError, gql, useMutation } from '@apollo/client';
import React, {useState} from 'react';
import {
  LinkButton,
  lowWarningColorDark,
  warningColor,
} from '../../../styling/styleUtils';
import { CreatedItemStatus, PeakList, User } from '../../../types/graphQLTypes';
import {
  FLAG_PEAK_LIST,
  FlagSuccessResponse,
  FlagVariables,
} from '../../peakLists/create/PeakListForm';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { PeakListDatum, SuccessResponse } from '../AdminPeakLists';
import { ListItem } from '../sharedStyles';

const UPDATE_PEAK_LIST_STATUS = gql`
  mutation($id: ID!, $status: CreatedItemStatus) {
    mountain: updatePeakListStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

interface StatusSuccessResponse {
  mountain: null | {
    id: PeakList['id'];
    status: PeakList['status'];
  };
}

interface StatusVariables {
  id: string;
  status: CreatedItemStatus | null;
}

export const UPDATE_PEAK_LIST_PERMISSIONS = gql`
  mutation($id: ID!, $peakListPermissions: Int) {
    user: updatePeakListPermissions
    (id: $id, peakListPermissions: $peakListPermissions) {
      id
      email
      peakListPermissions
    }
  }
`;

export interface PermissionsSuccessResponse {
  user: null | {
    id: User['id'];
    peakListPermissions: User['peakListPermissions'];
    email: User['email'];
  };
}

export interface PermissionsVariables {
  id: string;
  peakListPermissions: number | null;
}

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deletePeakList: (id: string) => void;
  editPeakList: (id: string) => void;
  searchQuery: string;
}

const ListStates = (props: Props) => {
  const {loading, error, data, deletePeakList, editPeakList, searchQuery} = props;

  const [updatePeakListStatus] = useMutation<StatusSuccessResponse, StatusVariables>(UPDATE_PEAK_LIST_STATUS);
  const [updatePeakListPermissions] =
    useMutation<PermissionsSuccessResponse, PermissionsVariables>(
      UPDATE_PEAK_LIST_PERMISSIONS);
  const [updatePeakListFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_PEAK_LIST);

  const approveMountain = (peakListId: string, author: PermissionsSuccessResponse['user']) => {
    if (peakListId && author && author.id && author.peakListPermissions !== -1) {
      updatePeakListStatus({variables: {
        id: peakListId, status: CreatedItemStatus.accepted,
      }});
      const newPermission = author.peakListPermissions === null
        ? 1 : author.peakListPermissions + 1;
      updatePeakListPermissions({variables: {
        id: author.id, peakListPermissions: newPermission,
      }});
    }
  };

  const clearFlag = (peakListId: string) => {
    if (peakListId) {
      updatePeakListFlag({variables: {id: peakListId, flag: null}});
    }
  };

  const [peakListToDelete, setPeakListToDelete] = useState<PeakListDatum | null>(null);

  const closeAreYouSureModal = () => {
    setPeakListToDelete(null);
  };
  const confirmRemove = () => {
    if (peakListToDelete !== null) {
      deletePeakList(peakListToDelete.id);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = peakListToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete peakList ' + peakListToDelete.name + '? This cannot be undone.'}
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
    const { peakLists } = data;
    const peakListElms = peakLists.map(peakList => {
      if (peakList.searchString.toLowerCase().includes(searchQuery.toLowerCase())) {
        const { type, parent, states } = peakList;
        const flag = peakList.flag === null ? null : (
          <div style={{marginTop: '1rem', color: warningColor}}>
            Flagged for: <strong>{peakList.flag.toUpperCase()}</strong>
            <small style={{marginLeft: '1rem'}}>
              [<LinkButton
                onClick={() => clearFlag(peakList.id)}
              >
                Clear flag
              </LinkButton>]
            </small>
          </div>
        );
        const status = peakList.status === CreatedItemStatus.pending ? (
          <div style={{marginBottom: '1rem', color: lowWarningColorDark}}>
            <strong>STATUS PENDING</strong>
            <small style={{marginLeft: '1rem'}}>
              [<LinkButton onClick={() => approveMountain(peakList.id, peakList.author)}>
                Approve Mountain
              </LinkButton>]
            </small>
          </div>
        ) : null;
        let parentCopy: React.ReactElement<any> | null;
        let stateCopy: React.ReactElement<any> | null;
        if (parent !== null) {
          parentCopy = (
            <div>
              <small>
                Parent list: {parent.name} ({parent.type})
              </small>
            </div>
          );
        } else {
          parentCopy = null;
        }
        if (states !== null && states.length) {
          const stateElms = states.map(st => st.name + ', ');
          stateCopy = (
            <div>
              <small>
                States: {stateElms}
              </small>
            </div>
          );
        } else {
          stateCopy = null;
        }
        const content = (
          <>
            {status}
            {parentCopy}
            {stateCopy}
            {flag}
          </>
        );
        let titleColor: string | undefined;
        if (peakList.flag !== null) {
          titleColor = warningColor;
        } else if (peakList.status === CreatedItemStatus.pending) {
          titleColor = lowWarningColorDark;
        } else {
          titleColor = undefined;
        }
        return (
          <ListItem
            key={peakList.id}
            title={`${peakList.name} (${peakList.shortName}) - ${type}`}
            content={content}
            onEdit={() => editPeakList(peakList.id)}
            onDelete={() => setPeakListToDelete(peakList)}
            titleColor={titleColor}
          />
        );
      } else {
        return null;
      }
    });
    return(
      <>
        {peakListElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListStates;
