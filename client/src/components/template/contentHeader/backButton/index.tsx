import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useCallback, useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import useMapContext from '../../../../hooks/useMapContext';
import usePrevious from '../../../../hooks/usePrevious';
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

const MobileButton = styled(GhostButton)`
  text-align: center;
  font-size: 1.3rem;
  padding-right: 0.75rem;
`;

interface Props {
  mobileButton?: boolean;
  clearSearch?: () => void;
}

const BackButton = ({clearSearch, mobileButton}: Props) => {
  const { goBack, location, push } = useHistory();
  const [firstRender, updateFirstRender] = useState<boolean>(true);
  const mapContext = useMapContext();

  const prevLocation = usePrevious(location.pathname);

  useEffect(() => {
    if (prevLocation !== undefined && location.pathname !== prevLocation
        && mapContext.intialized) {
      mapContext.clearMap();
    }
  }, [mapContext, location.pathname, prevLocation]);

  useEffect(() => {
    if (location.pathname === Routes.Landing && clearSearch) {
      clearSearch();
    }
  }, [location.pathname, clearSearch]);

  useEffect(() => {
    if (prevLocation !== undefined && prevLocation !== location.pathname && firstRender) {
      updateFirstRender(false);
    }
  }, [prevLocation, location.pathname, firstRender]);

  const onClick = useCallback(() => {
    if (firstRender && !mobileButton) {
      push(Routes.Landing);
    } else {
      if (mobileButton && !document.referrer || document.referrer.includes('wilderlist') || document.referrer.includes('localhost')) {
        goBack();
      } else {
        push(Routes.Landing);
      }
    }
  }, [goBack, push, firstRender, mobileButton]);

  if (location.pathname === Routes.Landing) {
    return null;
  }

  const Root = mobileButton ? MobileButton : Button;

  return (
    <Root onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Root>
  );
};

export default BackButton;
