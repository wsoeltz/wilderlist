import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import React, {forwardRef, RefObject, useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  CheckboxList as CheckboxListBase,
  CheckboxListCheckbox,
  CheckboxListItem,
  DetailBoxTitle,
  DetailBoxWithMargin,
} from '../../../../../styling/styleUtils';
import {
  Conditions,
} from '../../../../../types/graphQLTypes';
import Tooltip from '../../../../sharedComponents/Tooltip';
import { DateType } from '../../../Utils';
import {
  Input,
  SectionTitle,
} from '../Utils';

const ReportContent = styled.div`
  margin-top: 1rem;
`;

const ReportTextarea = styled.textarea`
  margin: 0.3rem 0 1rem;
  padding: 8px;
  box-sizing: border-box;
  border: solid 1px #dcdcdc;
  font-size: 1rem;
  font-weight: 200;
  width: 100%;
  min-height: 6.35rem;
  line-height: 1.4;
`;

const CheckboxList = styled(CheckboxListBase)`
  background-color: #fff;
  margin-top: 0.3rem;
`;

export const nullConditions: Conditions = {
  mudMinor: null,
  mudMajor: null,
  waterSlipperyRocks: null,
  waterOnTrail: null,
  leavesSlippery: null,
  iceBlack: null,
  iceBlue: null,
  iceCrust: null,
  snowIceFrozenGranular: null,
  snowIceMonorailStable: null,
  snowIceMonorailUnstable: null,
  snowIcePostholes: null,
  snowMinor: null,
  snowPackedPowder: null,
  snowUnpackedPowder: null,
  snowDrifts: null,
  snowSticky: null,
  snowSlush: null,
  obstaclesBlowdown: null,
  obstaclesOther: null,
};

export const charLimit = 5000;

interface Props {
  conditions: Conditions;
  setConditions: (conditions: Conditions) => void;
  dateType: DateType;
  initialTripNotes: string;
  initialLink: string;
}

interface MultipleRefs {
  tripNotesEl: RefObject<HTMLTextAreaElement>;
  tripLinkEl: RefObject<HTMLInputElement>;
}

const TripDetails = forwardRef((props: Props, ref: RefObject<MultipleRefs>) => {
  const {
    conditions, setConditions, dateType, initialTripNotes, initialLink,
  } = props;

  const {tripNotesEl, tripLinkEl} = ref as any as MultipleRefs;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const updateCondition = (key: keyof Conditions) => setConditions({...conditions, [key]: !conditions[key]});

  // use nullConditions keys as it is defined to always be the same as the
  // interface Conditions, whereas the prop conditions could recieve unknown
  // keys from the database (such as __typename)
  const conditionsListItems = Object.keys(nullConditions).map(function(key: keyof Conditions) {
    return (
      <CheckboxListItem
        htmlFor={`${key}-condition-checkbox`}
        key={key}
      >
        <CheckboxListCheckbox
          id={`${key}-condition-checkbox`} type='checkbox'
          checked={conditions[key] ? true : false}
          onChange={() => updateCondition(key)}
        />
        {getFluentString('trip-report-condition-name', {key})}
      </CheckboxListItem>
    );
  });

  const conditionsList = dateType === DateType.full ? (
    <>
      <SectionTitle>{getFluentString('trip-report-conditions-title')}</SectionTitle>
      <CheckboxList>
        {conditionsListItems}
      </CheckboxList>
    </>
  ) : (
    <small>
      {getFluentString('trip-report-invalid-date-format')}
    </small>
  );

  const reportContent = dateType === DateType.full ? (
    <ReportContent>
      <SectionTitle>{getFluentString('trip-report-notes-title')}</SectionTitle>
      <ReportTextarea
        placeholder={getFluentString('trip-report-notes-placeholder')}
        defaultValue={initialTripNotes}
        ref={tripNotesEl}
        maxLength={charLimit}
      />
      <SectionTitle>{getFluentString('trip-report-link-title')}</SectionTitle>
      <Input
        type='text'
        placeholder={getFluentString('trip-report-link-placeholder')}
        defaultValue={initialLink}
        ref={tripLinkEl}
        maxLength={1000}
        autoComplete={'off'}
      />
    </ReportContent>
  ) : null;

  return (
    <>
      <DetailBoxTitle>
        <BasicIconInText icon={faEdit} />
        {getFluentString('trip-report-title')}
        <Tooltip
          explanation={getFluentString('trip-report-tooltip')}
        />
      </DetailBoxTitle>
      <DetailBoxWithMargin>
        {conditionsList}
        {reportContent}
      </DetailBoxWithMargin>
    </>
  );
});

export default TripDetails;
