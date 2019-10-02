import React from 'react';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonSecondary,
  lightBorderColor,
  LinkButton,
} from '../../styling/styleUtils';

const ListItemRoot = styled.div`
  margin: 1rem;
  padding: 1rem;
  border-top: 1px solid ${lightBorderColor};
  border-bottom: 1px solid ${lightBorderColor};
  position: relative;

  &:hover {
    background-color: #eee;
  }
`;

const TitleContainer = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
`;

const Title = styled(LinkButton)`
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  position: absolute;
  font-size: 0.75rem;
  top: 8px;
  right: 8px;
`;

const EditButton = styled(ButtonPrimary)`
  margin-right: 1rem;
`;

interface ListItemProps {
  title: string;
  content: React.ReactNode | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const ListItem = (props: ListItemProps) => {
  const { title, content, onDelete, onEdit } = props;

  return (
    <ListItemRoot>
      <TitleContainer>
        <Title onClick={onEdit}>
          {title}
        </Title>
      </TitleContainer>
      {content}
      <ButtonContainer>
        <EditButton onClick={onEdit}>
          Edit
        </EditButton>
        <ButtonSecondary onClick={onDelete}>
          Delete
        </ButtonSecondary>
      </ButtonContainer>
    </ListItemRoot>
  );
};

const EditPanelRoot = styled.div``;

interface EditPanelProps {
  onCancel: () => void;
  children: React.ReactNode;
}

export const EditPanel = (props: EditPanelProps) => {
  const { onCancel, children } = props;

  return (
    <EditPanelRoot>
      <ButtonSecondary onClick={onCancel}>
        Cancel
      </ButtonSecondary>
      {children}
    </EditPanelRoot>
  );
};
