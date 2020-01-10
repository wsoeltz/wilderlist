import {rgba} from 'polished';
import React, {useState} from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';
import {
  ButtonPrimary,
  lightBaseColor,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
  tertiaryColor,
} from '../../styling/styleUtils';

const Title = styled.div`
  padding: 0.5rem 0;
  text-transform: uppercase;
  font-weight: 600;
  color: ${lightBaseColor};
`;

const Textarea = styled(TextareaAutosize)`
  padding: 0.5rem;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: ${lightFontWeight};
  width: 100%;
  line-height: 1.5;
  border: solid 1px ${rgba(lightBorderColor, 0.6)};
  outline: none;
  display: block;

  &::placeholder {
    color: ${placeholderColor};
  }

  &:focus {
    border-color: ${lightBorderColor};
  }
`;

const ButtonContainer = styled.div`
  padding: 0.5rem;
  border: 1px solid ${lightBorderColor};
  border-top: none;
  background-color: ${tertiaryColor};
  display: flex;
  justify-content: flex-end;
`;

interface Props {
  placeholder: string;
  defaultValue: string;
  onSave: (value: string) => void;
}

const UserNote = (props: Props) => {
  const {placeholder, defaultValue, onSave} = props;
  const [value, setValue] = useState<string>(defaultValue);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);
  const buttonText = defaultValue !== value ? 'Save Changes' : 'All Changes Saved';

  return (
    <>
      <Title>Notes</Title>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={2}
        async={true}
      />
      <ButtonContainer>
        <ButtonPrimary
          onClick={() => onSave(value)}
          disabled={defaultValue === value}
        >
          {buttonText}
        </ButtonPrimary>
      </ButtonContainer>
    </>
  );
};

export default UserNote;
