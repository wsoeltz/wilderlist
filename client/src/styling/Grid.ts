import styled from 'styled-components/macro';
import {mobileSize} from '../Utils';
import { standardContainerPadding } from './styleUtils';

export const gridLines = {
  // Horizontal Grid Lines
  pageTop: 'wilderListGlobalGridPageTop',
  bannerTop: 'wilderListGlobalGridBannerTop',
  bannerBottom: 'wilderListGlobalGridBannerBottom',
  headerTop: 'wilderListGlobalGridHeaderTop',
  headerBottom: 'wilderListGlobalGridHeaderBottom',
  contentTop: 'wilderListGlobalGridContentTop',
  contentHeaderTop: 'wilderListGlobalGridContentHeaderTop',
  contentHeaderBottom: 'wilderListGlobalGridContentHeaderBottom',
  contentBottom: 'wilderListGlobalGridContentBottom',
  footerTop: 'wilderListGlobalGridFooterTop',
  footerbottom: 'wilderListGlobalGridFooterbottom',
  pageBottom: 'wilderListGlobalGridPageBottom',
  // Vertical Grid Lines
  contentSpace: 'wilderListGlobalGridContentSpace',
  mapSpace: 'wilderListGlobalGridMapSpace',
};

export const headerHeight = 2.1; // in rem

export const contentColumnMin = 400; // in px
export const contentColumnIdeal = 40; // in vw
export const contentColumnMax = 500; // in vw

const Grid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows:
    [${gridLines.pageTop} ${gridLines.bannerTop}] auto
    [${gridLines.bannerBottom} ${gridLines.headerTop}] ${headerHeight}rem
    [${gridLines.headerBottom} ${gridLines.contentHeaderTop}] auto
    [${gridLines.contentHeaderBottom} ${gridLines.contentTop}] 1fr
    [${gridLines.contentBottom} ${gridLines.footerTop}] auto
    [${gridLines.footerbottom} ${gridLines.pageBottom}];
  grid-template-columns:
    [${gridLines.contentSpace}] clamp(${contentColumnMin}px, ${contentColumnIdeal}vw, ${contentColumnMax}px)
    [${gridLines.mapSpace}] 1fr;

    @media(max-width: ${mobileSize}px) {
      height: auto;
      min-height: 100vh;
      grid-template-rows:
        [${gridLines.pageTop} ${gridLines.bannerTop}] auto
        [${gridLines.bannerBottom} ${gridLines.headerTop}] auto
        [${gridLines.headerBottom} ${gridLines.contentHeaderTop}] auto
        [${gridLines.contentHeaderBottom} ${gridLines.contentTop}] 1fr
        [${gridLines.contentBottom} ${gridLines.footerTop}] auto
        [${gridLines.footerbottom} ${gridLines.pageBottom}];
      grid-template-columns: [${gridLines.contentSpace} ${gridLines.mapSpace}] 1fr;
    }
`;

export const HeaderContainer = styled.div`
  grid-row: ${gridLines.headerTop} / ${gridLines.headerBottom};
  grid-column: 1 / -1;
  position: relative;
`;

export const PreContentHeaderFull = styled.div`
  grid-row: ${gridLines.contentHeaderTop} / ${gridLines.contentHeaderBottom};
  grid-column: 1 / -1;
  position: relative;
`;

const contentGridLines = {
  header: 'wilderListContentGridHeader',
  body: 'wilderListContentGridBody',
};

export const mobileTopPadding = 89; // in px

export const ContentHeader = styled.div`
  grid-row: ${contentGridLines.header};
  pointer-events: all;

  @media(max-width: ${mobileSize}px) {
    pointer-events: none;
    padding-top: ${mobileTopPadding}px;
  }
`;

export const ContentBody = styled.div`
  grid-row: ${contentGridLines.body};
  padding: ${standardContainerPadding};
  background-color: #fff;
  overflow: auto;
  pointer-events: all;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .3);
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, .1);
  }

  @media(max-width: ${mobileSize}px) {
    height: auto;
    min-height: 100vh;
    padding-bottom: 150px;
  }
`;

export const ContentContainer = styled.div`
  grid-column: ${gridLines.contentSpace};
  grid-row: ${gridLines.contentTop} / ${gridLines.contentBottom};
  position: relative;
  overflow: hidden;
  display: grid;
  pointer-events: none;
  grid-template-rows:
    [${contentGridLines.header}] auto
    [${contentGridLines.body}] 1fr;
`;

export const Root = styled(Grid)`
  /* Set overflow to hidden to ensure scroll bars never show up: */
  overflow: hidden;
`;
