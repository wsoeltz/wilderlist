import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import styled from 'styled-components';
import useFluent from '../../hooks/useFluent';
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

  const getString = useFluent();

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
        {getString('stats-mountain-panel')}
        <Subtitle>
          {getString('stats-total-mountains', {
            total: mountainCount,
          })}
        </Subtitle>
      </SectionTitleH3>
      <div>
        <ButtonSecondary onClick={() => setAscentModalOpen(true)}>
          <FontAwesomeIcon icon='calendar-alt' /> {getString('map-add-ascent')}
        </ButtonSecondary>
      </div>
      {addAscentModal}
    </Root>
  );
};

export default Header;
