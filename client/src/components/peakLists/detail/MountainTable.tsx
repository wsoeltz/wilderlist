import { sortBy } from 'lodash';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
  lightBorderColor,
  placeholderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
  mobileSize,
  Months,
  Seasons,
} from '../../../Utils';
import MountainCompletionModal from './MountainCompletionModal';
import MountainRow from './MountainRow';
import {
  buttonColumn,
  elevationColumn,
  extraSmallPadding,
  horizontalPadding,
  monthColumns,
  nameColumn,
  prominenceColumn,
  seasonColumns,
  smallPadding,
} from './MountainRow';
import {
  MountainDatum,
  UserDatum,
} from './PeakListDetail';

const smallColumnMediaQuery = `(min-width: ${mobileSize}px) and (max-width: 1350px)`;

export const Root = styled.div`
  display: grid;
`;

const TitleBase = styled.div`
  text-transform: uppercase;
  font-weight: ${semiBoldFontBoldWeight};
  display: flex;
  align-items: flex-end;
  padding: ${horizontalPadding}rem;
  border-bottom: solid 2px ${lightBorderColor};

  @media ${smallColumnMediaQuery} {
    font-size: 0.8rem;
    padding: ${smallPadding}rem;
  }

  @media (max-width: 360px) {
    padding: ${extraSmallPadding}rem;
  }
`;

export const MountainColumnTitleName = styled(TitleBase)`
  grid-column: ${nameColumn};
  font-size: 1.2rem;

  @media ${smallColumnMediaQuery} {
    font-size: 0.95rem;
  }
`;

export const TitleCell = styled(TitleBase)`
  justify-content: center;
`;

const GridTitle = styled(TitleCell)`
  padding: 0.5rem 0.1rem;

  @media ${smallColumnMediaQuery} {
    padding: 0.5rem 0.1rem;
  }
`;

const MountainColumnTitleButton = styled(TitleBase)`
  grid-column: ${buttonColumn};
  font-size: 1.2rem;
  justify-content: flex-end;

  @media ${smallColumnMediaQuery} {
    font-size: 0.95rem;
  }
`;

const Note = styled.div`
  color: ${placeholderColor};
  font-size: 0.8rem;
  padding-left: 0.8rem;
  position: relative;
  margin: 1rem 0;

  &:before {
    content: '*';
    position: absolute;
    left: 0;
    top: 0;
  }
`;

interface Props {
  mountains: MountainDatum[];
  user: UserDatum;
  type: PeakListVariants;
  peakListId: string;
}

const MountainTable = (props: Props) => {
  const { mountains, user, type, peakListId } = props;

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);

  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  let textNote: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard) {
    textNote = (
        <Note>
          Entering a date is optional for <strong>Standard</strong> lists.
          However an unspecific date may not count towards other lists that contain this peak.
        </Note>
    );
  } else if (type === PeakListVariants.winter) {
    textNote = (
        <Note>
          <strong>Winter</strong> lists require the date to be in between the <strong>winter solstice</strong> and the <strong>vernal equinox</strong> for a given year.
          You may still enter other dates here, and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.
        </Note>
    );
  } else if (type === PeakListVariants.fourSeason) {
    textNote = (
        <Note>
          <strong>4-Season</strong> lists require dates to be in between the official solstice and equinox for a given season and year.
          You may still enter other dates here, and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.
        </Note>
    );
  } else if (type === PeakListVariants.grid) {
    textNote = (
        <Note>
          <strong>Grid</strong> lists require dates to be a day within the specified month.
          You may still enter other dates here, and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.
        </Note>
    );
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
    textNote = null;
  }
  const editMountainModal = editMountainId === null ? null : (
    <MountainCompletionModal
      editMountainId={editMountainId}
      closeEditMountainModalModal={closeEditMountainModalModal}
      userId={user.id}
      textNote={textNote}
    />
  );

  const userMountains = (user && user.mountains) ? user.mountains : [];
  const mountainsByElevation = sortBy(mountains, mountain => mountain.elevation).reverse();
  const mountainRows = mountainsByElevation.map((mountain, index) => (
      <MountainRow
        key={mountain.id}
        index={index}
        mountain={mountain}
        type={type}
        setEditMountainId={setEditMountainId}
        userMountains={userMountains}
        peakListId={peakListId}
      />
    ),
  );

  let titleColumns: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    titleColumns = (
      <>
        <TitleCell style={{gridColumn: elevationColumn}}>Elevation</TitleCell>
        <TitleCell style={{gridColumn: prominenceColumn}}>Prominence</TitleCell>
        <MountainColumnTitleButton>Done</MountainColumnTitleButton>
      </>
    );
  } else if (type === PeakListVariants.fourSeason) {
    titleColumns = (
      <>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.summer]}}>Summer</TitleCell>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.fall]}}>Fall</TitleCell>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.winter]}}>Winter</TitleCell>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.spring]}}>Spring</TitleCell>
      </>
    );
  } else if (type === PeakListVariants.grid) {
    titleColumns = (
      <>
        <GridTitle style={{gridColumn: monthColumns[Months.january]}}>Jan</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.february]}}>Feb</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.march]}}>Mar</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.april]}}>Apr</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.may]}}>May</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.june]}}>Jun</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.july]}}>Jul</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.august]}}>Aug</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.september]}}>Sep</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.october]}}>Oct</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.november]}}>Nov</GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.december]}}>Dec</GridTitle>
      </>
    );
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
    titleColumns = null;
  }

  const gridNote = type === PeakListVariants.grid
    ? (<Note>
        <div>Date is shown in <em>DD,'YY</em> format in order to better fit on screen.</div>
        <div>For example, <em>March 3, 2014</em> would show as <em>3, '14</em>.</div>
      </Note>)
    : null;

  return (
    <>
      {gridNote}
      <Root>
        <MountainColumnTitleName>Mountain</MountainColumnTitleName>
        {titleColumns}
        {mountainRows}
        {editMountainModal}
      </Root>
    </>
  );

};

export default MountainTable;
