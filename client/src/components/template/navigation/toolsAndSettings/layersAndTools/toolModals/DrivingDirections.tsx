import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../../../hooks/useFluent';
import {
  ButtonSecondary,
} from '../../../../../../styling/styleUtils';
import PanelDirections from '../../../../../sharedComponents/detailComponents/directions/PanelDirections';
import Modal from '../../../../../sharedComponents/Modal';

const Root = styled.div`
  width: 500px;

  @media(max-width: 600px) {
    width: 100%;
  }
`;

const ButtonWrapper = styled.div`
  text-align: right;
`;

interface Props {
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const DrivingDirections = ({latitude, longitude, onClose}: Props) => {
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
      contentStyles={{padding: 0, marginBottom: '-1rem', overflow: 'visible'}}
    >
      <Root>
        <PanelDirections
          destination={[longitude, latitude]}
          considerDirect={true}
        />
      </Root>
    </Modal>
  );

};

export default DrivingDirections;
