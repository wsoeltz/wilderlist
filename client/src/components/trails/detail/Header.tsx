import upperFirst from 'lodash/upperFirst';
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { setTrailOgImageUrl } from '../../../routing/routes';
import { trailDetailLink } from '../../../routing/Utils';
import {
  State,
  Trail,
} from '../../../types/graphQLTypes';

const TrailNameHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Details = styled.h2`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 400;
`;

const Title = styled.h1`
  margin: 0;
`;

interface Props {
  setOwnMetaData: boolean;
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  states: Array<{
    name: State['name'];
    abbreviation: State['abbreviation'];
  }>;
}

const Header = (props: Props) => {
  const {
    setOwnMetaData, id, name, states,
  } = props;

  const getString = useFluent();
  const type = upperFirst(getString('global-formatted-trail-type', {type: props.type}));

  const stateText = states.map(s => s.name).join(', ');

  const metaDescription = getString('meta-data-trail-detail-description', {
    name, type, state: stateText,
  });

  const metaData = setOwnMetaData === true ? (
    <Helmet>
      <title>{getString('meta-data-detail-default-title', {
        title: `${name}`,
      })}</title>
      <meta
        name='description'
        content={metaDescription}
      />
      <meta property='og:title' content='Wilderlist' />
      <meta
        property='og:description'
        content={metaDescription}
      />
      <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + trailDetailLink(id)} />
      <meta property='og:image' content={setTrailOgImageUrl(id)} />
    </Helmet>
  ) : null;

  return (
    <>
      {metaData}
      <TrailNameHeader>
        <Title>{name}</Title>
      </TrailNameHeader>
      <Details>
        <span>{type} in {stateText}</span>
      </Details>
    </>
  );
};

export default Header;
