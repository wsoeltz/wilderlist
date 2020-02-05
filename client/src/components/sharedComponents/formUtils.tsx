import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonWarning,
  CheckboxLabel as CheckboxLabelBase,
} from '../../styling/styleUtils';

export const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`;

export const Title = styled.h1`
  margin-top: 0;
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
`;

export const SaveButton = styled(ButtonPrimary)`
  min-width: 100px;
  margin-left: 1rem;
`;

export const DeleteButton = styled(ButtonWarning)`
  margin-right: auto;
`;
