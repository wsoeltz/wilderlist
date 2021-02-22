import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import {
  BlockHeaderNoPush,
  BlockTitle,
  HorizontalBlock,
  LargeText,
  Paragraph,
} from '../../../../styling/sharedContentStyles';
import AllClassificationsModal from './AllClassificationsModal';

const ClassificationBlock = ({type}: {type: string}) => {
  const getString = useFluent();

  return (
    <HorizontalBlock>
      <BlockHeaderNoPush>
        <BlockTitle>{getString('global-text-classification')}</BlockTitle>
        <LargeText>{upperFirst(getString('global-type-official-classification', {type}))}</LargeText>
      </BlockHeaderNoPush>
      <Paragraph>
        {getString('global-type-official-classification-description', {type})}
      </Paragraph>
      <AllClassificationsModal />
    </HorizontalBlock>
  );
};

export default ClassificationBlock;
