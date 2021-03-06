import { rgba } from 'polished';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  baseColor,
  boldFontWeight,
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

export const FlexTitle = styled(ItemTitle)`
  display: flex;
  align-items: center;
`;

export const DetailItem = styled.div`
  border-top: solid 1px ${lightBorderColor};
  padding: 1rem;
`;

export const BasicListItem = styled.div`
  font-size: 0.9rem;
  margin: 0.4rem 0;
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
    height: 9px;
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

export const CollapsedScrollContainer = styled(HorizontalScrollContainer)`
  min-height: 0;
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

export const FittedBlock = styled(HorizontalBlock)`
  flex-shrink: 0;
  white-space: normal;
  &:after {
    display: none;
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

export const BlockHeaderNoPush = styled(BlockHeader)`
  margin: 0;
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

export const DetailsTop = styled.div`
  margin-bottom: auto;
`;

export const LimitedLink = styled.a`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 0.25rem;
`;

export const LargeText = styled.div`
  font-weight: 200;
  color: ${baseColor};
  font-size: 1.15rem;
`;

export const Paragraph = styled.p`
  white-space: normal;
  margin: auto 0 auto;
  color: ${lightBaseColor};
  font-size: 0.8rem;
`;

export const BasicContentContainer = styled.div`
  padding: 1rem;
`;

export const ScrollContainerDarkRoot = styled.div`
  margin: 1rem 0;
  border-top: solid 1px ${lightBorderColor};
  border-bottom: solid 1px ${lightBorderColor};
  background-color: ${tertiaryColor};
  position: relative;
`;

export const CenterdLightTitle = styled.h4`
  padding: 0.75rem 0.5rem 0rem 1rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  color: ${lightBaseColor};
`;

export const ScrollContainerDarkTitle = styled(CenterdLightTitle)`
  margin: 0;
  position: absolute;
  pointer-events: none;
  left: 0;
  right: 0;
  top: 0;
`;

export const ScrollContainerDark = styled(HorizontalScrollContainer)`
  min-height: 10rem;
  margin-bottom: 0;
  padding-top: 3rem;
  padding-bottom: 1.5rem;
`;
