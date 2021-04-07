import queryString from 'query-string';
import React, {useCallback, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {
  useEditTrail,
  Variables,
} from '../../../../queries/trails/addRemoveTrail';
import {useBasicTrailDetail} from '../../../../queries/trails/useBasicTrailDetail';
import {trailDetailLink} from '../../../../routing/Utils';
import { ButtonSecondary, PlaceholderText } from '../../../../styling/styleUtils';
import { PermissionTypes } from '../../../../types/graphQLTypes';
import PageNotFound from '../../../sharedComponents/404';
import LoadingSpinner from '../../../sharedComponents/LoadingSpinner';
import Modal from '../../../sharedComponents/Modal';
import TrailForm from './TrailForm';

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

const TrailCreatePage = () => {
  const user = useCurrentUser();
  const { id }: any = useParams();
  const history = useHistory();
  const {lat, lng}: QueryVariables = queryString.parse(history.location.search);
  const mapContext = useMapContext();

  useEffect(() => {
    const latitude = lat ? parseFloat(lat) : NaN;
    const longitude = lng ? parseFloat(lng) : NaN;
    if (mapContext.intialized && !isNaN(latitude) && !isNaN(longitude)) {
      mapContext.setNewCenter([longitude, latitude], 12);
    }
  }, [mapContext, lat, lng]);

  const getString = useFluent();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const closeErrorModal = useCallback(() => setIsErrorModalVisible(false), []);

  const {loading, error, data} = useBasicTrailDetail(id ? id : null );
  const editTrail = useEditTrail();

  let trailForm: React.ReactElement<any> | null;
  if (!user) {
    trailForm = <PageNotFound />;
  } else if (user.permissions !== PermissionTypes.admin) {
    trailForm = (
      <PlaceholderText>
        {getString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    trailForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    trailForm = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {

    const submitTrailForm = async (input: Variables) => {
      try {
        if (id) {
          if (data && data.trail && user.permissions === PermissionTypes.admin) {
            const res = await editTrail({variables: {...input, id}});
            if (res && res.data && res.data.trail) {
              history.push(trailDetailLink(res.data.trail.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (data.trail && user.permissions === PermissionTypes.admin) {
      const {trail} = data;
      trailForm = (
        <TrailForm
          initialData={trail}
          onSubmit={submitTrailForm}
          onCancel={history.goBack}
        />
      );
    } else {
      trailForm = null;
    }
  } else {
    trailForm = null;
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
      {trailForm}
      {errorModal}
    </>
  );
};

export default TrailCreatePage;
