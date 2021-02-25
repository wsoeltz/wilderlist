import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import React from 'react';
import styled from 'styled-components/macro';
import {
  ButtonOutline,
  incompleteColor,
  primaryColor,
} from '../../../../../styling/styleUtils';
import {CoreItems} from '../../../../../types/itemTypes';
import {
  Icon,
  Root,
} from './Utils';

const Content = styled.div`
  line-height: 1.2;
  padding-right: 2rem;
`;

const NotHikedText = styled.div`
  color: ${incompleteColor};
`;

const AscentButton = styled(ButtonOutline)`
  display: flex;
  align-items: center;
  width: min-content;
  text-align: left;
  margin-left: auto;
  padding: 0.2rem 0.4rem;
  font-size: 0.6rem;
`;

const AscentIcon = styled(Icon)`
  color: ${primaryColor};
  margin-right: 0.45rem;
`;

interface Props {
  id: string;
  itemType: CoreItems;
  getString: GetString;
}

const LastAscent = ({getString, itemType}: Props) => {
  return (
    <Root>
      <Icon icon={faCalendarAlt} />
      <Content>
        <small>
          <em>{getString('last-trip-dynamic', {type: itemType})}</em>
        </small>
        <NotHikedText>
          {getString('global-text-value-not-done-dynamic', {type: itemType})}
        </NotHikedText>
      </Content>
      <AscentButton>
        <AscentIcon icon={faCalendarAlt} />
        <div>
          {getString('map-add-ascent')}
        </div>
      </AscentButton>
    </Root>
  );
};

export default LastAscent;
