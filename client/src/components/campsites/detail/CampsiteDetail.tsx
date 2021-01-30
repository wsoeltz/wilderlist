import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useCampsiteDetail} from '../../../queries/campsites/useCampsiteDetail';
import { PlaceholderText } from '../../../styling/styleUtils';
import {CoreItem} from '../../../types/itemTypes';
import SimpleHeader from '../../sharedComponents/detailComponents/header/SimpleHeader';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {tentNeutralSvg} from '../../sharedComponents/svgIcons';
import Content from './Content';

interface Props {
  id: string;
  setOwnMetaData?: boolean;
}

const CampsiteDetail = (props: Props) => {
  const { id } = props;

  const getString = useFluent();

  const {loading, error, data} = useCampsiteDetail(id);

  let title: string = '----';
  let subtitle: string = '----';
  let authorId: string | null = null;
  let body: React.ReactElement<any> | null;
  if (id === null) {
    body = null;
  } else if (loading === true) {
    body = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    body =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { campsite } = data;
    if (!campsite) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        name, author, state, type, ownership,
      } = campsite;

      authorId = author && author.id ? author.id : null;

      const formattedType = getString('global-formatted-campsite-type', {type});
      title = name ? name : upperFirst(formattedType);
      subtitle = getString('campsite-detail-subtitle', {
        ownership,
        type: ownership ? formattedType : upperFirst(formattedType),
        location: state && state.name ? state.name : 'null',
      }).trim();

      const stateAbbreviation = state && state.abbreviation ? state.abbreviation : '';

      body = (
        <Content
          campsite={campsite}
          stateAbbreviation={stateAbbreviation}
        />
      );
    }
  } else {
    body = null;
  }

  return (
    <>
      <SimpleHeader
        id={id}
        loading={loading}
        title={title}
        subtitle={subtitle}
        customIcon={true}
        icon={tentNeutralSvg}
        authorId={authorId}
        type={CoreItem.campsite}
      />
      {body}
    </>
  );
};

export default CampsiteDetail;
