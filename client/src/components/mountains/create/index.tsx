import queryString from 'query-string';
import React, {useCallback, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {useMountainAndAllStates} from '../../../queries/compound/getMountainsAndStates';
import {
  BaseMountainVariables,
  useAddMountain,
  useEditMountain,
} from '../../../queries/mountains/addRemoveMountain';
import {Routes} from '../../../routing/routes';
import {mountainDetailLink} from '../../../routing/Utils';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import { ExternalResource, PermissionTypes } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import MountainForm, {InitialMountainDatum} from './MountainForm';

interface QueryVariables {
  lat?: string;
  lng?: string;
}

const ModalActions = ({closeErrorModal}: {closeErrorModal: () => void}) => {
  const getString = useFluent();
  return (
    <ButtonSecondary onClick={closeErrorModal} mobileExtend={true}>
      {getString('global-text-value-modal-close')}
    </ButtonSecondary>
  );
};

const MemoedActions = React.memo(ModalActions);

const MountainCreatePage = () => {
  const user = useCurrentUser();
  const { id }: any = useParams();
  const history = useHistory();
  const {lat, lng}: QueryVariables = queryString.parse(history.location.search);

  const getString = useFluent();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const closeErrorModal = useCallback(() => setIsErrorModalVisible(false), []);

  const {loading, error, data} = useMountainAndAllStates({ id: id ? id : null });
  const addMountain = useAddMountain();
  const editMountain = useEditMountain();

  let mountainForm: React.ReactElement<any> | null;
  if (!user) {
    mountainForm = null;
  } else if (user.mountainPermissions === -1) {
    mountainForm = (
      <PlaceholderText>
        {getString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    mountainForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    mountainForm = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const states = data.states ? data.states : [];
    const userId = user ? user._id : null;

    const submitMountainForm = (addAnother: boolean) => async (input: BaseMountainVariables) => {
      try {
        if (id) {
          if (data && data.mountain && (
              (data.mountain.author && data.mountain.author.id === userId) ||
              user.permissions === PermissionTypes.admin)
            ) {
            const res = await editMountain({variables: {...input, id}});
            if (addAnother === true) {
              window.location.href =
                Routes.CreateMountain +
                '?lat=' + (input.latitude + 0.001) +
                '&lng=' + (input.longitude + 0.001);
            } else if (res && res.data && res.data.mountain) {
              history.push(mountainDetailLink(res.data.mountain.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        } else if (userId) {
          const res = await addMountain({variables: {...input, author: userId}});
          if (addAnother === true) {
            window.location.href =
              Routes.CreateMountain +
              '?lat=' + (input.latitude + 0.001) +
              '&lng=' + (input.longitude + 0.001);
          } else if (res && res.data && res.data.mountain) {
            history.push(mountainDetailLink(res.data.mountain.id));
          } else {
            setIsErrorModalVisible(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (data.mountain && (
        (data.mountain.author && data.mountain.author.id === userId) ||
        user.permissions === PermissionTypes.admin)
      ) {
      const {mountain: {name, state, flag, description, resources}, mountain} = data;
      const nonNullResources: ExternalResource[] = [];
      if (resources) {
        resources.forEach(rsrc => {
          if (rsrc !== null && rsrc.title.length && rsrc.url.length) {
            nonNullResources.push({title: rsrc.title, url: rsrc.url});
          }
        });
      }
      const initialMountain: InitialMountainDatum = {
        id: mountain.id,
        name,
        latitude: mountain.latitude.toString(),
        longitude: mountain.longitude.toString(),
        elevation: mountain.elevation.toString(),
        description: description ? description : '',
        resources: nonNullResources,
        state, flag,
      };
      mountainForm = (
        <MountainForm
          states={states}
          initialData={initialMountain}
          onSubmit={submitMountainForm(false)}
          onSubmitAndAddAnother={null}
          onCancel={history.goBack}
        />
      );
    } else if (data.mountain) {
        mountainForm = (
        <PlaceholderText>
          {getString('global-text-value-no-permission')}
        </PlaceholderText>
      );
    } else {
      const latitude: string = lat ? lat : '';
      const longitude: string = lng ? lng : '';
      const initialMountain: InitialMountainDatum = {
        id: '',
        name: '',
        latitude,
        longitude,
        elevation: '',
        state: null,
        flag: null,
        description: '',
        resources: [],
      };
      mountainForm = (
        <MountainForm
          states={states}
          initialData={initialMountain}
          onSubmit={submitMountainForm(false)}
          onSubmitAndAddAnother={submitMountainForm(true)}
          onCancel={history.goBack}
        />
      );
    }
  } else {
    mountainForm = null;
  }
  const errorModal = isErrorModalVisible === false ? null : (
    <Modal
      onClose={closeErrorModal}
      width={'600px'}
      height={'auto'}
      actions={MemoedActions}
    >
      <p>{getString('global-error-saving-data')}</p>
    </Modal>
  );

  return (
    <>
      {mountainForm}
      {errorModal}
    </>
  );
};

export default MountainCreatePage;
