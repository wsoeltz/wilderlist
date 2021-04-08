import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  InlineSectionContainer,
  SimpleTitle,
} from '../../../styling/sharedContentStyles';
import {
  SelectBox,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import {
  Months,
  monthsArray,
  Seasons,
  seasonsArray,
} from '../../../Utils';

interface Props {
  type: PeakListVariants;
  value: Months | Seasons;
  setValue: (value: Months | Seasons) => void;
}

const MonthOrSeasonSelectBox = (props: Props) => {
  const {
    type, value, setValue,
  } = props;

  const getString = useFluent();

  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    return null;
  }

  const options = type === PeakListVariants.fourSeason ? seasonsArray.map(m => {
    return (
        <option
          value={m}
          key={'show-dates-for' + m}
        >
          {upperFirst(m)}
        </option>
    );
  }) : monthsArray.map(m => {
    return (
        <option
          value={m}
          key={'show-dates-for' + m}
        >
          {upperFirst(m)}
        </option>
    );
  });

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value as Months | Seasons);
  };

  return (
    <InlineSectionContainer>
      <SimpleTitle>
        {getString('compare-progress-for')}
      </SimpleTitle>
      <SelectBox onChange={onChange} value={value}>
        {options}
      </SelectBox>
    </InlineSectionContainer>
  );
};

export default MonthOrSeasonSelectBox;
