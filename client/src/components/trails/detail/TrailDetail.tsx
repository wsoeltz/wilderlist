import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useTrailDetail} from '../../../queries/trails/useTrailDetail';
import { PlaceholderText } from '../../../styling/styleUtils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Content from './Content';
import Header from './Header';

interface Props {
  id: string | null;
  setOwnMetaData?: boolean;
}

const TrailDetail = (props: Props) => {
  const { id, setOwnMetaData} = props;

  const getString = useFluent();

  const {loading, error, data} = useTrailDetail(id);

  let header: React.ReactElement<any> | null;
  let body: React.ReactElement<any> | null;
  if (id === null) {
    header = null;
    body = null;
  } else if (loading === true) {
    header = <LoadingSpinner />;
    body = null;
  } else if (error !== undefined) {
    console.error(error);
    header =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
  } else if (data !== undefined) {
    const { trail } = data;
    if (!trail) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        states, type, children,
      } = trail;

      const segments = children && children.length ? children : [trail];

      const stateAbbreviation = states && states[0] && states[0].abbreviation ? states[0].abbreviation : '';

      const name = trail.name ? trail.name : getString('global-formatted-trail-type', {type})

      header = (
        <Header
          setOwnMetaData={setOwnMetaData ? setOwnMetaData : false}
          id={id}
          name={name}
          type={type}
          states={states}
        />
      );

      body = (
        <Content
          id={id}
          name={name}
          trails={segments}
          stateAbbreviation={stateAbbreviation}
        />
      );
    }
  } else {
    header = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
  }

  return (
    <>
      {header}
      {body}
    </>
  );
};

export default TrailDetail;
