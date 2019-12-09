import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../../styling/Grid';
import {
  InputBase,
  lightBaseColor,
  lightBorderColor,
} from '../../../styling/styleUtils';
import { User } from '../../../types/graphQLTypes';
// import { UserContext } from '../../App';

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-column-gap: 3rem;
  color: ${lightBaseColor};
`;

const ProfileImg = styled.img`
  max-width: 100%;
  border-radius: 2000px;
`;

const DisabledInput = styled(InputBase)`
  opacity: 0.7;
  background-color: ${lightBorderColor};
  margin-bottom: 1rem;

  &:hover {
    cursor: not-allowed;
  }
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
      profilePictureUrl
      hideEmail
      hideProfilePicture
      hideProfileInSearch
      disableEmailNotifications
    }
  }
`;

interface QuerySucces {
  user: {
    id: User['id'];
    name: User['name'];
    email: User['email'];
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

interface MutationSucces {
  user: {
    id: User['id'];
  };
}

interface MutationVariables {
  id: string;
  value: boolean;
}

interface Props {
  userId: string;
}

const Settings = ({userId}: Props) => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<QuerySucces, QueryVariables>(GET_USER_PROFILE_DATA, {
    variables: { id: userId },
  });

  const [setHideEmail] = useMutation<MutationSucces, MutationVariables>(SET_HIDE_EMAIL, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideProfilePicture] = useMutation<MutationSucces, MutationVariables>(SET_HIDE_PROFILE_PICTURE, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideProfileInSearchResults] =
    useMutation<MutationSucces, MutationVariables>(SET_HIDE_PROFILE_IN_SEARCH_RESULTS, {
      refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
    });
  const [setDisableEmailNotifications] =
    useMutation<MutationSucces, MutationVariables>(SET_DISABLE_EMAIL_NOTIFICATIONS, {
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
      name, profilePictureUrl,
      hideEmail, hideProfilePicture, hideProfileInSearch, disableEmailNotifications,
    } } = data;

    const email = data.user.email ? data.user.email : '---';

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
              <DisabledInput value={email} readOnly={true} />
              <p dangerouslySetInnerHTML={{__html: getFluentString('settings-page-sync-your-account-help')}} />
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
    <ContentLeftLarge>
      <ContentBody>
        <h1>{getFluentString('header-text-menu-settings')}</h1>
        {output}
      </ContentBody>
    </ContentLeftLarge>
  );
};

export default Settings;
