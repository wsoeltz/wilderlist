import { GetString } from 'fluent-react';
import { sortBy } from 'lodash';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
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

export const TitleBase = styled.div`
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);

  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  let textNote: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard) {
    textNote = <Note dangerouslySetInnerHTML={{
      __html: getFluentString('mountain-completion-modal-text-note-standard'),
    }} />;
  } else if (type === PeakListVariants.winter) {
    textNote = <Note dangerouslySetInnerHTML={{
      __html: getFluentString('mountain-completion-modal-text-note-winter'),
    }} />;
  } else if (type === PeakListVariants.fourSeason) {
    textNote = <Note dangerouslySetInnerHTML={{
      __html: getFluentString('mountain-completion-modal-text-note-four-season'),
    }} />;
  } else if (type === PeakListVariants.grid) {
    textNote = <Note dangerouslySetInnerHTML={{
      __html: getFluentString('mountain-completion-modal-text-note-grid'),
    }} />;
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
        <TitleCell style={{gridColumn: elevationColumn}}>
          {getFluentString('global-text-value-elevation')}
        </TitleCell>
        <TitleCell style={{gridColumn: prominenceColumn}}>
          {getFluentString('global-text-value-prominence')}
        </TitleCell>
        <MountainColumnTitleButton>
          {getFluentString('global-text-value-done')}
        </MountainColumnTitleButton>
      </>
    );
  } else if (type === PeakListVariants.fourSeason) {
    titleColumns = (
      <>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.summer]}}>
          {getFluentString('global-text-value-summer')}
        </TitleCell>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.fall]}}>
          {getFluentString('global-text-value-fall')}
        </TitleCell>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.winter]}}>
          {getFluentString('global-text-value-winter')}
        </TitleCell>
        <TitleCell style={{gridColumn: seasonColumns[Seasons.spring]}}>
          {getFluentString('global-text-value-spring')}
        </TitleCell>
      </>
    );
  } else if (type === PeakListVariants.grid) {
    titleColumns = (
      <>
        <GridTitle style={{gridColumn: monthColumns[Months.january]}}>
          {getFluentString('global-text-value-month-short-jan')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.february]}}>
          {getFluentString('global-text-value-month-short-feb')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.march]}}>
          {getFluentString('global-text-value-month-short-mar')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.april]}}>
          {getFluentString('global-text-value-month-short-apr')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.may]}}>
          {getFluentString('global-text-value-month-short-may')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.june]}}>
          {getFluentString('global-text-value-month-short-jun')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.july]}}>
          {getFluentString('global-text-value-month-short-jul')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.august]}}>
          {getFluentString('global-text-value-month-short-aug')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.september]}}>
          {getFluentString('global-text-value-month-short-sep')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.october]}}>
          {getFluentString('global-text-value-month-short-oct')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.november]}}>
          {getFluentString('global-text-value-month-short-nov')}
        </GridTitle>
        <GridTitle style={{gridColumn: monthColumns[Months.december]}}>
          {getFluentString('global-text-value-month-short-dec')}
        </GridTitle>
      </>
    );
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
    titleColumns = null;
  }

  const gridNote = type === PeakListVariants.grid
    ? (<Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-table-grid-date-note-text'),
        }} />)
    : null;

  return (
    <>
      {gridNote}
      <Root>
        <MountainColumnTitleName>
          {getFluentString('global-text-value-mountain')}
        </MountainColumnTitleName>
        {titleColumns}
        {mountainRows}
        {editMountainModal}
      </Root>
    </>
  );

};

export default MountainTable;
