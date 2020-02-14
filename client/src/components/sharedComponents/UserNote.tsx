import {
  faFacebook,
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
  ButtonWarningLow,
  lightBorderColor,
  lightFontWeight,
  lowWarningColor,
  placeholderColor,
  SectionTitle,
} from '../../styling/styleUtils';
import { UserContext } from '../App';
import {
  BrandIcon,
  facebookBlue,
  googleBlue,
  LoginButtonBase,
  LoginText as LoginTextBase,
  redditRed,
} from './SignUpModal';

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
  display: flex;
  justify-content: flex-end;
  transition: all 0.2s ease;
  box-sizing: border-box;
  padding: 0.125rem;
`;

const openContainerStyles: React.CSSProperties = {
  padding: '0.5rem',
};

const LoginButton = styled(LoginButtonBase)`
  margin: 0.5rem 0.5rem;
  min-width: 0;
  max-width: 200px;
  max-height: 50px;
  border: 1px solid ${lightBorderColor};
`;

const LoginText = styled(LoginTextBase)`
  @media (max-width: 500px) {
    font-size: 0.9rem;
  }
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      setHeight(textAreaRef.current.scrollHeight);
    }
    setIsLoading(false);
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
  let buttonText: React.ReactElement<any> | null;
  if (!defaultValue && !value) {
    buttonText = null;
  } else if (defaultValue === value) {
    buttonText = (
      <small>
        <em>{getFluentString('global-text-value-all-changes-saved')}</em>
      </small>
    );
  } else {
    const innerText = isLoading
      ? getFluentString('global-text-value-saving') + '...' : getFluentString('global-text-value-save-changes');
    const onClick = () => {
      onSave(value.substring(0, charLimit));
      setIsLoading(true);
    };
    buttonText = (
      <ButtonWarningLow
        onClick={onClick}
        disabled={isLoading}
        style={{cursor: isLoading ? 'progress' : undefined}}
      >
        {innerText}
      </ButtonWarningLow>
    );
  }

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
      <LoginButton href='/auth/facebook'>
        <BrandIcon
          icon={faFacebook}
          style={{color: facebookBlue}}
        />
        <LoginText>
          {getFluentString('header-text-login-with-facebook')}
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
    <ButtonContainer
      style={defaultValue === value ? {} : openContainerStyles}
    >
      {buttonText}
    </ButtonContainer>
  );

  return (
    <>
      <SectionTitle>Notes</SectionTitle>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={charLimit}
        ref={textAreaRef}
        style={{height, borderColor: defaultValue !== value ? lowWarningColor : undefined}}
      />
      {buttons}
    </>
  );
};

export default UserNote;
