import {
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { GetString } from 'fluent-react';
import {rgba} from 'polished';
import React, {useContext, useState} from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  lightBaseColor,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
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

  const user = useContext(UserContext);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);
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
      <Title>Notes</Title>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={2}
        async={true}
        maxLength={charLimit}
      />
      {buttons}
    </>
  );
};

export default UserNote;
