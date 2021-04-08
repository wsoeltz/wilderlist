import React from 'react';
import {useBasicTrailDetail} from '../../../queries/trails/useBasicTrailDetail';
import ParentContent from './ParentContent';
import SegmentContent from './SegmentContent';

interface Props {
  id: string;
}

const Content = (props: Props) => {
  const  {id} = props;
  const {data} = useBasicTrailDetail(id);
  if (data && data.trail) {
    if (data.trail.line && data.trail.line.length && !data.trail.childrenCount) {
      return (
        <SegmentContent
          id={id}
        />
      );
    }
    if (data.trail.childrenCount > 0) {
      return (
        <ParentContent
          id={id}
        />
      );
    }
  }
  return null;
};

export default Content;
