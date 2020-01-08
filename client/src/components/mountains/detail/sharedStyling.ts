import { rgba } from 'polished';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  boldFontWeight,
  lightBaseColor,
  lightBlue,
  lightBorderColor,
  semiBoldFontBoldWeight,
  tertiaryColor,
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

export const SectionTitle = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: ${boldFontWeight};
  margin-bottom: 0.2rem
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

export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
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
