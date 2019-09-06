import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { mountainDetailLink } from '../../routing/Utils';
import {
  ButtonSecondary,
  lightBaseColor,
  lightBorderColor,
  semiBoldFontBoldWeight,
} from '../../styling/styleUtils';
import { CompletedMountain, PeakListVariants } from '../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
  formatNumberWithCommas,
} from '../../Utils';
import { Months, Seasons } from '../../Utils';
import {
  formatDate,
  getFourSeasonCompletion,
  getGridCompletion,
  getStandardCompletion,
  getWinterCompletion,
} from '../peakLists/Utils';
import {
  MountainDatum,
} from './index';

export const nameColumn = 1;
export const elevationColumn = 2;
export const prominenceColumn = 3;
export const buttonColumn = 4;
export const horizontalPadding = 0.6; // in rem

export const seasonColumns = {
  [Seasons.summer]: 2,
  [Seasons.fall]: 3,
  [Seasons.winter]: 4,
  [Seasons.spring]: 5,
};

export const monthColumns = {
  [Months.january]: 2,
  [Months.february]: 3,
  [Months.march]: 4,
  [Months.april]: 5,
  [Months.may]: 6,
  [Months.june]: 7,
  [Months.july]: 8,
  [Months.august]: 9,
  [Months.september]: 10,
  [Months.october]: 11,
  [Months.november]: 12,
  [Months.december]: 13,
};

export const TableCellBase = styled.div`
  font-weight: ${semiBoldFontBoldWeight};
  padding: 0.8rem ${horizontalPadding}rem;
  display: flex;
  align-items: center;
`;

export const NameCell = styled(TableCellBase)`
  grid-column: ${nameColumn};
  font-size: 1.2rem;
`;

const TableCell = styled(TableCellBase)`
  grid-column: ${elevationColumn};
  justify-content: center;
  color: ${lightBaseColor};
`;

export const MountainName = styled(Link)`
  font-weight: ${semiBoldFontBoldWeight};
`;

const MountainButton = styled(TableCellBase)`
  grid-column: ${buttonColumn};
  justify-content: flex-end;
`;

interface Props {
  index: number;
  mountain: MountainDatum;
  type: PeakListVariants;
  setEditMountainId: (id: string) => void;
  userMountains: CompletedMountain[];
}

const MountainRow = (props: Props) => {
  const { index, mountain, type, setEditMountainId, userMountains } = props;
  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;
  const completeButton: React.ReactElement = (
    <ButtonSecondary onClick={() => setEditMountainId(mountain.id)}>
      Mark done
    </ButtonSecondary>
  );

  let peakCompletedContent: React.ReactElement<any> | null = completeButton;
  const completedDates = userMountains.find(
    (completedMountain) => completedMountain.mountain.id === mountain.id);
  if (completedDates !== undefined) {
    if (type === PeakListVariants.standard) {
      const completedDate = getStandardCompletion(completedDates);
      if (completedDate !== null && completedDate !== undefined) {
        const formattedDate = formatDate(completedDate);
        peakCompletedContent = <em>{formattedDate}</em>;
      }
    } else if (type === PeakListVariants.winter) {
      const completedDate = getWinterCompletion(completedDates);
      if (completedDate !== null && completedDate !== undefined) {
        const formattedDate = formatDate(completedDate);
        peakCompletedContent = <em>{formattedDate}</em>;
      }
    } else if (type === PeakListVariants.fourSeason) {
      const completedDate = getFourSeasonCompletion(completedDates);
      if (completedDate !== null) {
        const {summer, fall, spring, winter} = completedDate;
        const summerDate = summer !== undefined ? formatDate(summer) : completeButton;
        const fallDate = fall !== undefined ? formatDate(fall) : completeButton;
        const springDate = spring !== undefined ? formatDate(spring) : completeButton;
        const winterDate = winter !== undefined ? formatDate(winter) : completeButton;
        peakCompletedContent = (
          <>
            <TableCell
              style={{backgroundColor, gridColumn: seasonColumns[Seasons.summer]}}
              children={summerDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: seasonColumns[Seasons.fall]}}
              children={fallDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: seasonColumns[Seasons.winter]}}
              children={winterDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: seasonColumns[Seasons.spring]}}
              children={springDate}
            />
          </>
        );
      }
    } else if (type === PeakListVariants.grid) {
      const completedDate = getGridCompletion(completedDates);
      if (completedDate !== null) {
        const {
          january, february, march, april,
          may, june, july, august, september,
          october, november, december,
        } = completedDate;
        const januaryDate = january !== undefined ? formatDate(january) : completeButton;
        const februaryDate = february !== undefined ? formatDate(february) : completeButton;
        const marchDate = march !== undefined ? formatDate(march) : completeButton;
        const aprilDate = april !== undefined ? formatDate(april) : completeButton;
        const mayDate = may !== undefined ? formatDate(may) : completeButton;
        const juneDate = june !== undefined ? formatDate(june) : completeButton;
        const julyDate = july !== undefined ? formatDate(july) : completeButton;
        const augustDate = august !== undefined ? formatDate(august) : completeButton;
        const septemberDate = september !== undefined ? formatDate(september) : completeButton;
        const octoberDate = october !== undefined ? formatDate(october) : completeButton;
        const novemberDate = november !== undefined ? formatDate(november) : completeButton;
        const decemberDate = december !== undefined ? formatDate(december) : completeButton;
        peakCompletedContent = (
          <>
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.january]}}
              children={januaryDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.february]}}
              children={februaryDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.march]}}
              children={marchDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.april]}}
              children={aprilDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.may]}}
              children={mayDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.june]}}
              children={juneDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.july]}}
              children={julyDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.august]}}
              children={augustDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.september]}}
              children={septemberDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.october]}}
              children={octoberDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.november]}}
              children={novemberDate}
            />
            <TableCell
              style={{backgroundColor, gridColumn: monthColumns[Months.december]}}
              children={decemberDate}
            />
          </>
        );
      }
    } else {
      failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
    }
  } else {
    if (type === PeakListVariants.fourSeason) {
      peakCompletedContent = (
        <>
          <TableCell
            style={{backgroundColor, gridColumn: seasonColumns[Seasons.summer]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: seasonColumns[Seasons.fall]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: seasonColumns[Seasons.winter]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: seasonColumns[Seasons.spring]}}
            children={completeButton}
          />
        </>
      );
    } else if (type === PeakListVariants.grid) {
      peakCompletedContent = (
        <>
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.january]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.february]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.march]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.april]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.may]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.june]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.july]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.august]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.september]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.october]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.november]}}
            children={completeButton}
          />
          <TableCell
            style={{backgroundColor, gridColumn: monthColumns[Months.december]}}
            children={completeButton}
          />
        </>
      );
    }
  }

  const elevation = mountain.elevation !== null ? formatNumberWithCommas(mountain.elevation) + ' ft' : 'N/A';
  const prominence = mountain.prominence !== null ? formatNumberWithCommas(mountain.prominence) + ' ft' : 'N/A';

  let columnDetailContent: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    columnDetailContent = (
      <>
        <TableCell style={{backgroundColor, gridColumn: elevationColumn}}>{elevation}</TableCell>
        <TableCell style={{backgroundColor, gridColumn: prominenceColumn}}>{prominence}</TableCell>
        <MountainButton style={{backgroundColor}}>
          {peakCompletedContent}
        </MountainButton>
      </>
    );
  } else if (type === PeakListVariants.fourSeason || type === PeakListVariants.grid) {
    columnDetailContent = peakCompletedContent;
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
    columnDetailContent = null;
  }

  return (
    <>
      <NameCell style={{backgroundColor}}>
        <MountainName to={mountainDetailLink(mountain.id)}>
          {mountain.name}
        </MountainName>
      </NameCell>
      {columnDetailContent}
    </>
  );
};

export default MountainRow;
