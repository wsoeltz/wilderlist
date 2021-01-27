import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  ItemTitle,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInTextCompact,
  CompactButtonPrimary,
  PreFormattedDiv,
  ResourceItem,
  ResourceList,
} from '../../../styling/styleUtils';
import { ExternalResource } from '../../../types/graphQLTypes';

const Root = styled.div`
  padding: 1rem 1rem;
  display: flex;
`;

const DescriptionContainer = styled(PreFormattedDiv)`
  font-size: 0.9rem;
  overflow: hidden;
  position: relative;
  flex-grow: 1;
  min-height: 150px;

  p {
    line-height: 1.5;
  }

  p:first-of-type {
    margin-top: 0;
  }
`;

const DescriptionContent = styled.div`
  position: absolute;
`;

const ResourceContainer = styled.div`
  margin-left: 2rem;
  width: 180px;
  flex-shrink: 0;
`;

const ShowMoreContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 3rem;
  background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const ShowMoreButton = styled(CompactButtonPrimary)`

`;

interface Props {
  loading: boolean;
  description: string | React.ReactElement<any> | null;
  resources: ExternalResource[];
}

const Description = ({loading, description, resources}: Props) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const getString = useFluent();
  const descRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = descRef.current;
    if (node && !showAll) {
      const { clientWidth, clientHeight, scrollWidth, scrollHeight } = node;
      if (!(scrollHeight > clientHeight || scrollWidth > clientWidth)) {
        setShowAll(true);
      }
    }
  }, [descRef, showAll]);

  const resourceItems = resources.map(({title, url}) => (
    <ResourceItem key={'list-resource-' + title + url}>
      <a href={url} rel='noreferrer' target='_blank'>{title}</a>
    </ResourceItem>
  ));

  const resourceList = resourceItems && resourceItems.length ? (
    <ResourceContainer>
      <ItemTitle>
        {getString('global-text-value-additional-resources')}
      </ItemTitle>
      <ResourceList>
        {resourceItems}
      </ResourceList>
    </ResourceContainer>
  ) : null;

  const showMore = !showAll && !loading ? (
    <ShowMoreContainer>
      <ShowMoreButton
        onClick={() => setShowAll(true)}
      >
        <BasicIconInTextCompact icon={faPlus} />
        Keep Reading
      </ShowMoreButton>
    </ShowMoreContainer>
  ) : null;

  return (
    <Root>
      <DescriptionContainer
        ref={descRef}
        style={{minHeight: showAll ? 0 : undefined}}
      >
        <DescriptionContent
          style={{position: showAll ? 'static' : undefined}}
        >
          {description}
        </DescriptionContent>
        {showMore}
      </DescriptionContainer>
      {resourceList}
    </Root>
  );
};

export default Description;
