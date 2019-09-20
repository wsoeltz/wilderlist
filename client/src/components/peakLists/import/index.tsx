import React, {useState} from 'react';
import styled from 'styled-components';
import {
  ButtonSecondary,
  ButtonPrimary,
  semiBoldFontBoldWeight,
  lightBorderColor,
  lowWarningColor,
  lowWarningColorLight,
  primaryColor,
  primaryHoverColor,
  successColor,
  successColorLight,
} from '../../../styling/styleUtils';
import Modal from '../../sharedComponents/Modal';
import { Mountain } from '../../../types/graphQLTypes';
import {intersection, sortBy} from 'lodash';
import MountainItem, { gridCols } from './MountainItem';
import {
  Root as Table,
} from '../detail/MountainTable';
import {
  horizontalPadding,
} from '../detail/MountainRow';
import { useMutation } from '@apollo/react-hooks';
import {
  ADD_MOUNTAIN_COMPLETION,
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../detail/MountainCompletionModal';
import { convertFieldsToDate } from '../../../Utils';
import SelectMountainsGifUrl from '../../../assets/images/import-gifs/select-mountains.gif';
import SelectDatesGifUrl from '../../../assets/images/import-gifs/select-dates.gif';
import SelectMountainsStaticUrl from '../../../assets/images/import-gifs/select-mountains.png';
import SelectDatesStaticUrl from '../../../assets/images/import-gifs/select-dates.png';

const TitleBase = styled.div`
  text-transform: uppercase;
  padding: ${horizontalPadding}rem;
  border-bottom: solid 2px ${lightBorderColor};
  font-weight: ${semiBoldFontBoldWeight};
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const InputTitle = styled(TitleBase)`
  opacity: 0.7;
  font-size: 0.8rem;
`;
const OutputTitle = styled(TitleBase)`
  font-size: 1rem;
`;

const UserInput = styled(InputTitle)`
  grid-column: ${gridCols.userInput};
`;
const ExpectedName = styled(OutputTitle)`
  grid-column: ${gridCols.expectedName};
`;
const UserDate = styled(InputTitle)`
  grid-column: ${gridCols.userDate};
`;
const ExpectedDate = styled(OutputTitle)`
  grid-column: ${gridCols.expectedDate};
`;

const ButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const SubmitButton = styled(ButtonPrimary)`
  margin-left: auto;
`;

const PasteContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  margin-bottom: 2rem;
`;

const PasteArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  grid-row: 2;
  height: 3.5rem;

  &::placeholder {
    text-align: center;
  }
`;

const TextHelp = styled.div`
  grid-row: 1;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
`;

const BigNumber = styled.div`
  grid-column: 1;
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 200px;
  color: white;
  background-color: ${primaryHoverColor};
  border: solid 4px ${primaryColor};
`;

const HelpText = styled.div`
  padding: 0 0.7rem;
  line-height: 1.4;
`;

const HelpGifContainer = styled.div`
  grid-row: 3;
  grid-column: 1 / 3;

  img {
    max-width: 100%;
    max-height: 180px;
    cursor: pointer;
  }
`;

const SignalBox = styled.div`
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 4px;
  line-height: 1.4;
`;

const WarningBox = styled(SignalBox)`
  background-color: ${lowWarningColorLight};
  border: 1px solid ${lowWarningColor};
`;

const SuccessBox = styled(SignalBox)`
  background-color: ${successColorLight};
  border: 1px solid ${successColor};
`;

const OutputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const genericWords = [
  'mount',
  'mountain',
];

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
}
export interface DateDatum {
  day: number;
  month: number;
  year: number;
}

type DateArray = Array<DateDatum | undefined | null>;

interface Props {
  mountains: MountainDatum[];
  onConfirm: () => void;
  onCancel: () => void;
  userId: string;
}

const maxValIndicies = (array: number[]) => {
  const sortedArray = sortBy(array).reverse();
  let indexOfValuesInOrder: number[] = [];
  for (let i = 0; i < 3; i++) {
    const val = sortedArray[i];
    const index = array.indexOf(val);
    if (indexOfValuesInOrder.includes(index)) {
    // if index is already in, then find the next index
      const nextIndex = array.indexOf(val, index + 1);
      indexOfValuesInOrder.push(nextIndex);
    } else {
      indexOfValuesInOrder.push(index);
    }
  }
  return indexOfValuesInOrder;
}

const ImportAscentsModal = (props: Props) => {
  const { onCancel, mountains, userId } = props;
  // const mountains = mountainTestArr;

  const [pastedMountains, setPastedMountains] = useState<string[]>([]);
  const [cleanedMountains, setCleanedMountains] = useState<MountainDatum[] | null>([]);

  const [pastedDates, setPastedDates] = useState<string[]>([]);
  const [cleanedDates, setCleanedDates] = useState<DateArray | null>([]);

  const [selectMountainsGif, setSelectMountainsGif] = useState<string>(SelectMountainsStaticUrl);
  const [selectDatesGif, setSelectDatesGif] = useState<string>(SelectDatesStaticUrl);

  const toggleMountainGif = () => {
    const src = selectMountainsGif === SelectMountainsGifUrl
      ? SelectMountainsStaticUrl : SelectMountainsGifUrl;
    setSelectMountainsGif(src);
  }
  const toggleDatesGif = () => {
    const src = selectDatesGif === SelectDatesGifUrl
      ? SelectDatesStaticUrl : SelectDatesGifUrl;
    setSelectDatesGif(src);
  }

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);

  const validateAndAddMountainCompletion = (mountainId: Mountain['id'], day: string, month: string, year: string) => {
    const completedDate = convertFieldsToDate(day, month, year);
    if (completedDate.error !== undefined) {
      console.error(completedDate.error);
    } else {
      addMountainCompletion({ variables: {userId, mountainId, date: completedDate.date}});
      console.log('success');
    }
  };

  const onConfirm = () => {
    if (
      cleanedMountains !== null && cleanedDates !== null
      && cleanedMountains.length > 0 && cleanedDates.length > 0
      && cleanedMountains.length === cleanedDates.length) {
      cleanedMountains.forEach((mtn, i) => {
        const dates = cleanedDates[i];
        const mountainId = mtn.id;
        if (dates !== null && dates !== undefined && mountainId) {
          const {day, month, year} = dates;
          validateAndAddMountainCompletion(mountainId, day.toString(), month.toString(), year.toString());
        }
        console.warn('dates are undefined, skipping');
      });
    } else {
      console.error('Data doesnt exist or is the wrong length');
    }
    onCancel();
  }

  const onMountainNamesPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedValue = e.target.value;
    const valueArray = pastedValue.split(/\r?\n/);
    const hasEmptyString = valueArray.indexOf('');
    if (valueArray.length > mountains.length || !pastedValue || hasEmptyString !== -1) {
      setCleanedMountains(null);
    } else {
      const matchPercentages = valueArray.map(mtn => {
        const mtnLowerCase = mtn.toLowerCase();
        const letters = mtnLowerCase.split('');
        const pastedWords = mtnLowerCase.trim().split(/\W+/).filter(w => !genericWords.includes(w));
        const matches = mountains.map(({name}) => {
          const lowerCaseName = name.toLowerCase();
          const nameWords = lowerCaseName.trim().split(/\W+/).filter(w => !genericWords.includes(w));
          let exactMatch = mtnLowerCase === lowerCaseName ? 100 : 0;
          if (pastedWords.length === 1 && nameWords.length === 1) {
            if (pastedWords[0] === nameWords[0]) {
              exactMatch = exactMatch + 100;
            }
          }
          let nameMatch: number = 0;
          pastedWords.forEach(pastedWord => {
            if (lowerCaseName.includes(pastedWord)
              && pastedWord.length > 1) {
              nameMatch = nameMatch + 1;
            }
          });
          let pastedMatch: number = 0;
          nameWords.forEach(nameWord => {
            if (mtnLowerCase.includes(nameWord)
              && nameWord.length > 1) {
              pastedMatch = pastedMatch + 1;
            }
          });
          const letterMatch = intersection(lowerCaseName.split(''), letters).length;
          const percentMatchOriginal = letterMatch/mtn.length;
          const percentMatchTarget = letterMatch/name.length;
          const totalMatch = exactMatch + nameMatch + pastedMatch + percentMatchOriginal + percentMatchTarget;
          return totalMatch;
        });
        return matches;
      });
      const topChoices = matchPercentages.map((matches) => {
        return maxValIndicies(matches);
      });
      let usedPeak: string[] = [];
      const cleanPeaknames = topChoices.map(([a1, b1], i) => {
        const firstChoice = mountains[a1];
        const secondChoice = mountains[b1];
        // check if someone else has the same first choice but with a higher match rating
        let useSecondChoice: boolean = false;
        if (usedPeak.indexOf(firstChoice.name) !== -1) {
          useSecondChoice = true;
        }
        if (useSecondChoice === false) {
          topChoices.forEach(([a2], j) => {
            if (j !== i) {
              if (a2 === a1) {
                // get weight of a2
                if (matchPercentages[j][a1] > matchPercentages[i][a1]) {
                  useSecondChoice = true;
                }
              }
            }
          });
        }
        if (useSecondChoice === true) {
          // // if so return second choice
          usedPeak.push(secondChoice.name);
          return secondChoice;
        } else {
          usedPeak.push(firstChoice.name);
          return firstChoice;
        }
      })
      setCleanedMountains([...cleanPeaknames]);
    }
    setPastedMountains([...valueArray]);
  }

  const onMountainDatesPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedValue = e.target.value;
    const valueArray = pastedValue.split(/\r?\n/);
    if (valueArray.length > mountains.length || !pastedValue) {
      setCleanedDates(null);
    } else {
      const cleanedDates: DateArray = [];
      valueArray.forEach(dateAsString => {
        const dateParts = dateAsString.split('/');
        if (dateAsString === '' || dateParts.length === 0) {
          cleanedDates.push(undefined);
        } else if (dateParts.length === 3) {
          const month = parseInt(dateParts[0], 10);
          const day = parseInt(dateParts[1], 10);
          let year = parseInt(dateParts[2], 10);
          if (year < 1000) {
            if (year < new Date().getFullYear() - 2000) {
              year = year + 2000;
            } else {
              year = year + 1900;
            }
          }
          if (isNaN(month) || isNaN(day) || isNaN(year)) {
            cleanedDates.push(null);
          } else {
            cleanedDates.push({day, month, year});
          }
        } else if (dateParts.length === 2) {
          // is it DD/(DD)/YYYY
          // or is is DD/YY/(YYYY)
          if (dateParts[1].length === 4) {
            const month = parseInt(dateParts[0], 10);
            const day = month;
            let year = parseInt(dateParts[1], 10);
            if (year < 1000) {
              if (year < new Date().getFullYear() - 2000) {
                year = year + 2000;
              } else {
                year = year + 1900;
              }
            }
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
              cleanedDates.push(null);
            } else {
              cleanedDates.push({day, month, year});
            }
          } else if (dateParts[1].length === 2) {
            const month = parseInt(dateParts[0], 10);
            const day = parseInt(dateParts[1], 10);
            const year = day + 2000;
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
              cleanedDates.push(null);
            } else {
              cleanedDates.push({day, month, year});
            }
          } else {
            cleanedDates.push(null);
          }
        } else {
          cleanedDates.push(null);
        }
      });
      setCleanedDates([...cleanedDates]);
    }
    setPastedDates([...valueArray]);
  }

  const mountainList =
    (cleanedMountains === null || cleanedDates === null ||
      cleanedMountains.length !== cleanedDates.length)
    ? null
    : cleanedMountains.map((mtn, i) => {
    const fixMountain = (newMountain: MountainDatum) => {
      const newPeaks = cleanedMountains;
      newPeaks[i] = { id: newMountain.id, name: newMountain.name };
      setCleanedMountains([...newPeaks]);
    }
    const fixDate = (value: string | undefined, dayMonthYear: keyof DateDatum) => {
      const newDates = cleanedDates;
      const originalDates = newDates[i];
      if (originalDates !== null && originalDates !== undefined && value !== undefined) {
        const numberValue = parseInt(value, 10);
        if (!isNaN(numberValue)) {
          newDates[i] = {...originalDates, [dayMonthYear]: numberValue}
        } else {
          newDates[i] = {...originalDates, [dayMonthYear]: -1}
        }
      }
      setCleanedDates([...newDates]);
    }
    const duplicate = (cleanedMountains.filter(({id}) => id === mtn.id).length > 1);
    return (
      <MountainItem
        userInput={pastedMountains[i]}
        officialMountain={mtn}
        mountains={mountains}
        fixMountain={fixMountain}
        fixDate={fixDate}
        duplicate={duplicate}
        date={cleanedDates[i]}
        dateInput={pastedDates[i]}
        index={i}
        key={mtn.id + i}
      />
    );
  });
  let errorMessage: React.ReactElement<any> | null;
  if (pastedMountains.length > mountains.length) {
      // mountains is longer than total mountains
      const pastedOutMountains = pastedMountains.map((mtn, i) => <li key={mtn + i}>{mtn}</li>);
      const mountainNames = mountains.map((mtn, i) => <li key={mtn.id + i}>{mtn.name}</li>);
      errorMessage = (
        <WarningBox>
          <p>The list of mountains you pasted was <strong>longer than the amount of mountains on this list</strong>. Please review the output of what we recieved below, make changes, and try pasting again</p>
          <OutputContainer>
            <div>
              <h4>Your Input</h4>
              <ol>
                {pastedOutMountains}
              </ol>
            </div>
            <div>
              <h4>Mountains On This List</h4>
              <ol>
                {mountainNames}
              </ol>
            </div>
          </OutputContainer>
        </WarningBox>
      );
  } else if (cleanedDates === null && cleanedMountains === null) {
    // neither list has received any input, no error
    errorMessage = null;
  } else if ((cleanedDates === null || cleanedDates.length === 0)  && 
    (cleanedMountains !== null && cleanedMountains.length !== 0)) {
    // mountains has input but dates does not
    // ask to paste in the dates
    errorMessage = <WarningBox>Please paste your list of <strong>dates</strong></WarningBox>;
  } else if ((cleanedMountains === null || cleanedMountains.length === 0)  && 
    (cleanedDates !== null && cleanedDates.length !== 0)) {
    // date has input but mountains does not
    // ask to paste in the dates
    errorMessage = <WarningBox>Please paste your list of <strong>mountains</strong></WarningBox>;
  } else if (cleanedDates !== null && cleanedMountains !== null
    && cleanedMountains.length !== 0 && cleanedDates.length !== 0
    && cleanedMountains.length !== cleanedDates.length) {
    // length of both lists does not match
    const biggerList = cleanedMountains.length > cleanedDates.length ? 'mountains' : 'dates';
    const smallerList = cleanedMountains.length > cleanedDates.length ? 'dates' : 'mountains';
    const pastedOutMountains = pastedMountains.map((mtn, i) => <li key={mtn + i}>{mtn}</li>);
    const pastedOutDates = pastedDates.map((date, i) => <li key={date + i}>{date}</li>);
    errorMessage = (
      <WarningBox>
        <p>Your list of {biggerList} is larger than your {smallerList}. Please adjust them so they are both the same size. Please review the output of what we recieved below.</p>
        <OutputContainer>
          <div>
            <h4>Mountains</h4>
            <ol>
              {pastedOutMountains}
            </ol>
          </div>
          <div>
            <h4>Dates</h4>
            <ol>
              {pastedOutDates}
            </ol>
          </div>
        </OutputContainer>
      </WarningBox>
    );
  } else {
    errorMessage = null;
  }

  const allDataAvailable = !(cleanedDates === null || cleanedMountains === null
      || cleanedMountains.length === 0
      || cleanedDates.length === 0
      || cleanedMountains.length !== cleanedDates.length);

  const table = allDataAvailable
    ? (
      <Table>
        <UserInput>Your Name Input</UserInput>
        <ExpectedName>Name Output</ExpectedName>
        <UserDate>Your Date Input</UserDate>
        <ExpectedDate>Date Output</ExpectedDate>
        {mountainList}
      </Table>
    ) : null;

    const successMessage = allDataAvailable
      ? (
        <SuccessBox>
          Your data has been succesfully read. Please review it for accuracy and make any necessary changes. Then hit the green <strong>Submit</strong> button at the end of page.
        </SuccessBox>
      ) : null;

    const submitBtn = allDataAvailable
      ? (
        <SubmitButton onClick={onConfirm}>
          Submit
        </SubmitButton>
      ) : null;

  return (
    <Modal
      onClose={onCancel}
      width={'80%'}
      height={'auto'}
    >
      <h2>Import Ascents</h2>
      <p>This tool will import your existing ascent data from a spreadsheet and into Wilderlist</p>
      <p>
        <em><strong>Note:</strong> Dates must be in <strong>Month/Day/Year</strong> format in order to be properly read.</em>
      </p>
      <PasteContainer>
        <TextHelp>
          <BigNumber>1</BigNumber>
          <HelpText>First, select all of the cells with the <strong>mountain names</strong> and paste them into the box on the <strong>left</strong>.</HelpText>
          <HelpGifContainer>
            <img
              src={selectMountainsGif}
              onClick={toggleMountainGif}
              alt={'Click and drag to select multiple cells in a spreadsheet'}
            />
          </HelpGifContainer>
        </TextHelp>
        <TextHelp>
          <BigNumber>2</BigNumber>
          <HelpText>Then, select all of the cells with the <strong>dates (including the ones that are blank)</strong> and paste them into the box on the <strong>right</strong>.</HelpText>
          <HelpGifContainer>
            <img
              src={selectDatesGif}
              onClick={toggleDatesGif}
              alt={'Click and drag to select multiple cells in a spreadsheet'}
            />
          </HelpGifContainer>
        </TextHelp>
        <PasteArea
          placeholder='Paste Mountain Names Here'
          onChange={onMountainNamesPaste}
        />
        <PasteArea
          placeholder='Paste Dates Here'
          onChange={onMountainDatesPaste}
        />
      </PasteContainer>
      {successMessage}
      {errorMessage}
      {table}
      <ButtonWrapper>
        <CancelButton onClick={onCancel}>
          Cancel
        </CancelButton>
        {submitBtn}
      </ButtonWrapper>
    </Modal>
  );
};

export default ImportAscentsModal;
