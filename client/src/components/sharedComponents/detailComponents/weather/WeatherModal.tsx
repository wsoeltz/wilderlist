import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  ButtonSecondary,
} from '../../../../styling/styleUtils';
import PointForecast from './pointForecast';

import Modal from '../../Modal';

const ButtonWrapper = styled.div`
  text-align: right;
`;

interface Props {
  onClose: () => void;
  latitude: number;
  longitude: number;
  valley?: boolean;
}

const DrivingDirections = ({latitude, longitude, valley, onClose}: Props) => {
  const getString = useFluent();
  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onClose} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
      </ButtonSecondary>
    </ButtonWrapper>
  );

  return (
    <Modal
      onClose={onClose}
      width={'500px'}
      height={'auto'}
      actions={actions}
      contentStyles={{padding: 0, marginBottom: '-1rem'}}
    >
      <PointForecast latitude={latitude} longitude={longitude} valley={valley} />
    </Modal>
  );

};

export default DrivingDirections;
