import { sortBy } from 'lodash';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
  ButtonSecondary,
  lightBaseColor,
  lightBorderColor,
  semiBoldFontBoldWeight,
} from '../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
  formatNumberWithCommas,
} from '../../Utils';
import {
  formatDate,
  getStandardCompletion,
  getWinterCompletion,
} from '../peakLists/Utils';
import {
  MountainDatum,
  UserDatum,
} from './index';
import MountainCompletionModal from './MountainCompletionModal';

const Root = styled.div`
  display: grid;
`;

const nameColumn = 1;
const elevationColumn = 2;
const prominenceColumn = 3;
const buttonColumn = 4;

const horizontalPadding = 0.6; // in rem

const TableCellBase = styled.div`
  font-weight: ${semiBoldFontBoldWeight};
  padding: 0.8rem ${horizontalPadding}rem;
  display: flex;
  align-items: center;
`;

const MountainName = styled(TableCellBase)`
  grid-column: ${nameColumn};
  font-size: 1.2rem;
`;

const MountainElevation = styled(TableCellBase)`
  grid-column: ${elevationColumn};
  justify-content: center;
  color: ${lightBaseColor};
`;

const MountainProminence = styled(TableCellBase)`
  grid-column: ${prominenceColumn};
  justify-content: center;
  color: ${lightBaseColor};
`;

const MountainButton = styled(TableCellBase)`
  grid-column: ${buttonColumn};
  justify-content: flex-end;
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
const MountainColumnTitleElevation = styled(TitleBase)`
  grid-column: ${elevationColumn};
  justify-content: center;

`;
const MountainColumnTitleProminence = styled(TitleBase)`
  grid-column: ${prominenceColumn};
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

  const mountainsByElevation = sortBy(mountains, mountain => mountain.elevation).reverse();
  const mountainRows = mountainsByElevation.map((mountain, index) => {
    let peakCompletedContent: React.ReactElement<any | null> = (
      <ButtonSecondary onClick={() => setEditMountainId(mountain.id)}>
        Mark done
      </ButtonSecondary>
    );
    if (user !== undefined && user !== null) {
      if (user.mountains !== undefined && user.mountains !== null) {
        const completedDates = user.mountains.find(
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
            peakCompletedContent = <>four season</>;
          } else if (type === PeakListVariants.grid) {
            peakCompletedContent = <>grid</>;
          } else {
            failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
          }
        }
      }
    }
    const elevation = mountain.elevation !== null ? formatNumberWithCommas(mountain.elevation) + ' ft' : 'N/A';
    const prominence = mountain.prominence !== null ? formatNumberWithCommas(mountain.prominence) + ' ft' : 'N/A';
    const style: React.CSSProperties = (index % 2 === 0) ? {} : { backgroundColor: lightBorderColor };
    return (
      <React.Fragment key={mountain.id}>
        <MountainName style={style}>{mountain.name}</MountainName>
        <MountainElevation style={style}>{elevation}</MountainElevation>
        <MountainProminence style={style}>{prominence}</MountainProminence>
        <MountainButton style={style}>
          {peakCompletedContent}
        </MountainButton>
      </React.Fragment>
    );
  });

  return (
    <Root>
      <MountainColumnTitleName>Mountain</MountainColumnTitleName>
      <MountainColumnTitleElevation>Elevation</MountainColumnTitleElevation>
      <MountainColumnTitleProminence>Prominence</MountainColumnTitleProminence>
      <MountainColumnTitleButton>Completed</MountainColumnTitleButton>
      {mountainRows}
      {editMountainModal}
    </Root>
  );

};

export default MountainTable;
