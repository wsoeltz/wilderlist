import { GetString } from 'fluent-react';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../../styling/Grid';
import {
  ButtonPrimary,
  InputBase,
  lightBaseColor,
  lightBorderColor,
} from '../../../styling/styleUtils';
import { User } from '../../../types/graphQLTypes';
import { UserContext } from '../../App';

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

const Settings = () => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [displayEmail, setDisplayEmail] = useState<boolean>(true);
  const [displayProfilePicture, setDisplayProfilePicture] = useState<boolean>(true);
  const [displayAccountInSearch, setDisplayAccountInSearch] = useState<boolean>(true);

  const renderProp = (user: User | null) => {
    if (!user) {
      return null;
    } else {
      return (
        <>
          <SettingsContainer>
            <div>
              <InputTitle>{getFluentString('global-text-value-profile-picture')}</InputTitle>
              <ProfileImg src={user.profilePictureUrl} />
            </div>
            <div>
              <Section>
                <InputTitle>{getFluentString('global-text-value-name')}</InputTitle>
                <DisabledInput value={user.name} readOnly={true} />
                <InputTitle>{getFluentString('global-text-value-modal-email')}</InputTitle>
                <DisabledInput value={user.email} readOnly={true} />
                <p dangerouslySetInnerHTML={{__html: getFluentString('settings-page-sync-your-account-help')}} />
                <ButtonPrimary>{getFluentString('settings-page-sync-with-google-button')}</ButtonPrimary>
              </Section>
              <Section>
                <h3>{getFluentString('settings-page-privacy-settings')}</h3>
                <PrivacyToggleItem>
                  <PrivacyToggleBox
                    type='checkbox'
                    id={'display-user-email-privacy'}
                    checked={displayEmail}
                    onChange={() => setDisplayEmail(!displayEmail)}
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
                    checked={displayProfilePicture}
                    onChange={() => setDisplayProfilePicture(!displayProfilePicture)}
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
                    id={'display-user-account-search-privacy'}
                    checked={displayAccountInSearch}
                    onChange={() => setDisplayAccountInSearch(!displayAccountInSearch)}
                  />
                  <PrivacyToggleLabel
                    htmlFor={'display-user-account-search-privacy'}
                  >
                    {getFluentString('settings-page-display-profile-in-search')}
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
    }
  };
  return (
    <ContentLeftLarge>
      <ContentBody>
        <h1>{getFluentString('header-text-menu-settings')}</h1>
        <UserContext.Consumer
          children={renderProp}
        />
      </ContentBody>
    </ContentLeftLarge>
  );
};

export default Settings;
