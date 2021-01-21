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

  &:not(:last-of-type) {
    border-right: solid 1px ${lightBorderColor};
  }
`;

const ActiveNavButton = styled(NavButton)`
  background-color: #fff;
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
}

const DetailSegment = (props: Props) => {
  const {panels} = props;
  const [panelIndex, setPanelIndex] = useState<number>(0);

  const buttons: Array<React.ReactElement<any>> = [];
  const panelContents: Array<React.ReactElement<any>> = [];
  panels.forEach((panel, i) => {
    const active = panelIndex === i;

    const Button = active ? ActiveNavButton : NavButton;
    const selectPanel = () => setPanelIndex(i);
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
    buttons.push(
      <Button
        key={'panel-nav-button' + panel.title + i}
        onClick={selectPanel}
      >
        {icon}
        {panel.title}
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
