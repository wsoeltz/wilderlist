import {
  faCalendarAlt,
  faChartArea,
  faCrosshairs,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {useBasicMountainDetails} from '../../../queries/mountains/useBasicMountainDetails';
import {setMountainOgImageUrl} from '../../../routing/routes';
import {mountainDetailLink, summitViewLink} from '../../../routing/Utils';
import {
  Column,
  ItemTitle,
  LoadableText,
  TopLevelColumns,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  BasicIconInTextCompact,
  PlaceholderText,
  SmallLink,
  SmallSemiBold,
} from '../../../styling/styleUtils';
import {CoreItem} from '../../../types/itemTypes';
import FormattedCoordinates from '../../sharedComponents/detailComponents/header/FormattedCoordinates';
import FormattedElevation from '../../sharedComponents/detailComponents/header/FormattedElevation';
import LastHikedText from '../../sharedComponents/detailComponents/header/LastHikedText';
import SimpleHeader from '../../sharedComponents/detailComponents/header/SimpleHeader';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {mountainNeutralSvg} from '../../sharedComponents/svgIcons';

interface Props {
  id: string;
}

const MountainDetail = (props: Props) => {
  const { id } = props;

  const getString = useFluent();

  const {loading, data} = useBasicMountainDetails(id);

  let title: string = '----';
  let subtitle: string = '----';
  let authorId: null | string = null;
  let map: React.ReactElement<any> | null = null;
  if (data !== undefined) {
    const { mountain } = data;
    if (!mountain) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      title = mountain.name;
      subtitle = mountain.locationText ? mountain.locationText : '';
      authorId = mountain.author ? mountain.author.id : null;
      map = (
        <MapRenderProp
          id={mountain.id}
          mountains={[mountain]}
          center={mountain.location}
        />
      );
    }
  }

  const summitViewUrl = data && data.mountain ? summitViewLink(
    data.mountain.location[1],
    data.mountain.location[0],
    data.mountain.elevation,
    id,
  ) : '';
  const summitViewButton = (
    <SmallLink
      to={summitViewUrl}
    >
      <BasicIconInTextCompact icon={faEye} />
      {getString('mountain-detail-summit-view')}
    </SmallLink>
  );

  const metaDescription = data && data.mountain
    ? getString('meta-data-mountain-detail-description', {
      name: data.mountain.name,
      state: data.mountain.locationTextShort,
      elevation: data.mountain.elevation,
    })
    : null;
  const metaTitle = data && data.mountain ? getString('meta-data-detail-default-title', {
    title: data.mountain.name + ', ' + data.mountain.locationTextShort, type: '',
  }) : '';
  const metaData = metaDescription && data && data.mountain ? (
    <Helmet>
      <title>{metaTitle}</title>
      <meta
        name='description'
        content={metaDescription}
      />
      <meta property='og:title' content={metaTitle} />
      <meta
        property='og:description'
        content={metaDescription}
      />
      <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + mountainDetailLink(id)} />
      <meta property='og:image' content={setMountainOgImageUrl(id)} />
    </Helmet>
  ) : null;

  return (
    <>
      {metaData}
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
      <TopLevelColumns>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faCrosshairs} />
            {getString('global-text-value-location')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              <FormattedCoordinates
                coordinates={data && data.mountain && data.mountain.location ? data.mountain.location : undefined}
              />
            </SmallSemiBold>
          </LoadableText>
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faChartArea} />
            {getString('global-text-value-elevation')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              <FormattedElevation
                elevation={data && data.mountain && data.mountain.elevation ? data.mountain.elevation : undefined}
              />
            </SmallSemiBold>
          </LoadableText>
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faCalendarAlt} />
            {getString('peak-list-text-last-hiked')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              <LastHikedText
                id={id}
                item={CoreItem.mountain}
                loading={loading}
              />
            </SmallSemiBold>
          </LoadableText>
        </Column>
      </TopLevelColumns>
      {map}
    </>
  );
};

export default MountainDetail;
