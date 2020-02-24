import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import styled from 'styled-components';
import Image404Url from '../../assets/images/404.gif';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { searchListDetailLink, searchMountainsDetailLink } from '../../routing/Utils';
import {ContentFull} from '../../styling/Grid';
import { ButtonPrimaryLink } from '../../styling/styleUtils';

const Root = styled(ContentFull)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
`;

const Button = styled(ButtonPrimaryLink)`
  margin: 0 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  opacity: 0.75;
  max-width: 100%;
  width: 500px;
`;

const PageNotFound = () => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  return (
    <Root>
      <Image src={Image404Url} />
      <h1>
        {getFluentString('page-not-found-404-title')}
      </h1>
      <p>
        {getFluentString('page-not-found-404-desc')}
      </p>
      <ButtonContainer>
        <Button to={searchListDetailLink('search')}>
          {getFluentString('global-text-value-search-hiking-lists')}
        </Button>
        <Button to={searchMountainsDetailLink('search')}>
          {getFluentString('global-text-value-search-mountains')}
        </Button>
      </ButtonContainer>
      <p>
        <small
          dangerouslySetInnerHTML={{__html: getFluentString('page-not-found-404-contact')}}
        />
      </p>
    </Root>
    );
};

export default PageNotFound;
