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
  historyTop: 'wilderListGlobalGridHistoryTop',
  historyBottom: 'wilderListGlobalGridHistoryBottom',
  searchTop: 'wilderListGlobalGridSearchTop',
  searchBottom: 'wilderListGlobalGridSearchBottom',
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

const Grid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows:
    [${gridLines.pageTop} ${gridLines.bannerTop}] auto
    [${gridLines.bannerBottom} ${gridLines.headerTop}] ${headerHeight}rem
    [${gridLines.headerBottom} ${gridLines.historyTop}] auto
    [${gridLines.historyBottom} ${gridLines.searchTop}] auto
    [${gridLines.searchBottom} ${gridLines.contentHeaderTop}] auto
    [${gridLines.contentHeaderBottom} ${gridLines.contentTop}] 1fr
    [${gridLines.contentBottom} ${gridLines.footerTop}] auto
    [${gridLines.footerbottom} ${gridLines.pageBottom}];
  grid-template-columns:
    [${gridLines.contentSpace}] clamp(400px, 40vw, 500px)
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
  footer: 'wilderListContentGridFooter',
};

const BaseContentElement = styled.div`
  position: relative;
  display: grid;
  overflow: hidden;
  grid-template-rows:
    [${contentGridLines.header}] auto
    [${contentGridLines.body}] 1fr
    [${contentGridLines.footer}] auto;
`;

export const ContentHeader = styled.div`
  grid-row: ${contentGridLines.header};
  padding: 0 ${standardContainerPadding};
  position: relative;
`;
export const SearchContainer = styled(ContentHeader)`
  padding: ${standardContainerPadding};
`;

const mobilePadding = '120px'; // padding buffer to account for the url changing on mobile devices & sticky header

export const ContentBody = styled.div`
  grid-row: ${contentGridLines.body};
  position: relative;
  padding: ${standardContainerPadding};
  overflow: auto;
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
    padding: ${mobilePadding} ${standardContainerPadding};
  }
`;

// const mediumColumnBreakpoint = 1400;

export const ContentContainer = styled(BaseContentElement)`
  grid-column: ${gridLines.contentSpace};
  grid-row: ${gridLines.contentTop} / ${gridLines.contentBottom};
`;

export const Root = styled(Grid)`
  /* Set overflow to hidden to ensure scroll bars never show up: */
  overflow: hidden;
`;
