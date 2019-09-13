/* tslint:disable:max-line-length */
import React from 'react';
import styled from 'styled-components';
import GlobalStyles from '../styling/GlobalStyles';

const Root = styled.div`
  margin: 0;
  padding: 2%;
  width: 100vw;
  height: 100vh;
  display: table;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  background-color: rgba(0, 0, 0, 0.04)
`;

const Text = styled.p`
  max-width: 500px;
  margin: auto;
`;

const NoApp = ({browser, version}: {browser: string, version: number}) => {
  let output: React.ReactElement<any> | null;
  if (browser === 'IE') {
    output = (
      <Text><strong>Wilderlist</strong> does not support <strong>Internet Explorer</strong>. Please use a different browser, such as <a href='microsoft-edge:http://wilderlist-dev.herokuapp.com'>Edge</a>, <a href='https://www.google.com/chrome/'>Chrome</a>, or <a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a>.</Text>
    );
  } else if (browser === 'Chrome') {
    output = (<Text><strong>Wilderlist</strong> does not support <strong>Chrome</strong> version <strong>{version}</strong>. Please upgrade your browser. You can read how to do so <a href={'https://support.google.com/chrome/answer/95414?co=GENIE.Platform%3DDesktop&hl=en'}>here</a></Text>
    );
  } else if (browser === 'Firefox') {
    output = (<Text><strong>Wilderlist</strong> does not support <strong>Firefox</strong> version <strong>{version}</strong>. Please upgrade your browser. You can read how to do so <a href={'https://support.mozilla.org/en-US/kb/update-firefox-latest-release'}>here</a></Text>
    );
  } else if (browser === 'Safari') {
    output = (<Text><strong>Wilderlist</strong> does not support <strong>Safari</strong> version <strong>{version}</strong>. Please upgrade your browser. You can read how to do so <a href={'https://support.apple.com/en-us/HT204416'}>here</a></Text>
    );
  } else if (browser === 'Edge') {
    output = (<Text><strong>Wilderlist</strong> does not support <strong>Edge</strong> version <strong>{version}</strong>. Please upgrade your browser. You can read how to do so <a href={'https://www.microsoft.com/en-us/windows/microsoft-edge'}>here</a></Text>
    );
  } else if (browser === 'Opera') {
    output = (<Text><strong>Wilderlist</strong> does not support <strong>Opera</strong> version <strong>{version}</strong>. Please upgrade your browser. You can read how to do so <a href={'https://help.opera.com/en/opera-tutorials/how-do-i-update-my-opera-browser/'}>here</a></Text>
    );
  } else {
    output = (<Text><strong>Wilderlist</strong> does not support <strong>{browser}</strong>. Please use a different browser, such as <a href='https://www.google.com/chrome/'>Chrome</a> or <a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a>.</Text>
    );
  }
  return (
    <>
      <GlobalStyles />
      <Root>
        <Container>
          <h1>
            Unsupported Browser
          </h1>
          {output}
        </Container>
      </Root>
    </>
  );
};

export default NoApp;
