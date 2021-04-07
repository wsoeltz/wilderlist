import {Types} from 'mongoose';
import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import useAddEditPeakList, {
  SuccessResponse,
  useGetPeakList,
  Variables,
} from '../../../queries/lists/addEditPeakList';
import {listDetailLink} from '../../../routing/Utils';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import {
  ListPrivacy,
  PermissionTypes,
} from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import PleaseLogin from '../../sharedComponents/PleaseLogin';
import PeakListForm, {FormSource} from './PeakListForm';

const ModalActions = ({closeErrorModal}: {closeErrorModal: () => void}) => {
  const getString = useFluent();
  return (
    <ButtonSecondary onClick={closeErrorModal} mobileExtend={true}>
      {getString('global-text-value-modal-close')}
    </ButtonSecondary>
  );
};

const MemoizedActions = React.memo(ModalActions);

const PeakListCreatePage = () => {
  const user = useCurrentUser();
  const history = useHistory();
  const { id }: any = useParams();

  const userId = user ? user._id : null;

  const getString = useFluent();

  const {loading, error, data} = useGetPeakList(id ? id : null);

  const addEditPeakList = useAddEditPeakList();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  let peakListForm: React.ReactElement<any> | null;
  if (!user && user !== null) {
    return <PleaseLogin />;
  } else if (user && user.peakListPermissions === -1 && user.permissions !== PermissionTypes.admin) {
    peakListForm = (
      <PlaceholderText>
        {getString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    peakListForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    peakListForm = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (user && data !== undefined) {
    const {peakList} = data;
    const onSubmit = async (input: Variables) => {
      try {
        if (id) {
          if (data && data.peakList
              && (
                (data.peakList.author && data.peakList.author.id === userId) ||
                user.permissions === PermissionTypes.admin)
            ) {
            const res = await addEditPeakList({variables: {...input, id}});
            if (res && res.data && res.data.peakList) {
              history.push(listDetailLink(res.data.peakList.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        } else if (userId) {
          const res = await addEditPeakList({variables: input});
          if (res && res.data && res.data.peakList) {
            history.push(listDetailLink(res.data.peakList.id));
          } else {
            setIsErrorModalVisible(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (data.peakList && (
          (data.peakList.author && data.peakList.author.id === userId) ||
          user.permissions === PermissionTypes.admin)
      ) {
      peakListForm = (
        <PeakListForm
          initialData={peakList}
          onSubmit={onSubmit}
          source={FormSource.Edit}
        />
      );
    } else if (data.peakList) {
        peakListForm = (
        <PlaceholderText>
          {getString('global-text-value-no-permission')}
        </PlaceholderText>
      );
    } else {
      const initialData: SuccessResponse['peakList'] = {
        id: new Types.ObjectId() as unknown as string,
        name: '',
        shortName: '',
        description: '',
        mountains: [],
        optionalMountains: [],
        trails: [],
        optionalTrails: [],
        campsites: [],
        optionalCampsites: [],
        resources: [],
        author: {id: user._id},
        tier: null,
        flag: null,
        status: null,
        privacy: ListPrivacy.Public,
        center: null,
        bbox: null,
      };
      peakListForm = (
        <PeakListForm
          initialData={initialData}
          onSubmit={onSubmit}
          source={FormSource.Create}
        />
      );
    }

  } else {
    peakListForm = null;
  }

  const closeErrorModal = () => setIsErrorModalVisible(false);
  const errorModal = isErrorModalVisible === false ? null : (
    <Modal
      onClose={closeErrorModal}
      width={'600px'}
      height={'auto'}
      actions={MemoizedActions}
    >
      <p>{getString('global-error-saving-data')}</p>
    </Modal>
  );

  return (
    <>
      {peakListForm}
      {errorModal}
    </>
  );
};

export default PeakListCreatePage;
