import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebook,
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import {
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {rgba} from 'polished';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import useBeforeUnload from '../../hooks/useBeforeUnload';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFluent from '../../hooks/useFluent';
import {
  ItemTitle,
} from '../../styling/sharedContentStyles';
import {
  ButtonWarningLow,
  lightBorderColor,
  lightFontWeight,
  lowWarningColor,
  placeholderColor,
} from '../../styling/styleUtils';
import {
  BrandIcon,
  facebookBlue,
  googleBlue,
  LoginButtonBase,
  LoginText as LoginTextBase,
  redditRed,
} from './SignUpModal';
import Tooltip from './Tooltip';

const defaultHeight = 4.75; // in rem

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: ${defaultHeight}rem;
  position: relative;
`;

const Title = styled(ItemTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: ${lightFontWeight};
  width: 100%;
  min-height: ${defaultHeight}rem;
  line-height: 1.5;
  border: solid 1px ${rgba(lightBorderColor, 0.6)};
  outline: none;
  display: block;
  resize: vertical;
  flex-grow: 1;
  padding-bottom: 4rem;
  font-family: monospace;
  color: #555;
  background-color: #fdfdfd;

  &::placeholder {
    color: ${placeholderColor};
  }

  &:focus {
    border-color: ${lightBorderColor};
  }
`;

export const PlaceholderTextarea = styled(Textarea)`
  cursor: wait;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  transition: all 0.2s ease;
  box-sizing: border-box;
  padding: 0.125rem;
  position: absolute;
  right: 0.4rem;
  bottom: 0.4rem;
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

  const user = useCurrentUser();

  const getString = useFluent();

  useBeforeUnload(!((!defaultValue && !value) || (defaultValue === value)));

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
        <em>{getString('global-text-value-all-changes-saved')}</em>
      </small>
    );
  } else {
    const innerText = isLoading
      ? getString('global-text-value-saving') + '...' : getString('global-text-value-save-changes');
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
          icon={faGoogle as IconDefinition}
          style={{color: googleBlue}}
        />
        <LoginText>
          {getString('header-text-login-with-google')}
        </LoginText>
      </LoginButton>
      <LoginButton href='/auth/facebook'>
        <BrandIcon
          icon={faFacebook as IconDefinition}
          style={{color: facebookBlue}}
        />
        <LoginText>
          {getString('header-text-login-with-facebook')}
        </LoginText>
      </LoginButton>
      <LoginButton href='/auth/reddit'>
        <BrandIcon
          icon={faReddit as IconDefinition}
          style={{color: redditRed}}
        />
        <LoginText>
          {getString('header-text-login-with-reddit')}
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
    <Root>
      <Title>
        <div>{getString('user-notes-title')}:</div>
        <div>
          <small>
            <Tooltip
              explanation={getString('user-notes-tooltip')}
            >
            <FontAwesomeIcon icon={faLock} /> {getString('global-text-value-private')}
            </Tooltip>
          </small>
        </div>
      </Title>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={charLimit}
        ref={textAreaRef}
        style={{height, borderColor: defaultValue !== value ? lowWarningColor : undefined}}
      />
      {buttons}
    </Root>
  );
};

export default UserNote;
