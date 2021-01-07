import styled from 'styled-components/macro';
import {
  BasicIconInText,
  secondaryColor,
} from '../../../../../../styling/styleUtils';

export const Root = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const Icon = styled(BasicIconInText)`
  color: ${secondaryColor};
  font-size: 1rem;
`;
