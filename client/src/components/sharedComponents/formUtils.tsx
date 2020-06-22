import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonWarning,
  CheckboxLabel as CheckboxLabelBase,
  lightBorderColor,
  tertiaryColor,
} from '../../styling/styleUtils';
import {
    mobileWidth,
} from './Modal';

export const Wrapper = styled.div`
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
  grid-template-columns: 1fr 1fr auto;
  grid-column-gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const Sublabel = styled.small`
  text-transform: none;
`;

export const ActionButtons = styled.div`
  position: sticky;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 1rem;
  box-sizing: border-box;
  background-color: ${tertiaryColor};
  border: solid 1px ${lightBorderColor};
  z-index: 100;

  @media (max-width: ${mobileWidth}px) {
    padding: 0;
    position: fixed;
  }
`;
