import {
  faHiking,
  faLock,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  ItemTitle,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  HelpUnderline,
  LinkButton,
  SelectBox,
} from '../../../styling/styleUtils';
import {
  ListPrivacy,
  PeakListTier,
  PeakListVariants,
} from '../../../types/graphQLTypes';
import DelayedInput from '../../sharedComponents/DelayedInput';
import Tooltip from '../../sharedComponents/Tooltip';
import MountainLogo from '../mountainLogo';

const mobileSize = 650; // in px

const Root = styled.div`
  margin: 0 0 1rem -1rem;
  display: grid;
  grid-template-columns: 8rem 1fr 6rem;
  grid-template-rows: auto auto;
  grid-column-gap: 0.5rem;
  align-items: center;

  @media (max-width: ${mobileSize}px) {
    grid-template-columns: 6rem 1fr 1fr;
    grid-template-rows: auto auto auto auto;
    grid-row-gap: 0.5rem;
  }
`;

const LogoContainer = styled.div`
  grid-column: 1;
  grid-row: 1 / -1;
`;

const CycleImageContainer = styled.small`
  display: block;
  margin-left: 1rem;
  transform: translateY(-100%);

  @media (max-width: ${mobileSize}px) {
    transform: none;
  }
`;

const TitleContainer = styled.div`
  grid-column: 2;
  grid-row: 1;

  @media (max-width: ${mobileSize}px) {
    grid-column: 2 / -1;
  }
`;

const AbbreviationContainer = styled.div`
  grid-column: 3;
  grid-row: 1;

  @media (max-width: ${mobileSize}px) {
    grid-column: 2 / -1;
    grid-row: 2;
  }
`;

const ImageAndDifficultyContainer = styled.div`
  grid-column: 2;
  grid-row: 2;

  @media (max-width: ${mobileSize}px) {
    grid-column: 2;
    grid-row: 3;
  }
`;

const VisibilityContainer = styled.div`
  grid-column: 3;
  grid-row: 2;

  @media (max-width: ${mobileSize}px) {
    grid-column: 3;
    grid-row: 3;
  }
`;

const ThinSelect = styled(SelectBox)`
  font-size: 0.9rem;
  padding: 4px 8px;
`;

interface Props {
  id: string;
  toggleId: null | (() => void);
  name: string;
  setName: (value: string) => void;
  shortName: string;
  setShortName: (value: string) => void;
  tier: PeakListTier | null;
  setStringToPeakListTier: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  privacy: ListPrivacy | null;
  setStringToListPrivacy: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormHeader = (props: Props) => {
  const {
    id, toggleId,
    name, setName,
    shortName, setShortName,
    tier, setStringToPeakListTier,
    privacy, setStringToListPrivacy,
  } = props;
  const getString = useFluent();

  const cycleImageButton = toggleId ? (
    <CycleImageContainer>
      <LinkButton onClick={toggleId}>
        <BasicIconInText icon={faSyncAlt} />
        {getString('create-peak-list-cycle-image')}
      </LinkButton>
    </CycleImageContainer>
  ) : null;

  return (
    <Root>
      <LogoContainer>
        <MountainLogo
          id={id}
          title={name}
          shortName={shortName}
          variant={PeakListVariants.standard}
          active={true}
          completed={false}
        />
        {cycleImageButton}
      </LogoContainer>
      <TitleContainer>
        <label htmlFor={'create-peak-list-name'}>
          <ItemTitle>
            {getString('global-text-value-name')}
          </ItemTitle>
        </label>
        <DelayedInput
          id={'create-peak-list-name'}
          type={'text'}
          initialValue={name}
          setInputValue={setName}
          placeholder={getString('create-peak-list-peak-list-name-placeholder')}
          /* autoComplete='off' is ignored in Chrome, but other strings aren't */
          maxLength={1000}
        />
      </TitleContainer>
      <AbbreviationContainer>
        <label htmlFor={'create-peak-list-short-name'}>
          <ItemTitle>
            {getString('create-peak-list-peak-list-short-name-label')}
          </ItemTitle>
        </label>
        <DelayedInput
          id={'create-peak-list-short-name'}
          type={'text'}
          initialValue={shortName}
          setInputValue={setShortName}
          placeholder={getString('create-peak-list-peak-list-short-name-placeholder')}
          maxLength={8}
        />
      </AbbreviationContainer>
      <ImageAndDifficultyContainer>
        <div>
          <label htmlFor={'create-peak-list-select-tier'}>
            <ItemTitle>
              <Tooltip
                explanation={
                  <div dangerouslySetInnerHTML={{__html: getString('global-text-value-list-tier-desc')}} />
                }
              >
                <BasicIconInText icon={faHiking} />
                <HelpUnderline>{getString('global-text-value-difficulty')}</HelpUnderline>
              </Tooltip>
            </ItemTitle>
          </label>
          <ThinSelect
            id={'create-peak-list-select-tier'}
            value={tier || ''}
            onChange={setStringToPeakListTier}
            placeholder={getString('global-text-value-tier')}
          >
            <option value=''></option>
            <option value={PeakListTier.casual}>
              {getString('global-text-value-list-tier', {
                tier: PeakListTier.casual,
              })}
            </option>
            <option value={PeakListTier.advanced}>
              {getString('global-text-value-list-tier', {
                tier: PeakListTier.advanced,
              })}
            </option>
            <option value={PeakListTier.expert}>
              {getString('global-text-value-list-tier', {
                tier: PeakListTier.expert,
              })}
            </option>
            <option value={PeakListTier.mountaineer}>
              {getString('global-text-value-list-tier', {
                tier: PeakListTier.mountaineer,
              })}
            </option>
          </ThinSelect>
        </div>
      </ImageAndDifficultyContainer>
      <VisibilityContainer>
        <label htmlFor={'create-peak-list-select-privacy'}>
          <ItemTitle>
            <BasicIconInText icon={faLock} />
            {getString('global-text-value-visibility')}
          </ItemTitle>
        </label>
        <ThinSelect
          id={'create-peak-list-select-privacy'}
          value={privacy || ''}
          onChange={setStringToListPrivacy}
          placeholder={getString('global-text-value-visibility')}
        >
          <option value={ListPrivacy.Public}>
            {upperFirst(ListPrivacy.Public)}
          </option>
          <option value={ListPrivacy.Private}>
            {upperFirst(ListPrivacy.Private)}
          </option>
        </ThinSelect>
      </VisibilityContainer>
    </Root>
  );
};

export default React.memo(FormHeader);
