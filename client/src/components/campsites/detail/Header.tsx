import {
  faAddressCard,
  faAt,
  faCalendarAlt,
  faCrosshairs,
  faLink,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useBasicCampsiteDetails} from '../../../queries/campsites/useBasicCampsiteDetails';
import {
  Column,
  ItemTitle,
  LimitedLink,
  LoadableText,
  TopLevelColumns,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  BasicIconInTextCompact,
  PlaceholderText,
  SmallSemiBold,
  Subtext,
} from '../../../styling/styleUtils';
import {CoreItem, CoreItems} from '../../../types/itemTypes';
import FormattedCoordinates from '../../sharedComponents/detailComponents/header/FormattedCoordinates';
import LastHikedText from '../../sharedComponents/detailComponents/header/LastHikedText';
import SimpleHeader from '../../sharedComponents/detailComponents/header/SimpleHeader';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {tentNeutralSvg} from '../../sharedComponents/svgIcons';

interface Props {
  id: string;
}

const CampsiteDetail = (props: Props) => {
  const { id } = props;

  const getString = useFluent();

  const {loading, data} = useBasicCampsiteDetails(id);

  let title: string = '----';
  let subtitle: string = '----';
  let authorId: null | string = null;
  let map: React.ReactElement<any> | null = null;
  let website: React.ReactElement<any> | null = null;
  let email: React.ReactElement<any> | null = null;
  let phone: React.ReactElement<any> | null = null;
  let noContactInfo: React.ReactElement<any> | null = null;
  if (data !== undefined) {
    const { campsite } = data;
    if (!campsite) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const formattedType = upperFirst(getString('global-formatted-campsite-type', {type: campsite.type}));
      title = campsite.name ? campsite.name : formattedType;
      subtitle = getString('campsite-detail-subtitle', {
        ownership: campsite.ownership,
        type: formattedType,
        location: campsite.locationText,
      });
      authorId = campsite.author ? campsite.author.id : null;
      map = (
        <MapRenderProp
          id={campsite.id}
          campsites={[campsite]}
          center={campsite.location}
        />
      );
      if (campsite.website) {
        let url: URL | null = null;
        try {
          const validUrl = new URL(campsite.website);
          url = validUrl;
        } catch (err) {
          url = null;
          console.error(err);
        }
        let displayUrl = url && url.hostname
          ? url.hostname : campsite.website;
        if (displayUrl.length > 35) {
          displayUrl = displayUrl.slice(0, 35) + '...';
        }
        website = (
          <SmallSemiBold>
            <LimitedLink href={campsite.website} target={'_blank'}>
              <small><BasicIconInTextCompact icon={faLink} /></small>
              {displayUrl}
            </LimitedLink>
          </SmallSemiBold>
        );
      }
      if (campsite.email) {
        const displayEmail = campsite.email.length > 35 ? campsite.email.slice(0, 35) + '...' : campsite.email;
        email = (
          <SmallSemiBold>
            <LimitedLink href={'mailto:' + campsite.email}>
              <small><BasicIconInTextCompact icon={faAt} /></small>
              {displayEmail}
            </LimitedLink>
          </SmallSemiBold>
        );
      }
      if (campsite.phone) {
        phone = (
          <SmallSemiBold>
            <LimitedLink href={'tel:' + campsite.phone}>
              <small><BasicIconInTextCompact icon={faPhone} /></small>
              {campsite.phone}
            </LimitedLink>
          </SmallSemiBold>
        );
      }
    }
  }

  if (loading) {
    noContactInfo = (<>-----</>);
  } else if (!website && !email && !phone) {
    noContactInfo = (
      <Subtext>
        <em>
          {getString('global-text-value-none-avail')}
        </em>
      </Subtext>
    );
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
      <TopLevelColumns>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faCrosshairs} />
            {getString('global-text-value-location')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              <FormattedCoordinates
                coordinates={data && data.campsite && data.campsite.location ? data.campsite.location : undefined}
              />
            </SmallSemiBold>
          </LoadableText>
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faAddressCard} />
            {getString('global-text-value-contact')}
          </ItemTitle>
          <LoadableText $loading={loading}>
            {website}
            {email}
            {phone}
            {noContactInfo}
          </LoadableText>
        </Column>
        <Column>
          <ItemTitle>
            <BasicIconInText icon={faCalendarAlt} />
            {getString('global-text-value-last-trip-dynamic', {type: CoreItems.campsites})}
          </ItemTitle>
          <LoadableText $loading={loading}>
            <SmallSemiBold>
              <LastHikedText
                id={id}
                item={CoreItem.campsite}
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

export default CampsiteDetail;
