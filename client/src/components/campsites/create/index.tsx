import queryString from 'query-string';
import React, {useCallback, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import {
  BaseCampsiteVariables,
  useAddCampsite,
  useEditCampsite,
} from '../../../queries/campsites/addRemoveCampsite';
import {useCampsiteAndAllStates} from '../../../queries/compound/getCampsitesAndStates';
import {Routes} from '../../../routing/routes';
import {campsiteDetailLink} from '../../../routing/Utils';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import { PermissionTypes } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import CampsiteForm, {InitialCampsiteDatum} from './CampsiteForm';

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

const CampsiteCreatePage = () => {
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

  const {loading, error, data} = useCampsiteAndAllStates({ id: id ? id : null });
  const addCampsite = useAddCampsite();
  const editCampsite = useEditCampsite();

  let campsiteForm: React.ReactElement<any> | null;
  if (!user) {
    campsiteForm = null;
  } else if (user.campsitePermissions === -1) {
    campsiteForm = (
      <PlaceholderText>
        {getString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    campsiteForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    campsiteForm = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const states = data.states ? data.states : [];
    const userId = user ? user._id : null;

    const submitCampsiteForm = (addAnother: boolean) => async (input: BaseCampsiteVariables) => {
      try {
        if (id) {
          if (data && data.campsite && (
              (data.campsite.author && data.campsite.author.id === userId) ||
              user.permissions === PermissionTypes.admin)
            ) {
            const res = await editCampsite({variables: {...input, id}});
            if (addAnother === true) {
              window.location.href =
                Routes.CreateCampsite +
                '?lat=' + (input.latitude + 0.001) +
                '&lng=' + (input.longitude + 0.001);
            } else if (res && res.data && res.data.campsite) {
              history.push(campsiteDetailLink(res.data.campsite.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        } else if (userId) {
          const res = await addCampsite({variables: {...input, author: userId}});
          if (addAnother === true) {
            window.location.href =
              Routes.CreateCampsite +
              '?lat=' + (input.latitude + 0.001) +
              '&lng=' + (input.longitude + 0.001);
          } else if (res && res.data && res.data.campsite) {
            history.push(campsiteDetailLink(res.data.campsite.id));
          } else {
            setIsErrorModalVisible(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (data.campsite && (
        (data.campsite.author && data.campsite.author.id === userId) ||
        user.permissions === PermissionTypes.admin)
      ) {
      const {campsite: {name, state, flag, locationText, locationTextShort, ...rest}, campsite} = data;

      const initialCampsite: InitialCampsiteDatum = {
        ...rest,
        id: campsite.id,
        name: name ? name : '',
        latitude: campsite.location[1].toString(),
        longitude: campsite.location[0].toString(),
        elevation: campsite.elevation.toString(),
        locationText: locationText ? locationText : '',
        locationTextShort: locationTextShort ? locationTextShort : '',
        state, flag,
      };
      campsiteForm = (
        <CampsiteForm
          states={states}
          initialData={initialCampsite}
          onSubmit={submitCampsiteForm(false)}
          onSubmitAndAddAnother={null}
          onCancel={history.goBack}
        />
      );
    } else if (data.campsite) {
        campsiteForm = (
        <PlaceholderText>
          {getString('global-text-value-no-permission')}
        </PlaceholderText>
      );
    } else {
      const latitude: string = lat ? lat : '';
      const longitude: string = lng ? lng : '';
      const initialCampsite: InitialCampsiteDatum = {
        id: '',
        name: '',
        latitude,
        longitude,
        elevation: '',
        state: null,
        flag: null,
        type: null,
        locationText: '',
        locationTextShort: '',
        website: null,
        ownership: null,
        electricity: null,
        toilets: null,
        drinking_water: null,
        email: null,
        reservation: null,
        showers: null,
        phone: null,
        fee: null,
        tents: null,
        capacity: null,
        internet_access: null,
        fire: null,
        maxtents: null,
      };
      campsiteForm = (
        <CampsiteForm
          states={states}
          initialData={initialCampsite}
          onSubmit={submitCampsiteForm(false)}
          onSubmitAndAddAnother={submitCampsiteForm(true)}
          onCancel={history.goBack}
        />
      );
    }
  } else {
    campsiteForm = null;
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
      {campsiteForm}
      {errorModal}
    </>
  );
};

export default CampsiteCreatePage;
