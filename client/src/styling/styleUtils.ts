import styled from 'styled-components';
import { PeakListVariants } from '../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../Utils';

export const baseColor = '#333333'; // dark gray/black color for text
export const lightBaseColor = '#7c7c7c'; // light gray color for subtitles and contextual information
export const placeholderColor = '#a7a7a7'; // light gray color for placeholder text
export const lightBorderColor = '#dcdcdc'; // really light gray color for subtle borders between elements

export const primaryColor = '#668434'; // primary green color for buttons and other highlighted elements
export const secondaryColor = '#696969'; // gray color for use with buttons or other clickable items
export const primaryHoverColor = '#86a651'; // hover variant of primaryColor
export const secondaryHoverColor = '#908d8d'; // hover variant of secondaryColor

export const tertiaryColor = '#f3f3f3'; // really light gray color for use as a hover background color on cards

export const linkColor = '#2b5b37'; // greenish blue color for use with links
export const linkHoverColor = '#3dad15'; // hover color for links, light green
export const warningColor = '#b9161a'; // bright red for warning buttons

export interface ColorSet {
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

export const getColorSetFromVariant = (variant: PeakListVariants) => {
  if (variant === PeakListVariants.standard) {
    return colorSetGreen;
  } else if (variant === PeakListVariants.winter) {
    return colorSetBlue;
  } else if (variant === PeakListVariants.fourSeason) {
    return colorSetOrange;
  } else if (variant === PeakListVariants.grid) {
    return colorSetBlack;
  } else {
    failIfValidOrNonExhaustive(variant, 'Invalid variant ' + variant);
    return colorSetGray;
  }
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
  margin: 0;
  padding: 0;
  background: transparent;

  ${linkStyles}
`;

export const Card = styled.div`
  padding: 0.7rem;
  border: solid 1px ${lightBorderColor};
  box-shadow: 0px 0px 3px -1px #b5b5b5;
  margin-bottom: 2rem;

  &:hover {
    cursor: pointer;
    background-color: ${tertiaryColor};
  }
`;

export const borderRadius = 6; // in px

const ButtonBase = styled.button`
  padding: 0.6rem;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
  border-radius: ${borderRadius}px;
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 0.95rem;
`;

export const ButtonPrimary = styled(ButtonBase)`
  background-color: ${primaryColor};

  &:hover {
    background-color: ${primaryHoverColor};
  }
`;

export const ButtonSecondary = styled(ButtonBase)`
  background-color: ${secondaryColor};

  &:hover {
    background-color: ${secondaryHoverColor};
  }
`;

export const InputBase = styled.input`
  padding: 8px;
  box-sizing: border-box;
  border: solid 1px ${lightBorderColor};
  font-size: 1rem;
  font-weight: ${lightFontWeight};
  width: 100%;

  &::placeholder {
    color: ${placeholderColor};
  }
`;

export const Label = styled.span`
  text-transform: uppercase;
  color: ${lightBaseColor};
  font-size: 1rem;
  letter-spacing: 0.01rem;
`;
