import 'cross-fetch/polyfill';
import debounce from 'lodash/debounce';
import 'normalize.css';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import Helmet from 'react-helmet';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import styled from 'styled-components/macro';
import {useQueryLoggedInUser, UserContext} from '../contextProviders/userContext';
import { defaultOgImageUrl } from '../routing/routes';
import '../styling/fonts/fonts.css';
import GlobalStyles from '../styling/GlobalStyles';
import { Root } from '../styling/Grid';
import { overlayPortalContainerId } from '../Utils';
import GlobalMap from './template/globalMap';
import MainContent from './template/MainContent';
import Header from './template/navigation/Header';

if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID, {debug: false});
}

const overlayPortalZIndex = 3000;

const OverlayPortal = styled.div`
  position: relative;
  z-index: ${overlayPortalZIndex};
`;

export interface IAppContext {
  windowWidth: number;
}

export const AppContext = React.createContext<IAppContext>({
  windowWidth: window.innerWidth,
});

const App: React.FC = () => {
  const user = useQueryLoggedInUser();

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const appContext = {windowWidth};

  useEffect(() => {
    const updateWindowWidth = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 500);
    window.addEventListener('resize', updateWindowWidth);
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  return (
    <UserContext.Provider value={user}>
      <AppContext.Provider value={appContext}>
          <Helmet>
            {/* Set default meta data values */}
            <title>{'Wilderlist'}</title>
            <meta
              name='description'
              content='Track, plan and share your hiking and mountaineering adventures.'
            />
            <meta property='og:title' content='Wilderlist' />
            <meta
              property='og:description'
              content='Track, plan and share your hiking and mountaineering adventures.'
            />
            <meta property='og:image' content={defaultOgImageUrl} />
            <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + window.location.pathname} />
          </Helmet>
          <GlobalStyles />
          <Router>
            <Root>
              <GlobalMap>
                <Header />
                <MainContent />
                <OverlayPortal id={overlayPortalContainerId} />
              </GlobalMap>
            </Root>
          </Router>
      </AppContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
