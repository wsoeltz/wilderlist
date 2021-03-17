import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonWarning,
  CheckboxLabel as CheckboxLabelBase,
  GhostButton,
  lightBorderColor,
  tertiaryColor,
} from '../../styling/styleUtils';
import {mobileSize} from '../../Utils';
import {
    mobileWidth,
} from './Modal';

export const Wrapper = styled.div`
  margin: 0 -1rem;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: ${mobileWidth}px) {
    padding-bottom: 15vh;
  }
`;

export const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.7rem;
`;

export const Title = styled.h1`
  margin: 0;
`;

export const FullColumn = styled.div`
  grid-column: span 2;
`;

export const CheckboxLabel = styled(CheckboxLabelBase)`
  margin-bottom: 1rem;
  font-size: 0.8rem;
  line-height: 1.6;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  margin: 0 -1rem -1rem;
  bottom: -1rem;
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

export const SaveButton = styled(ButtonPrimary)`
  min-width: 100px;
  margin-left: auto;
`;

export const DeleteButton = styled(ButtonWarning)`
  margin-right: 1rem;
`;

export const ResourceContainer = styled.div`
  display: grid;
  border-left: solid 3px ${lightBorderColor};
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const DeleteResourceButton = styled(GhostButton)`
  grid-row: 1 / -1;
  grid-column: 2;
`;

export const Sublabel = styled.small`
  text-transform: none;
`;
