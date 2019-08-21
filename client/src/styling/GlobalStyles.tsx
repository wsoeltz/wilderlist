import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCaretUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { createGlobalStyle } from 'styled-components';
import { linkStyles } from './styleUtils';

// Add all font awesome icons here
library.add(faCaretDown, faCaretUp, faSearch);

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
