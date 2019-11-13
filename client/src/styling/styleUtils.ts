import styled from 'styled-components';
import DynamicLink from '../components/sharedComponents/DynamicLink';
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
export const warningHoverColor = '#db363a'; // bright red for warning buttons
export const lowWarningColorLight = '#f2e4b3';
export const lowWarningColor = '#d6aa0a';

export const successColor = '#658238';
export const successColorLight = '#d0e3b1';

export const coolBlueColor = '#3a29c3';
export const warmRedColor = '#d92a21';

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

export const SemiBold = styled.strong`
  font-weight: ${semiBoldFontBoldWeight};
`;

export const standardContainerPadding = '1rem';

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

export const CardLinkWrapper = styled(DynamicLink)`
  display: block;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
  }
`;

export const CardTitle = styled.h1`
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0.4rem;
`;

export const CardSubtitle = styled.div`
  color: ${lightBaseColor};
  margin: 0.4rem 0;
  display: flex;
  justify-content: space-between;
  font-weight: ${semiBoldFontBoldWeight};
`;

export const borderRadius = 6; // in px

const ButtonBase = styled.button`
  padding: 0.4rem;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
  border-radius: ${borderRadius}px;
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 0.8rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
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

export const ButtonWarning = styled(ButtonBase)`
  background-color: ${warningColor};

  &:hover {
    background-color: ${warningHoverColor};
  }
`;

export const ButtonPrimaryLink = styled(DynamicLink)`
  padding: 0.6rem;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
  border-radius: ${borderRadius}px;
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 0.8rem;
  background-color: ${primaryColor};
  display: inline-block;
  text-decoration: none;

  &:hover {
    color: #fff;
    background-color: ${primaryHoverColor};
  }
`;

export const GhostButton = styled(ButtonBase)`
  color: ${secondaryColor};
  background-color: transparent;

  &:hover {
    color: ${secondaryHoverColor};
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

export const PaginationContainer = styled.div`
  display: flex;
`;

export const Next = styled(ButtonSecondary)`
  margin-left: auto;

  &:after {
    content: '›';
    font-size: 1.5rem;
    position: relative;
    line-height: 0;
    top: 0.1rem;
    margin-left: 0.4rem;
  }
`;
export const Prev = styled(ButtonSecondary)`
  margin-right: auto;

  &:before {
    content: '‹';
    font-size: 1.5rem;
    position: relative;
    line-height: 0;
    top: 0.1rem;
    margin-right: 0.4rem;
  }
`;

export const PlaceholderText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-style: italic;
  color: ${placeholderColor};
  background-color: rgba(0, 0, 0, 0.04);
`;

export const NoResults = styled.div`
  font-style: italic;
  color: ${placeholderColor};
  text-align: center;
`;
