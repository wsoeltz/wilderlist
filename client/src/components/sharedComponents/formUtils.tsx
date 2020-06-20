import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonWarning,
  CheckboxLabel as CheckboxLabelBase,
} from '../../styling/styleUtils';

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
