import {
  faCalendarAlt,
  faCheck,
  faFlag,
  faMapMarkerAlt,
  faPencilAlt,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {useBasicListDetails} from '../../../queries/lists/useBasicListDetails';
import { setPeakListOgImageUrl } from '../../../routing/routes';
import { editPeakListLink } from '../../../routing/Utils';
import { listDetailLink } from '../../../routing/Utils';
import {
  Column,
  ItemTitle,
  TopLevelColumns,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  BasicIconInTextCompact,
  completeColor,
  HelpUnderline,
  incompleteColor,
  LinkButtonCompact,
  SmallLink,
  SmallSemiBold,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {
  PeakListVariants,
  PermissionTypes,
} from '../../../types/graphQLTypes';
import { formatDate, getType, parseDate } from '../../../utilities/dateUtils';
import { failIfValidOrNonExhaustive} from '../../../Utils';
import Tooltip from '../../sharedComponents/Tooltip';
import PeakProgressBar from '../list/PeakProgressBar';
import VariantLinkDropdown from '../list/VariantLinkDropdown';
import MountainLogo from '../mountainLogo';
import FlagModal from './FlagModal';
import StarListButton from './StarListButton';

const mobileWidth = 500; // in px

const Root = styled.div`
  margin: 0 -1rem 1rem;
  display: grid;
  grid-template-columns: 120px 1fr 5.625rem;
  grid-template-rows: auto auto;
  grid-column-gap: 0.35rem;

  @media (max-width: ${mobileWidth}px) {
    grid-template-columns: 85px 1fr 5.45rem;
  }
`;

const TitleContent = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ListSettings = styled.div`
  grid-column: 3;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const EditFlagButtonContainer = styled.div`
  padding-right: 1rem;

  @media (max-width: ${mobileWidth}px) {
    padding-right: 0.5rem;
  }
`;

const ListInfo = styled.h3`
  margin-bottom: 0.5rem;
  margin-top: 0;
  font-size: 0.9rem;
  font-weight: 400;
`;

const LogoContainer = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
`;

const ProgressBarContainer = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
`;

const CompletedText = styled(SmallSemiBold)`
  color: ${completeColor};
`;
const NotCompletedText = styled(SmallSemiBold)`
  color: ${incompleteColor};
`;

interface Props {
  peakListId: string;
  setOwnMetaData: boolean | undefined;
}

const Header = (props: Props) => {
  const {peakListId, setOwnMetaData} = props;
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const {loading, error, data} = useBasicListDetails(peakListId, userId);

  const getString = useFluent();

  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);

  const openFlagModal = useCallback(() => setIsFlagModalOpen(true), []);
  const closeFlagModal = useCallback(() => setIsFlagModalOpen(false), []);

  let shortName: string | undefined;
  let name: string = '-----';
  let stateOrRegionString: string | null = '-----';
  let topLevelHeading: React.ReactElement<any> | null = null;
  let mountainLogoId: string = peakListId;
  let type: PeakListVariants | null = null;
  let numMountains: number = 0;
  let numTrails: number = 0;
  let numCampsites: number = 0;
  let totalRequiredAscents: number = 0;
  let numCompletedTrips: number = 0;
  let latestDateText: React.ReactElement<any> | null = (<>---</>);
  let variantList: React.ReactElement<any> | null = null;
  if (loading === true) {
    name = '-----';
  } else if (error !== undefined) {
    console.error(error);
  } else if (data !== undefined) {
    const {
      peakList: {
        parent, latestTrip,
      },
      peakList,
    } = data;
    numMountains = peakList.numMountains;
    numTrails = peakList.numTrails;
    numCampsites = peakList.numCampsites;
    type = peakList.type;
    numCompletedTrips = peakList.numCompletedTrips;
    stateOrRegionString = peakList.stateOrRegionString;
    name = peakList.name;
    shortName = peakList.shortName;
    if (parent && parent.id) {
      mountainLogoId = parent.id;
    }

    let editFlagButton: React.ReactElement<any> | null;
    if (!user) {
      editFlagButton = null;
    } else {
      editFlagButton = (user && peakList.author && user._id === peakList.author.id
            && user.peakListPermissions !== -1)
        || (user && user.permissions === PermissionTypes.admin) ? (
        <SmallLink to={editPeakListLink(peakList.id)}>
          <BasicIconInTextCompact icon={faPencilAlt} />
          {getString('global-text-value-edit')}
        </SmallLink>
      ) : (
        <LinkButtonCompact onClick={openFlagModal}>
          <BasicIconInTextCompact icon={faFlag} />
          {getString('global-text-value-flag')}
        </LinkButtonCompact>
      );
    }

    topLevelHeading = (
      <>
        <StarListButton
          peakListId={peakListId}
          peakListName={name}
        />
        <EditFlagButtonContainer>
          {editFlagButton}
        </EditFlagButtonContainer>
      </>
    );

    const numItems = numMountains + numTrails + numCampsites;
    if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
      totalRequiredAscents = numItems;
    } else if (type === PeakListVariants.fourSeason) {
      totalRequiredAscents = numItems * 4;
    } else if (type === PeakListVariants.grid) {
      totalRequiredAscents = numItems * 12;
    } else {
      totalRequiredAscents = 0;
      failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
    }

    const latestDate = latestTrip ? parseDate(latestTrip) : undefined;

    if (latestDate !== undefined) {
      const {day, month, year} = latestDate;
      let textDate: string;
      if (!isNaN(month) && !isNaN(year)) {
        if (!isNaN(day)) {
          textDate = getString('global-formatted-text-date', {
            day, month, year: year.toString(),
          });
        } else {
          textDate = getString('global-formatted-text-month-year', {
            month, year: year.toString(),
          });
        }
      } else {
        textDate = formatDate(latestDate);
      }
      latestDateText = (
        <CompletedText>
          <BasicIconInTextCompact icon={faCheck} />
          {textDate}
        </CompletedText>
      );
    } else {
       latestDateText = (
         <NotCompletedText>{getString('peak-list-text-no-completed-ascent')}</NotCompletedText>
       );
    }

    variantList = (
      <VariantLinkDropdown
        key={type}
        peakList={peakList}
      />
    );
  } else {
    name = '';
  }

  const flagModal = isFlagModalOpen === false ? null : (
    <FlagModal
      onClose={closeFlagModal}
      peakListId={peakListId}
      peakListName={name}
    />
  );

  const numMountainsText = numMountains
    ? (
      <SmallSemiBold>
        {
          numMountains + ' ' +
          (numMountains === 1
            ? getString('global-text-value-mountain') : getString('global-text-value-mountains'))
        }
      </SmallSemiBold>)
    : '';
  const numTrailsText = numTrails
    ? (
      <SmallSemiBold>
        {
          numTrails + ' ' +
          (numTrails === 1
            ? getString('global-text-value-trail') : getString('global-text-value-trails'))
        }
      </SmallSemiBold>)
    : '';
  const numCampsitesText = numCampsites
    ? (
      <SmallSemiBold>
        {
          numCampsites + ' ' +
          (numCampsites === 1
            ? getString('global-text-value-campsite') : getString('global-text-value-campsites'))
        }
      </SmallSemiBold>)
    : '';

  let areaText: string | null;
  if (stateOrRegionString === 'Across the US') {
    areaText = ' across the US';
  } else if (stateOrRegionString) {
    areaText = ' throughout ' + stateOrRegionString;
  } else {
    areaText = null;
  }

  const metaDescription = name && type && shortName && areaText
    ? getString('meta-data-peak-list-detail-description', {
      'list-name': name,
      'type': type,
      'num-mountains': numMountains,
      'list-short-name': shortName,
      'state-or-region-string': areaText,
    })
    : null;

  const metaData = setOwnMetaData === true && metaDescription && name && type ? (
    <Helmet>
      <title>{getString('meta-data-detail-default-title', {
        title: name, type,
      })}</title>
      <meta
        name='description'
        content={metaDescription}
      />
      <meta property='og:title' content='Wilderlist' />
      <meta
        property='og:description'
        content={metaDescription}
      />
      <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + listDetailLink(peakListId)} />
      <meta property='og:image' content={setPeakListOgImageUrl(peakListId)} />
    </Helmet>
  ) : null;

  return (
    <>
      {metaData}
      <Root>
        <TitleContent>
          <h1
            style={loading ? {
              width: '75%', backgroundColor: tertiaryColor, color: 'transparent',
            } : undefined}
          >
            {name}{type ? getType(type) : ''}
          </h1>
          <ListInfo
            style={loading ? {
              width: '35%', backgroundColor: tertiaryColor, color: 'transparent',
            } : undefined}>
            {stateOrRegionString}
          </ListInfo>
          <ProgressBarContainer>
            <PeakProgressBar
              variant={type}
              completed={numCompletedTrips ? numCompletedTrips : 0}
              total={totalRequiredAscents}
              id={peakListId}
            />
          </ProgressBarContainer>
        </TitleContent>
        <LogoContainer>
          <MountainLogo
            id={mountainLogoId}
            title={!loading ? name : ''}
            shortName={shortName ? shortName : ''}
            variant={type ? type : PeakListVariants.standard}
            active={Boolean(type)}
            completed={totalRequiredAscents > 0 && numCompletedTrips === totalRequiredAscents}
          />
        </LogoContainer>
        <ListSettings>
          {topLevelHeading}
        </ListSettings>
      </Root>
      <TopLevelColumns>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faTasks} />
            <Tooltip
              explanation={'about tracking types'}
            >
              <HelpUnderline>{getString('global-text-value-tracking-type')}</HelpUnderline>
            </Tooltip>
          </ItemTitle>
          {variantList}
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faMapMarkerAlt} />
            {getString('peak-list-text-total-points')}
          </ItemTitle>
          {numMountainsText}
          {numTrailsText}
          {numCampsitesText}
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faCalendarAlt} />
            {getString('peak-list-text-last-hiked')}
          </ItemTitle>
          {latestDateText}
        </Column>
      </TopLevelColumns>
      {flagModal}
    </>
  );
};

export default Header;
