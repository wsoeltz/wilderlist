import styled from 'styled-components';

export const baseColor = '#333333'; // dark gray/black color for text
export const lightBaseColor = '#7c7c7c'; // light gray color for subtitles and contextual information
export const lightBorderColor = '#dcdcdc'; // really light gray color for subtle borders between elements

export const primaryColor = '#668434'; // primary green color for buttons and other highlighted elements
export const secondaryColor = '#696969'; // gray color for use with buttons or other clickable items
export const primaryHoverColor = '#668434'; // hover variant of primaryColor
export const secondaryHoverColor = '#696969'; // hover variant of secondaryColor

export const tertiaryColor = '#f3f3f3'; // really light gray color for use as a hover background color on cards

export const linkColor = '#2b5b37'; // greenish blue color for use with links
export const linkHoverColor = '#3dad15'; // hover color for links, light green
export const warningColor = '#b9161a'; // bright red for warning buttons

interface ColorSet {
  primary: string;
  secondary: string;
  tertiary: string;
}

export const colorSetGreen: ColorSet = {
  primary: '#405229',
  secondary: '#5a7936',
  tertiary: '#648561',
};

export const colorSetBlue: ColorSet = {
  primary: '#626b7d',
  secondary: '#c3c0c5',
  tertiary: '#6fa1d0',
};

export const colorSetOrange: ColorSet = {
  primary: '#714c45',
  secondary: '#93635b',
  tertiary: '#bd9a70',
};

export const colorSetBlack: ColorSet = {
  primary: '#151318',
  secondary: '#89897f',
  tertiary: '#b3b8bb',
};

export const colorSetGray: ColorSet = {
  primary: '#c4c4c4',
  secondary: '#cecece',
  tertiary: '#dddddd',
};

export const primaryFont = `
  font-family: 'RobotoWeb';
`;

export const lightFontWeight = 200;
export const regularFontWeight = 400;
export const semiBoldFontBoldWeight = 600;
export const boldFontWeight = 700;

export const standardContainerPadding = '1rem';

export const svgTitleFont = `
  font-family: 'DelicousWeb';
  font-weight: 700;
`;

export const linkStyles = `
  color: ${linkColor};
  font-weight: initial;
  text-decoration: underline;

  &:hover {
    color: ${linkHoverColor};
  }
`;

export const LinkButton = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  text-align: inherit;
  background: transparent;

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

  ${linkStyles}
`;
