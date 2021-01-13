import React from 'react';
import styled from 'styled-components/macro';
import {lightBlue} from '../../../../styling/styleUtils';

const Root = styled.div`
  flex-shrink: 0;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.4rem 0.8rem 0.4rem 0;
  overflow: hidden;
  background-color: #fff;
  width: 100%;
`;

const RemoveItem = styled.button`
  margin-left: 1rem;
  padding: 0.3rem 0.6rem;
  height: 100%;
  background-color: ${lightBlue};
  border: none;
`;

const Title = styled.div`
  padding: 0.3rem 0.3rem 0.3rem 0.6rem;
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
        {name}
        <SelectedItemSubtitle>
          {subtitle}
        </SelectedItemSubtitle>
      </Title>
      <RemoveItem onClick={onClose}>×</RemoveItem>
    </Root>
  );
};

export default SelectedItem;
