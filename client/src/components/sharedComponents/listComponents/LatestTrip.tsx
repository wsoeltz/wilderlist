import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  BasicIconInText,
  SemiBold,
  Subtext,
} from '../../../styling/styleUtils';
import {CoreItem} from '../../../types/itemTypes';
import LastHikedText from '../detailComponents/header/LastHikedText';

const Root = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
`;

interface Props {
  item: CoreItem;
  id: string;
}

const LatestTrip = ({item, id}: Props) => {
  const getString = useFluent();
  return (
    <Root>
      <BasicIconInText icon={faCalendarAlt} />
      <div>
        <Subtext>
          <em>{getString('global-text-value-last-trip-dynamic', {type: item + 's'})}</em>
        </Subtext>
        <div>
          <small>
            <SemiBold>
              <LastHikedText
                loading={false}
                item={item}
                id={id}
                subtleIncomplete={true}
                subtleComplete={true}
              />
            </SemiBold>
          </small>
        </div>
      </div>
    </Root>
  );
};

export default LatestTrip;
