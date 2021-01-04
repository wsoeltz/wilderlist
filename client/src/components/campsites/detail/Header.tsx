import upperFirst from 'lodash/upperFirst';
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { setCampsiteOgImageUrl } from '../../../routing/routes';
import { mountainDetailLink } from '../../../routing/Utils';
import {
  lowWarningColorDark,
} from '../../../styling/styleUtils';
import {
  Campsite,
  CreatedItemStatus,
  State,
} from '../../../types/graphQLTypes';

const CampsiteNameHeader = styled.div`
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
  id: Campsite['id'];
  name: Campsite['name'];
  type: Campsite['type'];
  state: {
    name: State['name'];
    abbreviation: State['abbreviation'];
  };
  status: Campsite['status'];
}

const Header = (props: Props) => {
  const {
    setOwnMetaData, id, name, state,
    status,
  } = props;

  const getString = useFluent();
  const type = upperFirst(getString('global-formatted-campsite-type', {type: props.type}));

  const title = status === CreatedItemStatus.pending ? (
    <div>
      <Title style={{marginBottom: 0}}>{name}</Title>
      <Subtitle>{getString('mountain-detail-pending-approval')}</Subtitle>
    </div>
  ) : (
    <Title>{name}</Title>
  );

  const metaDescription = getString('meta-data-campsite-detail-description', {
    name, type, state: state.name,
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
      <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + mountainDetailLink(id)} />
      <meta property='og:image' content={setCampsiteOgImageUrl(id)} />
    </Helmet>
  ) : null;

  return (
    <>
      {metaData}
      <CampsiteNameHeader>
        {title}
      </CampsiteNameHeader>
      <Details>
        <span>{type} in {state.name}</span>
      </Details>
    </>
  );
};

export default Header;
