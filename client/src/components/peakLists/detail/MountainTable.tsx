import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import { sortBy } from 'lodash';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  lightBorderColor,
  placeholderColor,
  semiBoldFontBoldWeight,
  tertiaryColor,
  // baseColor,
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
import getCompletionDates from './getCompletionDates';
import MountainCompletionModal from './MountainCompletionModal';
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
  flex-wrap: wrap;
  align-items: flex-end;
  padding: ${horizontalPadding}rem;
  border-bottom: solid 2px ${lightBorderColor};
  position: sticky;
  top: -1rem;
  background-color: #fff;
  z-index: 50;

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

const ImportAscentsButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

const SortIcon = styled(FontAwesomeIcon)`
  font-size: 0.8rem;
  margin: 0 .25rem;
`;

const GridCellText = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const GridSortIcon = styled(SortIcon)`
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

// Sort icon strings come from font awesome
enum DirectionIcon {
  sortNone = 'sort',
  sortUp = 'sort-up',
  sortDown = 'sort-down',
}

interface Props {
  mountains: MountainDatum[];
  user: UserDatum | null;
  type: PeakListVariants;
  peakListId: string;
  peakListShortName: string;
}

const MountainTable = (props: Props) => {
  const { mountains, user, type, peakListId, peakListShortName } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [mountainToEdit, setMountainToEdit] = useState<MountainToEdit | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [sortingBy, setSortingBy] = useState<SortingBy>(SortingCategories.elevation);
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>(SortingDirection.descending);

  const sortIcon = sortingDirection === SortingDirection.ascending
    ? DirectionIcon.sortUp : DirectionIcon.sortDown;

  const toggleSortDirection = () => {
    const newDirection = sortingDirection === SortingDirection.ascending
    ? SortingDirection.descending : SortingDirection.ascending;
    setSortingDirection(newDirection);
  };

  const setSorting = (sortValue: SortingBy) => {
    if (sortValue === sortingBy) {
      toggleSortDirection();
    } else {
      setSortingBy(sortValue);
    }
  };

  const closeEditMountainModalModal = () => {
    setMountainToEdit(null);
  };
  let editMountainModal: React.ReactElement<any> | null;
  if (mountainToEdit === null) {
    editMountainModal = null;
  } else {
    if (!user) {
      editMountainModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today', {
            'list-short-name': peakListShortName,
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
  } else if (isImportModalOpen === true) {
    importAscentsModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today', {
            'list-short-name': peakListShortName,
          })}
          onCancel={() => setIsImportModalOpen(false)}
        />
    );
  } else {
    importAscentsModal = null;
  }

  const userMountains = (user && user.mountains) ? user.mountains : [];

  const mountainsWithDates = mountains.map(mountain => {
    const completionDates = getCompletionDates({type, mountain, userMountains});
    return {...mountain, completionDates};
  });

  let sortedMountains: MountainDatumWithDate[];
  if (sortingBy === SortingCategories.name) {
    sortedMountains = sortBy(mountainsWithDates, mountain => mountain.name).reverse();
  } else if (sortingBy === SortingCategories.state) {
    sortedMountains = sortBy(mountainsWithDates, mountain => mountain.state.abbreviation).reverse();
  } else if (sortingBy === SortingCategories.elevation) {
    sortedMountains = sortBy(mountainsWithDates, mountain => mountain.elevation);
  } else if (sortingBy === SortingCategories.date) {
    sortedMountains = sortBy(mountainsWithDates, ({completionDates}) => {
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
    sortedMountains = sortBy(mountainsWithDates, ({completionDates}) => {
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
    sortedMountains = sortBy(mountainsWithDates, ({completionDates}) => {
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
    sortedMountains = sortBy(mountainsWithDates, mountain => mountain.elevation);
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
      />
    ),
  );

  let titleColumns: React.ReactElement<any> | null;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    titleColumns = (
      <>
        <TitleCell
          style={{gridColumn: elevationColumn}}
          onClick={() => setSorting(SortingCategories.elevation)}
        >
          {getFluentString('global-text-value-elevation')}
          <SortIcon
            icon={sortingBy === SortingCategories.elevation
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === SortingCategories.elevation ? 1 : 0.3,
            }}
          />
        </TitleCell>
        <TitleCell
          style={{gridColumn: stateColumn}}
          onClick={() => setSorting(SortingCategories.state)}
        >
          {getFluentString('global-text-value-state')}
          <SortIcon
            icon={sortingBy === SortingCategories.state
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === SortingCategories.state ? 1 : 0.3,
            }}
          />
        </TitleCell>
        <MountainColumnTitleButton
          onClick={() => setSorting(SortingCategories.date)}
        >
          {getFluentString('global-text-value-done')}
          <SortIcon
            icon={sortingBy === SortingCategories.date
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === SortingCategories.date ? 1 : 0.3,
            }}
          />
        </MountainColumnTitleButton>
      </>
    );
  } else if (type === PeakListVariants.fourSeason) {
    titleColumns = (
      <>
        <TitleCell
          style={{gridColumn: seasonColumns[Seasons.summer]}}
          onClick={() => setSorting(Seasons.summer)}
        >
          <GridCellText>
            {getFluentString('global-text-value-summer')}
          </GridCellText>
          <SortIcon
            icon={sortingBy === Seasons.summer
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Seasons.summer ? 1 : 0.3,
            }}
          />
        </TitleCell>
        <TitleCell
          style={{gridColumn: seasonColumns[Seasons.fall]}}
          onClick={() => setSorting(Seasons.fall)}
        >
          <GridCellText>
            {getFluentString('global-text-value-fall')}
          </GridCellText>
          <SortIcon
            icon={sortingBy === Seasons.fall
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Seasons.fall ? 1 : 0.3,
            }}
          />
        </TitleCell>
        <TitleCell
          style={{gridColumn: seasonColumns[Seasons.winter]}}
          onClick={() => setSorting(Seasons.winter)}
        >
          <GridCellText>
            {getFluentString('global-text-value-winter')}
          </GridCellText>
          <SortIcon
            icon={sortingBy === Seasons.winter
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Seasons.winter ? 1 : 0.3,
            }}
          />
        </TitleCell>
        <TitleCell
          style={{gridColumn: seasonColumns[Seasons.spring]}}
          onClick={() => setSorting(Seasons.spring)}
        >
          <GridCellText>
            {getFluentString('global-text-value-spring')}
          </GridCellText>
          <SortIcon
            icon={sortingBy === Seasons.spring
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Seasons.spring ? 1 : 0.3,
            }}
          />
        </TitleCell>
      </>
    );
  } else if (type === PeakListVariants.grid) {
    titleColumns = (
      <>
        <GridTitle
          style={{gridColumn: monthColumns[Months.january]}}
          onClick={() => setSorting(Months.january)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-jan')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.january
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.january ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.february]}}
          onClick={() => setSorting(Months.february)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-feb')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.february
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.february ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.march]}}
          onClick={() => setSorting(Months.march)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-mar')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.march
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.march ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.april]}}
          onClick={() => setSorting(Months.april)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-apr')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.april
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.april ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.may]}}
          onClick={() => setSorting(Months.may)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-may')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.may
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.may ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.june]}}
          onClick={() => setSorting(Months.june)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-jun')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.june
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.june ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.july]}}
          onClick={() => setSorting(Months.july)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-jul')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.july
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.july ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.august]}}
          onClick={() => setSorting(Months.august)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-aug')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.august
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.august ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.september]}}
          onClick={() => setSorting(Months.september)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-sep')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.september
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.september ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.october]}}
          onClick={() => setSorting(Months.october)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-oct')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.october
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.october ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.november]}}
          onClick={() => setSorting(Months.november)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-nov')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.november
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.november ? 1 : 0.3,
            }}
          />
        </GridTitle>
        <GridTitle
          style={{gridColumn: monthColumns[Months.december]}}
          onClick={() => setSorting(Months.december)}
        >
          <GridCellText>
            {getFluentString('global-text-value-month-short-dec')}
          </GridCellText>
          <GridSortIcon
            icon={sortingBy === Months.december
              ? sortIcon : DirectionIcon.sortNone}
            style={{
              opacity: sortingBy === Months.december ? 1 : 0.3,
            }}
          />
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
          <MountainColumnTitleName
            onClick={() => setSorting(SortingCategories.name)}
          >
            {getFluentString('global-text-value-mountain')}
            <SortIcon
              icon={sortingBy === SortingCategories.name
                ? sortIcon : DirectionIcon.sortNone}
              style={{
                opacity: sortingBy === SortingCategories.name ? 1 : 0.3,
              }}
            />
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
