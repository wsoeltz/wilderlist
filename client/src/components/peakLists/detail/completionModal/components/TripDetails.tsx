import { GetString } from 'fluent-react/compat';
import React, {forwardRef, RefObject, useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import {
  CheckboxList,
  CheckboxListCheckbox,
  CheckboxListItem,
} from '../../../../../styling/styleUtils';
import {
  Conditions,
} from '../../../../../types/graphQLTypes';
import { DateType } from '../../../Utils';
import {
  Input,
  SectionTitle,
} from '../Utils';

const TripReportRoot = styled.div`
  margin-top: 2rem;
`;

const ReportContent = styled.div`
  margin-top: 1.6rem;
`;

const ReportTextarea = styled.textarea`
  margin: 1rem 0;
  padding: 8px;
  box-sizing: border-box;
  border: solid 1px #dcdcdc;
  font-size: 1rem;
  font-weight: 200;
  width: 100%;
  min-height: 6rem;
  line-height: 1.4;
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
    <CheckboxList>
      {conditionsListItems}
    </CheckboxList>
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
    <TripReportRoot>
      <div>
        <SectionTitle>
          {getFluentString('trip-report-conditions-title')}
        </SectionTitle>
        {conditionsList}
      </div>
      {reportContent}
    </TripReportRoot>
  );
});

export default TripDetails;
