import { faDownload, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import { sortBy } from 'lodash';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  ButtonPrimary,
  lightBorderColor,
  placeholderColor,
  semiBoldFontBoldWeight,
  tertiaryColor,
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
import ExportAscentsModal, {SpecialExport} from '../export';
import ImportAscentsModal from '../import';
import ImportGridModal, { NH48_GRID_OBJECT_ID } from '../import/ImportGrid';
import NewAscentReport from './completionModal/NewAscentReport';
import MountainRow from './MountainRow';
import {
  buttonColumn,
  elevationColumn,
  extraSmallPadding,
  horizontalPadding,
  monthColumns,
  MountainDatumWithDate,
  nameColumn,
  seasonColumns,
  smallPadding,
  stateColumn,
} from './MountainRow';
import {
  friendHeaderHeight,
} from './PeakListDetail';

const smallColumnMediaQuery = `(min-width: ${mobileSize}px) and (max-width: 1350px)`;

export const topOfPageBuffer = 0 - 1; // in rem

export const Root = styled.div`
  display: grid;
`;

export const TitleBase = styled.h4`
  text-transform: uppercase;
  font-weight: ${semiBoldFontBoldWeight};
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  padding: ${horizontalPadding}rem;
  border-bottom: solid 2px ${lightBorderColor};
  position: sticky;
  background-color: #fff;
  z-index: 50;
  margin: 0;

  &:hover {
    cursor: pointer;
    background-color: ${tertiaryColor};
  }

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
  font-size: 1.1rem;
  align-items: center;

  @media ${smallColumnMediaQuery} {
    font-size: 0.8rem;
  }
`;

export const TitleCell = styled(TitleBase)`
  padding: 0.6rem 0.1rem;
  justify-content: center;

  @media ${smallColumnMediaQuery} {
    padding: 0.5rem 0.1rem;
  }
`;

const GridTitle = styled(TitleCell)`
  padding: 0.6rem 0.1rem;
  justify-content: space-between;

  @media ${smallColumnMediaQuery} {
    padding: 0.5rem 0.1rem;
  }
`;

const FourSeasonTitle = styled(TitleCell)`
  flex-wrap: nowrap;
`;

const MountainColumnTitleButton = styled(TitleBase)`
  grid-column: ${buttonColumn};
  font-size: 1.1rem;
  justify-content: flex-end;
  align-items: center;

  @media ${smallColumnMediaQuery} {
    font-size: 0.8rem;
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

const ImportExportAscentsButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

const ExportButton = styled(ButtonPrimary)`
  margin-left: 1.5rem;
`;

const SortIconContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SortIcon = styled(FontAwesomeIcon)`
  font-size: 0.8rem;
  margin: 0 .25rem;
`;

const CompressedCellText = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const GridSortIconContainer = styled(SortIconContainer)`
  flex-grow: 1;
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

enum SortingCategories {
  name = 'name',
  elevation = 'elevation',
  state = 'state',
  date = 'date',
}

type SortingBy = SortingCategories | Seasons | Months;

enum SortingDirection {
  ascending = 'ascending',
  descending = 'descending',
}

const getInitialCategory = (value: any, type: PeakListVariants) => {
  if ( value === SortingCategories.name
    || value === SortingCategories.elevation) {
    return value as SortingBy;
  }
  if ( ( type === PeakListVariants.standard
       || type === PeakListVariants.winter)
    && ( value === SortingCategories.state
      || value === SortingCategories.date )
    ) {
    return value as SortingBy;
  }
  if ( type === PeakListVariants.fourSeason
      && (
           value === Seasons.summer
        || value === Seasons.fall
        || value === Seasons.winter
        || value === Seasons.spring
      )
    ) {
    return value as SortingBy;
  }
  if ( type === PeakListVariants.grid
      && (
           value === Months.january
        || value === Months.february
        || value === Months.march
        || value === Months.april
        || value === Months.may
        || value === Months.june
        || value === Months.july
        || value === Months.august
        || value === Months.september
        || value === Months.october
        || value === Months.november
        || value === Months.december
      )
    ) {
    return value as SortingBy;
  }
  return SortingCategories.name;
};

const localStorageSortingCategoryVariable = 'localStorageSortingCategoryVariable';
const localStorageSortingDirectionVariable = 'localStorageSortingDirectionVariable';

// Sort icon strings come from font awesome
enum DirectionIcon {
  sortNone = 'sort',
  sortUp = 'sort-up',
  sortDown = 'sort-down',
}

const getInitialDirection = (value: any) => {
  if ( value === SortingDirection.ascending
    || value === SortingDirection.descending
    ) {
    return value as SortingDirection;
  } else {
    return SortingDirection.descending;
  }
};

interface Props {
  mountains: MountainDatumWithDate[];
  user: {id: string} | null;
  type: PeakListVariants;
  peakListId: string | null;
  peakListShortName: string;
  isOtherUser?: boolean;
  showImportExport: boolean;
  queryRefetchArray?: Array<{query: any, variables: any}>;
  disallowImports?: boolean;
  disallowExports?: boolean;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (val: boolean) => void;
}

const MountainTable = (props: Props) => {
  const {
    mountains, user, type, peakListId, peakListShortName, isOtherUser,
    showImportExport, queryRefetchArray, disallowImports, disallowExports,
    isExportModalOpen, setIsExportModalOpen,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [mountainToEdit, setMountainToEdit] = useState<MountainToEdit | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const localSortCategory = localStorage.getItem(localStorageSortingCategoryVariable);
  const localSortDirection = localStorage.getItem(localStorageSortingDirectionVariable);

  const initialSortCategory = getInitialCategory(localSortCategory, type);
  const initialSortDirection = getInitialDirection(localSortDirection);

  const [sortingBy, setSortingBy] = useState<SortingBy>(initialSortCategory);
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>(initialSortDirection);

  const sortIcon = sortingDirection === SortingDirection.ascending
    ? DirectionIcon.sortUp : DirectionIcon.sortDown;

  const toggleSortDirection = () => {
    const newDirection = sortingDirection === SortingDirection.ascending
    ? SortingDirection.descending : SortingDirection.ascending;
    localStorage.setItem(localStorageSortingDirectionVariable, newDirection);
    setSortingDirection(newDirection);
  };

  const setSorting = (sortValue: SortingBy) => {
    if (sortValue === sortingBy) {
      toggleSortDirection();
    } else {
      localStorage.setItem(localStorageSortingCategoryVariable, sortValue);
      setSortingBy(sortValue);
    }
  };

  const top = isOtherUser === true ? (friendHeaderHeight + topOfPageBuffer) + 'rem' : topOfPageBuffer + 'rem';

  const closeEditMountainModalModal = () => {
    setMountainToEdit(null);
  };

  let peakListShortNameWithType: string;
  if (type === PeakListVariants.standard) {
    peakListShortNameWithType = peakListShortName;
  } else if (type === PeakListVariants.fourSeason) {
    peakListShortNameWithType = peakListShortName + ': 4-Season';
  } else if (type === PeakListVariants.grid || PeakListVariants.winter) {
    peakListShortNameWithType = peakListShortName + ' ' + type.replace(/^\w/, c => c.toUpperCase());
  } else {
    peakListShortNameWithType = peakListShortName;
  }

  let editMountainModal: React.ReactElement<any> | null;
  if (mountainToEdit === null) {
    editMountainModal = null;
  } else {
    if (!user) {
      editMountainModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today', {
            'list-short-name': peakListShortNameWithType,
          })}
          onCancel={closeEditMountainModalModal}
        />
      );
    } else {
      if (type === PeakListVariants.standard) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-standard'),
        }} />;
        editMountainModal = (
          <NewAscentReport
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
            queryRefetchArray={queryRefetchArray}
          />
        );
      } else if (type === PeakListVariants.winter) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-winter'),
        }} />;
        editMountainModal = (
          <NewAscentReport
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
            queryRefetchArray={queryRefetchArray}
          />
        );
      } else if (type === PeakListVariants.fourSeason) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-four-season'),
        }} />;
        const season = mountainToEdit.target as Seasons;
        editMountainModal = (
          <NewAscentReport
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
            season={season}
            queryRefetchArray={queryRefetchArray}
          />
        );
      } else if (type === PeakListVariants.grid) {
        const textNote = <Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-completion-modal-text-note-grid'),
        }} />;
        const month = mountainToEdit.target as Months;
        editMountainModal = (
          <NewAscentReport
            editMountainId={mountainToEdit.id}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={textNote}
            mountainName={mountainToEdit.name}
            variant={type}
            month={month}
            queryRefetchArray={queryRefetchArray}
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
  } else if (isImportModalOpen === true) {
    importAscentsModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today-import', {
            'list-short-name': peakListShortNameWithType,
          })}
          onCancel={() => setIsImportModalOpen(false)}
        />
    );
  } else {
    importAscentsModal = null;
  }

  let sortedMountains: MountainDatumWithDate[];
  if (sortingBy === SortingCategories.name) {
    sortedMountains = sortBy(mountains, mountain => mountain.name).reverse();
  } else if (sortingBy === SortingCategories.state) {
    sortedMountains = sortBy(mountains, mountain =>
      mountain.state ? mountain.state.abbreviation : '').reverse();
  } else if (sortingBy === SortingCategories.elevation) {
    sortedMountains = sortBy(mountains, mountain => mountain.elevation);
  } else if (sortingBy === SortingCategories.date) {
    sortedMountains = sortBy(mountains, ({completionDates}) => {
      if (completionDates !== null && completionDates.type) {
        if (completionDates.type === PeakListVariants.standard) {
          const dateObject = completionDates.standard;
          if (dateObject) {
            return isNaN(dateObject.dateAsNumber) ? 0 : dateObject.dateAsNumber;
          }
        } else if (completionDates.type === PeakListVariants.winter) {
          const dateObject = completionDates.winter;
          if (dateObject) {
            return isNaN(dateObject.dateAsNumber) ? 0 : dateObject.dateAsNumber;
          }
        }
      }
      return undefined;
    });
  } else if (sortingBy === Seasons.summer ||
             sortingBy === Seasons.fall ||
             sortingBy === Seasons.winter ||
             sortingBy === Seasons.spring) {
    sortedMountains = sortBy(mountains, ({completionDates}) => {
      if (completionDates !== null && completionDates.type) {
        if (completionDates.type === PeakListVariants.fourSeason) {
          const dateObject = completionDates[sortingBy];
          if (dateObject) {
            return isNaN(dateObject.dateAsNumber) ? 0 : dateObject.dateAsNumber;
          }
        }
      }
      return undefined;
    });
  } else if (sortingBy === Months.january ||
             sortingBy === Months.february ||
             sortingBy === Months.march ||
             sortingBy === Months.april ||
             sortingBy === Months.may ||
             sortingBy === Months.june ||
             sortingBy === Months.july ||
             sortingBy === Months.august ||
             sortingBy === Months.september ||
             sortingBy === Months.october ||
             sortingBy === Months.november ||
             sortingBy === Months.december) {
    sortedMountains = sortBy(mountains, ({completionDates}) => {
      if (completionDates !== null && completionDates.type) {
        if (completionDates.type === PeakListVariants.grid) {
          const dateObject = completionDates[sortingBy];
          if (dateObject) {
            return isNaN(dateObject.dateAsNumber) ? 0 : dateObject.dateAsNumber;
          }
        }
      }
      return undefined;
    });
  } else {
    failIfValidOrNonExhaustive(sortingBy, 'Invalid sort ' + sortingBy);
    sortedMountains = sortBy(mountains, mountain => mountain.elevation);
  }
  if (sortingDirection === SortingDirection.descending) {
    sortedMountains.reverse();
  }
  const filteredMountains = sortedMountains.filter(
    ({name}) => name.toLowerCase().includes(searchQuery.toLowerCase()));
  const mountainRows = filteredMountains.map((mountain, index) => (
      <MountainRow
        key={mountain.id}
        index={index}
        mountain={mountain}
        type={type}
        setEditMountainId={setMountainToEdit}
        peakListId={peakListId}
        isOtherUser={isOtherUser !== undefined ? isOtherUser : false}
        userId={user ? user.id : null}
      />
    ),
  );

  let titleColumns: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    titleColumns = (
      <>
        <TitleCell
          style={{top, gridColumn: elevationColumn}}
          onClick={() => setSorting(SortingCategories.elevation)}
        >
          {getFluentString('global-text-value-elevation')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === SortingCategories.elevation
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === SortingCategories.elevation ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </TitleCell>
        <TitleCell
          style={{top, gridColumn: stateColumn}}
          onClick={() => setSorting(SortingCategories.state)}
        >
          {getFluentString('global-text-value-state')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === SortingCategories.state
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === SortingCategories.state ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </TitleCell>
        <MountainColumnTitleButton
          style={{top}}
          onClick={() => setSorting(SortingCategories.date)}
        >
          {getFluentString('global-text-value-done')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === SortingCategories.date
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === SortingCategories.date ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </MountainColumnTitleButton>
      </>
    );
  } else if (type === PeakListVariants.fourSeason) {
    titleColumns = (
      <>
        <FourSeasonTitle
          style={{top, gridColumn: seasonColumns[Seasons.summer]}}
          onClick={() => setSorting(Seasons.summer)}
        >
          {getFluentString('global-text-value-summer')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === Seasons.summer
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Seasons.summer ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </FourSeasonTitle>
        <FourSeasonTitle
          style={{top, gridColumn: seasonColumns[Seasons.fall]}}
          onClick={() => setSorting(Seasons.fall)}
        >
          {getFluentString('global-text-value-fall')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === Seasons.fall
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Seasons.fall ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </FourSeasonTitle>
        <FourSeasonTitle
          style={{top, gridColumn: seasonColumns[Seasons.winter]}}
          onClick={() => setSorting(Seasons.winter)}
        >
          {getFluentString('global-text-value-winter')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === Seasons.winter
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Seasons.winter ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </FourSeasonTitle>
        <FourSeasonTitle
          style={{top, gridColumn: seasonColumns[Seasons.spring]}}
          onClick={() => setSorting(Seasons.spring)}
        >
          {getFluentString('global-text-value-spring')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === Seasons.spring
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Seasons.spring ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </FourSeasonTitle>
      </>
    );
  } else if (type === PeakListVariants.grid) {
    titleColumns = (
      <>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.january]}}
          onClick={() => setSorting(Months.january)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-jan')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.january
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.january ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.february]}}
          onClick={() => setSorting(Months.february)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-feb')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.february
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.february ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.march]}}
          onClick={() => setSorting(Months.march)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-mar')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.march
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.march ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.april]}}
          onClick={() => setSorting(Months.april)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-apr')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.april
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.april ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.may]}}
          onClick={() => setSorting(Months.may)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-may')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.may
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.may ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.june]}}
          onClick={() => setSorting(Months.june)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-jun')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.june
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.june ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.july]}}
          onClick={() => setSorting(Months.july)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-jul')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.july
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.july ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.august]}}
          onClick={() => setSorting(Months.august)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-aug')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.august
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.august ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.september]}}
          onClick={() => setSorting(Months.september)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-sep')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.september
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.september ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.october]}}
          onClick={() => setSorting(Months.october)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-oct')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.october
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.october ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.november]}}
          onClick={() => setSorting(Months.november)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-nov')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.november
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.november ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
        <GridTitle
          style={{top, gridColumn: monthColumns[Months.december]}}
          onClick={() => setSorting(Months.december)}
        >
          <CompressedCellText>
            {getFluentString('global-text-value-month-short-dec')}
          </CompressedCellText>
          <GridSortIconContainer>
            <SortIcon
              icon={sortingBy === Months.december
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === Months.december ? 1 : 0.3,
              }}
            />
          </GridSortIconContainer>
        </GridTitle>
      </>
    );
  } else {
    titleColumns = null;
    failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
  }

  let exportAscentsModal: React.ReactElement<any> | null;
  if (user && isExportModalOpen === true) {
    exportAscentsModal = (
      <ExportAscentsModal
        listShortName={peakListShortName}
        type={type}
        mountains={sortedMountains}
        onCancel={() => setIsExportModalOpen(false)}
        specialExport={peakListId === NH48_GRID_OBJECT_ID ? SpecialExport.nh48grid : null}
      />
     );
  } else if (isExportModalOpen === true) {
    exportAscentsModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today-export', {
            'list-short-name': peakListShortNameWithType,
          })}
          onCancel={() => setIsExportModalOpen(false)}
        />
    );
  } else {
    exportAscentsModal = null;
  }

  const gridNote = type === PeakListVariants.grid
    ? (<Note dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-table-grid-date-note-text'),
        }} />)
    : null;

  const importButton = disallowImports !== true && (
    type === PeakListVariants.standard ||
    type === PeakListVariants.winter   ||
    peakListId === NH48_GRID_OBJECT_ID )
    ? (
        <ButtonPrimary
          onClick={() => setIsImportModalOpen(true)}
        >
          <BasicIconInText icon={faFileImport} />
          {getFluentString('mountain-table-import-button')}
        </ButtonPrimary>
    ) : null;

  const filterMountains = (value: string) => {
    setSearchQuery(value);
  };

  const exportButton = disallowExports !== true ? (
    <ExportButton
      onClick={() => setIsExportModalOpen(true)}
    >
      <BasicIconInText icon={faDownload} />
      {getFluentString('mountain-table-export-button')}
    </ExportButton>
  ) : null;

  const importExportButtons = showImportExport === true ? (
    <ImportExportAscentsButtonContainer>
      {importButton}
      {exportButton}
    </ImportExportAscentsButtonContainer>
  ) : null;

  return (
    <>
      {gridNote}
      {importExportButtons}
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
          <MountainColumnTitleName
            style={{top}}
            onClick={() => setSorting(SortingCategories.name)}
          >
            {getFluentString('global-text-value-mountain')}
            <SortIconContainer>
              <SortIcon
                icon={sortingBy === SortingCategories.name
                  ? sortIcon : DirectionIcon.sortNone}
                style={{
                  opacity: sortingBy === SortingCategories.name ? 1 : 0.3,
                }}
              />
            </SortIconContainer>
          </MountainColumnTitleName>
          {titleColumns}
          {mountainRows}
          {editMountainModal}
          {importAscentsModal}
          {exportAscentsModal}
        </Root>
      </div>
    </>
  );

};

export default MountainTable;
