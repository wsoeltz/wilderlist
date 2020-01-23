import React from 'react';
import styled from 'styled-components/macro';
import {
  ButtonPrimary,
  ButtonSecondary,
  InputBase,
  lightBorderColor,
  LinkButton,
  TextareaBase,
} from '../../styling/styleUtils';

export const SubNav = styled.nav`
  display: flex;
`;

export const NavButtonLink = styled(LinkButton)`
  margin-right: 1rem;
`;

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
  onEdit: null | (() => void);
  onDelete: () => void;
  titleColor?: string;
}

export const ListItem = (props: ListItemProps) => {
  const { title, content, onDelete, onEdit, titleColor } = props;

  const editButton = onEdit === null ? null : (
    <EditButton onClick={onEdit}>
      Edit
    </EditButton>
  );

  const titleEl = onEdit === null ? <strong>{title}</strong> : (
    <Title
      onClick={onEdit}
      style={{color: titleColor}}
    >
      {title}
    </Title>
  );

  return (
    <ListItemRoot>
      <TitleContainer>
        {titleEl}
      </TitleContainer>
      {content}
      <ButtonContainer>
        {editButton}
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

  label {
    margin-right: auto;
  }
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

export const TextareaDisabled = styled(TextareaBase)`
  border: 1px solid transparent;
  outline: none;
  background-color: #eee;
  flex-shrink: 0;
  margin-bottom: 0.4rem;
`;
export const TextareaActive = styled(TextareaBase)`
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

/* tslint:disable:max-line-length */
export const SelectBox = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  font-size: 1rem;
  padding: 7px;
  border-radius: 0;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
  display: block;
  width: 100%;
  margin-bottom: 1rem;

  &:hover {
    cursor: pointer;
    background-color: #ddd;
  }
`;
