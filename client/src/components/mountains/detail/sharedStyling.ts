import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  lightBaseColor,
  lightBorderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';

export const ItemTitle = styled.div`
  text-transform: uppercase;
  color: ${lightBaseColor};
  font-weight: ${semiBoldFontBoldWeight};
`;

export const ItemFooter = styled.div`
  font-size: 0.7rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const ContentItem = styled.div`
  border-bottom: solid 1px ${lightBorderColor};
  padding: 0.5rem 0;
`;

export const VerticalContentItem = styled(ContentItem)`
  margin-bottom: 0.5rem;
`;

export const BasicListItem = styled.div`
  font-size: 0.9rem;
  margin: 0.4rem 0;
`;

export const AscentListItem = styled(BasicListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-basis: 1;

  &:hover {
    background-color: ${lightBorderColor};
  }
`;

export const BoldLink = styled(Link)`
  font-weight: ${semiBoldFontBoldWeight};
`;
