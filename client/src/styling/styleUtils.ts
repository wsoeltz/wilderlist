import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken } from 'polished';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import { PeakListVariants } from '../types/graphQLTypes';
import { mediumSize, mobileSize } from '../Utils';

export const primaryFont = '"Source Sans Pro", sans-serif';
export const secondaryFont = 'DeliciousWeb, sans-serif';

export const baseColor = '#333333'; // dark gray/black color for text
export const lightBaseColor = '#7c7c7c'; // light gray color for subtitles and contextual information
export const placeholderColor = '#a7a7a7'; // light gray color for placeholder text
export const lightBorderColor = '#dcdcdc'; // really light gray color for subtle borders between elements

export const primaryColor = '#206ca6'; // primary blue color for buttons and other highlighted elements
export const secondaryColor = '#696969'; // gray color for use with buttons or other clickable items
export const primaryHoverColor = '#0580ca'; // hover variant of primaryColor
export const secondaryHoverColor = '#908d8d'; // hover variant of secondaryColor

export const tertiaryColor = '#f3f3f3'; // really light gray color for use as a hover background color on cards
export const offWhite = '#fdfdfd';

export const linkColor = primaryColor; // greenish blue color for use with links
export const linkHoverColor = primaryHoverColor; // hover color for links, light green
export const warningColor = '#b9161a'; // bright red for warning buttons
export const warningHoverColor = '#db363a'; // bright red for warning buttons
export const lowWarningColorLight = '#f2e4b3';
export const lowWarningColor = '#d6aa0a';
export const lowWarningColorHover = '#ebc12a';
export const lowWarningColorDark = '#8a7e54';
export const lowWarningColorTextOverlay = '#312c1a';

export const successColor = '#658238';
export const successColorLight = '#d0e3b1';

export const coolBlueColor = '#3a29c3';
export const warmRedColor = '#d92a21';

export const lightBlue = '#f2f7fb';

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

export const incompleteColor = '#d94728';
export const completeColor = '#145500';

export const completionColorScaleArray = [
  incompleteColor,
  '#d17728',
  '#cd932b',
  '#c99e2c',
  '#c7ab2d',
  '#c4b52f',
  '#b4bf35',
  '#99ba3c',
  '#89b13f',
  '#7caa41',
  '#619a41',
  '#4b8a3f',
  '#145500',
];
export const completionColorScale = {
  0: completionColorScaleArray[0],
  8: completionColorScaleArray[1],
  17: completionColorScaleArray[2],
  25: completionColorScaleArray[3],
  33: completionColorScaleArray[4],
  42: completionColorScaleArray[5],
  50: completionColorScaleArray[6],
  58: completionColorScaleArray[7],
  67: completionColorScaleArray[8],
  75: completionColorScaleArray[9],
  83: completionColorScaleArray[10],
  92: completionColorScaleArray[11],
  100: completionColorScaleArray[12],
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
    console.error(variant, 'Invalid variant ' + variant);
    return colorSetGray;
  }
};

export const lightFontWeight = 200;
export const regularFontWeight = 400;
export const semiBoldFontBoldWeight = 600;
export const boldFontWeight = 700;

export const SemiBold = styled.strong`
  font-weight: ${semiBoldFontBoldWeight};
`;

export const HelpUnderline = styled.u`
  text-decoration: none;
  border-bottom: dashed 1px ${lightBaseColor};
`;

export const SmallSemiBold = styled(SemiBold)`
  font-size: 0.85rem;
`;

export const SmallLink = styled(Link)`
  font-size: 0.7rem;
`;

export const SmallExternalLink = styled.a`
  font-size: 0.7rem;
`;

export const Subtext = styled.small`
color: ${lightBaseColor};
`;

export const IncompleteText = styled.span`
  color: #b21616;
`;
export const CompleteText = styled.span`
  color: ${completeColor};
`;

export const Section = styled.div`
  margin-bottom: 1rem;
`;

export const Block = styled.div`
  margin: 2rem 0;
`;

export const SectionTitle = styled.div`
  padding: 0.5rem 0;
  text-transform: uppercase;
  font-weight: 600;
  color: ${lightBaseColor};
`;

export const SectionTitleH3 = styled.h3`
  font-size: 1.2rem;
  text-transform: uppercase;
  color: ${lightBaseColor};
  margin: 0 0 1.2rem;
`;

export const IconTitle = styled.h1`
  display: flex;
  align-items: center;
  margin: 0 0 0.75rem;

  @media(max-width: ${mobileSize}px) {
    margin-top: 1rem;
  }
`;

export const TitleText = styled.span`
  padding-left: 1rem;
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

export const LinkButtonCompact = styled.button`
  margin: 0;
  padding: 0;
  background: transparent;
  font-size: 0.7rem;
  display: inline-flex;
  align-items: center;

  ${linkStyles}
`;

export const CardBase = styled.div`
  padding: 0.7rem;
  border: solid 1px ${lightBorderColor};
  box-shadow: 0px 0px 3px -1px #b5b5b5;
  background-color: #fff;
`;

export const Card = styled(CardBase)`
  margin-bottom: 2rem;

  &:hover {
    cursor: pointer;
    background-color: ${tertiaryColor};
  }
`;

export const CardLinkWrapper = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
  }
`;

export const StackableCardSection = styled(Card)`
  box-shadow: none;
  border-bottom: none;
  margin-bottom: 0;
`;

export const StackableCardFooter = styled(Card)`
  background-color: ${tertiaryColor};
  box-shadow: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const cardFooterLinkStyles = `
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0.25rem;

  &:not(:last-child) {
    border-right: solid 1px ${lightBorderColor};
  }
`;

interface ColorProps {
  color: string;
  $isActive: boolean;
}

export const CardFooterLink = styled(Link)<ColorProps>`
  ${cardFooterLinkStyles}
  color: ${(p) => p.$isActive ? '#fff' : p.color};
  background-color: ${(p) => p.$isActive ? p.color : 'transparent'};
  text-decoration: ${(p) => p.$isActive ? 'none' : 'underline'};

  &:hover {
    color: #fff;
    background-color: ${({color}) => color};
    text-decoration: none;
  }
`;
export const CardFooterButton = styled.button<ColorProps>`
  ${cardFooterLinkStyles}
  color: ${(p) => p.$isActive ? '#fff' : p.color};
  background-color: ${(p) => p.$isActive ? p.color : 'transparent'};
  text-decoration: ${(p) => p.$isActive ? 'none' : 'underline'};

  &:hover {
    color: #fff;
    background-color: ${({color}) => color};
    text-decoration: none;
  }
`;

export const StackedCardWrapper = styled(CardLinkWrapper)`
  box-shadow: 0px 0px 3px -1px #b5b5b5;
`;

export const CardTitle = styled.h1`
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 0.4rem;
`;

export const CardSubtitle = styled.div`
  color: ${lightBaseColor};
  font-size: 0.95rem;
  margin: 0.4rem 0;
  display: flex;
  justify-content: space-between;
`;
export const Seperator = styled.span`
  color: ${lightBaseColor};
  opacity: 0.45;
  font-weight: ${semiBoldFontBoldWeight};
  margin: 0 0.2rem;
`;

export const InlineTitle = styled.h3`
  color: ${baseColor};
  margin: 0.5rem 0;
`;

export const DetailBox = styled.div`
  border: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  padding: 1rem;
`;

export const DetailBoxWithMargin = styled(DetailBox)`
  margin-bottom: 1rem;
`;

export const DetailBoxTitle = styled(InlineTitle)`
  border: 1px solid ${lightBorderColor};
  border-bottom: none;
  background-color: #d7d7d7;
  margin: 0;
  padding: 0.5rem 1rem;
  color: ${baseColor};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;

export const DetailBoxFooter = styled.h4`
  border: 1px solid ${lightBorderColor};
  border-top: none;
  background-color: #d7d7d7;
  margin: 0;
  padding: 0.15rem 1rem;
  color: ${baseColor};
`;

export const FullWidthBreak = styled.div`
  margin: 0.5rem -1rem;
  height: 0;
  border-top: solid 1px ${lightBorderColor};
`;

export const Basket = styled.div`
  border: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const ComponentTitle = styled.h3`
  margin: 0;
  font-weight: 600;
  padding: 0 0 0.5rem;
  color: ${lightBaseColor};
  font-size: 0.8rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const BasketTitle = styled(ComponentTitle)`
  justify-content: center;
  text-align: center;
  padding: 0 0.5rem 0.5rem;
  box-sizing: border-box;
`;

export const SmallTextNote = styled.div`
  font-size: 0.8rem;
  color: ${placeholderColor};
  text-align: center;
  font-style: italic;
  margin: 1rem 0;
  border-radius: 8px;
`;

export const SmallTextNoteWithMargin = styled(SmallTextNote)`
  margin-bottom: 1rem;
`;

export const borderRadius = 6; // in px

export const ButtonBase = styled.button<{mobileExtend?: boolean}>`
  padding: 0.4rem;
  color: #fff;
  text-align: center;
  border-radius: ${borderRadius}px;
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 0.8rem;
  letter-spacing: 0.01rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: ${mobileSize}px) {
    font-size: 0.9rem;
  }

  ${({mobileExtend}) => mobileExtend ? `
    @media (max-width: 600px) {
      width: 100%;
      padding: 0.9rem;
      font-size: 1rem;
      border-radius: 0;
      white-space: nowrap;
    }
  ` : ''}
`;

export const ExpandedButtonBase = styled.button`
  color: #fff;
  text-align: center;
  font-weight: ${semiBoldFontBoldWeight};
  letter-spacing: 0.01rem;
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  border-radius: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;

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

export const ExpandedButtonPrimary = styled(ExpandedButtonBase)`
  background-color: ${primaryColor};

  &:hover {
    background-color: ${primaryHoverColor};
  }
`;

export const ExpandedButtonSecondary = styled(ExpandedButtonBase)`
  background-color: ${secondaryColor};

  &:hover {
    background-color: ${secondaryHoverColor};
  }
`;

export const ExpandedButtonWarning = styled(ExpandedButtonBase)`
  background-color: ${warningColor};

  &:hover {
    background-color: ${warningHoverColor};
  }
`;

export const ButtonOutline = styled(ButtonBase)`
  background-color: #fff;
  color: ${baseColor};
  border: solid 1px ${lightBorderColor};

  &:hover {
    background-color: ${tertiaryColor};
  }
`;

export const CompactButtonPrimary = styled(ButtonPrimary)`
  font-size: 0.7rem;
  padding: 0.35rem;
`;
export const CompactButtonSecondary = styled(ButtonSecondary)`
  font-size: 0.7rem;
  padding: 0.35rem;
`;

export const ButtonTertiary = styled(ButtonBase)`
  color: ${secondaryColor};
  background-color: ${tertiaryColor};
  border: solid 1px ${lightBorderColor};


  &:hover {
    background-color: ${lightBorderColor};
  }
`;

export const ButtonWarning = styled(ButtonBase)`
  background-color: ${warningColor};

  &:hover {
    background-color: ${warningHoverColor};
  }
`;

export const ButtonWarningLow = styled(ButtonBase)`
  background-color: ${lowWarningColor};
  color: ${lowWarningColorTextOverlay};

  &:hover {
    background-color: ${lowWarningColorHover};
  }
`;

export const ButtonPrimaryLink = styled(Link)`
  padding: 0.6rem;
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

export const CompactButtonPrimaryLink = styled(Link)`
  color: #fff;
  text-align: center;
  border-radius: ${borderRadius}px;
  font-weight: ${semiBoldFontBoldWeight};
  background-color: ${primaryColor};
  display: inline-block;
  text-decoration: none;
  font-size: 0.7rem;
  padding: 0.4rem;
  line-height: 1.3;

  &:hover {
    color: #fff;
    background-color: ${primaryHoverColor};
  }
`;

export const GhostButtonLink = styled(Link)`
  padding: 0.6rem;
  color: ${secondaryColor};
  text-align: center;
  border-radius: ${borderRadius}px;
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 0.8rem;
  background-color: transparent;
  display: inline-block;
  text-decoration: none;

  &:hover {
    color: ${secondaryHoverColor};
  }
`;

export const GhostButton = styled(ButtonBase)`
  color: ${secondaryColor};
  background-color: transparent;

  &:hover {
    color: ${secondaryHoverColor};
  }
`;

export const CompactGhostButton = styled(GhostButton)`
  font-size: 0.7rem;
  padding: 0.35rem;
`;
export const CompactGhostButtonLink = styled(GhostButtonLink)`
  font-size: 0.7rem;
  padding: 0.35rem;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  bottom: -1rem;
  margin: 0 -1rem -1rem;
  margin-top: auto;
  background-color: ${tertiaryColor};
  border-top: solid 1px ${lightBorderColor};
  padding: 0.7rem 1rem;
  box-shadow: 0px 0px 3px -1px #b5b5b5;

  @media(max-width: ${mobileSize}px) {
    position: fixed;
    bottom: 1.4rem;
    border-bottom: solid 1px ${lightBorderColor};
    margin-bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    align-items: stretch;
    z-index: 500;
    padding: 1rem 2rem;
    box-sizing: border-box;
  }
`;

export const CancelButton = styled(GhostButton)`
  margin-right: auto;
`;

export const FloatingButtonContainer = styled.div`
  position: sticky;
  z-index: 90;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

export const FloatingButton = styled(ButtonPrimaryLink)`
  font-size: 1rem;
  border-radius: 15px;
  border-bottom: 3px solid ${darken(0.12, primaryColor)};
  border-right: 3px solid ${darken(0.12, primaryColor)};
  box-shadow: 0px 2px 4px 0px #737373;
  pointer-events: auto;
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

export const InputBaseCompact = styled(InputBase)`
  font-size: 0.9rem;
  padding: 4px 8px;
`;

export const TextareaBase = styled.textarea`
  padding: 8px;
  box-sizing: border-box;
  border: solid 1px ${lightBorderColor};
  font-size: 1rem;
  line-height: 1.25;
  font-weight: ${lightFontWeight};
  width: 100%;
  resize: vertical;

  &::placeholder {
    color: ${placeholderColor};
  }
`;

export const TextareaBaseCompact = styled(TextareaBase)`
  font-size: 0.9rem;
  padding: 4px 8px;
`;

export const Label = styled.span`
  text-transform: uppercase;
  color: ${lightBaseColor};
  font-size: 1rem;
  letter-spacing: 0.01rem;
`;

export const LabelContainer = styled.label`
  margin-bottom: 0.4rem;
  display: inline-block;
`;

export const PaginationContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
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

export const PlusIcon = styled.span`
  font-size: 1.3rem;
  height: 0;
  display: inline-block;
  line-height: 0;
  position: relative;
  top: 2px;
`;

const IconInTextBase = styled(FontAwesomeIcon)`
  position: relative;
`;

export const BasicIconInTextCompact = styled(IconInTextBase)`
  margin-right: 0.25rem;
`;
export const BasicIconInText = styled(IconInTextBase)`
  margin-right: 0.6rem;
`;
export const BasicIconAtEndOfText = styled(IconInTextBase)`
  margin-left: 0.6rem;
`;
export const BasicIconAtEndOfTextCompact = styled(IconInTextBase)`
  margin-left: 0.25rem;
`;

export const IconContainer = styled.div<{$color: string}>`
  margin-right: 0.25rem;
  margin-top: 0.1em;
  font-size: 0.85em;
  color: ${({$color}) => $color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1rem;

    .fill-path {
      fill: ${({$color}) => $color};
    }
    .stroke-path {
      fill: #fff;
    }
  }
`;

export const HighlightedIconInText = styled(IconInTextBase)`
  color: ${primaryColor};
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
  background-color: rgb(245, 245, 245);
  position: relative;
`;

export const NoResults = styled.div`
  font-style: italic;
  color: ${placeholderColor};
  text-align: center;
  margin-bottom: 1.2rem;
`;

export const CheckboxRoot = styled.div`
  display: block;
  position: relative;
`;

export const CheckboxInput = styled.input`
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  margin: auto;
`;

export const CheckboxLabel = styled.label`
  padding: 8px 8px 8px 30px;
  display: block;

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

export const CheckboxList = styled.div`
  max-height: 200px;
  margin-top: 1rem;
  overflow: auto;
  list-style: none;
  padding: 0;
  border: 1px solid ${lightBorderColor};

  @media(max-width: ${mobileSize}px) {
    max-height: initial;
  }
`;

export const CheckboxListItem = styled.label`
  display: block;
  padding: 0.5rem;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${lightBorderColor};
  }

  &:hover {
    cursor: pointer;
    background-color: ${lightBlue};
  }
`;

export const CheckboxListCheckbox = styled.input`
  margin-right: 1rem;
`;

export const RemoveIcon = styled.div`
  margin-left: auto;
`;

/* eslint-disable max-len */
/* tslint:disable:max-line-length */
export const SelectBox = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  font-size: 1rem;
  padding: 8px;
  border: solid 1px ${lightBorderColor};
  border-radius: 0;
  background-color: white;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#ffffff 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
  display: block;
  width: 100%;
  min-width: 4.25rem;

  &:hover {
    cursor: pointer;
    background-color: white;
  }
`;

export const PreFormattedParagraph = styled.p`
  margin-top: 0;
  white-space: pre-wrap;
`;

export const PreFormattedDiv = styled.div`
  margin-top: 0;
  white-space: pre-wrap;
`;

export const CollapsedParagraph = styled.p`
  margin: 0;
`;

export const ResourceList = styled.ul`
  margin: 0;
  padding-left: 0;
  list-style: none;
`;

export const SimpleListItem = styled.li`
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

export const ResourceItem = styled(SimpleListItem)`
  padding-left: 0.7rem;
  position: relative;

  &:before {
    content: '›';
    position: absolute;
    left: 0;
  }
`;

export const RequiredNote = styled.div`
  color: ${lightBaseColor};
  font-size: 0.8rem;

  span.red-text {
    color: ${warningColor};
  }
`;

export const Required = styled.span`
  color: ${warningColor};
`;

export const SvgImg = styled.img`
  height: 3rem;
  margin-right: 1rem;

  @media(max-width: ${mediumSize}px) and (min-width: ${mobileSize}px) {
    height: 2rem;
  }
`;

export const SvgSmallImg = styled.img`
  height: 2rem;
  margin-right: 1rem;
`;

export const SvgMiniImg = styled.img`
  height: 1rem;
  position: relative;
  margin-right: 0.6rem;
  top: 3px;
`;

export const SecondaryNavigationContainer = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  width: 100%;
`;
export const SecondaryNavigationButton = styled.button`
  padding: 0.75rem;
  text-align: center;
  color: ${secondaryColor};
  text-transform: uppercase;
  font-size: 0.9rem;
  background-color: #fff;
  border: solid 1px ${lightBorderColor};
  border-top: none;
`;
