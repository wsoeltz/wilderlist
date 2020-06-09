import {lighten} from 'polished';
import styled from 'styled-components/macro';
import {
  borderRadius,
  DetailBox,
  lightBorderColor,
  primaryColor,
  ResourceList,
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

export const Header = styled.div`
 display: grid;
 grid-template-columns: 1fr auto;
 grid-column-gap: 1rem;
 margin-bottom: 1rem;
`;

export const CoverPhoto = styled.div`
  max-height: 230px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
  }
`;

export const Seperator = styled.div`
  width: 100%;
  height: 0;
  margin-top: 1rem;
  border-bottom: 1px solid ${lightBorderColor};
`;

export const Details = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  margin: 1rem 0;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexDetailBox = styled(DetailBox)`
  flex-grow: 1;
`;

export const List = styled(ResourceList)`
  margin-bottom: 0;
`;

export const DirectionsRoot = styled(DirectionsContainer)`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
`;

export const GoogleButton = styled.div`
  margin-left: auto;
`;
