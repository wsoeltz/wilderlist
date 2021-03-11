import {Link} from 'react-router-dom';
import styled, {css} from 'styled-components/macro';
import {
  baseColor,
  lightBorderColor,
  primaryColor,
  tertiaryColor,
} from '../../../../styling/styleUtils';
import {mobileSize} from '../../../../Utils';

const linkStyles = css`
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0.35rem 0.5rem 0.55rem;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  position: relative;
  outline: none;

  &:hover {
    background-color: ${tertiaryColor};
  }

  @media (max-width: ${mobileSize}px) {
    margin-bottom: 0;
    height: 100%;
    width: auto;
    box-shadow: none;
    flex-grow: 1;
    border-radius: 0;
  }
`;

export const FloatingButton = styled.button`
  ${linkStyles}
`;

export const ToggleButton = styled(FloatingButton)<{$open: boolean}>`
  &:hover {
    ${({$open}) => $open ? 'background-color: #fff;' : ''}
  }

  @media (max-width: ${mobileSize}px) {
    ${({$open}) => $open ? 'background-color:' + tertiaryColor + ';' : ''}
    ${({$open}) => $open ? 'border-left:solid 1px' + lightBorderColor + ';' : ''}
    ${({$open}) => $open ? 'border-right:solid 1px' + lightBorderColor + ';' : ''}
    &:hover {
      background-color: ${tertiaryColor};
    }
  }
`;

export const FloatingLinkButton = styled(Link)`
  text-decoration: none;
  ${linkStyles}
`;

export const PanelConnection = styled.div`
  position: absolute;
  width: 100%;
  height: 0.95rem;
  background-color: #fff;
  left: 0;
  bottom: 0;
  transform: translate(-1px, 0.85rem);
  z-index: 10;
  border-left: solid 1px ${lightBorderColor};
  border-right: solid 1px ${lightBorderColor};

  @media (max-width: ${mobileSize}px) {
    display: none;
  }
`;

export const IconContainer = styled.div`
  margin-right: 0.5rem;
  margin-top: 0.15rem;
  font-size: 0.85rem;
  color: ${primaryColor};
  line-height: 0;

  @media(max-width: ${mobileSize}px) {
    font-size: 1.1rem;
    margin-top: 0;
    margin-right: 0.55rem;
  }

  @media(max-width: 350px) {
    font-size: 0.75rem;
  }

  @media(max-width: 300px) {
    display: none;
  }
`;

export const TextContainer = styled.div`
  font-size: 0.8rem;
  color: ${baseColor};

  @media(max-width: ${mobileSize}px) {
    text-transform: uppercase;
    width: min-content;
  }
`;
