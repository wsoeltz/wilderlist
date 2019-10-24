import { GetString } from 'fluent-react';
import { sortBy } from 'lodash';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
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
import SignUpModal from '../../sharedComponents/SignUpModal';
import StandardSearch from '../../sharedComponents/StandardSearch';
import ImportAscentsModal from '../import';
import ImportGridModal, { NH48_GRID_OBJECT_ID } from '../import/ImportGrid';
import MountainCompletionModal from './MountainCompletionModal';
import MountainRow from './MountainRow';
import {
  buttonColumn,
  elevationColumn,
  extraSmallPadding,
  horizontalPadding,
  monthColumns,
  nameColumn,
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
  position: sticky;
  top: -1rem;
  background-color: #fff;

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

const ImportAscentsButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const FilterBar = styled.div`
  margin-bottom: 1rem;
  font-size: 75%;
`;

export interface MountainToEdit {
  id: Mountain['id'];
  name: Mountain['name'];
  target: Months | Seasons | null;
}

interface Props {
  mountains: MountainDatum[];
  user: UserDatum | null;
  type: PeakListVariants;
  peakListId: string;
}

const MountainTable = (props: Props) => {
  const { mountains, user, type, peakListId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [mountainToEdit, setMountainToEdit] = useState<MountainToEdit | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const closeEditMountainModalModal = () => {
    setMountainToEdit(null);
  };
  let editMountainModal: React.ReactElement<any> | null;
  if (mountainToEdit === null) {
    editMountainModal = null;
  } else {
    if (!user) {
      editMountainModal = (
        <SignUpModal onCancel={closeEditMountainModalModal}/>
      );
    } else {
      if (type === PeakListVariants.standard) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-standard'),
        }} />;
        editMountainModal = (
          <MountainCompletionModal
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
          />
        );
      } else if (type === PeakListVariants.winter) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-winter'),
        }} />;
        editMountainModal = (
          <MountainCompletionModal
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
          />
        );
      } else if (type === PeakListVariants.fourSeason) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-four-season'),
        }} />;
        const season = mountainToEdit.target as Seasons;
        editMountainModal = (
          <MountainCompletionModal
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
            season={season}
          />
        );
      } else if (type === PeakListVariants.grid) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-grid'),
        }} />;
        const month = mountainToEdit.target as Months;
        editMountainModal = (
          <MountainCompletionModal
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
            month={month}
          />
        );
      } else {
        failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
        editMountainModal = null;
      }
    }
  }

  let importAscentsModal: React.ReactElement<any> | null;
  if (user && isImportModalOpen === true) {
    if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
      importAscentsModal = (
        <ImportAscentsModal
          userId={user.id}
          mountains={mountains}
          onCancel={() => setIsImportModalOpen(false)}
        />
     ) ;
    } else if (type === PeakListVariants.grid) {
      importAscentsModal = (
          <ImportGridModal
            userId={user.id}
            onCancel={() => setIsImportModalOpen(false)}
          />
      );
    } else {
      importAscentsModal = null;
    }
  } else {
    importAscentsModal = null;
  }

  const userMountains = (user && user.mountains) ? user.mountains : [];
  const mountainsByElevation = sortBy(mountains, mountain => mountain.elevation).reverse();
  const filteredMountains = mountainsByElevation.filter(
    ({name}) => name.toLowerCase().includes(searchQuery.toLowerCase()));
  const mountainRows = filteredMountains.map((mountain, index) => (
      <MountainRow
        key={mountain.id}
        index={index}
        mountain={mountain}
        type={type}
        setEditMountainId={setMountainToEdit}
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

  const importButton =
    (type === PeakListVariants.standard || type === PeakListVariants.winter || peakListId === NH48_GRID_OBJECT_ID)
    ? (
      <ImportAscentsButtonContainer>
        <ButtonPrimary
          onClick={() => setIsImportModalOpen(true)}
        >
          {getFluentString('mountain-table-import-button')}
        </ButtonPrimary>
      </ImportAscentsButtonContainer>
    ) : null;

  const filterMountains = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      {gridNote}
      {importButton}
      <FilterBar>
        <StandardSearch
          placeholder={getFluentString('peak-list-detail-filter-mountains')}
          setSearchQuery={filterMountains}
          focusOnMount={false}
          initialQuery={searchQuery}
        />
      </FilterBar>
      <div style={{minHeight: mountains.length * 32}}>
        <Root>
          <MountainColumnTitleName>
            {getFluentString('global-text-value-mountain')}
          </MountainColumnTitleName>
          {titleColumns}
          {mountainRows}
          {editMountainModal}
          {importAscentsModal}
        </Root>
      </div>
    </>
  );

};

export default MountainTable;
