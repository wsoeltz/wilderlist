import {
  faList,
} from '@fortawesome/free-solid-svg-icons';
import orderBy from 'lodash/orderBy';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import useAppearsInLists from '../../../../queries/lists/useAppearsInLists';
import {listDetailLink} from '../../../../routing/Utils';
import {
  Details,
  HorizontalBlock,
  HorizontalScrollContainer,
  SimpleTitle,
} from '../../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  IconContainer,
  lightBaseColor,
  lightBorderColor,
  Subtext,
  tertiaryColor,
} from '../../../../styling/styleUtils';
import {CoreItems} from '../../../../types/itemTypes';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../svgIcons';

const Root = styled.div`
  margin: 0 -1rem -1rem;
  border-top: solid 1px ${lightBorderColor};
  background-color: ${tertiaryColor};
  position: relative;
`;

const Title = styled.h4`
  padding: 0.75rem 0.5rem 0rem 1rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
  color: ${lightBaseColor};
  position: absolute;
  pointer-events: none;
  left: 0;
  right: 0;
  top: 0;
`;

const ScrollContainer = styled(HorizontalScrollContainer)`
  min-height: 10rem;
  margin-bottom: 0;
  padding-top: 3rem;
  padding-bottom: 1.5rem;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  id: string;
  name: string;
  field: CoreItems;
}

const AppearsIn = (props: Props) => {
  const {id, name, field} = props;
  const getString = useFluent();
  const {data} = useAppearsInLists({id, field});
  if (data && data.appearsIn && data.appearsIn.length) {

    const lists = orderBy(
      data.appearsIn.map(d => ({...d, totalItems: d.numMountains + d.numTrails + d.numCampsites})),
      ['isActive', 'totalItems'], ['desc', 'asc'])
    .map(list => {
      const url = listDetailLink(list.id);
      const mountains = list.numMountains ? (
        <FlexRow>
          <IconContainer
            $color={lightBaseColor}
            dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
          />
          <SimpleTitle>
            <Subtext>
              {list.numMountains} {
              getString(list.numMountains > 1 ? 'global-text-value-mountains' : 'global-text-value-mountain')
            }</Subtext>
          </SimpleTitle>
        </FlexRow>
      ) : null;
      const trails = list.numTrails ? (
        <FlexRow>
          <IconContainer
            $color={lightBaseColor}
            dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
          />
          <SimpleTitle>
            <Subtext>
              {list.numTrails} {
              getString(list.numTrails > 1 ? 'global-text-value-trails' : 'global-text-value-trail')
            }</Subtext>
          </SimpleTitle>
        </FlexRow>
      ) : null;
      const campsites = list.numCampsites ? (
        <FlexRow>
          <IconContainer
            $color={lightBaseColor}
            dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
          />
          <SimpleTitle>
            <Subtext>
              {list.numCampsites} {
              getString(list.numCampsites > 1 ? 'global-text-value-campsites' : 'global-text-value-campsite')
            }</Subtext>
          </SimpleTitle>
        </FlexRow>
      ) : null;
      const DetailContainer = Number(Boolean(mountains)) + Number(Boolean(trails)) + Number(Boolean(campsites)) > 1
        ? Details : React.Fragment;
      return (
        <HorizontalBlock key={'appears-in-' + list.id}>
          <div>
            <Link to={url}>
              <>{list.name}</>
            </Link>
            <br />
            <Subtext>{list.locationText}</Subtext>
          </div>
          <DetailContainer>
            {mountains}
            {trails}
            {campsites}
          </DetailContainer>
        </HorizontalBlock>
      );
    });

    return (
      <Root>
        <ScrollContainer hideScrollbars={false} $noScroll={data.appearsIn.length < 3}>
          <Title>
            <BasicIconInText icon={faList} />
            {getString('global-text-value-appears-on', {name})}
          </Title>
          {lists}
        </ScrollContainer>
      </Root>
    );

  }
  return null;
};

export default AppearsIn;
