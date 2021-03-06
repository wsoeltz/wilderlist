import {faArrowRight, faCloudSun} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../../hooks/useFluent';
import {
  lightBorderColor,
  primaryColor,
  primaryHoverColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {Coordinate} from '../../../../../types/graphQLTypes';
import WeatherModal from '../../../../sharedComponents/detailComponents/weather/WeatherModal';
import {
  Icon,
} from './Utils';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${tertiaryColor};
  border-top: solid 1px ${lightBorderColor};
  font-size: 0.85rem;
  align-items: center;
  width: 100%;
`;

const Button = styled.button`
  font-size: 0.7rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    border-right: solid 1px ${lightBorderColor};
  }

  &:hover {
    background-color: ${lightBorderColor};
  }
`;

const DetailButton = styled(Button)`
  background-color: ${primaryColor};
  justify-content: flex-end;
  color: #fff;

  &:hover {
    background-color: ${primaryHoverColor};
  }
`;

const DetailText = styled.span`
  margin-left: auto;
`;

const BlueIcon = styled(Icon)`
  color: ${primaryColor};
`;

const WhiteIcon = styled(Icon)`
  color: #fff;
  margin-left: auto;
  margin-right: 0;
`;

interface Props {
  detailAction: () => void;
  location: Coordinate;
}

const ActionButtons = (props: Props) => {
  const {
    detailAction, location,
  } = props;
  const getString = useFluent();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const weather = modalOpen ? (
    <WeatherModal
      onClose={closeModal}
      latitude={location[1]}
      longitude={location[0]}
    />
  ) : null;
  return (
    <Root>
      <Button
        onClick={openModal}
      >
      <BlueIcon icon={faCloudSun} />
        {getString('mountain-detail-get-weather')}
      </Button>
      <DetailButton onClick={detailAction}>
        <DetailText>
          {getString('mountain-card-view-details')}
        </DetailText>
        <WhiteIcon icon={faArrowRight} />
      </DetailButton>
      {weather}
    </Root>
  );

};

export default ActionButtons;
