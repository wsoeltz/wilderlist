import {
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { GetString } from 'fluent-react';
import {rgba} from 'polished';
import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
  SectionTitle,
  tertiaryColor,
} from '../../styling/styleUtils';
import { UserContext } from '../App';
import {
  BrandIcon,
  googleBlue,
  LoginButtonBase,
  LoginText,
  redditRed,
} from '../login';

const Textarea = styled.textarea`
  padding: 0.5rem;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: ${lightFontWeight};
  width: 100%;
  min-height: 4.75rem;
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
  flex-wrap: wrap;
`;

const LoginButton = styled(LoginButtonBase)`
  margin: 0.5rem 0.5rem;
  max-width: 200px;
  max-height: 50px;
  border: 1px solid ${lightBorderColor};
`;

const charLimit = 5000;

interface Props {
  placeholder: string;
  defaultValue: string;
  onSave: (value: string) => void;
}

const UserNote = (props: Props) => {
  const {placeholder, defaultValue, onSave} = props;
  const [value, setValue] = useState<string>(defaultValue);
  const [height, setHeight] = useState<number>(0);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      setHeight(textAreaRef.current.scrollHeight);
    }
  }, [textAreaRef, defaultValue]);

  const user = useContext(UserContext);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (e.target.scrollHeight > height) {
      setHeight(e.target.scrollHeight);
    }
  };
  const buttonText = defaultValue !== value ? 'Save Changes' : 'All Changes Saved';

  const buttons = !user ? (
    <ButtonContainer>
      <LoginButton href='/auth/google'>
        <BrandIcon
          icon={faGoogle}
          style={{color: googleBlue}}
        />
        <LoginText>
          {getFluentString('header-text-login-with-google')}
        </LoginText>
      </LoginButton>
      <LoginButton href='/auth/reddit'>
        <BrandIcon
          icon={faReddit}
          style={{color: redditRed}}
        />
        <LoginText>
          {getFluentString('header-text-login-with-reddit')}
        </LoginText>
      </LoginButton>
    </ButtonContainer>
    ) : (
    <ButtonContainer>
      <ButtonPrimary
        onClick={() => onSave(value.substring(0, charLimit))}
        disabled={defaultValue === value}
      >
        {buttonText}
      </ButtonPrimary>
    </ButtonContainer>
  );

  return (
    <>
      <SectionTitle>Notes</SectionTitle>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{height}}
        maxLength={charLimit}
        ref={textAreaRef}
      />
      {buttons}
    </>
  );
};

export default UserNote;
