import React from 'react';
import styled from 'styled-components/macro';
import {
  lightBorderColor,
  SemiBold,
} from '../../../../styling/styleUtils';
import {mobileSize} from '../../../../Utils';

const Root = styled.div`
  flex-shrink: 0;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.4rem 0.8rem 0.4rem 0;
  overflow: hidden;
  width: 100%;
  padding-bottom: 0.8rem;

  &:not(:last-of-type) {
    border-bottom: solid 1px ${lightBorderColor};
  }

  @media(max-width: ${mobileSize}) {
    font-size: 1rem;
  }
`;

const RemoveItem = styled.button`
  margin-left: 1rem;
  padding: 0.3rem 0.3rem;
  border: none;
  background-color: transparent;
`;

const Title = styled.div`
  padding: 0.3rem 0;
`;

const SelectedItemSubtitle = styled.small`
  display: block;
`;

interface Props {
  name: string;
  subtitle: string;
  onClose: () => void;
}

const SelectedItem = (props: Props) => {
  const {
    name, subtitle, onClose,
  } = props;

  return (
    <Root>
      <Title>
        <SemiBold>{name}</SemiBold>
        <SelectedItemSubtitle>
          {subtitle}
        </SelectedItemSubtitle>
      </Title>
      <RemoveItem onClick={onClose}>×</RemoveItem>
    </Root>
  );
};

export default SelectedItem;
