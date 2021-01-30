import {faRoute} from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {Link} from 'react-router-dom';
import useFluent from '../../../hooks/useFluent';
import {useTrailDetail} from '../../../queries/trails/useTrailDetail';
import {trailDetailLink} from '../../../routing/Utils';
import { PlaceholderText } from '../../../styling/styleUtils';
import {CoreItem} from '../../../types/itemTypes';
// import Header from './Header';
import SimpleHeader from '../../sharedComponents/detailComponents/header/SimpleHeader';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {trailDefaultSvg} from '../../sharedComponents/svgIcons';
import Content from './Content';

interface Props {
  id: string;
  setOwnMetaData?: boolean;
}

const TrailDetail = (props: Props) => {
  const { id } = props;

  const getString = useFluent();

  const {loading, error, data} = useTrailDetail(id);

  let name: string = '----';
  let subtitle: string = '----';
  let relatedTrails: React.ReactElement<any> | null = null;
  let hasChildren: boolean = false;
  let body: React.ReactElement<any> | null;
  if (id === null) {
    body = null;
  } else if (loading === true) {
    body = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    body =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { trail } = data;
    if (!trail) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        states, type, children, parents,
      } = trail;

      const segments = children && children.length ? children : [trail];
      hasChildren = Boolean(children && children.length);

      const stateAbbreviation = states && states[0] && states[0].abbreviation ? states[0].abbreviation : '';
      const stateName = states && states[0] && states[0].name ? states[0].name : '';
      const formattedType = upperFirst(getString('global-formatted-trail-type', {type}));
      name = trail.name ? trail.name : formattedType;

      if (children.length) {
        subtitle = 'Feature route';
      } else {
        subtitle = getString('trail-detail-subtitle', {
          type: formattedType, segment: parents.length, state: stateName,
        });
      }
      if (children.length) {
        relatedTrails = (
          <small>{getString('trail-child-segments', {count: children.length})}</small>
        );
      } else if (parents.length) {
        const links = parents.map((p, i) => {
          let seperator = ' ';
          if (i === parents.length - 2) {
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

      body = (
        <Content
          id={id}
          name={name}
          trails={segments}
          stateAbbreviation={stateAbbreviation}
        />
      );
    }
  } else {
    body = null;
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
      {body}
    </>
  );
};

export default TrailDetail;
