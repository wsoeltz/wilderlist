import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebook,
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import {
  faAddressBook,
  faAlignLeft,
  faArrowRight,
  faAt,
  faCalendarAlt,
  faCar,
  faCaretDown,
  faCaretUp,
  faChartArea,
  faChartLine,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faClone,
  faCloudSun,
  faCompass,
  faCrow,
  faDownload,
  faEdit,
  faEnvelope,
  faExclamationTriangle,
  faFileCsv,
  faFileExcel,
  faFileImport,
  faFlag,
  faHiking,
  faHome,
  faLeaf,
  faLink,
  faList,
  faLongArrowAltDown,
  faMapMarkedAlt,
  faMapMarkerAlt,
  faMapSigns,
  faMountain,
  faPhone,
  faSearch,
  faSnowflake,
  faSort,
  faSortDown,
  faSortUp,
  faSync,
  faTh,
  faThList,
  faTrash,
  faTrophy,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import {rgba} from 'polished';
import { createGlobalStyle } from 'styled-components/macro';
import {
  baseColor,
  lightBaseColor,
  linkStyles,
  primaryFont,
  semiBoldFontBoldWeight,
  tertiaryColor,
} from './styleUtils';

// Add all font awesome icons here
library.add(
  faCaretDown, faCaretUp, faSearch, faCalendarAlt,
  faCheck, faEnvelope, faChevronLeft, faChevronRight,
  faList, faThList, faMapMarkerAlt, faSort, faSortDown,
  faSortUp, faFileCsv,
  faGoogle as IconDefinition, faReddit as IconDefinition, faFacebook as IconDefinition,
  faFileExcel, faMapSigns, faMountain, faHiking,
  faUserFriends, faHome, faChartLine, faTrash, faClone,
  faFlag, faSync, faLongArrowAltDown, faCar, faChartArea,
  faCloudSun, faEdit, faFileImport, faDownload, faAlignLeft,
  faAddressBook, faAt, faPhone, faLink, faTrophy, faCompass,
  faLeaf, faSnowflake, faTh, faMapMarkedAlt, faCrow,
  faArrowRight, faExclamationTriangle,
);

export const mapboxHoverPopupClassName = 'mapbox-gl-hovered-popup-container';

const GlobalStyles = createGlobalStyle`

  @media (max-width: 900px), (max-height: 700px) {
    html {
      font-size: 15px;
    }
  }
  @media (max-width: 450px), (max-height: 600px) {
    html {
      font-size: 14px;
    }
  }

  body {
    font-family: ${primaryFont};
    color: ${baseColor};
  }

  h1 {
    font-weight: ${semiBoldFontBoldWeight};
   margin-bottom: 0.5rem;
    margin-top: 0;
    font-size: 1.25rem;
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

  /********
      MAPBOX CUSTOM STYLES
  ********/
  .mapboxgl-popup {
    .mapboxgl-popup-content {
      padding: 0;
      font-family: ${primaryFont};
      border-radius: 8px;
      overflow: hidden;
    }

    .mapboxgl-popup-close-button {
      outline: none;
    }

    .mapboxgl-popup-tip {
      border-top-color: ${tertiaryColor};
      border-bottom-color: ${tertiaryColor};
    }

    &.${mapboxHoverPopupClassName} {
      background-color: transparent;
      backdrop-filter: blur(1px);

      .mapboxgl-popup-content {
        background-color: ${rgba(tertiaryColor, 0.75)};
      }
      .mapboxgl-popup-tip {
        opacity: 0.95;
        position: absolute;
        bottom: 0;
        transform: translate(0, 100%);
      }
    }
  }

  .mapboxgl-ctrl.mapboxgl-ctrl-attrib {
    background-color: transparent;
  }
  .mapboxgl-ctrl-attrib-inner {
    font-family: ${primaryFont};
    max-width: 50vw;
    white-space: nowrap;
    text-align: right;
    font-size: 0.8rem;
    text-shadow:
       1px 1px 0 #fff,
     -1px -1px 0 #fff,
      1px -1px 0 #fff,
      -1px 1px 0 #fff,
       1px 1px 0 #fff;
  }

  /**********
      REACT-FAST-CHARTS CUSTOM STYLES
  **********/
  .react-fast-chart-tooltip {
    font-size: 0.875rem;
    .label-text {
      color: ${lightBaseColor};
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 600;
    }
    .value-text {
      font-weight: 800;
    }
  }
`;

export default GlobalStyles;
