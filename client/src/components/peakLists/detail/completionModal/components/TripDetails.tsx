import { faEdit } from '@fortawesome/free-solid-svg-icons';
import React, {forwardRef, RefObject} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../../hooks/useFluent';
import {
  BasicIconInText,
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
  CheckboxList,
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

  const getString = useFluent();

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
        {getString('trip-report-condition-name', {key})}
      </CheckboxListItem>
    );
  });

  const conditionsList = dateType === DateType.full ? (
    <>
      <SectionTitle>{getString('trip-report-conditions-title')}</SectionTitle>
      <CheckboxList style={{maxHeight: '100%'}}>
        {conditionsListItems}
      </CheckboxList>
    </>
  ) : (
    <small>
      {getString('trip-report-invalid-date-format')}
    </small>
  );

  const reportContent = dateType === DateType.full ? (
    <ReportContent>
      <SectionTitle>{getString('trip-report-notes-title')}</SectionTitle>
      <ReportTextarea
        placeholder={getString('trip-report-notes-placeholder')}
        defaultValue={initialTripNotes}
        ref={tripNotesEl}
        maxLength={charLimit}
      />
      <SectionTitle>{getString('trip-report-link-title')}</SectionTitle>
      <Input
        type='text'
        placeholder={getString('trip-report-link-placeholder')}
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
        {getString('trip-report-title')}
        <Tooltip
          explanation={getString('trip-report-tooltip')}
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
