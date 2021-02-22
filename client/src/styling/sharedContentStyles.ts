import { rgba } from 'polished';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  baseColor,
  boldFontWeight,
  DetailBox as DetailBoxBase,
  lightBaseColor,
  lightBlue,
  lightBorderColor,
  offWhite,
  semiBoldFontBoldWeight,
  tertiaryColor,
} from './styleUtils';

export const ItemTitle = styled.h2`
  text-transform: uppercase;
  color: ${lightBaseColor};
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 0.85rem;
  margin: 0 0 0.45rem;
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
  margin-bottom: 0.75rem;
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
    cursor: pointer;

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
  border-left: 1px solid ${lightBorderColor};
`;
export const ExternalLink = styled.a`
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const InlineSectionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const DetailBox = styled(DetailBoxBase)`
  margin-bottom: 2rem;
`;

export const NotesTitle = styled(ItemTitle)`
  margin-bottom: 0.5rem;
`;

export const TopLevelColumns = styled.div`
  margin: 0 -1rem 1.5rem;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const LoadableText = styled.div<{$loading: boolean}>`
  ${({$loading}) => $loading
    ? 'width: 75%;' +
      'background-color:' + tertiaryColor + ';' +
      'color: transparent;'
    : ''
  }
`;

export const HorizontalScrollContainer = styled(ScrollContainer)<{$noScroll?: boolean}>`
  display: flex;
  width: 100%;
  min-height: 11.15rem;
  overflow: auto;
  padding: 1rem 0 1rem 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  ${({$noScroll}) => $noScroll ? '' : 'cursor: move;'}

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    height: 12px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .3);
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, .1);
  }

  /* Required for padding at end of box to work */
  &:after {
    content: '.';
    display: block;
    padding-right: 1rem;
    width: 0;
    overflow: hidden;
    color: transparent;
    visibility: hidden;
  }
`;

export const HorizontalBlock = styled.div`
  flex-grow: 1;
  padding: 0.5rem;
  background-color: ${offWhite};
  border: solid 1px ${lightBorderColor};
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:not(:last-of-type) {
    margin-right: 1rem;
  }

  /* Required for padding at end of box to work */
  &:after {
    content: '';
    display: block;
    min-width: 10.5rem;
    color: transparent;
    visibility: hidden;
  }
`;

export const DarkBlock = styled(HorizontalBlock)`
  background-color: ${tertiaryColor};
  max-width: 7rem;
  width: 7rem;
  flex-shrink: 0;
  white-space: normal;
  &:after {
    display: none;
  }
`;

export const EmptyBlock = styled(HorizontalBlock)`
  justify-content: center;
`;

export const BlockHeader = styled.h3`
  font-size: 0.8rem;
  margin: 0;
  margin-bottom: auto;
  padding: 0;
  font-weight: 400;
`;

export const CenteredHeader = styled(BlockHeader)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
`;

export const InlineColumns = styled.div`
  margin-top: 0.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SimpleTitle = styled.div`
  text-transform: uppercase;
  font-size: 0.9em;
  font-weight: ${boldFontWeight};
  padding-right: 0.25rem;
`;

export const BlockTitle = styled(SimpleTitle)`
  margin-bottom: 0.5rem;
`;

export const Details = styled.div`
  margin: 0.5rem 0 0;
`;

export const LimitedLink = styled.a`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 0.25rem;
`;
