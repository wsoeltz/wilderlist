import { faEdit, faHiking, faLink } from '@fortawesome/free-solid-svg-icons';
import React, {forwardRef, Ref} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  BasicIconInText,
  CheckboxListCheckbox,
  CheckboxListItem,
  ComponentTitle,
} from '../../../../styling/styleUtils';
import {
  Conditions,
} from '../../../../types/graphQLTypes';
import { DateType } from '../../../../utilities/dateUtils';
import {mobileSize} from '../../../../Utils';
import {
  CheckboxList,
  Input,
} from '../Utils';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 180px;
  grid-column-gap: 0.75rem;
  margin: 1rem 0 3rem;

  @media(max-width: ${mobileSize}px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-row-gap: 1rem;
  }
`;

const ReportTextarea = styled.textarea`
  margin: 0.3rem 0 1rem;
  padding: 8px;
  box-sizing: border-box;
  border: solid 1px #dcdcdc;
  font-size: 0.85rem;
  font-weight: 200;
  width: 100%;
  min-height: 12.35rem;
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
  tripNotesEl: Ref<HTMLTextAreaElement>;
  tripLinkEl: Ref<HTMLInputElement>;
}

const TripDetails = (props: Props, ref: Ref<MultipleRefs>) => {
  const {
    conditions, setConditions, dateType, initialTripNotes, initialLink,
  } = props;

  const {tripNotesEl, tripLinkEl} = ref as any as MultipleRefs;

  const getString = useFluent();

  const updateCondition = (key: keyof Conditions) => setConditions({...conditions, [key]: !conditions[key]});

  // use nullConditions keys as it is defined to always be the same as the
  // interface Conditions, whereas the prop conditions could recieve unknown
  // keys from the database (such as __typename)
  const conditionsListItems = Object.keys(nullConditions).map(function(key: string) {
    const onChange = () => updateCondition(key as keyof Conditions);
    return (
      <CheckboxListItem
        htmlFor={`${key}-condition-checkbox`}
        key={key}
      >
        <CheckboxListCheckbox
          id={`${key}-condition-checkbox`} type='checkbox'
          checked={conditions[key as keyof Conditions] ? true : false}
          onChange={onChange}
        />
        {getString('trip-report-condition-name', {key})}
      </CheckboxListItem>
    );
  });

  const conditionsList = dateType === DateType.full ? (
    <>
      <ComponentTitle>
        <BasicIconInText icon={faHiking} /> {getString('trip-report-conditions-title')}
      </ComponentTitle>
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
    <>
      <ComponentTitle>
        <BasicIconInText icon={faEdit} /> {getString('trip-report-notes-title')}
      </ComponentTitle>
      <ReportTextarea
        placeholder={getString('trip-report-notes-placeholder')}
        defaultValue={initialTripNotes}
        ref={tripNotesEl}
        maxLength={charLimit}
      />
      <ComponentTitle>
        <BasicIconInText icon={faLink} /> {getString('trip-report-link-title')}
      </ComponentTitle>
      <Input
        type='text'
        placeholder={getString('trip-report-link-placeholder')}
        defaultValue={initialLink}
        ref={tripLinkEl}
        maxLength={1000}
        autoComplete={'off'}
      />
    </>
  ) : null;

  return (
    <Root>
      <div>
        {reportContent}
      </div>
      <div>
        {conditionsList}
      </div>
    </Root>
  );
};

export default forwardRef(TripDetails);
