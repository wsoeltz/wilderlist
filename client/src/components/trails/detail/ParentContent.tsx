import React from 'react';
import {useBasicTrailDetail} from '../../../queries/trails/useBasicTrailDetail';

interface Props {
  id: string;
}

const Content = (props: Props) => {
  const  {id} = props;
  const {data} = useBasicTrailDetail(id);

  if (data) {
    return (
      <div>
        Parent Content
      </div>
    );
  }

  return null;
};

export default Content;
