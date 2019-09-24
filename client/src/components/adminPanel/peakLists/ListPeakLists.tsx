import { ApolloError } from 'apollo-boost';
import React from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import { SuccessResponse } from '../AdminPeakLists';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deletePeakList: (id: string) => void;
  editPeakList: (id: string) => void;
}

const ListStates = (props: Props) => {
  const {loading, error, data, deletePeakList, editPeakList} = props;

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { peakLists } = data;
    const peakListElms = peakLists.map(peakList => {
      const { type, parent } = peakList;
      let mountainElms;
      if (parent !== null) {
        mountainElms = `Parent list: ${parent.name}`;
      } else {
        mountainElms = peakList.mountains.map(({name}) => name + ', ');
      }
      return (
        <li key={peakList.id}>
          <strong><LinkButton
            onClick={() => editPeakList(peakList.id)}
          >{peakList.name} ({peakList.shortName})</LinkButton></strong>
          <button
            onClick={() => deletePeakList(peakList.id)}
          >
            Delete
          </button>
          <div>
            <small>{mountainElms}</small>
          </div>
          <div>
            <small>
              {type},
            </small>
          </div>
        </li>
      );
    });
    return(
      <>
        {peakListElms}
      </>
    );
  } else {
    return null;
  }
};

export default ListStates;
