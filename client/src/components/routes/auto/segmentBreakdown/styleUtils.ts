import styled from 'styled-components/macro';
import {
  BasicIconInText,
  IconContainer as IconContainerBase,
  lightBorderColor,
  primaryColor,
  secondaryColor,
} from '../../../../styling/styleUtils';

export const SegmentRoot = styled.div`
  border-top: dashed 1px ${lightBorderColor};
  padding: 1rem;
  display: grid;
  grid-template-columns: 4rem 1fr;
  align-items: center;
  box-sizing: border-box;
`;

export const ContentRoot = styled.div`
  grid-column: 2;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
`;

export const IconContainer = styled(IconContainerBase)`
  font-size: 1.5rem;

  svg {
    width: 1.5rem;
  }
`;

export const ListText = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

export const ListItem = styled.div`
  display: flex;
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
`;

export const IconBullet = styled(BasicIconInText)`
  color: ${secondaryColor};
  font-size: 1rem;
`;

export const SegementLine = styled.div`
  width: 0.65rem;
  height: 100%;
  border-radius: 1000px;
  margin: auto;
  background-color: ${primaryColor};
`;
