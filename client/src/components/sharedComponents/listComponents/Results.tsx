import React from 'react';
import ResultItem, {Props as Datum} from './ResultItem';

interface Props {
  data: Datum[];
}

const Results = (props: Props) => {
  const reults = props.data.map(d => (
    <ResultItem
      key={d.id}
      {...d}
    />
  ));
  return (
    <div>
      {reults}
    </div>
  );
};

export default Results;
