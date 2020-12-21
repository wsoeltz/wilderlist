import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import usePrevious from '../../../hooks/usePrevious';
import {
  listDetailLink,
  preventNavigation,
} from '../../../routing/Utils';
import {
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
  CompactButtonPrimary,
  lightBaseColor,
  secondaryFont,
  Seperator,
  StackableCardFooter,
  StackableCardSection as CardBase,
  StackedCardWrapper,
} from '../../../styling/styleUtils';
import { getColorSetFromVariant } from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import {
  roundPercentToSingleDecimal,
} from '../../../Utils';
import ImportAscentNotification from '../import/ImportAscentsNotification';
import { NH48_GRID_OBJECT_ID } from '../import/ImportGrid';
import { getType } from '../Utils';
import { CompactPeakListDatum } from './ListPeakLists';
import VariantLinks from './VariantLinks';

const Root = styled.div`
  border-left-width: 8px;
  border-left-style: solid;
  margin-bottom: 2rem;
`;

const LinkWrapper = styled(StackedCardWrapper)`
  margin-bottom: 0;
`;

const Card = styled(CardBase)`
  border-left-width: 0;
  display: grid;
  grid-template-columns: 1fr auto;
`;

const CardFooter = styled(StackableCardFooter)`
  border-left-width: 0;
`;

const CompletedValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${lightBaseColor};
`;

const Value = styled.div`
  font-size: 1.85rem;
  font-family: ${secondaryFont};
`;

const SubtleText = styled.small`
  text-transform: uppercase;
  font-size: 0.75rem;
`;

const Capitalize = styled.span`
  text-transform: capitalize;
`;

interface Props {
  peakList: CompactPeakListDatum;
  active: boolean | null;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  totalRequiredAscents: number;
  numCompletedAscents: number;
  queryRefetchArray: Array<{query: any, variables: any}>;
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, type, stateOrRegionString, numMountains}, peakList,
    active, listAction, actionText, totalRequiredAscents,
    numCompletedAscents, queryRefetchArray,
  } = props;

  const getString = useFluent();

  const [showImportNotification, setShowImportNotification] = useState<boolean>(false);
  const closeNotification = useCallback(() => setShowImportNotification(false), [setShowImportNotification]);

  const prevActive = usePrevious(active);
  useEffect(() => {
    if (prevActive === false && active === true && showImportNotification === false) {
      setShowImportNotification(true);
    }
  }, [prevActive, active, showImportNotification, setShowImportNotification]);
  const importAscentsNotification = showImportNotification &&
    (type === PeakListVariants.standard || type === PeakListVariants.winter || id === NH48_GRID_OBJECT_ID) ? (
    <ImportAscentNotification
      closeNotification={closeNotification}
      type={type}
      peakListId={id}
    />
  ) : null;

  const [hovered, setHovered] = useState<boolean>(false);
  const setHoveredTrue = useCallback(() => setHovered(true), [setHovered]);
  const setHoveredFalse = useCallback(() => setHovered(false), [setHovered]);

  const color = type === PeakListVariants.grid
        ? getColorSetFromVariant(type).primary :  getColorSetFromVariant(type).tertiary;

  const actionButtonOnClick = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    if (listAction !== null) {
      listAction(id);
    }
  };

  let cornerContent: React.ReactElement<any> | null;
  if (active === true) {
    const percent = roundPercentToSingleDecimal(numCompletedAscents, totalRequiredAscents);
    const percentComplete = isNaN(percent) ? 0 : percent;
    cornerContent = (
      <CompletedValue>
        <Value style={{color: percentComplete === 100 ? color : undefined}}>
          {percentComplete}%
        </Value>
        <SubtleText style={{color: percentComplete === 100 ? color : undefined}}>
          {getString('global-text-value-complete')}
        </SubtleText>
      </CompletedValue>
    );
  } else if (listAction !== null) {
    cornerContent = (
      <CompactButtonPrimary onClick={actionButtonOnClick}>
        {actionText}
      </CompactButtonPrimary>
    );
  } else {
    cornerContent = null;
  }

  return (
    <Root
      style={{borderLeftColor: color}}
      onMouseEnter={setHoveredTrue}
      onMouseLeave={setHoveredFalse}
    >
      <LinkWrapper
        to={listDetailLink(id)}
      >
        <Card>
          <div>
            <CardTitle>
              {name}{getType(type)}
            </CardTitle>
            <CardSubtitle>
              <CollapsedParagraph>
                {numMountains} Peaks
                <Seperator>|</Seperator>
                <Capitalize>
                {stateOrRegionString}
                </Capitalize>
              </CollapsedParagraph>
            </CardSubtitle>
          </div>
          <div>
            {cornerContent}
          </div>
        </Card>
      </LinkWrapper>
      <CardFooter>
        <VariantLinks
          peakList={peakList}
          queryRefetchArray={queryRefetchArray}
          grayText={!hovered}
        />
        {importAscentsNotification}
      </CardFooter>
    </Root>
  );
};

export default PeakListCard;
