import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import debounce from 'lodash/debounce';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {primaryColor} from '../../../styling/styleUtils';

const removedScrollIconClassName = 'scroll-down-icon-scrolled-past-mid';

const Root = styled.button`
  position: fixed;
  bottom: 4.5rem;
  left: 0;
  right: 0;
  z-index: 1000;
  margin: 0 auto 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1000px;
  background-color: ${primaryColor};
  color: #fff;
  box-shadow: 0px 0px 5px 0px #525252;
  pointer-events: all;
  transition: opacity 0.1s ease-in-out;

  &.${removedScrollIconClassName} {
    opacity: 0;
    pointer-events: none;
  }
`;

interface Props {
  windowHeight: number;
}

const ScrollDownIcon = ({windowHeight}: Props) => {
  const user = useCurrentUser();
  const [scrollButtonVisible, setScrollButtonVisible] = useState<boolean>(true);

  useEffect(() => {
    const windowScrollFn = debounce(() => {
      const pageScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (pageScroll > windowHeight * 0.4) {
        setScrollButtonVisible(false);
        document.removeEventListener('scroll', windowScrollFn);
      }
    }, 250);
    document.addEventListener('scroll', windowScrollFn);
    return () => document.removeEventListener('scroll', windowScrollFn);
  }, [windowHeight]);

  const onScrollButtonClick = () => {
    window.scrollTo({
      top: windowHeight * 0.5,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Root
      style={user ? undefined : {bottom: '1.5rem'}}
      onClick={onScrollButtonClick}
      className={scrollButtonVisible ? undefined : removedScrollIconClassName}
    >
     <FontAwesomeIcon icon={faAngleDoubleDown} />
    </Root>
  );
};

export default ScrollDownIcon;
