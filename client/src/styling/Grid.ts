import styled from 'styled-components';

const gridLines = {
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
  pageLeft: 'wilderListGlobalGridPageLeft',
  column1: 'wilderListGlobalGridColumn1',
  column2: 'wilderListGlobalGridColumn2',
  column3: 'wilderListGlobalGridColumn3',
  column4: 'wilderListGlobalGridColumn4',
  column5: 'wilderListGlobalGridColumn5',
  column6: 'wilderListGlobalGridColumn6',
  column7: 'wilderListGlobalGridColumn7',
  column8: 'wilderListGlobalGridColumn8',
  column9: 'wilderListGlobalGridColumn9',
  column10: 'wilderListGlobalGridColumn10',
  pageRight: 'wilderListGlobalGridPageRight',
};

const headerHeight = 200; // in px

const Grid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows:
    [${gridLines.pageTop} ${gridLines.bannerTop}] auto
    [${gridLines.bannerBottom} ${gridLines.headerTop}] ${headerHeight}px
    [${gridLines.headerBottom} ${gridLines.contentHeaderTop}] auto
    [${gridLines.contentHeaderBottom} ${gridLines.contentTop}] 1fr
    [${gridLines.contentBottom} ${gridLines.footerTop}] auto
    [${gridLines.footerbottom} ${gridLines.pageBottom}];
  grid-template-columns:
    [${gridLines.pageLeft} ${gridLines.column1}] 1fr
    [${gridLines.column2}] 1fr
    [${gridLines.column3}] 1fr
    [${gridLines.column4}] 1fr
    [${gridLines.column5}] 1fr
    [${gridLines.column6}] 1fr
    [${gridLines.column7}] 1fr
    [${gridLines.column8}] 1fr
    [${gridLines.column9}] 1fr
    [${gridLines.column10}] 1fr
    [${gridLines.pageRight}];
`;

export const HeaderContainer = styled.div`
  grid-row: ${gridLines.headerTop} / ${gridLines.headerBottom};
  grid-column: ${gridLines.pageLeft} / ${gridLines.pageRight};
  position: relative;
`;

export const PreContentHeaderFull = styled.div`
  grid-row: ${gridLines.contentHeaderTop} / ${gridLines.contentHeaderBottom};
  grid-column: ${gridLines.pageLeft} / ${gridLines.pageRight};
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
  position: relative;
`;
export const ContentBody = styled.div`
  grid-row: ${contentGridLines.body};
  position: relative;
  overflow: auto;
`;

export const ContentLeftLarge = styled(BaseContentElement)`
  grid-row: ${gridLines.contentTop} / ${gridLines.contentBottom};
  grid-column: ${gridLines.pageLeft} / ${gridLines.column7};
`;

export const ContentRightSmall = styled(BaseContentElement)`
  grid-row: ${gridLines.contentTop} / ${gridLines.contentBottom};
  grid-column: ${gridLines.column7} / ${gridLines.pageRight};
`;

export const Root = styled(Grid)`
  /* Set overflow to hidden to ensure scroll bars never show up: */
  overflow: hidden;
`;
