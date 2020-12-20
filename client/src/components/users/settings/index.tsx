import { gql, useMutation, useQuery } from '@apollo/client';
import { GetString } from 'fluent-react/compat';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentFull,
} from '../../../styling/Grid';
import {
  ButtonPrimary,
  InputBase,
  lightBaseColor,
  lightBorderColor,
} from '../../../styling/styleUtils';
import { User } from '../../../types/graphQLTypes';

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

const GET_USER_PROFILE_DATA = gql`
  query getUserPrivacyData($id: ID!) {
    user(id: $id) {
      id
      name
      email
      redditId
      facebookId
      profilePictureUrl
      hideEmail
      hideProfilePicture
      hideProfileInSearch
      disableEmailNotifications
    }
  }
`;

interface QuerySuccess {
  user: {
    id: User['id'];
    name: User['name'];
    email: User['email'];
    redditId: User['redditId'];
    facebookId: User['facebookId'];
    profilePictureUrl: User['profilePictureUrl'];
    hideEmail: User['hideEmail'];
    hideProfilePicture: User['hideProfilePicture'];
    hideProfileInSearch: User['hideProfileInSearch'];
    disableEmailNotifications: User['disableEmailNotifications'];
  };
}

interface QueryVariables {
  id: string;
}

const UPDATE_EMAIL = gql`
  mutation updateEmail($id: ID!, $value: String!) {
    user: updateEmail(id: $id, value: $value) {
      id
    }
  }
`;

const SET_HIDE_EMAIL = gql`
  mutation setHideEmail($id: ID!, $value: Boolean!) {
    user: setHideEmail(id: $id, value: $value) {
      id
    }
  }
`;

const SET_HIDE_PROFILE_PICTURE = gql`
  mutation setHideProfilePicture($id: ID!, $value: Boolean!) {
    user: setHideProfilePicture(id: $id, value: $value) {
      id
    }
  }
`;

const SET_HIDE_PROFILE_IN_SEARCH_RESULTS = gql`
  mutation setHideProfileInSearchResults($id: ID!, $value: Boolean!) {
    user: setHideProfileInSearchResults(id: $id, value: $value) {
      id
    }
  }
`;

const SET_DISABLE_EMAIL_NOTIFICATIONS = gql`
  mutation setDisableEmailNotifications($id: ID!, $value: Boolean!) {
    user: setDisableEmailNotifications(id: $id, value: $value) {
      id
    }
  }
`;

interface MutationSuccess {
  user: {
    id: User['id'];
  };
}

interface MutationVariables {
  id: string;
  value: boolean;
}

interface EditEmailVariables {
  id: string;
  value: string;
}

interface Props {
  userId: string;
}

const Settings = ({userId}: Props) => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [emailValue, setEmailValue] = useState<string>('');
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const emailRefElm = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (emailRefElm && emailRefElm.current && editEmail === true) {
      emailRefElm.current.focus();
    }
  }, [emailRefElm, editEmail]);

  const {loading, error, data} = useQuery<QuerySuccess, QueryVariables>(GET_USER_PROFILE_DATA, {
    variables: { id: userId },
  });

  const [updateEmail] = useMutation<MutationSuccess, EditEmailVariables>(UPDATE_EMAIL, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideEmail] = useMutation<MutationSuccess, MutationVariables>(SET_HIDE_EMAIL, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideProfilePicture] = useMutation<MutationSuccess, MutationVariables>(SET_HIDE_PROFILE_PICTURE, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideProfileInSearchResults] =
    useMutation<MutationSuccess, MutationVariables>(SET_HIDE_PROFILE_IN_SEARCH_RESULTS, {
      refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
    });
  const [setDisableEmailNotifications] =
    useMutation<MutationSuccess, MutationVariables>(SET_DISABLE_EMAIL_NOTIFICATIONS, {
      refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
    });

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
            {getFluentString(buttonText)}
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
            <InputTitle>{getFluentString('global-text-value-profile-picture')}</InputTitle>
            <ProfileImg src={profilePictureUrl} />
          </div>
          <div>
            <Section>
              <InputTitle>{getFluentString('global-text-value-name')}</InputTitle>
              <DisabledInput value={name} readOnly={true} />
              <InputTitle>{getFluentString('global-text-value-modal-email')}</InputTitle>
              {email}
              <p dangerouslySetInnerHTML={{__html: getFluentString(helpTextFluentString)}} />
            </Section>
            <Section>
              <h3>{getFluentString('settings-page-privacy-settings')}</h3>
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
                  {getFluentString('settings-page-display-email')}
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
                  {getFluentString('settings-page-display-profile-picture')}
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
                  {getFluentString('settings-page-display-profile-in-search')}
                </PrivacyToggleLabel>
              </PrivacyToggleItem>
            </Section>
            <Section>
              <h3>{getFluentString('settings-page-notification-settings')}</h3>
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
                  {getFluentString('settings-page-notification-settings-email')}
                </PrivacyToggleLabel>
              </PrivacyToggleItem>
            </Section>
            <Section>
              <h3>{getFluentString('settings-page-delete-account')}</h3>
              <p dangerouslySetInnerHTML={{__html: getFluentString('settings-page-delete-account-text')}} />
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
        <title>{getFluentString('meta-data-settings-default-title')}</title>
      </Helmet>
      <ContentFull>
        <ContentBody>
          <h1>{getFluentString('header-text-menu-settings')}</h1>
          {output}
        </ContentBody>
      </ContentFull>
    </>
  );
};

export default Settings;
