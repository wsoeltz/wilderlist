import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import {
  CollapsedScrollContainer,
  EmptyBlock,
} from '../../../../styling/sharedContentStyles';
import {ButtonPrimary} from '../../../../styling/styleUtils';
import {Coordinate, CoordinateWithElevation} from '../../../../types/graphQLTypes';
import {downloadGPXString} from '../../../../utilities/trailUtils';

interface Props {
  title: string;
  line: Coordinate[] | CoordinateWithElevation[];
}

const TrailDetails = (props: Props) => {
  const {title, line} = props;
  const getString = useFluent();
  const onClick = () => {
    downloadGPXString({
      line,
      name: title,
      url: 'https://wilderlist.app' + window.location.pathname,
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

};

export default TrailDetails;
