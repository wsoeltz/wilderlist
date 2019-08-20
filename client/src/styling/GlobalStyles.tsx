import { createGlobalStyle } from 'styled-components';
import { linkStyles } from './styleUtils';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: RobotoWeb;
  }

  a {
    ${linkStyles}
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyles;
