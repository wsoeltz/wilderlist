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
import { createGlobalStyle } from 'styled-components/macro';
import {
  baseColor,
  lightBaseColor,
  lightBorderColor,
  linkStyles,
  primaryColor,
  primaryFont,
  primaryHoverColor,
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

const GlobalStyles = createGlobalStyle`

  @media(max-width: 900px) {
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
    font-family: ${primaryFont};
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

  /********
      MAPBOX CUSTOM STYLES
  ********/
  .mapboxgl-popup {
    .mapboxgl-popup-content {
      padding: 0;
      font-family: ${primaryFont};
      border-radius: 8px;
      overflow: hidden;

      .popup-title {
        padding: 0.8rem 1rem 0.7rem;
        display: grid;
        grid-template-columns: 1.5rem 1fr;
        background-color: ${tertiaryColor};
        border-bottom: solid 1px ${lightBorderColor};
        font-size: 1rem;

        button {
          border: none;
          background-color: transparent;
          font-family: ${primaryFont};
          color: ${primaryColor};
          text-decoration: underline;
          padding: 0;

          &:focus {
            outline: none;
          }

          &:hover {
            color: ${primaryHoverColor};
          }

        }
        div {
          display: flex;
          flex-direction: column;
        }
      }
    }

    &.mapbox-gl-popup-compact {
      .popup-title {
        border-bottom: none;
      }
      .mapboxgl-popup-close-button {
        display: none;
      }
      .mapboxgl-popup-tip {
        border-top-color: ${tertiaryColor};
      }
    }
  }
`;

export default GlobalStyles;
