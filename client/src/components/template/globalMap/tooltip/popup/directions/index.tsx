import {faCar} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useDirectionsOrigin from '../../../../../../hooks/directions/useDirectionsOrigin';
import useFluent from '../../../../../../hooks/useFluent';
import {
  ButtonSecondary,
  LinkButton,
} from '../../../../../../styling/styleUtils';
import {Coordinate} from '../../../../../../types/graphQLTypes';
import {CoreItems} from '../../../../../../types/itemTypes';
import SetOrigin from '../../../../../sharedComponents/detailComponents/directions/SetOrigin';
import Modal from '../../../../../sharedComponents/Modal';
import SimpleTextLoading from '../../../../../sharedComponents/SimpleTextLoading';
import {
  Icon,
  Root as RootBase,
} from '../Utils';
import DirectionsText from './DirectionsText';

const ButtonWrapper = styled.div`
  text-align: right;
`;

const Root = styled(RootBase)`
  min-height: 1.5625rem;
`;

interface Props {
  destination: Coordinate;
  itemType: CoreItems;
}

const DrivingDirections = (props: Props) => {
  const {destination, itemType} = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const {location, updateLocation, getUsersLocation} = useDirectionsOrigin();
  const getString = useFluent();

  let output: React.ReactElement<any> | null;
  if (location.loading) {
    output = <SimpleTextLoading />;
  } else if (location.data) {
    const clearAndOpenOriginModal = () => {
      updateLocation(null);
      setModalOpen(true);
    };
    output = (
      <DirectionsText
        destination={destination}
        origin={location.data}
        considerDirect={itemType === CoreItems.campsites}
        changeOrigin={clearAndOpenOriginModal}
      />
    );
  } else {
    const onClose = () => setModalOpen(false);

    const actions = (
      <ButtonWrapper>
        <ButtonSecondary onClick={onClose} mobileExtend={true}>
          {getString('global-text-value-modal-close')}
        </ButtonSecondary>
      </ButtonWrapper>
    );

    const setOriginModal = modalOpen ? (
      <Modal
        onClose={onClose}
        width={'500px'}
        height={'auto'}
        actions={actions}
        contentStyles={{padding: 0, marginBottom: '-1rem', overflow: 'visible'}}
      >
        <SetOrigin
          error={location.error}
          updateLocation={updateLocation}
          getUsersLocation={getUsersLocation}
        />
        <div style={{width: 500}} />
      </Modal>
    ) : null;
    output = (
      <>
        <LinkButton
          onClick={() => setModalOpen(true)}

        >
          {getString('map-get-directions')}
        </LinkButton>
        {setOriginModal}
      </>
    );
  }

  return (
    <>
      <Root>
        <Icon icon={faCar} />
        {output}
      </Root>
    </>
  );
};

export default DrivingDirections;
