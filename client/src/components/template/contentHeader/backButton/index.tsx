import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  GhostButton,
} from '../../../../styling/styleUtils';
import {Routes} from '../../../../routing/routes';
import {mobileSize} from '../../../../Utils';
import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';


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

  useEffect(() => {
    if (location.pathname === Routes.Landing) {
      clearSearch();
    }
  }, [location.pathname, clearSearch])

  if (location.pathname === Routes.Landing) {
    return null;
  }

  const onClick = () => {
    goBack();
  }

  return (
    <Button onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Button>
  );
};

export default BackButton;
