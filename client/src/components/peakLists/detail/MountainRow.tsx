import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { listDetailWithMountainDetailLink, mountainDetailLink } from '../../../routing/Utils';
import {
  ButtonSecondary,
  lightBaseColor,
  lightBorderColor,
  semiBoldFontBoldWeight,
  successColor,
} from '../../../styling/styleUtils';
import { CompletedMountain, PeakListVariants } from '../../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
  formatNumberWithCommas,
  mobileSize,
} from '../../../Utils';
import { Months, Seasons } from '../../../Utils';
import DynamicLink from '../../sharedComponents/DynamicLink';
import {
  formatDate,
  formatGridDate,
  getFourSeasonCompletion,
  getGridCompletion,
  getStandardCompletion,
  getWinterCompletion,
} from '../Utils';
import {
  MountainDatum,
} from './PeakListDetail';

export const nameColumn = 1;
export const elevationColumn = 2;
export const prominenceColumn = 3;
export const buttonColumn = 4;
export const horizontalPadding = 0.6; // in rem
export const smallPadding = 0.5; // in rem
export const extraSmallPadding = 0.3; // in rem

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
const smallColumnMediaQuery = `(min-width: ${mobileSize}px) and (max-width: 1350px)`;

export const TableCellBase = styled.div`
  font-weight: ${semiBoldFontBoldWeight};
  padding: 0.8rem ${horizontalPadding}rem;
  display: flex;
  align-items: center;

  @media ${smallColumnMediaQuery} {
    font-size: 0.9rem;
    padding: 0.6rem ${smallPadding}rem;
  }

  @media (max-width: 360px) {
    padding: 0.5rem ${extraSmallPadding}rem;
  }
`;

export const NameCell = styled(TableCellBase)`
  grid-column: ${nameColumn};
  line-height: 1.4;

  @media ${smallColumnMediaQuery} {
    font-size: 1rem;
  }
`;

const TableCell = styled(TableCellBase)`
  grid-column: ${elevationColumn};
  justify-content: center;
  color: ${lightBaseColor};
`;

const GridNameCell = styled(NameCell)`
  font-size: 1rem;

  @media ${smallColumnMediaQuery} {
    font-size: 0.8rem;
    padding: 0.5rem ${extraSmallPadding}rem;
  }
`;

const GridCell = styled(TableCellBase)`
  font-size: 0.9rem;
  padding: 0.5rem 0.1rem;
  justify-content: center;
  border-left: solid 1px ${lightBorderColor};

  @media ${smallColumnMediaQuery} {
    padding: 0.5rem 0.1rem;
  }
`;

export const MountainName = styled(DynamicLink)`
  font-weight: ${semiBoldFontBoldWeight};
`;

const CalendarButton = styled(FontAwesomeIcon)`
  color: #fff;
`;

const CheckMark = styled(FontAwesomeIcon)`
  font-size: 1.1rem;
  margin-right: 0.3rem;
`;

const CompletedDateText = styled.div`
  color: ${successColor};
  font-size: 0.9rem;
  text-align: center;
`;

const MountainButton = styled(TableCellBase)`
  grid-column: ${buttonColumn};
  justify-content: flex-end;
`;

const MarkDoneButton = styled(ButtonSecondary)`
  @media ${smallColumnMediaQuery} {
    font-size: 0.7rem;
    padding: 0.3rem;
  }
`;

const CompletedDate = ({date}: {date: string}) => {
  return (
    <CompletedDateText>
      <CheckMark icon='check' />
      {date}
    </CompletedDateText>
  );
};

interface Props {
  index: number;
  mountain: MountainDatum;
  type: PeakListVariants;
  setEditMountainId: (id: string) => void;
  userMountains: CompletedMountain[];
  peakListId: string;
}

const MountainRow = (props: Props) => {
  const { index, mountain, type, setEditMountainId, userMountains, peakListId } = props;
  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;
  const borderColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : '#fff';
  const completeButtonText = type !== PeakListVariants.grid ? 'Mark Done' : '';
  const completeButton: React.ReactElement = (
    <MarkDoneButton onClick={() => setEditMountainId(mountain.id)}>
      <CalendarButton icon='calendar-alt' /> {completeButtonText}
    </MarkDoneButton>
  );

  let peakCompletedContent: React.ReactElement<any> | null = completeButton;
  const completedDates = userMountains.find(
    (completedMountain) => completedMountain.mountain.id === mountain.id);
  if (completedDates !== undefined) {
    if (type === PeakListVariants.standard) {
      const completedDate = getStandardCompletion(completedDates);
      if (completedDate !== null && completedDate !== undefined) {
        const formattedDate = formatDate(completedDate);
        peakCompletedContent = <CompletedDate date={formattedDate} />;
      }
    } else if (type === PeakListVariants.winter) {
      const completedDate = getWinterCompletion(completedDates);
      if (completedDate !== null && completedDate !== undefined) {
        const formattedDate = formatDate(completedDate);
        peakCompletedContent = <CompletedDate date={formattedDate} />;
      }
    } else if (type === PeakListVariants.fourSeason) {
      const completedDate = getFourSeasonCompletion(completedDates);
      if (completedDate !== null) {
        const {summer, fall, spring, winter} = completedDate;
        const summerDate = summer !== undefined
          ? <CompletedDate date={formatDate(summer)} />
          : completeButton;
        const fallDate = fall !== undefined
          ? <CompletedDate date={formatDate(fall)} />
          : completeButton;
        const springDate = spring !== undefined
          ? <CompletedDate date={formatDate(spring)} />
          : completeButton;
        const winterDate = winter !== undefined
          ? <CompletedDate date={formatDate(winter)} />
          : completeButton;
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
        const januaryDate = january !== undefined
          ? <CompletedDateText children={<>{formatGridDate(january)}</>} />
          : completeButton;
        const februaryDate = february !== undefined
          ? <CompletedDateText children={<>{formatGridDate(february)}</>} />
          : completeButton;
        const marchDate = march !== undefined
          ? <CompletedDateText children={<>{formatGridDate(march)}</>} />
          : completeButton;
        const aprilDate = april !== undefined
          ? <CompletedDateText children={<>{formatGridDate(april)}</>} />
          : completeButton;
        const mayDate = may !== undefined
          ? <CompletedDateText children={<>{formatGridDate(may)}</>} />
          : completeButton;
        const juneDate = june !== undefined
          ? <CompletedDateText children={<>{formatGridDate(june)}</>} />
          : completeButton;
        const julyDate = july !== undefined
          ? <CompletedDateText children={<>{formatGridDate(july)}</>} />
          : completeButton;
        const augustDate = august !== undefined
          ? <CompletedDateText children={<>{formatGridDate(august)}</>} />
          : completeButton;
        const septemberDate = september !== undefined
          ? <CompletedDateText children={<>{formatGridDate(september)}</>} />
          : completeButton;
        const octoberDate = october !== undefined
          ? <CompletedDateText children={<>{formatGridDate(october)}</>} />
          : completeButton;
        const novemberDate = november !== undefined
          ? <CompletedDateText children={<>{formatGridDate(november)}</>} />
          : completeButton;
        const decemberDate = december !== undefined
          ? <CompletedDateText children={<>{formatGridDate(december)}</>} />
          : completeButton;
        peakCompletedContent = (
          <>
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.january],
                borderColor,
              }}
              children={januaryDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.february],
                borderColor,
              }}
              children={februaryDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.march],
                borderColor,
              }}
              children={marchDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.april],
                borderColor,
              }}
              children={aprilDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.may],
                borderColor,
              }}
              children={mayDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.june],
                borderColor,
              }}
              children={juneDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.july],
                borderColor,
              }}
              children={julyDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.august],
                borderColor,
              }}
              children={augustDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.september],
                borderColor,
              }}
              children={septemberDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.october],
                borderColor,
              }}
              children={octoberDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.november],
                borderColor,
              }}
              children={novemberDate}
            />
            <GridCell
              style={{
                backgroundColor, gridColumn: monthColumns[Months.december],
                borderColor,
              }}
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
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.january],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.february],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.march],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.april],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.may],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.june],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.july],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.august],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.september],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.october],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.november],
              borderColor,
            }}
            children={completeButton}
          />
          <GridCell
            style={{
              backgroundColor, gridColumn: monthColumns[Months.december],
              borderColor,
            }}
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

  const NameContainer = type === PeakListVariants.grid || type === PeakListVariants.fourSeason
    ? GridNameCell : NameCell;

  return (
    <>
      <NameContainer style={{backgroundColor}}>
        <MountainName
          mobileURL={mountainDetailLink(mountain.id)}
          desktopURL={listDetailWithMountainDetailLink(peakListId, mountain.id)}
        >
          {mountain.name}
        </MountainName>
      </NameContainer>
      {columnDetailContent}
    </>
  );
};

export default MountainRow;
