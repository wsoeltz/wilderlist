import { faFlag } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useState } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { setMountainOgImageUrl } from '../../../routing/routes';
import { editMountainLink, mountainDetailLink } from '../../../routing/Utils';
import {
  BasicIconInText,
  CompactGhostButton,
  CompactGhostButtonLink,
  lowWarningColorDark,
} from '../../../styling/styleUtils';
import {
  CreatedItemStatus,
  Mountain,
  PermissionTypes,
  State,
  User,
} from '../../../types/graphQLTypes';
import FlagModal from './FlagModal';

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
  userId: string | null;
  user: null | {
    id: User['name'];
    permissions: User['permissions'];
    mountainPermissions: User['mountainPermissions'];
  };
  author: null | { id: User['id'] };
  id: Mountain['id'];
  name: Mountain['name'];
  elevation: Mountain['elevation'];
  state: {
    id: State['id'];
    name: State['name'];
    abbreviation: State['abbreviation'];
  };
  status: Mountain['status'];
}

const Header = (props: Props) => {
  const {
    setOwnMetaData, elevation, user, author, userId, id, name, state,
    status,
  } = props;

  const getString = useFluent();

  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
  const openFlagModal = useCallback(() => setIsFlagModalOpen(true), []);
  const closeFlagModal = useCallback(() => setIsFlagModalOpen(false), []);

  let actionButton: React.ReactElement<any> | null;
  if (!user) {
    actionButton = null;
  } else {
    actionButton = (author && author.id && author.id === userId
              && user.mountainPermissions !== -1) || user.permissions === PermissionTypes.admin ? (
      <CompactGhostButtonLink to={editMountainLink(id)}>
        {getString('global-text-value-edit')}
      </CompactGhostButtonLink>
    ) : (
      <CompactGhostButton onClick={openFlagModal}>
        <BasicIconInText icon={faFlag} />
        {getString('global-text-value-flag')}
      </CompactGhostButton>
    );
  }

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

  const flagModal = isFlagModalOpen === false ? null : (
    <FlagModal
      onClose={closeFlagModal}
      mountainId={id}
      mountainName={name}
    />
  );

  return (
    <>
      {metaData}
      <MountainNameHeader>
        {title}
        <div>
          {actionButton}
        </div>
      </MountainNameHeader>
      <Details>
        <span>{state.name}</span>
        <span>{elevation}ft</span>
      </Details>
      {flagModal}
    </>
  );
};

export default Header;
