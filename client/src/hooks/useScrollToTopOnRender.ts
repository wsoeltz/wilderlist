import {useContext, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {AppContext} from '../components/App';
import {mobileSize} from '../Utils';

const useScrollToTopOnRender = (node: HTMLElement | null) => {
  const {windowWidth} = useContext(AppContext);
  const {pathname} = useLocation();

  useEffect(() => {
    if (node && windowWidth > mobileSize) {
      node.scrollTop = 0;
    }
  }, [node, pathname, windowWidth]);
};

export default useScrollToTopOnRender;
