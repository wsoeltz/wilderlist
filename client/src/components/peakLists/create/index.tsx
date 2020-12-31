import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  FormInput,
  useAddPeakList,
  useEditPeakList,
  useGetPeakList,
} from '../../../queries/lists/addEditPeakList';
import {listDetailLink} from '../../../routing/Utils';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import {
  ExternalResource,
  Mountain,
  PeakListVariants,
  PermissionTypes,
} from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import PeakListForm, {InitialPeakListDatum} from './PeakListForm';

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

  const addPeakList = useAddPeakList();
  const editPeakList = useEditPeakList();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  let peakListForm: React.ReactElement<any> | null;
  if (!user) {
    return null;
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
    const {states} = data;
    const onSubmit = async (input: FormInput) => {
      try {
        if (id) {
          if (data && data.peakList
              && (
                (data.peakList.author && data.peakList.author.id === userId) ||
                user.permissions === PermissionTypes.admin)
            ) {
            const res = await editPeakList({variables: {...input, id}});
            if (res && res.data && res.data.peakList) {
              history.push(listDetailLink(res.data.peakList.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        } else if (userId) {
          const res = await addPeakList({variables: {...input, author: userId}});
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
    if (data.peakList && data.peakList.type === PeakListVariants.standard && (
            (data.peakList.author && data.peakList.author.id === userId) ||
            user.permissions === PermissionTypes.admin)
      ) {
      const {
        peakList: {
          name, shortName, description, optionalPeaksDescription, type,
          flag, tier, resources, parent,
        }, peakList,
      } = data;
      const mountains = parent && parent.mountains ? parent.mountains : peakList.mountains;
      const optionalMountains = parent && parent.optionalMountains
        ? parent.optionalMountains : peakList.optionalMountains;
      const nonNullMountains: Mountain[] = [];
      mountains.forEach(mtn => {
        if (mtn !== null) {
          nonNullMountains.push(mtn);
        }
      });
      const nonNullOptionalMountains: Mountain[] = [];
      if (optionalMountains) {
        optionalMountains.forEach(mtn => {
          if (mtn !== null) {
            nonNullOptionalMountains.push(mtn);
          }
        });
      }
      const nonNullResources: ExternalResource[] = [];
      if (resources) {
        resources.forEach(rsrc => {
          if (rsrc !== null && rsrc.title.length && rsrc.url.length) {
            nonNullResources.push({title: rsrc.title, url: rsrc.url});
          }
        });
      }
      const initialData: InitialPeakListDatum = {
        id: peakList.id,
        name, shortName,
        description: description ? description : '',
        optionalPeaksDescription: optionalPeaksDescription ? optionalPeaksDescription : '',
        type,
        mountains: nonNullMountains,
        optionalMountains: nonNullOptionalMountains,
        flag,
        tier: tier ? tier : undefined,
        resources: nonNullResources,
        parent: null,
      };
      peakListForm = (
        <PeakListForm
          initialData={initialData}
          onSubmit={onSubmit}
          states={states}
        />
      );
    } else if (data.peakList) {
        peakListForm = (
        <PlaceholderText>
          {getString('global-text-value-no-permission')}
        </PlaceholderText>
      );
    } else {
      const initialData: InitialPeakListDatum = {
        id: undefined,
        name: '',
        shortName: '',
        description: '',
        optionalPeaksDescription: '',
        type: PeakListVariants.standard,
        mountains: [],
        optionalMountains: [],
        flag: null,
        tier: undefined,
        resources: [],
        parent: null,
      };
      peakListForm = (
        <PeakListForm
          initialData={initialData}
          onSubmit={onSubmit}
          states={states}
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
