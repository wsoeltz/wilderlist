import { sortBy } from 'lodash';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
  lightBorderColor,
  semiBoldFontBoldWeight,
} from '../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { Months, Seasons } from '../../Utils';
import {
  MountainDatum,
  UserDatum,
} from './index';
import MountainCompletionModal from './MountainCompletionModal';
import MountainRow from './MountainRow';
import {
  buttonColumn,
  elevationColumn,
  horizontalPadding,
  monthColumns,
  nameColumn,
  prominenceColumn,
  seasonColumns,
} from './MountainRow';

const Root = styled.div`
  display: grid;
`;

const TitleBase = styled.div`
  text-transform: uppercase;
  font-weight: ${semiBoldFontBoldWeight};
  display: flex;
  align-items: flex-end;
  padding: ${horizontalPadding}rem;
  border-bottom: solid 2px ${lightBorderColor};
`;

const MountainColumnTitleName = styled(TitleBase)`
  grid-column: ${nameColumn};
  font-size: 1.3rem;
`;

const TitleCell = styled(TitleBase)`
  justify-content: center;
`;

const MountainColumnTitleButton = styled(TitleBase)`
  grid-column: ${buttonColumn};
  font-size: 1.3rem;
  justify-content: flex-end;
`;

interface Props {
  mountains: MountainDatum[];
  user: UserDatum;
  type: PeakListVariants;
}

const MountainTable = (props: Props) => {
  const { mountains, user, type } = props;

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);

  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  const editMountainModal = editMountainId === null ? null : (
    <MountainCompletionModal
      editMountainId={editMountainId}
      closeEditMountainModalModal={closeEditMountainModalModal}
      userId={user.id}
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
      />
    ),
  );

  let titleColumns: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    titleColumns = (
      <>
        <TitleCell style={{gridColumn: elevationColumn}}>Elevation</TitleCell>
        <TitleCell style={{gridColumn: prominenceColumn}}>Prominence</TitleCell>
        <MountainColumnTitleButton>Completed</MountainColumnTitleButton>
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
        <TitleCell style={{gridColumn: monthColumns[Months.january]}}>Jan</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.february]}}>Feb</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.march]}}>Mar</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.april]}}>Apr</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.may]}}>May</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.june]}}>Jun</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.july]}}>Jul</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.august]}}>Aug</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.september]}}>Sep</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.october]}}>Oct</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.november]}}>Nov</TitleCell>
        <TitleCell style={{gridColumn: monthColumns[Months.december]}}>Dec</TitleCell>
      </>
    );
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
    titleColumns = null;
  }

  return (
    <Root>
      <MountainColumnTitleName>Mountain</MountainColumnTitleName>
      {titleColumns}
      {mountainRows}
      {editMountainModal}
    </Root>
  );

};

export default MountainTable;
