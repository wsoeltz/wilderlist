import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {
  baseColor,
  IconContainer as IconContainerBase,
  lightBaseColor,
  lightBlue,
  lightBorderColor,
} from '../../../styling/styleUtils';

const Root = styled.div`
  margin: 0 -1rem;
  border-top: solid 1px ${lightBorderColor};
`;

const NavContainer = styled.nav`
  width: 100%;
  display: flex;
`;

const NavButton = styled.button`
  display: block;
  flex-grow: 1;
  background-color: ${lightBlue};
  color: ${lightBaseColor};
  padding: 0.75rem 0.5rem 0.75rem 1rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  border-bottom: solid 1px ${lightBorderColor};
  text-align: center;

  &:not(:last-of-type) {
    border-right: solid 1px ${lightBorderColor};
  }

  @media(max-width: 450px) {
    flex-direction: column;
    justify-content: space-between;
  }
`;

const ActiveNavButton = styled(NavButton)`
  background-color: transparent;
  color: ${baseColor};
  border-bottom: none;
`;

const renderedButHiddenClassName = 'detail-segment-content-rendered-inactive';

const PanelContainer = styled.div``;

const PanelContent = styled.div`
  &.${renderedButHiddenClassName} {
    display: none;
  }
`;

const IconContainer = styled(IconContainerBase)`
  margin-right: 0.5rem;
`;

export type Panel = {
  title: string;
  // reactNode is of type "any" due to an issue with TypeScript overloading memory
  reactNode: any;
  // if true, panel should render with display: none instead of null if not selected:
  renderHiddenContent?: boolean;
  customIcon?: boolean;
  icon?: string | any;
} & (
  {
    customIcon?: undefined;
  } |
  {
    customIcon: true,
    icon: string,
  } | {
    customIcon: false,
  // icon is of type "any" due to an issue with TypeScript overloading memory
    icon: any,
  }
);

interface Props {
  panels: Panel[];
  // panelCounts as seperate prop prevents rerender of panels reactNodes every time the number changes
  panelCounts?: Array<{index: number, count: number, numerator?: number}>;
  panelId: string;
}

const localStorageId = (id: string) => 'detailPanel_' + id;

const DetailSegment = (props: Props) => {
  const {panels, panelCounts, panelId} = props;

  const initialPanelValue = localStorage.getItem(localStorageId(panelId));
  const initialPanelIndex = initialPanelValue ? parseInt(initialPanelValue, 10) : 0;

  const [panelIndex, setPanelIndex] = useState<number>(
    initialPanelIndex && initialPanelIndex < panels.length ? initialPanelIndex : 0,
  );

  const buttons: Array<React.ReactElement<any>> = [];
  const panelContents: Array<React.ReactElement<any>> = [];
  panels.forEach((panel, i) => {
    const active = panelIndex === i;

    const Button = active ? ActiveNavButton : NavButton;
    const selectPanel = () => {
      localStorage.setItem(localStorageId(panelId), i.toString());
      setPanelIndex(i);
    };
    let icon: React.ReactElement<any> | null;
    if (panel.customIcon === true) {
      icon = (
        <IconContainer
          $color={active ? baseColor : lightBaseColor}
          dangerouslySetInnerHTML={{__html: panel.icon}}
        />
      );
    } else if (panel.customIcon === false) {
      icon = (
        <IconContainer
          $color={active ? baseColor : lightBaseColor}
        >
          <FontAwesomeIcon icon={panel.icon} />
        </IconContainer>
      );
    } else {
      icon = null;
    }

    const titleCount = panelCounts ? panelCounts.find(p => p.index === i) : undefined;
    const numerator = titleCount && titleCount.numerator !== undefined ? titleCount.numerator + '/' : '';
    const title = titleCount ? `${panel.title} (${numerator}${titleCount.count})` : panel.title;

    buttons.push(
      <Button
        key={'panel-nav-button' + panel.title + i}
        onClick={selectPanel}
        style={panels.length === 1 ? {outline: 'none', cursor: 'default'} : undefined}
      >
        {icon}
        {title}
      </Button>,
    );

    const content = active || panel.renderHiddenContent === true ? (
      <PanelContent
        className={panel.renderHiddenContent === true && !active ? renderedButHiddenClassName : undefined}
      >
        {panel.reactNode}
      </PanelContent>
    ) : null;
    panelContents.push(
      <React.Fragment key={'panel-content' + panel.title + i}>
        {content}
      </React.Fragment>,
    );
  });

  return (
    <Root>
      <NavContainer>
        {buttons}
      </NavContainer>
      <PanelContainer>
        {panelContents}
      </PanelContainer>
    </Root>
  );
};

export default DetailSegment;
