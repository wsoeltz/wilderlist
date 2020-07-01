import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { comparePeakListWithMountainDetailLink, mountainDetailLink } from '../../../routing/Utils';
import {
  baseColor,
  lightBorderColor,
  SemiBold,
  successColor,
} from '../../../styling/styleUtils';
import { Mountain } from '../../../types/graphQLTypes';
import DynamicLink from '../../sharedComponents/DynamicLink';
import {
  NameCell,
  TableCellBase,
} from '../detail/MountainRow';
import {
  AscentGoals,
  getGoalText,
} from './Utils';

export interface MountainDatumLite {
  id: Mountain['id'];
  name: Mountain['name'];
}

const TableCell = styled(TableCellBase)`
  justify-content: center;
  text-align: center;
`;

interface Props {
  userMountains: AscentGoals[];
  myMountains: AscentGoals[];
  mountain: MountainDatumLite;
  friendId: string;
  peakListId: string;
  index: number;
}

const ComparisonRow = (props: Props) => {
  const {
    mountain, index, myMountains, userMountains,
    friendId, peakListId,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;

  const userCompletedDates = userMountains.find(({mountainId}) => mountainId === mountain.id);
  const myCompletedDates = myMountains.find(({mountainId}) => mountainId === mountain.id);

  const userGoalText = getGoalText(userCompletedDates, getFluentString);
  const myGoalText = getGoalText(myCompletedDates, getFluentString);
  const userText = userGoalText.text;
  const myText = myGoalText.text;

  let userStyles: React.CSSProperties;
  let myStyles: React.CSSProperties;
  if (userGoalText.open === false) {
    userStyles = {
      opacity: 0.7,
      color: successColor,
    };
  } else if (userGoalText.open === true) {
    userStyles = {
      opacity: 1,
      color: baseColor,
    };
  } else if (userGoalText.open === null) {
    userStyles = {
      opacity: 0.7,
      color: baseColor,
    };
  } else {
    userStyles = {};
  }
  if (myGoalText.open === false) {
    myStyles = {
      opacity: 0.7,
      color: successColor,
    };
  } else if (myGoalText.open === true) {
    myStyles = {
      opacity: 1,
      color: baseColor,
    };
  } else if (myGoalText.open === null) {
    myStyles = {
      opacity: 0.5,
      color: baseColor,
    };
  } else {
    myStyles = {};
  }

  return (
    <>
      <NameCell style={{backgroundColor}}>
        <DynamicLink
          desktopURL={comparePeakListWithMountainDetailLink(friendId, peakListId, mountain.id)}
          mobileURL={mountainDetailLink(mountain.id)}
         >
          <SemiBold>{mountain.name}</SemiBold>
        </DynamicLink>
      </NameCell>
      <TableCell style={{ gridColumn: 2, backgroundColor}}>
        <span style={userStyles}>
          {userText}
        </span>
      </TableCell>
      <TableCell style={{ gridColumn: 3, backgroundColor}}>
        <span style={myStyles}>
          {myText}
        </span>
      </TableCell>
    </>
  );

};

export default ComparisonRow;
