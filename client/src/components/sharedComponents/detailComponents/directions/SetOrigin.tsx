import {
  faMapMarkerAlt,
  faStreetView,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {OriginLocation} from '../../../../hooks/directions/useDirectionsOrigin';
import useFluent from '../../../../hooks/useFluent';
import {
  BlockTitle,
  CenteredHeader,
  EmptyBlock,
} from '../../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  ButtonPrimary,
} from '../../../../styling/styleUtils';
import LoadingSimple from '../../LoadingSimple';
import Search from '../../search';

const Root = styled.div`
  display: flex;
  width: 100%;
  min-height: 11.15rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
`;

const Content = styled(CenteredHeader)`
  flex-direction: column;
  text-align: left;
`;

const SeperatorText = styled(BlockTitle)`
  margin-top: 0.5rem;
`;

const Container = styled.div`
  width: 80%;
`;

interface Props {
  error: string | undefined;
  loading: boolean;
  updateLocation: (d: OriginLocation | null) => void;
  getUsersLocation: () => void;
}

const SetOrigin = (props: Props) => {
  const getString = useFluent();
  const {error, updateLocation, getUsersLocation, loading} = props;
  const button = error ? (
    <div>{error}</div>
  ) : (
    <ButtonPrimary onClick={getUsersLocation}>
      <BasicIconInText icon={faStreetView} />
      {getString('directions-your-location')}
    </ButtonPrimary>
  );
  if (loading) {
    return (
      <Root>
        <EmptyBlock>
          <CenteredHeader>
            <LoadingSimple />
          </CenteredHeader>
        </EmptyBlock>
      </Root>
    );
  }
  return (
    <Root>
      <EmptyBlock>
        <Content>
          <BlockTitle>{getString('directions-select-origin')}:</BlockTitle>
          <Container>
            <Search
              endpoint={'/api/geo-search'}
              ignore={[]}
              onSelect={updateLocation}
              placeholder={getString('global-text-value-search-geo')}
              customIcon={faMapMarkerAlt}
            />
          </Container>
          <SeperatorText>— {getString('global-text-value-or')} —</SeperatorText>
          {button}
        </Content>
      </EmptyBlock>
    </Root>
  );
};

export default SetOrigin;
