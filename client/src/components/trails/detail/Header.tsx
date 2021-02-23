const {lineString} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
import {faRoute} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendarAlt,
  faChartLine,
  faShoePrints,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {Link} from 'react-router-dom';
import useFluent from '../../../hooks/useFluent';
import {useBasicTrailDetail} from '../../../queries/trails/useBasicTrailDetail';
import {trailDetailLink} from '../../../routing/Utils';
import {
  Column,
  FlexTitle,
  ItemTitle,
  LoadableText,
  TopLevelColumns,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  IconContainer,
  lightBaseColor,
  PlaceholderText,
  SmallSemiBold,
} from '../../../styling/styleUtils';
import {TrailType} from '../../../types/graphQLTypes';
import {CoreItem, CoreItems} from '../../../types/itemTypes';
import {slopeToSteepnessClass} from '../../../utilities/trailUtils';
import LastHikedText from '../../sharedComponents/detailComponents/header/LastHikedText';
import SimpleHeader from '../../sharedComponents/detailComponents/header/SimpleHeader';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {trailDefaultSvg} from '../../sharedComponents/svgIcons';

interface Props {
  id: string;
}

const TrailDetail = (props: Props) => {
  const { id } = props;

  const getString = useFluent();

  const {loading, data} = useBasicTrailDetail(id);

  let name: string = '----';
  let subtitle: string = '----';
  let relatedTrails: React.ReactElement<any> | null = null;
  let hasChildren: boolean = false;
  let trailLengthText: string = '----';
  let map: React.ReactElement<any> | null = null;
  let centerColumn: React.ReactElement<any> = (
    <Column>
      <ItemTitle>
        <BasicIconInText icon={faSquare} />
        ------
      </ItemTitle>
      <LoadableText $loading={loading}>
        <SmallSemiBold>
          -----
        </SmallSemiBold>
      </LoadableText>
    </Column>
  );
  if (data !== undefined) {
    const { trail } = data;
    if (!trail) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        childrenCount, parents, locationText,
      } = trail;

      hasChildren = Boolean(childrenCount);

      const type = childrenCount ? TrailType.parentTrail : trail.type;
      const trailLength = trail.trailLength ? parseFloat(trail.trailLength.toFixed(2)) : 0;
      trailLengthText = getString('directions-driving-distance', {miles: trailLength});

      const formattedType = upperFirst(getString('global-formatted-trail-type', {type}));
      name = trail.name ? trail.name : formattedType;

      subtitle = hasChildren ? formattedType + ' in ' + locationText : getString('trail-detail-subtitle', {
          type: formattedType, segment: parents.length, state: locationText,
        });
      if (trail.avgSlope) {
        centerColumn = (
          <Column>
            <ItemTitle>
              <BasicIconInText icon={faChartLine} />
              {getString('global-text-value-average-incline')}
            </ItemTitle>
            <LoadableText $loading={loading}>
              <SmallSemiBold>
                {upperFirst(slopeToSteepnessClass(trail.avgSlope))},
                &nbsp;&nbsp;
                {parseFloat(trail.avgSlope.toFixed(1))}°
              </SmallSemiBold>
            </LoadableText>
          </Column>
        );
      }
      if (childrenCount) {
        relatedTrails = (
          <small>{getString('trail-child-segments', {count: childrenCount})}</small>
        );
        centerColumn = (
          <Column>
            <FlexTitle>
              <IconContainer
                $color={lightBaseColor}
                dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
              />
              {getString('global-text-value-total-segments')}
            </FlexTitle>
            <LoadableText $loading={loading}>
              <SmallSemiBold>
                {childrenCount}
              </SmallSemiBold>
            </LoadableText>
          </Column>

        );
      } else if (parents.length) {
        const links = parents.map((p, i) => {
          let seperator = ' ';
          if (i === parents.length - 1 && parents.length > 1) {
            // second to last link, use amersand
            seperator = ' & ';
          } else if (i < parents.length - 2 && i !== 0) {
            // else if not last link, add comma
            seperator = ', ';
          }
          const fullTrailText = getString('trail-parent-full-trail');
          const parentName = p.name === name && !p.name.includes(fullTrailText)
            ? `${p.name} (${fullTrailText})` : p.name;
          return (
            <React.Fragment key={'parent-trail-link' + p.id}>
              {seperator}
              <Link to={trailDetailLink(p.id)}>{parentName}</Link>
            </React.Fragment>
          );
        });
        relatedTrails = (
          <small>
            {getString('trail-parent-links')}
            {links}
          </small>
        );
      }
      if (trail.line && trail.line.length && trail.center) {
        const bbox = getBbox(lineString(trail.line));
        map = (
          <MapRenderProp
            id={trail.id}
            trails={[trail]}
            bbox={bbox}
          />
        );
      }
      if (trail.bbox && trail.bbox.length === 4) {
        map = (
          <MapRenderProp
            id={trail.id}
            bbox={trail.bbox}
          />
        );
      }

  }
 }

  return (
    <>
      <SimpleHeader
        id={id}
        loading={loading}
        title={name}
        subtitle={subtitle}
        customIcon={!hasChildren}
        icon={hasChildren ? faRoute : trailDefaultSvg}
        actionLine={relatedTrails}
        authorId={null}
        type={CoreItem.trail}
      />
      <TopLevelColumns>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faShoePrints} />
            {getString('global-text-value-length')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              {trailLengthText}
            </SmallSemiBold>
          </LoadableText>
        </Column>
        {centerColumn}
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faCalendarAlt} />
            {getString('global-text-value-last-trip-dynamic', {type: CoreItems.trails})}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              <LastHikedText
                id={id}
                item={CoreItem.trail}
                loading={loading}
              />
            </SmallSemiBold>
          </LoadableText>
        </Column>
      </TopLevelColumns>
      {map}
    </>
  );
};

export default TrailDetail;
