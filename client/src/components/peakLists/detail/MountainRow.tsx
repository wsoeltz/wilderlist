import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  MountainDatum,
} from '../../../queries/lists/usePeakListDetail';
import {
  mountainDetailLink,
} from '../../../routing/Utils';
import {
  ButtonSecondary,
  lightBaseColor,
  lightBorderColor,
  SemiBold,
  semiBoldFontBoldWeight,
  successColor,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import {
  formatDate,
  formatGridDate,
} from '../../../utilities/dateUtils';
import {
  failIfValidOrNonExhaustive,
  formatNumberWithCommas,
  mobileSize,
} from '../../../Utils';
import { Months, Seasons } from '../../../Utils';
import {VariableDate} from './getCompletionDates';
import { MountainToEdit } from './MountainTable';

export const horizontalPadding = 0.6; // in rem
export const smallPadding = 0.4; // in rem
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
  margin: 0;
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
  line-height: 1.4;

  @media ${smallColumnMediaQuery} {
    font-size: 1rem;
  }
`;

const TableCell = styled(TableCellBase)`
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

const EmptyDate = styled.div`
  text-align: center;
`;

const MountainButton = styled(TableCellBase)`
  justify-content: flex-end;
`;

const MarkDoneButton = styled(ButtonSecondary)`
  @media ${smallColumnMediaQuery} {
    font-size: 0.7rem;
    padding: 0.3rem;
  }
`;

const NotAvailable = styled.div`
  text-transform: uppercase;
  opacity: 0.7;
  font-size: 0.8rem;
`;

const CompletedDate = ({date}: {date: string}) => (
  <CompletedDateText>
    <CheckMark icon='check' />
    {date}
  </CompletedDateText>
);

const MemoizedDate = React.memo(CompletedDate);

export type MountainDatumWithDate = MountainDatum & {completionDates: VariableDate | null};

interface Props {
  index: number;
  mountain: MountainDatumWithDate;
  type: PeakListVariants;
  setEditMountainId: (mountainToEdit: MountainToEdit) => void;
  isOtherUser: boolean;
  disableLinks: undefined | boolean;
  showCount: undefined | boolean;
  customAction: undefined | ((mountain: MountainDatum) => void) | ((mountain: MountainDatumWithDate) => void);
  customActionText: undefined | React.ReactNode;
}

const MountainRow = (props: Props) => {
  const {
    index, mountain, type, setEditMountainId, isOtherUser,
    disableLinks, showCount, customAction, customActionText,
  } = props;
  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;
  const borderColor: React.CSSProperties['borderColor'] = (index % 2 === 0) ? undefined : '#fff';
  const completeButtonText = type !== PeakListVariants.grid ? 'Mark Done' : '';
  const completeButton = (target: Months | Seasons | null) => isOtherUser
    ? (<EmptyDate>{'—'}</EmptyDate>) : (
      <MarkDoneButton onClick={() => setEditMountainId({...mountain, target})}>
        <CalendarButton icon='calendar-alt' /> {completeButtonText}
      </MarkDoneButton>
    );

  let peakCompletedContent: React.ReactElement<any> | null = completeButton(null);
  const { completionDates } = mountain;
  if (completionDates !== undefined && completionDates !== null ) {
    if (completionDates.type === PeakListVariants.standard) {
      if (completionDates.standard !== null && completionDates.standard !== undefined) {
        const formattedDate = formatDate(completionDates.standard);
        peakCompletedContent = <MemoizedDate date={formattedDate} />;
      }
    } else if (completionDates.type === PeakListVariants.winter) {
      if (completionDates.winter !== null && completionDates.winter !== undefined) {
        const formattedDate = formatDate(completionDates.winter);
        peakCompletedContent = <MemoizedDate date={formattedDate} />;
      }
    } else if (completionDates.type === PeakListVariants.fourSeason) {
      const {summer, fall, spring, winter} = completionDates;
      const summerDate = summer !== undefined
        ? <MemoizedDate date={formatDate(summer)} />
        : completeButton(Seasons.summer);
      const fallDate = fall !== undefined
        ? <MemoizedDate date={formatDate(fall)} />
        : completeButton(Seasons.fall);
      const springDate = spring !== undefined
        ? <MemoizedDate date={formatDate(spring)} />
        : completeButton(Seasons.spring);
      const winterDate = winter !== undefined
        ? <MemoizedDate date={formatDate(winter)} />
        : completeButton(Seasons.winter);
      peakCompletedContent = (
        <>
          <TableCell
            style={{backgroundColor}}
          >
            {summerDate}
          </TableCell>
          <TableCell
            style={{backgroundColor}}
          >
            {fallDate}
          </TableCell>
          <TableCell
            style={{backgroundColor}}
          >
            {winterDate}
          </TableCell>
          <TableCell
            style={{backgroundColor}}
          >
            {springDate}
          </TableCell>
        </>
      );
    } else if (completionDates.type === PeakListVariants.grid) {
      const {
        january, february, march, april,
        may, june, july, august, september,
        october, november, december,
      } = completionDates;
      const januaryDate = january !== undefined
        ? <CompletedDateText>{formatGridDate(january)}</CompletedDateText>
        : completeButton(Months.january);
      const februaryDate = february !== undefined
        ? <CompletedDateText>{formatGridDate(february)}</CompletedDateText>
        : completeButton(Months.february);
      const marchDate = march !== undefined
        ? <CompletedDateText>{formatGridDate(march)}</CompletedDateText>
        : completeButton(Months.march);
      const aprilDate = april !== undefined
        ? <CompletedDateText>{formatGridDate(april)}</CompletedDateText>
        : completeButton(Months.april);
      const mayDate = may !== undefined
        ? <CompletedDateText>{formatGridDate(may)}</CompletedDateText>
        : completeButton(Months.may);
      const juneDate = june !== undefined
        ? <CompletedDateText>{formatGridDate(june)}</CompletedDateText>
        : completeButton(Months.june);
      const julyDate = july !== undefined
        ? <CompletedDateText>{formatGridDate(july)}</CompletedDateText>
        : completeButton(Months.july);
      const augustDate = august !== undefined
        ? <CompletedDateText>{formatGridDate(august)}</CompletedDateText>
        : completeButton(Months.august);
      const septemberDate = september !== undefined
        ? <CompletedDateText>{formatGridDate(september)}</CompletedDateText>
        : completeButton(Months.september);
      const octoberDate = october !== undefined
        ? <CompletedDateText>{formatGridDate(october)}</CompletedDateText>
        : completeButton(Months.october);
      const novemberDate = november !== undefined
        ? <CompletedDateText>{formatGridDate(november)}</CompletedDateText>
        : completeButton(Months.november);
      const decemberDate = december !== undefined
        ? <CompletedDateText>{formatGridDate(december)}</CompletedDateText>
        : completeButton(Months.december);
      peakCompletedContent = (
        <>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {januaryDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {februaryDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {marchDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {aprilDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {mayDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {juneDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {julyDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {augustDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {septemberDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {octoberDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {novemberDate}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {decemberDate}
          </GridCell>
        </>
      );
    }
  } else {
    if (type === PeakListVariants.fourSeason) {
      peakCompletedContent = (
        <>
          <TableCell style={{backgroundColor}}>
            {completeButton(Seasons.summer)}
          </TableCell>
          <TableCell style={{backgroundColor}}>
            {completeButton(Seasons.fall)}
          </TableCell>
          <TableCell style={{backgroundColor}}>
            {completeButton(Seasons.winter)}
          </TableCell>
          <TableCell style={{backgroundColor}}>
            {completeButton(Seasons.spring)}
          </TableCell>
        </>
      );
    } else if (type === PeakListVariants.grid) {
      peakCompletedContent = (
        <>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.january)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.february)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.march)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.april)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.may)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.june)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.july)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.august)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.september)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.october)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.november)}
          </GridCell>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {completeButton(Months.december)}
          </GridCell>
        </>
      );
    }
  }

  const elevation = mountain.elevation !== null
    ? formatNumberWithCommas(mountain.elevation) + ' ft' : <NotAvailable>Not Available</NotAvailable>;

  let columnDetailContent: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    const mountainState = mountain.state ? mountain.state.abbreviation : 'N/A';
    const action = customAction && customActionText ? (
      <MountainButton style={{backgroundColor}}>
        <span onClick={() => customAction(mountain)}>{customActionText}</span>
      </MountainButton>
    ) : (
      <MountainButton style={{backgroundColor}}>
        {peakCompletedContent}
      </MountainButton>
    );
    columnDetailContent = (
      <>
        <TableCell style={{backgroundColor}}>{elevation}</TableCell>
        <TableCell style={{backgroundColor}}>
          {mountainState}
        </TableCell>
        {action}
      </>
    );
  } else if (type === PeakListVariants.fourSeason || type === PeakListVariants.grid) {
    columnDetailContent = peakCompletedContent;
  } else {
    columnDetailContent = null;
    failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
  }

  const NameContainer = type === PeakListVariants.grid || type === PeakListVariants.fourSeason
    ? GridNameCell : NameCell;

  const count = showCount ? (
    <TableCell style={{backgroundColor}}>{index + 1}</TableCell>
  ) : null;

  const name = disableLinks ? <>{mountain.name}</> : (
    <Link
      to={mountainDetailLink(mountain.id)}
    >
      <SemiBold>{mountain.name}</SemiBold>
    </Link>
  );

  return (
    <>
      {count}
      <NameContainer style={{backgroundColor}}>
        {name}
      </NameContainer>
      {columnDetailContent}
    </>
  );
};

export default React.memo(MountainRow);
