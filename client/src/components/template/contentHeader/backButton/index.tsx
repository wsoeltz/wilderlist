import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import useMapContext from '../../../../hooks/useMapContext';
import {Routes} from '../../../../routing/routes';
import {
  GhostButton,
} from '../../../../styling/styleUtils';
import {mobileSize} from '../../../../Utils';

const Button = styled(GhostButton)`
  text-align: center;
  font-size: 1.3rem;
  padding-right: 0.75rem;

  @media (max-width: ${mobileSize}px) {
    display: none;
  }
`;

const BackButton = ({clearSearch}: {clearSearch: () => void}) => {
  const { goBack, location } = useHistory();
  const mapContext = useMapContext();

  useEffect(() => {
    if (mapContext.intialized) {
      mapContext.clearMap();
    }
  }, [mapContext, location]);

  useEffect(() => {
    if (location.pathname === Routes.Landing) {
      clearSearch();
    }
  }, [location.pathname, clearSearch]);

  if (location.pathname === Routes.Landing) {
    return null;
  }

  const onClick = () => {
    goBack();
  };

  return (
    <Button onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Button>
  );
};

export default BackButton;
