import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import {useBasicTrailDetail} from '../../../../queries/trails/useBasicTrailDetail';
import {trailDetailLink} from '../../../../routing/Utils';
import {
  CenteredHeader,
  CollapsedScrollContainer,
  EmptyBlock,
  HorizontalScrollContainer,
} from '../../../../styling/sharedContentStyles';
import {ButtonPrimary} from '../../../../styling/styleUtils';
import {downloadGPXString} from '../../../../utilities/trailUtils';
import LoadingSimple from '../../../sharedComponents/LoadingSimple';

interface Props {
  id: string;
}

const TrailDetails = (props: Props) => {
  const {id} = props;
  const getString = useFluent();
  const {loading, error, data} = useBasicTrailDetail(id);

  if (loading) {
    return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <CenteredHeader>
              <LoadingSimple />
              {getString('global-text-value-loading')}...
            </CenteredHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
    );
  } else if (error !== undefined) {
    console.error(error);
    return (
      <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
        <EmptyBlock>
          <CenteredHeader>
            {getString('global-error-retrieving-data')}
          </CenteredHeader>
        </EmptyBlock>
      </HorizontalScrollContainer>
    );
  } else if (data !== undefined && data.trail && data.trail.line) {
    const line = data.trail.line;
    const name = data.trail.name ? data.trail.name : upperFirst(getString('global-formatted-trail-type', {
      type: data.trail.type,
    }));

    const onClick = () => {
      downloadGPXString({
        line,
        name,
        url: 'https://wilderlist.app' + trailDetailLink(id),
      });
    };

    return (
      <CollapsedScrollContainer hideScrollbars={false} $noScroll={true}>
        <EmptyBlock>
          <p>
            <ButtonPrimary onClick={onClick}>
              {getString('download-gpx-button')}
            </ButtonPrimary>
          </p>
        </EmptyBlock>
      </CollapsedScrollContainer>
    );
  } else {
    return null;
  }

};

export default TrailDetails;
