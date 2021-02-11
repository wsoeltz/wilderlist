import {faCheck} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import useUsersProgress from '../../../../queries/users/useUsersProgress';
import {
  BasicIconInText,
  CompleteText,
  IncompleteText,
} from '../../../../styling/styleUtils';
import {CoreItem, CoreItems} from '../../../../types/itemTypes';
import {
  formatDate,
  getDates,
} from '../../../../utilities/dateUtils';

interface Props {
  item: CoreItem;
  id: string;
  loading: boolean;
}

const LastHikedText = (props: Props) => {
  const {item, id, loading} = props;
  const {data} = useUsersProgress();
  const getString = useFluent();

  const field = item + 's' as unknown as CoreItems;

  let output: React.ReactElement<any> | string | null;
  if (loading) {
    output = '----';
  } else if (data) {
    const target = data.progress && data.progress[field] !== null
      ? (data.progress[field] as any).find((d: any) => d[item] && d[item].id && d[item].id === id) : undefined;

    if (target && target.dates && target.dates.length) {
      const dates = getDates(target.dates);
      if (dates && dates[dates.length - 1]) {
        const {day, month, year} = dates[dates.length - 1];
        let textDate: string;
        if (!isNaN(month) && !isNaN(year)) {
          if (!isNaN(day)) {
            textDate = getString('global-formatted-text-date', {
              day, month, year: year.toString(),
            });
          } else {
            textDate = getString('global-formatted-text-month-year', {
              month, year: year.toString(),
            });
          }
        } else {
          textDate = formatDate(dates[dates.length - 1]);
        }
        output = (
          <CompleteText>
            <BasicIconInText icon={faCheck} />
            {textDate}
          </CompleteText>
        );
      } else {
        output = (
          <IncompleteText>
            {getString('global-text-value-not-done-dynamic', {type: field})}
          </IncompleteText>
        );
      }
    } else {
      output = (
        <IncompleteText>
          {getString('global-text-value-not-done-dynamic', {type: field})}
        </IncompleteText>
      );
    }
  } else {
    output = null;
  }

  return (
    <>
      {output}
    </>
  );
};

export default LastHikedText;
