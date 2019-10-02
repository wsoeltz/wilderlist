import React from 'react';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonSecondary,
  InputBase,
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

export const NameInactive = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const NameActive = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const EditNameForm = styled.form`
  display: contents;
`;

export const NameText = styled(InputBase)`
  border: 1px solid transparent;
  outline: none;
  background-color: #eee;
  flex-shrink: 0;
  margin-bottom: 0.4rem;
`;
export const NameInput = styled(InputBase)`
  flex-shrink: 0;
  margin-bottom: 0.4rem;
`;

export const UpdateButton = styled(ButtonPrimary)`
  margin-right: 0.4rem;
`;
export const CreateButton = styled(ButtonPrimary)`
  margin: 0.4rem auto;
`;

export const SelectionPanel = styled.div`
  display: grid;
  grid-template-columns: 4fr 3fr;
`;

export const CheckboxContainer = styled.fieldset`
  overflow: auto;
  max-height: 300px;
  padding: 0;
  border: 1px solid #ccc;
`;

export const CheckboxRoot = styled.div`
  display: block;
  position: relative;
`;

export const CheckboxInput = styled.input`
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  margin: auto;
`;

export const CheckboxLabel = styled.label`
  padding: 8px 8px 8px 30px;
  display: block;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

export const SelectedItemsContainer = styled.div`
  max-height: 300px;
  overflow: auto;
  padding: 0 0.7rem;
  border: 1px solid #ccc;
`;
