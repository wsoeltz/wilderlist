import { rgba } from 'polished';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  baseColor,
  boldFontWeight,
  lightBaseColor,
  lightBlue,
  lightBorderColor,
  semiBoldFontBoldWeight,
  tertiaryColor,
} from '../../../styling/styleUtils';

export const ItemTitle = styled.h2`
  text-transform: uppercase;
  color: ${lightBaseColor};
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 1rem;
  margin: 0;
`;

export const ContentItem = styled.div`
  border-bottom: solid 1px ${lightBorderColor};
  padding: 0.5rem 0;
  margin: 0;
`;

export const VerticalContentItem = styled(ContentItem)`
  margin-bottom: 0.5rem;
`;

export const BasicListItem = styled.div`
  font-size: 0.9rem;
  margin: 0.4rem 0;
`;

export const BasicUnorderedListContainer = styled.ul`
  padding: 0;
  margin: 0;
`;

export const BasicUnorderedListItem = styled.li`
  font-size: 0.9rem;
  margin: 0.4rem 0;
  list-style: none;
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

export const SectionTitle = styled.h4`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: ${boldFontWeight};
  margin-bottom: 0.2rem;
  margin-top: 0;
`;

export const Section = styled.section`
  line-height: 1.6;

  &:not(:last-child) {
    margin-bottom: 0.8rem;
  }
`;

export const Condition = styled.span`
  background-color: ${rgba(lightBlue, 0.5)};
`;

export const ReportContainer = styled(BasicListItem)`
  padding: 0.5rem 0;

  &:hover {
    background-color: ${tertiaryColor};

    .read-full-report-button {
      visibility: visible;
    }
  }
`;

export const ReportHeader = styled.h3`
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 400;
  color: ${baseColor};
`;

export const ReportBody = styled.div`
  margin-left: 1rem;
  padding-left: 0.8rem;
  border-left: 1px solid ${lightBlue};
`;
export const ExternalLink = styled.a`
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
