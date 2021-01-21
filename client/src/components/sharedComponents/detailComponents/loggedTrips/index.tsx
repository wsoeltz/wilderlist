import React from 'react';
import styled from 'styled-components/macro';
import useUsersProgress from '../../../../queries/users/useUsersProgress';
import {tertiaryColor} from '../../../../styling/styleUtils';
import {CoreItem, CoreItems} from '../../../../types/itemTypes';
import {BasicRoot} from '../styleUtils';
import LoggedTripList from './LoggedTripList';

const LoadingLine = styled.div`
  height: 0.7rem;
  max-width: 100%;
  margin-bottom: 0.25rem;
  background-color: ${tertiaryColor};
`;

export interface Props {
  id: string;
  name: string;
  item: CoreItem;
}

const LoggedTrips = (props: Props) => {
  const {id, name, item} = props;
  const {loading, error,  data} = useUsersProgress();
  let output: React.ReactElement<any> | null;
  if (loading) {
    output = (
      <>
        <LoadingLine style={{width: '100%'}}/>
        <LoadingLine style={{width: '80%'}}/>
        <LoadingLine style={{width: '60%'}}/>
        <LoadingLine style={{width: '40%'}}/>
      </>
    );
  } else if (error !== undefined) {
    console.error(error);
    output = (<p><small>{error.message}</small></p>);
  } else if (data !== undefined) {
    const {progress} = data;
    if (progress) {
      const field = item + 's' as unknown as CoreItems;
      const target = progress[field] !== null
        ? (progress[field] as any).find((d: any) => d[item] && d[item].id && d[item].id === id) : undefined;
      output = (
        <LoggedTripList
          id={id}
          name={name}
          completedDates={target && target.dates ? target.dates : []}
          type={item}
        />
      );
    } else {
      output = null;
    }
  } else {
    output = null;
  }
  return (
    <BasicRoot>
      {output}
    </BasicRoot>
  );
};

export default LoggedTrips;
