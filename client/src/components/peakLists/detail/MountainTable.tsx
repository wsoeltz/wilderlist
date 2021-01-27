import { faDownload, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  BasicIconInText,
  ButtonPrimary,
  lightBorderColor,
  placeholderColor,
  semiBoldFontBoldWeight,
  tertiaryColor,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
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
import MountainRow from './MountainRow';
import {
  extraSmallPadding,
  horizontalPadding,
  MountainDatumWithDate,
  smallPadding,
} from './MountainRow';

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
  showImportExport?: boolean;
  disallowImports?: boolean;
  disallowExports?: boolean;
  isExportModalOpen?: boolean;
  setIsExportModalOpen?: (val: boolean) => void;
  disableLinks?: boolean;
  showCount?: boolean;
  customAction?: (mountain: MountainDatumWithDate) => void;
  customActionTitle?: string;
  customActionText?: React.ReactNode;
}

const MountainTable = (props: Props) => {
  const {
    mountains, user, type, peakListId, peakListShortName, isOtherUser,
    showImportExport, disallowImports, disallowExports,
    isExportModalOpen, setIsExportModalOpen, disableLinks, showCount, customAction,
    customActionText,
  } = props;

  const getString = useFluent();

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const closeImportModal = useCallback(() => setIsImportModalOpen(false), []);
  const openImportModal = useCallback(() => setIsImportModalOpen(true), []);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const localSortCategory = localStorage.getItem(localStorageSortingCategoryVariable);
  const localSortDirection = localStorage.getItem(localStorageSortingDirectionVariable);

  const initialSortCategory = getInitialCategory(localSortCategory, type);
  const initialSortDirection = getInitialDirection(localSortDirection);

  const [sortingBy, setSortingBy] = useState<SortingBy>(initialSortCategory);
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>(initialSortDirection);

  const sortIcon = sortingDirection === SortingDirection.ascending
    ? DirectionIcon.sortUp : DirectionIcon.sortDown;

  const setSorting = useCallback((sortValue: SortingBy) => {
    if (sortValue === sortingBy) {
      const newDirection = sortingDirection === SortingDirection.ascending
      ? SortingDirection.descending : SortingDirection.ascending;
      localStorage.setItem(localStorageSortingDirectionVariable, newDirection);
      setSortingDirection(newDirection);
    } else {
      localStorage.setItem(localStorageSortingCategoryVariable, sortValue);
      setSortingBy(sortValue);
    }
  }, [sortingBy, sortingDirection, setSortingDirection]);

  const setSortToNames = () => setSorting(SortingCategories.name);
  const setSortToElevation = () => setSorting(SortingCategories.elevation);
  const setSortToState = () => setSorting(SortingCategories.state);
  const setSortToDate = () => setSorting(SortingCategories.date);

  const top = isOtherUser === true ? (topOfPageBuffer) + 'rem' : topOfPageBuffer + 'rem';

  const openExportModal = useCallback(() => {
    if (setIsExportModalOpen) {
      setIsExportModalOpen(true);
    }
  }, [setIsExportModalOpen]);

  const closeExportModal = useCallback(() => {
    if (setIsExportModalOpen) {
      setIsExportModalOpen(false);
    }
  }, [setIsExportModalOpen]);

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

  let importAscentsModal: React.ReactElement<any> | null;
  if (user && isImportModalOpen === true) {
    if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
      importAscentsModal = (
        <ImportAscentsModal
          userId={user.id}
          mountains={mountains}
          onCancel={closeImportModal}
        />
     ) ;
    } else if (type === PeakListVariants.grid) {
      importAscentsModal = (
          <ImportGridModal
            userId={user.id}
            onCancel={closeImportModal}
          />
      );
    } else {
      importAscentsModal = null;
    }
  } else if (isImportModalOpen === true) {
    importAscentsModal = (
        <SignUpModal
          text={getString('global-text-value-modal-sign-up-today-import', {
            'list-short-name': peakListShortNameWithType,
          })}
          onCancel={closeImportModal}
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
    sortedMountains = sortBy(mountains, mountain => mountain.elevation);
    failIfValidOrNonExhaustive(sortingBy, 'Invalid sort ' + sortingBy);
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
        peakListId={peakListId ? peakListId : ''}
        isOtherUser={isOtherUser !== undefined ? isOtherUser : false}
        disableLinks={disableLinks}
        showCount={showCount}
        customAction={customAction}
        customActionText={customActionText}
      />
    ),
  );

  const titleColumns: Array<React.ReactElement<any>> = [
    (
      <MountainColumnTitleName
        style={{top}}
        onClick={setSortToNames}
        key={'mountain table title column ' + peakListId + 'name'}
      >
        {getString('global-text-value-mountain')}
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
    ),
  ];
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    titleColumns.push(
      <TitleCell
        style={{top}}
        onClick={setSortToElevation}
        key={'mountain table title column ' + peakListId + 'elevation'}
      >
        {getString('global-text-value-elevation')}
        <SortIconContainer>
          <SortIcon
            icon={sortingBy === SortingCategories.elevation
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === SortingCategories.elevation ? 1 : 0.3,
            }}
          />
        </SortIconContainer>
      </TitleCell>,
    );
    titleColumns.push(
      <TitleCell
        style={{top}}
        onClick={setSortToState}
        key={'mountain table title column ' + peakListId + 'state'}
      >
        {getString('global-text-value-state')}
        <SortIconContainer>
          <SortIcon
            icon={sortingBy === SortingCategories.state
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === SortingCategories.state ? 1 : 0.3,
            }}
          />
        </SortIconContainer>
      </TitleCell>,
    );
    if (customAction) {
      const customActionTitle = props.customActionTitle ? props.customActionTitle : '';
      titleColumns.push(
        <MountainColumnTitleButton
          style={{top}}
          key={'mountain table title column ' + peakListId + 'custom action'}
        >
          {customActionTitle}
        </MountainColumnTitleButton>,
      );
    } else {
      titleColumns.push(
        <MountainColumnTitleButton
          style={{top}}
          onClick={setSortToDate}
          key={'mountain table title column ' + peakListId + 'date'}
        >
          {getString('global-text-value-done')}
          <SortIconContainer>
            <SortIcon
              icon={sortingBy === SortingCategories.date
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === SortingCategories.date ? 1 : 0.3,
              }}
            />
          </SortIconContainer>
        </MountainColumnTitleButton>,
      );
    }
  } else if (type === PeakListVariants.fourSeason) {
    for (const key in Seasons) {
      if (Seasons.hasOwnProperty(key)) {
        const season: Seasons = key as Seasons;
        const onClick = () => setSorting(season);
        titleColumns.push(
          <FourSeasonTitle
            style={{top}}
            onClick={onClick}
            key={'title column mountain table season ' + peakListId + season}
          >
            {getString('global-text-value-' + season)}
            <SortIconContainer>
              <SortIcon
                icon={sortingBy === season
                  ? sortIcon : DirectionIcon.sortNone}
                style={{
                  opacity: sortingBy === season ? 1 : 0.3,
                }}
              />
            </SortIconContainer>
          </FourSeasonTitle>,
        );
      }
    }
  } else if (type === PeakListVariants.grid) {
    for (const key in Months) {
      if (Months.hasOwnProperty(key)) {
        const month: Months = key as Months;
        const onClick = () => setSorting(month);
        titleColumns.push(
          <GridTitle
            style={{top}}
            onClick={onClick}
            key={'title column mountain table grid ' + peakListId + month}
          >
            <CompressedCellText>
              {getString('global-text-value-month-short-' + month.substring(0, 3).toLowerCase())}
            </CompressedCellText>
            <GridSortIconContainer>
              <SortIcon
                icon={sortingBy === month
                  ? sortIcon : DirectionIcon.sortNone}
                style={{
                  opacity: sortingBy === month ? 1 : 0.3,
                }}
              />
            </GridSortIconContainer>
          </GridTitle>,
        );
      }
    }
  }

  if (showCount) {
    titleColumns.unshift(
      <TitleCell
        style={{top}}
        key={'mountain table title column ' + peakListId + 'count'}
      >
      </TitleCell>,
    );
  }

  let exportAscentsModal: React.ReactElement<any> | null;
  if (user && isExportModalOpen === true && setIsExportModalOpen) {
    exportAscentsModal = (
      <ExportAscentsModal
        listShortName={peakListShortName}
        type={type}
        mountains={sortedMountains}
        onCancel={closeExportModal}
        specialExport={peakListId === NH48_GRID_OBJECT_ID ? SpecialExport.nh48grid : null}
      />
     );
  } else if (isExportModalOpen === true && setIsExportModalOpen) {
    exportAscentsModal = (
        <SignUpModal
          text={getString('global-text-value-modal-sign-up-today-export', {
            'list-short-name': peakListShortNameWithType,
          })}
          onCancel={closeExportModal}
        />
    );
  } else {
    exportAscentsModal = null;
  }

  const gridNote = type === PeakListVariants.grid
    ? (<Note dangerouslySetInnerHTML={{
          __html: getString('mountain-table-grid-date-note-text'),
        }} />)
    : null;

  const importButton = disallowImports !== true && (
    type === PeakListVariants.standard ||
    type === PeakListVariants.winter   ||
    peakListId === NH48_GRID_OBJECT_ID )
    ? (
        <ButtonPrimary
          onClick={openImportModal}
        >
          <BasicIconInText icon={faFileImport} />
          {getString('mountain-table-import-button')}
        </ButtonPrimary>
    ) : null;

  const filterMountains = (value: string) => {
    setSearchQuery(value);
  };

  const exportButton = disallowExports !== true && setIsExportModalOpen ? (
    <ExportButton
      onClick={openExportModal}
    >
      <BasicIconInText icon={faDownload} />
      {getString('mountain-table-export-button')}
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
          placeholder={getString('peak-list-detail-filter-mountains')}
          setSearchQuery={filterMountains}
          focusOnMount={false}
          initialQuery={searchQuery}
        />
      </FilterBar>
      <div style={{minHeight: mountains.length * 32}}>
        <Root style={{gridTemplateColumns: `repeat(${titleColumns.length}, auto)`}}>
          {titleColumns}
          {mountainRows}
          {importAscentsModal}
          {exportAscentsModal}
        </Root>
      </div>
    </>
  );

};

export default MountainTable;
