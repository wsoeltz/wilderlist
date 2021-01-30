import {faEye} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useMountainDetail} from '../../../queries/mountains/useMountainDetail';
import {
  BasicIconInTextCompact,
  LinkButtonCompact,
  PlaceholderText,
} from '../../../styling/styleUtils';
import {CoreItem} from '../../../types/itemTypes';
// import Header from './Header';
import SimpleHeader from '../../sharedComponents/detailComponents/header/SimpleHeader';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {mountainNeutralSvg} from '../../sharedComponents/svgIcons';
import Content from './Content';

interface Props {
  id: string;
  setOwnMetaData?: boolean;
}

const MountainDetail = (props: Props) => {
  const { id, setOwnMetaData} = props;

  const getString = useFluent();

  const {loading, error, data} = useMountainDetail(id);

  // let header: React.ReactElement<any> | null;
  let title: string = '----';
  let subtitle: string = '----';
  let authorId: null | string = null;
  let body: React.ReactElement<any> | null;
  if (id === null) {
    // header = null;
    body = null;
  } else if (loading === true) {
    // header = <LoadingSpinner />;
    body = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    body =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    // body = null;
  } else if (data !== undefined) {
    const { mountain } = data;
    if (!mountain) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        name, state,
      } = mountain;
      title = name;
      subtitle = state.name;
      authorId = mountain.author ? mountain.author.id : null;

      // header = (
      //   <Header
      //     setOwnMetaData={setOwnMetaData ? setOwnMetaData : false}
      //     authorId={author ? author.id : null}
      //     id={id}
      //     name={name}
      //     elevation={elevation}
      //     state={state}
      //     status={status}
      //   />
      // );

      body = (
        <Content
          setOwnMetaData={setOwnMetaData === true ? true : false}
          mountain={mountain}
        />
      );
    }
  } else {
    // header = (
    //   <PlaceholderText>
    //     {getString('global-error-retrieving-data')}
    //   </PlaceholderText>
    // );
    body = null;
  }

  const summitViewButton = (
    <LinkButtonCompact>
      <BasicIconInTextCompact icon={faEye} />
      {getString('mountain-detail-summit-view')}
    </LinkButtonCompact>
  );

  return (
    <>
      <SimpleHeader
        id={id}
        loading={loading}
        title={title}
        subtitle={subtitle}
        customIcon={true}
        icon={mountainNeutralSvg}
        actionLine={summitViewButton}
        authorId={authorId}
        type={CoreItem.mountain}
      />
      {body}
    </>
  );
};

export default MountainDetail;
