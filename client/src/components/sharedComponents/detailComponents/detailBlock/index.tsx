import {
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import {
  BlockHeaderNoPush,
  BlockTitle,
  CenteredHeader,
  DetailsTop,
  FittedBlock,
  InlineColumns,
  SimpleTitle,
} from '../../../../styling/sharedContentStyles';
import {
  BasicIconInTextCompact,
  CompleteText,
  IncompleteText,
  Subtext,
} from '../../../../styling/styleUtils';

export interface DetailDatum {
  label: string;
  value: string | boolean | undefined;
}

interface Props {
  title: string;
  data: undefined | DetailDatum[];
}

const DetailBlock = (props: Props) => {
  const {title, data} = props;
  const getString = useFluent();

  const listItems = data && data.length ? data.map(({label, value}) => {
    let valueElm: React.ReactElement<any>;
    if (value === true) {
      valueElm = (
        <CompleteText>
          <BasicIconInTextCompact icon={faCheck} /> {getString('global-text-value-yes')}
        </CompleteText>
      );
    } else if (value === false) {
      valueElm = (
        <IncompleteText>
          <BasicIconInTextCompact icon={faTimes} /> {getString('global-text-value-no')}
        </IncompleteText>
      );
    } else if (value === undefined) {
      valueElm = <>{getString('global-text-value-no-data').toUpperCase()}</>;
    } else {
      valueElm = <>{value}</>;
    }
    return (
      <InlineColumns
        key={'detail-block-' + label + value}
        style={{opacity: value === undefined ? 0.5 : undefined}}
      >
        <Subtext>
          <SimpleTitle>{label}:</SimpleTitle>
        </Subtext>
        <Subtext>
          {valueElm}
        </Subtext>
      </InlineColumns>
    );
  }) : (
    <CenteredHeader>{getString('global-text-value-no-data').toUpperCase()}</CenteredHeader>
  );

  return (
    <FittedBlock>
      <BlockHeaderNoPush>
        <BlockTitle>{title}</BlockTitle>
      </BlockHeaderNoPush>
      <DetailsTop>
        {listItems}
      </DetailsTop>
    </FittedBlock>
  );
};

export default DetailBlock;
