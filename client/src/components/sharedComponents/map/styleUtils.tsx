import {lighten} from 'polished';
import styled from 'styled-components/macro';
import {
  borderRadius,
  primaryColor,
} from '../../../styling/styleUtils';

export const DirectionsContainer = styled.div`
  display: flex;
  margin-top: 0.8rem;
`;

export const DirectionsIcon = styled.div`
  border: solid 1px ${primaryColor};
  border-top-left-radius: ${borderRadius}px;
  border-bottom-left-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  color: ${primaryColor};
`;

const directionsContentStyles = `
  border: solid 1px ${primaryColor};
  border-top-right-radius: ${borderRadius}px;
  border-bottom-right-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  font-weight: 600;
`;

export const DirectionsContent = styled.div`
  ${directionsContentStyles}
  background-color: ${lighten(0.4, primaryColor)};
`;

export const DirectionsButton = styled.button`
  ${directionsContentStyles}
  background-color: ${primaryColor};
  color: #fff;
  text-transform: uppercase;

  &:hover {
    background-color: ${lighten(0.1, primaryColor)};
  }
`;
