import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
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
  failIfValidOrNonExhaustive,
  formatNumberWithCommas,
  mobileSize,
} from '../../../Utils';
import { Months, Seasons } from '../../../Utils';
import {
  formatDate,
  formatGridDate,
} from '../Utils';
import {VariableDate} from './getCompletionDates';
import { MountainToEdit } from './MountainTable';
import {
  MountainDatum,
} from './PeakListDetail';

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

export type MountainDatumWithDate = MountainDatum & {completionDates: VariableDate | null};

interface Props {
  index: number;
  mountain: MountainDatumWithDate;
  type: PeakListVariants;
  setEditMountainId: (mountainToEdit: MountainToEdit) => void;
  isOtherUser: boolean;
  disableLinks: undefined | boolean;
  showCount: undefined | boolean;
  customAction: undefined | ((mountain: MountainDatum) => void);
  customActionText: undefined | React.ReactNode;
}

const MountainRow = (props: Props) => {
  const {
    index, mountain, type, setEditMountainId, isOtherUser,
    disableLinks, showCount, customAction, customActionText,
  } = props;
  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;
  const borderColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : '#fff';
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
        peakCompletedContent = <CompletedDate date={formattedDate} />;
      }
    } else if (completionDates.type === PeakListVariants.winter) {
      if (completionDates.winter !== null && completionDates.winter !== undefined) {
        const formattedDate = formatDate(completionDates.winter);
        peakCompletedContent = <CompletedDate date={formattedDate} />;
      }
    } else if (completionDates.type === PeakListVariants.fourSeason) {
      const {summer, fall, spring, winter} = completionDates;
      const summerDate = summer !== undefined
        ? <CompletedDate date={formatDate(summer)} />
        : completeButton(Seasons.summer);
      const fallDate = fall !== undefined
        ? <CompletedDate date={formatDate(fall)} />
        : completeButton(Seasons.fall);
      const springDate = spring !== undefined
        ? <CompletedDate date={formatDate(spring)} />
        : completeButton(Seasons.spring);
      const winterDate = winter !== undefined
        ? <CompletedDate date={formatDate(winter)} />
        : completeButton(Seasons.winter);
      peakCompletedContent = (
        <>
          <TableCell
            style={{backgroundColor}}
            children={summerDate}
          />
          <TableCell
            style={{backgroundColor}}
            children={fallDate}
          />
          <TableCell
            style={{backgroundColor}}
            children={winterDate}
          />
          <TableCell
            style={{backgroundColor}}
            children={springDate}
          />
        </>
      );
    } else if (completionDates.type === PeakListVariants.grid) {
      const {
        january, february, march, april,
        may, june, july, august, september,
        october, november, december,
      } = completionDates;
      const januaryDate = january !== undefined
        ? <CompletedDateText children={<>{formatGridDate(january)}</>} />
        : completeButton(Months.january);
      const februaryDate = february !== undefined
        ? <CompletedDateText children={<>{formatGridDate(february)}</>} />
        : completeButton(Months.february);
      const marchDate = march !== undefined
        ? <CompletedDateText children={<>{formatGridDate(march)}</>} />
        : completeButton(Months.march);
      const aprilDate = april !== undefined
        ? <CompletedDateText children={<>{formatGridDate(april)}</>} />
        : completeButton(Months.april);
      const mayDate = may !== undefined
        ? <CompletedDateText children={<>{formatGridDate(may)}</>} />
        : completeButton(Months.may);
      const juneDate = june !== undefined
        ? <CompletedDateText children={<>{formatGridDate(june)}</>} />
        : completeButton(Months.june);
      const julyDate = july !== undefined
        ? <CompletedDateText children={<>{formatGridDate(july)}</>} />
        : completeButton(Months.july);
      const augustDate = august !== undefined
        ? <CompletedDateText children={<>{formatGridDate(august)}</>} />
        : completeButton(Months.august);
      const septemberDate = september !== undefined
        ? <CompletedDateText children={<>{formatGridDate(september)}</>} />
        : completeButton(Months.september);
      const octoberDate = october !== undefined
        ? <CompletedDateText children={<>{formatGridDate(october)}</>} />
        : completeButton(Months.october);
      const novemberDate = november !== undefined
        ? <CompletedDateText children={<>{formatGridDate(november)}</>} />
        : completeButton(Months.november);
      const decemberDate = december !== undefined
        ? <CompletedDateText children={<>{formatGridDate(december)}</>} />
        : completeButton(Months.december);
      peakCompletedContent = (
        <>
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={januaryDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={februaryDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={marchDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={aprilDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={mayDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={juneDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={julyDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={augustDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={septemberDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={octoberDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={novemberDate}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={decemberDate}
          />
        </>
      );
    }
  } else {
    if (type === PeakListVariants.fourSeason) {
      peakCompletedContent = (
        <>
          <TableCell
            style={{backgroundColor}}
            children={completeButton(Seasons.summer)}
          />
          <TableCell
            style={{backgroundColor}}
            children={completeButton(Seasons.fall)}
          />
          <TableCell
            style={{backgroundColor}}
            children={completeButton(Seasons.winter)}
          />
          <TableCell
            style={{backgroundColor}}
            children={completeButton(Seasons.spring)}
          />
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
            children={completeButton(Months.january)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.february)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.march)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.april)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.may)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.june)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.july)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.august)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.september)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.october)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.november)}
          />
          <GridCell
            style={{
              backgroundColor,
              borderColor,
            }}
            children={completeButton(Months.december)}
          />
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

export default MountainRow;
