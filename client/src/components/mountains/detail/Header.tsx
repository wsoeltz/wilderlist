import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { setMountainOgImageUrl } from '../../../routing/routes';
import { mountainDetailLink } from '../../../routing/Utils';
import {
  lowWarningColorDark,
} from '../../../styling/styleUtils';
import {
  CreatedItemStatus,
  Mountain,
  State,
} from '../../../types/graphQLTypes';
import ActionButton from './ActionButton';

const MountainNameHeader = styled.div`
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

const Subtitle = styled.em`
  color: ${lowWarningColorDark};
`;

interface Props {
  setOwnMetaData: boolean;
  authorId: string | null;
  id: Mountain['id'];
  name: Mountain['name'];
  elevation: Mountain['elevation'];
  state: {
    name: State['name'];
    abbreviation: State['abbreviation'];
  };
  status: Mountain['status'];
}

const Header = (props: Props) => {
  const {
    setOwnMetaData, elevation, authorId, id, name, state,
    status,
  } = props;

  const getString = useFluent();

  const title = status === CreatedItemStatus.pending ? (
    <div>
      <Title style={{marginBottom: 0}}>{name}</Title>
      <Subtitle>{getString('mountain-detail-pending-approval')}</Subtitle>
    </div>
  ) : (
    <Title>{name}</Title>
  );

  const metaDescription = getString('meta-data-mountain-detail-description', {
    name, elevation, state: state && state.abbreviation ? ', ' + state.abbreviation : '',
    additionaltext: '',
  });

  const metaData = setOwnMetaData === true ? (
    <Helmet>
      <title>{getString('meta-data-detail-default-title', {
        title: `${name}, ${state.name}`,
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
      <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + mountainDetailLink(id)} />
      <meta property='og:image' content={setMountainOgImageUrl(id)} />
    </Helmet>
  ) : null;

  return (
    <>
      {metaData}
      <MountainNameHeader>
        {title}
        <div>
          <ActionButton
            id={id}
            authorId={authorId}
          />
        </div>
      </MountainNameHeader>
      <Details>
        <span>{state.name}</span>
        <span>{elevation}ft</span>
      </Details>
    </>
  );
};

export default Header;
