import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import {useBasicCampsiteDetails} from '../../../../queries/campsites/useBasicCampsiteDetails';
import {
  CenteredHeader,
  CollapsedScrollContainer,
  EmptyBlock,
  HorizontalScrollContainer,
} from '../../../../styling/sharedContentStyles';
import ClassificationBlock from '../../../sharedComponents/detailComponents/classificationBlock';
import DetailBlock, {DetailDatum} from '../../../sharedComponents/detailComponents/detailBlock';
import LoadingSimple from '../../../sharedComponents/LoadingSimple';

interface Props {
  id: string;
}

const MoreInformationPanel = (props: Props) => {
  const {id} = props;
  const getString = useFluent();
  const {loading, error, data} = useBasicCampsiteDetails(id);
  if (loading) {
    return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <CenteredHeader>
              <LoadingSimple />
              {getString('global-text-value-loading')}...
            </CenteredHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
    );
  } else if (error !== undefined) {
    console.error(error);
    return (
      <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
        <EmptyBlock>
          <CenteredHeader>
            {getString('global-error-retrieving-data')}
          </CenteredHeader>
        </EmptyBlock>
      </HorizontalScrollContainer>
    );
  } else if (data !== undefined && data.campsite) {
    const {elevation} = data.campsite;
    const information: DetailDatum[] = [
      {
        label: getString('campsite-detail-elevation'),
        value: `${elevation}ft ` +
          `(${Math.round(elevation * 0.3048)}m)`,
      },
    ];
    if (data.campsite.reservation !== null) {
      information.push({
        label: getString('campsite-detail-reservation'),
        value: upperFirst(data.campsite.reservation),
      });
    }
    if (data.campsite.fee !== null) {
      information.push({
        label: getString('campsite-detail-required-fee'),
        value: data.campsite.fee,
      });
    }
    if (data.campsite.tents !== null) {
      information.push({
        label: getString('campsite-detail-allows-tents'),
        value: data.campsite.tents,
      });
    }
    if (data.campsite.capacity !== null) {
      information.push({
        label: getString('campsite-detail-max-capacity'),
        value: data.campsite.capacity.toString(),
      });
    }
    if (data.campsite.maxtents !== null) {
      information.push({
        label: getString('campsite-detail-max-tents'),
        value: data.campsite.maxtents.toString(),
      });
    }
    if (data.campsite.electricity !== null) {
      information.push({
        label: getString('campsite-detail-electricity'),
        value: data.campsite.electricity,
      });
    }
    if (data.campsite.toilets !== null) {
      information.push({
        label: getString('campsite-detail-toilets'),
        value: data.campsite.toilets,
      });
    }
    if (data.campsite.drinking_water !== null) {
      information.push({
        label: getString('campsite-detail-drinking-water'),
        value: data.campsite.drinking_water,
      });
    }
    if (data.campsite.showers !== null) {
      information.push({
        label: getString('campsite-detail-showers'),
        value: data.campsite.showers,
      });
    }
    if (data.campsite.internet_access !== null) {
      information.push({
        label: getString('campsite-detail-internet-access'),
        value: data.campsite.internet_access,
      });
    }
    if (data.campsite.fire !== null) {
      information.push({
        label: getString('campsite-detail-allows-fires'),
        value: data.campsite.fire,
      });
    }
    return (
      <CollapsedScrollContainer hideScrollbars={false} $noScroll={true}>
        <ClassificationBlock type={data.campsite.type} />
        <DetailBlock title={getString('global-text-information')} data={information} />
      </CollapsedScrollContainer>
    );
  } else {
    return null;
  }

};

export default MoreInformationPanel;
