import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {mobileSize} from '../Utils';
import useWindowWidth from './useWindowWidth';

const useScrollToTopOnRender = (node: HTMLElement | null) => {
  const windowWidth = useWindowWidth();
  const {pathname} = useLocation();

  useEffect(() => {
    if (node && windowWidth > mobileSize) {
      node.scrollTop = 0;
    }
  }, [node, pathname, windowWidth]);
};

export default useScrollToTopOnRender;
