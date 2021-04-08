import React from 'react';
import styled from 'styled-components/macro';
import usePointLocationData from '../../../../../../hooks/servicesHooks/pointData/usePointLocationData';
import useFluent from '../../../../../../hooks/useFluent';
import {
  CenteredHeader,
  EmptyBlock,
  Section,
  SectionTitle,
} from '../../../../../../styling/sharedContentStyles';
import {
  ButtonSecondary,
  Subtext,
} from '../../../../../../styling/styleUtils';
import FormattedCoordinates from '../../../../../sharedComponents/detailComponents/header/FormattedCoordinates';
import FormattedElevation from '../../../../../sharedComponents/detailComponents/header/FormattedElevation';
import LoadingSimple from '../../../../../sharedComponents/LoadingSimple';
import Modal from '../../../../../sharedComponents/Modal';

const Root = styled.div`
  display: flex;
  width: 100%;
  min-height: 11.15rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  text-align: left;
`;

const Content = styled(EmptyBlock)`
  text-align: left;
`;

const ButtonWrapper = styled.div`
  text-align: right;
`;

interface Props {
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const PointInfo = ({latitude, longitude, onClose}: Props) => {
  const getString = useFluent();
  const {loading, error, data} = usePointLocationData({latitude, longitude});

  let output: React.ReactElement<any> | null;
  if (loading) {
    output = (
      <Root>
        <EmptyBlock>
          <CenteredHeader>
            <LoadingSimple />
          </CenteredHeader>
        </EmptyBlock>
      </Root>
    );
  } else if (error) {
    output = (
      <Root>
        <EmptyBlock>
          <CenteredHeader>
            {getString('global-error-retrieving-data')}
          </CenteredHeader>
        </EmptyBlock>
      </Root>
    );
  } else if (data) {
    const elevation = data && data.elevation !== null && data.elevation !== undefined ? (
      <Section>
        <Subtext><SectionTitle>Elevation:</SectionTitle></Subtext>
        <FormattedElevation elevation={Math.round(data.elevation)} />
      </Section>
    ) : null;
    const county = data && data.county !== null && data.county !== undefined ? (
      <Section>
        <Subtext><SectionTitle>County:</SectionTitle></Subtext>
        <div>{data.county} County</div>
      </Section>
    ) : null;
    const state = data && data.state !== null && data.state !== undefined && data.state.name ? (
      <Section>
        <Subtext><SectionTitle>State:</SectionTitle></Subtext>
        <div>{data.state.name}</div>
      </Section>
    ) : null;
    output = (
      <Root>
        <Content>
          <h4>Point Info:</h4>
          <Section>
            <Subtext><SectionTitle>Decimal Degrees:</SectionTitle></Subtext>
            <FormattedCoordinates
              coordinates={[longitude, latitude]}
              noPadding={true}
              decimal={true}
              copyExact={true}
            />
          </Section>
          <Section>
            <Subtext><SectionTitle>Degrees Minutes Seconds:</SectionTitle></Subtext>
            <FormattedCoordinates
              coordinates={[longitude, latitude]}
              noPadding={true}
              copyExact={true}
            />
          </Section>
          {elevation}
          {county}
          {state}
        </Content>
      </Root>
    );
  } else {
    output = null;
  }

  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onClose} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
      </ButtonSecondary>
    </ButtonWrapper>
  );

  return (
    <Modal
      onClose={onClose}
      width={'500px'}
      height={'auto'}
      actions={actions}
      contentStyles={{padding: 0, marginBottom: '-1rem'}}
    >
      {output}
    </Modal>
  );

};

export default PointInfo;
