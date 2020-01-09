import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import {
  faCalendarAlt,
  faCaretDown,
  faCaretUp,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faFileCsv,
  faList,
  faMapMarkerAlt,
  faSearch,
  faSort,
  faSortDown,
  faSortUp,
  faThList,
} from '@fortawesome/free-solid-svg-icons';
import { createGlobalStyle } from 'styled-components/macro';
import {
  baseColor,
  lightBaseColor,
  linkStyles,
  semiBoldFontBoldWeight,
} from './styleUtils';

// Add all font awesome icons here
library.add(
  faCaretDown, faCaretUp, faSearch, faCalendarAlt,
  faCheck, faEnvelope, faChevronLeft, faChevronRight,
  faList, faThList, faMapMarkerAlt, faSort, faSortDown,
  faSortUp, faFileCsv, faGoogle, faReddit,
);

const GlobalStyles = createGlobalStyle`

  @media(max-width: 600px) {
    html {
      font-size: 14px;
    }
  }
  @media(max-width: 450px) {
    html {
      font-size: 12px;
    }
  }

  body {
    font-family: RobotoWeb;
    color: ${baseColor};
  }

  h1 {
    font-weight: ${semiBoldFontBoldWeight};
    font-size: 1.7rem;
  }

  a {
    ${linkStyles}
  }

  h3 {
    font-weight: ${semiBoldFontBoldWeight};
    font-size: 1.1rem;
    color: ${lightBaseColor};
  }

  p {
    line-height: 1.4;
  }

  button {
    cursor: pointer;
    border: none;
    width: auto;
    text-align: inherit;
    overflow: visible;

    /* Normalize 'line-height'. Cannot be changed from 'normal' in Firefox 4+. */
    line-height: normal;

    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    /* Corrects inability to style clickable 'input' types in iOS */
    -webkit-appearance: none;

    /* Remove excess padding and border in Firefox 4+ */
    &::-moz-focus-inner {
        border: 0;
        padding: 0;
    }

  }
`;

export default GlobalStyles;
