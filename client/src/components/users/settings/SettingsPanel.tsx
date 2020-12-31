import React, {useEffect, useRef, useState} from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {useUsersSettings} from '../../../queries/users/useUserSettings';
import {
  ButtonPrimary,
  InputBase,
  lightBaseColor,
  lightBorderColor,
} from '../../../styling/styleUtils';

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-column-gap: 3rem;
  color: ${lightBaseColor};
  max-width: 800px;
`;

const ProfileImg = styled.img`
  max-width: 100%;
  border-radius: 2000px;
`;

const StandardInput = styled(InputBase)`
  margin-bottom: 1rem;
`;

const DisabledInput = styled(StandardInput)`
  opacity: 0.7;
  background-color: ${lightBorderColor};

  &:hover {
    cursor: not-allowed;
  }
`;

const EditInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const InputButton = styled(ButtonPrimary)`
  margin-bottom: 1rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const InputTitle = styled.label`
  display: block;
  margin-bottom: 1rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const PrivacyToggleItem = styled.div`
  margin-bottom: 1rem;
`;

const PrivacyToggleBox = styled.input`
  cursor: pointer;
  margin-right: 0.6rem;
`;
const PrivacyToggleLabel = styled.label`
  cursor: pointer;
`;

interface Props {
  userId: string;
}

const SettingsPanel = ({userId}: Props) => {
  const getString = useFluent();

  const [emailValue, setEmailValue] = useState<string>('');
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const emailRefElm = useRef<HTMLInputElement | null>(null);

  const {
    loading, error, data,
    updateEmail, setHideEmail,
    setHideProfilePicture, setHideProfileInSearchResults,
    setDisableEmailNotifications,
  } = useUsersSettings(userId);

  useEffect(() => {
    if (emailRefElm && emailRefElm.current && editEmail === true) {
      emailRefElm.current.focus();
    }
  }, [emailRefElm, editEmail]);

  let output: React.ReactElement | null;
  if (loading === true) {
    output = null;
  } else if (error !== undefined) {
    output = null;
    console.error(error);
  } else if (data !== undefined) {
    const { user: {
      name, profilePictureUrl, redditId, facebookId,
      hideEmail, hideProfilePicture, hideProfileInSearch, disableEmailNotifications,
    } } = data;
    let email: React.ReactElement<any> | null;
    if (redditId) {
      if (data.user.email && editEmail === false && emailValue === '') {
        setEmailValue(data.user.email);
      }
      const InputContainer = editEmail === false ? DisabledInput : StandardInput;
      const buttonText = editEmail === false ? 'global-text-value-edit' : 'global-text-value-save';
      const onInputClick = () => {
        const editEmailWillBe = !editEmail;
        if (editEmailWillBe === false) {
          updateEmail({ variables: {id: userId, value: emailValue}});
        }
        setEditEmail(editEmailWillBe);
      };
      email = (
        <EditInputContainer>
          <InputContainer
            value={emailValue}
            readOnly={!editEmail}
            onChange={e => setEmailValue(e.target.value)}
            ref={emailRefElm}
          />
          <InputButton
            onClick={onInputClick}
          >
            {getString(buttonText)}
          </InputButton>
        </EditInputContainer>
      );
    } else {
      email = data.user.email
        ? ( <DisabledInput value={data.user.email} readOnly={true} /> )
        : ( <DisabledInput value={'-------'} readOnly={true} /> );
    }
    let helpTextFluentString: string;
    if (redditId) {
      helpTextFluentString = 'settings-page-sync-your-account-reddit';
    } else if (facebookId) {
      helpTextFluentString = 'settings-page-sync-your-account-facebook';
    } else {
      helpTextFluentString = 'settings-page-sync-your-account-help';

    }

    output = (
      <>
        <SettingsContainer>
          <div>
            <InputTitle>{getString('global-text-value-profile-picture')}</InputTitle>
            <ProfileImg src={profilePictureUrl} />
          </div>
          <div>
            <Section>
              <InputTitle>{getString('global-text-value-name')}</InputTitle>
              <DisabledInput value={name} readOnly={true} />
              <InputTitle>{getString('global-text-value-modal-email')}</InputTitle>
              {email}
              <p dangerouslySetInnerHTML={{__html: getString(helpTextFluentString)}} />
            </Section>
            <Section>
              <h3>{getString('settings-page-privacy-settings')}</h3>
              <PrivacyToggleItem>
                <PrivacyToggleBox
                  type='checkbox'
                  id={'display-user-email-privacy'}
                  checked={!hideEmail}
                  onChange={() => setHideEmail({ variables: {id: userId, value: !hideEmail}})}
                />
                <PrivacyToggleLabel
                  htmlFor={'display-user-email-privacy'}
                >
                  {getString('settings-page-display-email')}
                </PrivacyToggleLabel>
              </PrivacyToggleItem>
              <PrivacyToggleItem>
                <PrivacyToggleBox
                  type='checkbox'
                  id={'display-user-profile-picture-privacy'}
                  checked={!hideProfilePicture}
                  onChange={() => setHideProfilePicture({ variables: {id: userId, value: !hideProfilePicture}})}
                />
                <PrivacyToggleLabel
                  htmlFor={'display-user-profile-picture-privacy'}
                >
                  {getString('settings-page-display-profile-picture')}
                </PrivacyToggleLabel>
              </PrivacyToggleItem>
              <PrivacyToggleItem>
                <PrivacyToggleBox
                  type='checkbox'
                  id={'display-user-profile-in-search'}
                  checked={!hideProfileInSearch}
                  onChange={
                    () => setHideProfileInSearchResults({
                      variables: {id: userId, value: !hideProfileInSearch},
                    })
                  }
                />
                <PrivacyToggleLabel
                  htmlFor={'display-user-profile-in-search'}
                >
                  {getString('settings-page-display-profile-in-search')}
                </PrivacyToggleLabel>
              </PrivacyToggleItem>
            </Section>
            <Section>
              <h3>{getString('settings-page-notification-settings')}</h3>
              <PrivacyToggleItem>
                <PrivacyToggleBox
                  type='checkbox'
                  id={'disable-email-notifications'}
                  checked={!disableEmailNotifications}
                  onChange={
                    () => setDisableEmailNotifications({
                      variables: {id: userId, value: !disableEmailNotifications},
                    })
                  }
                />
                <PrivacyToggleLabel
                  htmlFor={'disable-email-notifications'}
                >
                  {getString('settings-page-notification-settings-email')}
                </PrivacyToggleLabel>
              </PrivacyToggleItem>
            </Section>
            <Section>
              <h3>{getString('settings-page-delete-account')}</h3>
              <p dangerouslySetInnerHTML={{__html: getString('settings-page-delete-account-text')}} />
            </Section>
          </div>
        </SettingsContainer>
      </>
    );
  } else {
    output = null;
  }
  return (
    <>
      <Helmet>
        <title>{getString('meta-data-settings-default-title')}</title>
      </Helmet>
      <div>
        <h1>{getString('header-text-menu-settings')}</h1>
        {output}
      </div>
    </>
  );
};

export default SettingsPanel;
