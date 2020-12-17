import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  ButtonSecondary,
  SectionTitleH3,
} from '../../styling/styleUtils';
import {
  PeakListVariants,
} from '../../types/graphQLTypes';
import NewAscentReport from '../peakLists/detail/completionModal/NewAscentReport';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
`;

const Subtitle = styled.small`
  display: block;
  text-transform: capitalize;
  margin-top: 0.3rem;
`;

interface Props {
  userId: string;
  queryRefetchArray: Array<{query: any, variables: any}>;
  mountainCount: number;
}

const Header = (props: Props) => {
  const {userId, queryRefetchArray, mountainCount} = props;

  const [ascentModalOpen, setAscentModalOpen] = useState<boolean>(false);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const addAscentModal =  ascentModalOpen ? (
    <NewAscentReport
      initialMountainList={[]}
      closeEditMountainModalModal={() => setAscentModalOpen(false)}
      userId={userId}
      variant={PeakListVariants.standard}
      queryRefetchArray={queryRefetchArray}
    />
  ) : null;

  return (
    <Root>
      <SectionTitleH3>
        {getFluentString('stats-mountain-panel')}
        <Subtitle>
          {getFluentString('stats-total-mountains', {
            total: mountainCount,
          })}
        </Subtitle>
      </SectionTitleH3>
      <div>
        <ButtonSecondary onClick={() => setAscentModalOpen(true)}>
          <FontAwesomeIcon icon='calendar-alt' /> {getFluentString('map-add-ascent')}
        </ButtonSecondary>
      </div>
      {addAscentModal}
    </Root>
  );
};

export default Header;
