import {
  faUser as faUserOutline,
} from '@fortawesome/free-regular-svg-icons';
import {
  faFlag,
  faPencilAlt,
  faTasks,
  faUser,
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
  HelpUnderline,
  LinkButtonCompact,
  SmallLink,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {
  PeakListVariants,
  PermissionTypes,
} from '../../../types/graphQLTypes';
import { getType } from '../../../utilities/dateUtils';
import { failIfValidOrNonExhaustive} from '../../../Utils';
import SimplePercentBar from '../../sharedComponents/listComponents/SimplePercentBar';
// import MapLegend from '../../sharedComponents/detailComponents/header/MapLegend';
// import MapRenderProp from '../../sharedComponents/MapRenderProp';
import Tooltip from '../../sharedComponents/Tooltip';
import FlagModal from '../detail/FlagModal';
import StarListButton from '../detail/StarListButton';
import VariantLinkDropdown from '../list/VariantLinkDropdown';
import MountainLogo from '../mountainLogo';

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

const StarListButtonContainer = styled.div`
  transform: translateY(-50%);
`;

interface Props {
  peakListId: string;
  comparisonUserId: string;
  comparisonUserName: string;
}

const Header = (props: Props) => {
  const {peakListId, comparisonUserId, comparisonUserName} = props;
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const primaryUserData = useBasicListDetails(peakListId, userId);
  const secondaryUserData = useBasicListDetails(peakListId, comparisonUserId);

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
  let primaryUserCompleted: number = 0;
  let secondaryUserCompleted: number = 0;
  let variantList: React.ReactElement<any> | null = null;
  if (primaryUserData.loading === true || secondaryUserData.loading === true) {
    name = '-----';
  } else if (primaryUserData.error !== undefined) {
    console.error(primaryUserData.error);
  } else if (secondaryUserData.error !== undefined) {
    console.error(secondaryUserData.error);
  } else if (primaryUserData.data !== undefined && secondaryUserData.data !== undefined) {
    const {
      peakList: {
        parent,
      },
      peakList,
    } = primaryUserData.data;
    const comparisonData = secondaryUserData.data.peakList;
    numMountains = peakList.numMountains;
    numTrails = peakList.numTrails;
    numCampsites = peakList.numCampsites;
    type = peakList.type;
    primaryUserCompleted = peakList.numCompletedTrips;
    secondaryUserCompleted = comparisonData.numCompletedTrips;
    stateOrRegionString = peakList.locationText;
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
        <StarListButtonContainer>
          <StarListButton
            peakListId={peakListId}
            peakListName={name}
          />
        </StarListButtonContainer>
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

    variantList = (
      <VariantLinkDropdown
        key={type}
        peakList={peakList}
        otherUserId={comparisonUserId}
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

  const metaData = metaDescription && name && type ? (
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

  const primaryPercent =
    parseFloat(((primaryUserCompleted ? primaryUserCompleted : 0) / totalRequiredAscents * 100).toFixed(1));
  const secondaryPercent =
    parseFloat(((secondaryUserCompleted ? secondaryUserCompleted : 0) / totalRequiredAscents * 100).toFixed(1));

  return (
    <>
      {metaData}
      <Root>
        <TitleContent>
          <h1
            style={primaryUserData.loading || secondaryUserData.loading ? {
              width: '75%', backgroundColor: tertiaryColor, color: 'transparent',
            } : undefined}
          >
            {name}{type ? getType(type) : ''}
          </h1>
          <ListInfo
            style={primaryUserData.loading || secondaryUserData.loading ? {
              width: '35%', backgroundColor: tertiaryColor, color: 'transparent',
            } : undefined}>
            {stateOrRegionString}
          </ListInfo>
        </TitleContent>
        <LogoContainer>
          <MountainLogo
            id={mountainLogoId}
            title={!(primaryUserData.loading || secondaryUserData.loading) ? name : ''}
            shortName={shortName ? shortName : ''}
            variant={type ? type : PeakListVariants.standard}
            active={Boolean(type)}
            completed={false}
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
            <BasicIconInText icon={faUser} />
            {getString('peak-list-detail-your-progress')}
          </ItemTitle>
          <SimplePercentBar
            percent={!isNaN(primaryPercent) ? primaryPercent : 0}
          />
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faUserOutline} />
            {comparisonUserName}
          </ItemTitle>
          <SimplePercentBar
            percent={!isNaN(secondaryPercent) ? secondaryPercent : 0}
          />
        </Column>
      </TopLevelColumns>
      {flagModal}
    </>
  );
};

export default Header;
