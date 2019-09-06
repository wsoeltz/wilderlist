import React from 'react';
import styled from 'styled-components';
import { mountainDetailLink } from '../../routing/Utils';
import {
  baseColor,
  lightBorderColor,
  successColor,
} from '../../styling/styleUtils';
import { Mountain } from '../../types/graphQLTypes';
import {
  MountainName,
  NameCell,
  TableCellBase,
} from '../peakListDetail/MountainRow';
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
`;

interface Props {
  userMountains: AscentGoals[];
  myMountains: AscentGoals[];
  mountain: MountainDatumLite;
  index: number;
}

const ComparisonTable = (props: Props) => {
  const { mountain, index, myMountains, userMountains } = props;
  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;

  const userCompletedDates = userMountains.find(({mountainId}) => mountainId === mountain.id);
  const myCompletedDates = myMountains.find(({mountainId}) => mountainId === mountain.id);

  let userStyles: React.CSSProperties;
  let myStyles: React.CSSProperties;
  let userText: string;
  let myText: string;
  if (myCompletedDates !== undefined && userCompletedDates !== undefined) {
    const userGoalText = getGoalText(userCompletedDates);
    const myGoalText = getGoalText(myCompletedDates);
    userText = userGoalText.text;
    myText = myGoalText.text;
    userStyles = {
      opacity: userGoalText.open === false ? 0.7 : 1,
      color: userGoalText.open === false ? successColor : baseColor,
    };
    myStyles = {
      opacity: myGoalText.open === false ? 0.7 : 1,
      color: myGoalText.open === false ? successColor : baseColor,
    };
  } else {
    userText = 'Open';
    myText = 'Open';
    userStyles = {};
    myStyles = {};
  }

  return (
    <>
      <NameCell style={{backgroundColor}}>
        <MountainName to={mountainDetailLink(mountain.id)}>
          {mountain.name}
        </MountainName>
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

export default ComparisonTable;
