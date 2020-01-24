// import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
// import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import BackButton from '../../sharedComponents/BackButton';
// import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';

interface Props extends RouteComponentProps {
  userId: string | null;
  peakListPermissions: null | number;
}

const PeakListCreatePage = (props: Props) => {
  const { userId, peakListPermissions, match } = props;
  const { id }: any = match.params;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  let peakListForm: React.ReactElement<any> | null;
  if (peakListPermissions === -1) {
    peakListForm = (
      <PlaceholderText>
        {getFluentString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else {
    peakListForm = (
      <div>
        userId: {userId} | peakListId: {id}
      </div>
    );
  }
  const closeErrorModal = () => setIsErrorModalVisible(false);
  const errorModal = isErrorModalVisible === false ? null : (
    <Modal
      onClose={closeErrorModal}
      width={'600px'}
      height={'auto'}
      actions={(
        <ButtonSecondary onClick={closeErrorModal}>
          {getFluentString('global-text-value-modal-close')}
        </ButtonSecondary>
        )}
    >
      <p>{getFluentString('global-error-saving-data')}</p>
    </Modal>
  );

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          {peakListForm}
        </ContentBody>
        {errorModal}
      </ContentLeftLarge>
    </>
  );
};

export default withRouter(PeakListCreatePage);
