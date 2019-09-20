import React, {useState} from 'react';
import styled from 'styled-components';
import {
  ButtonSecondary,
  ButtonPrimary,
  semiBoldFontBoldWeight,
  lightBorderColor,
  lowWarningColor,
  lowWarningColorLight,
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
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const PasteContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
`;

const PasteArea = styled.textarea`
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
`;

const WarningBox = styled.div`
  padding: 2rem;
  margin: 2rem 0;
  background-color: ${lowWarningColorLight};
  border: 1px solid ${lowWarningColor};
  border-radius: 4px;
`;

const mountainTestArr = [
  {id: "Mount Washington", name: "Mount Washington",},
  {id: "Mount Adams", name: "Mount Adams",},
  {id: "Mount Jefferson", name: "Mount Jefferson",},
  {id: "Mount Monroe", name: "Mount Monroe",},
  {id: "Mount Madison", name: "Mount Madison",},
  {id: "Mount Lafayette", name: "Mount Lafayette",},
  {id: "Mount Lincoln", name: "Mount Lincoln",},
  {id: "South Twin", name: "South Twin",},
  {id: "Carter Dome", name: "Carter Dome",},
  {id: "Mount Moosilauke", name: "Mount Moosilauke",},
  {id: "Mount Eisenhower", name: "Mount Eisenhower",},
  {id: "North Twin Mountain", name: "North Twin Mountain",},
  {id: "Mount Carrigain", name: "Mount Carrigain",},
  {id: "Mount Bond", name: "Mount Bond",},
  {id: "Middle Carter Mountain", name: "Middle Carter Mountain",},
  {id: "West Bond", name: "West Bond",},
  {id: "Mount Garfield", name: "Mount Garfield",},
  {id: "Mount Liberty", name: "Mount Liberty",},
  {id: "South Carter Mountain", name: "South Carter Mountain",},
  {id: "Wildcat, A peak", name: "Wildcat, A peak",},
  {id: "Hancock Mountain", name: "Hancock Mountain",},
  {id: "South Kinsman", name: "South Kinsman",},
  {id: "Mount Field", name: "Mount Field",},
  {id: "Mount Osceola", name: "Mount Osceola",},
  {id: "Mount Flume", name: "Mount Flume",},
  {id: "South Hancock Mountain", name: "South Hancock Mountain",},
  {id: "Mount Pierce", name: "Mount Pierce",},
  {id: "North Kinsman", name: "North Kinsman",},
  {id: "Willey", name: "Willey",},
  {id: "Bondcliff", name: "Bondcliff",},
  {id: "Zealand", name: "Zealand",},
  {id: "North Tripyramid", name: "North Tripyramid",},
  {id: "Cabot", name: "Cabot",},
  {id: "East Osceola", name: "East Osceola",},
  {id: "Middle Tripyramid", name: "Middle Tripyramid",},
  {id: "Cannon Mountain", name: "Cannon Mountain",},
  {id: "Mount Hale", name: "Mount Hale",},
  {id: "Mount Jackson", name: "Mount Jackson",},
  {id: "Mount Tom", name: "Mount Tom",},
  {id: "Wildcat, D Peak", name: "Wildcat, D Peak",},
  {id: "Mount Moriah", name: "Mount Moriah",},
  {id: "Mount Passaconaway", name: "Mount Passaconaway",},
  {id: "Owl's Head Mountain", name: "Owl's Head Mountain",},
  {id: "Galehead Mountain", name: "Galehead Mountain",},
  {id: "Mount Whiteface", name: "Mount Whiteface",},
  {id: "Mount Waumbek", name: "Mount Waumbek",},
  {id: "Mount Isolation", name: "Mount Isolation",},
  {id: "Mount Tecumseh", name: "Mount Tecumseh",},
  {id: "Mount Anderson", name: "Mount Anderson",},
  {id: "North Baldface", name: "North Baldface",},
  {id: "South Baldface", name: "South Baldface",},
  {id: "Bemis", name: "Bemis",},
  {id: "Blue", name: "Blue",},
  {id: "Bulge", name: "Bulge",},
  {id: "Cannonball", name: "Cannonball",},
  {id: "Captin", name: "Captin",},
  {id: "Castle West Peak", name: "Castle West Peak",},
  {id: "Cherry", name: "Cherry",},
  {id: "Clough", name: "Clough",},
  {id: "Dartmouth", name: "Dartmouth",},
  {id: "Deception, East", name: "Deception, East",},
  {id: "Field, West", name: "Field, West",},
  {id: "Fool Killer", name: "Fool Killer",},
  {id: "Garfield Ridge, East", name: "Garfield Ridge, East",},
  {id: "Garfield Ridge, West", name: "Garfield Ridge, West",},
  {id: "Gore", name: "Gore",},
  {id: "Hale, South", name: "Hale, South",},
  {id: "Hitchcock, Middle", name: "Hitchcock, Middle",},
  {id: "Horn", name: "Horn",},
  {id: "Huntington", name: "Huntington",},
  {id: "Huntington South", name: "Huntington South",},
  {id: "Mount Hutchins", name: "Mount Hutchins",},
  {id: "Mount Kancamagus", name: "Mount Kancamagus",},
  {id: "Middle Long Mountain", name: "Middle Long Mountain",},
  {id: "West Long Mountain", name: "West Long Mountain",},
  {id: "Lowell", name: "Lowell",},
  {id: "Mary", name: "Mary",},
  {id: "Muise", name: "Muise",},
  {id: "Nancy", name: "Nancy",},
  {id: "Peak Above the Nubble", name: "Peak Above the Nubble",},
  {id: "Pilot Ridge Middle", name: "Pilot Ridge Middle",},
  {id: "Pliny", name: "Pliny",},
  {id: "Sable", name: "Sable",},
  {id: "Sandwich Dome", name: "Sandwich Dome",},
  {id: "Savage", name: "Savage",},
  {id: "Scar Ridge, East", name: "Scar Ridge, East",},
  {id: "Scar Ridge, West", name: "Scar Ridge, West",},
  {id: "Scaur", name: "Scaur",},
  {id: "Shelburne Moriah", name: "Shelburne Moriah",},
  {id: "East Sleeper", name: "East Sleeper",},
  {id: "West Sleeper", name: "West Sleeper",},
  {id: "Stub Hill", name: "Stub Hill",},
  {id: "Success", name: "Success",},
  {id: "Sugarloaf", name: "Sugarloaf",},
  {id: "Terrace, East", name: "Terrace, East",},
  {id: "Unknown Pond", name: "Unknown Pond",},
  {id: "Vose Spur", name: "Vose Spur",},
  {id: "Weeks, Middle", name: "Weeks, Middle",},
  {id: "Weeks, North", name: "Weeks, North",},
  {id: "Weeks, South", name: "Weeks, South",},
  {id: "Wolf", name: "Wolf",},
]

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
  const { onConfirm, onCancel } = props;
  const mountains = mountainTestArr;

  const [pastedMountains, setPastedMountains] = useState<string[]>([]);
  const [cleanedMountains, setCleanedMountains] = useState<MountainDatum[] | null>([]);

  const [pastedDates, setPastedDates] = useState<string[]>([]);
  const [cleanedDates, setCleanedDates] = useState<DateArray | null>([]);

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
      setCleanedMountains(cleanPeaknames);
    }
    setPastedMountains(valueArray);
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
      setCleanedDates(cleanedDates);
    }
    setPastedDates(valueArray);
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
    const duplicate = (cleanedMountains.filter(({id}) => id === mtn.id).length > 1);
    return (
      <MountainItem
        userInput={pastedMountains[i]}
        officialMountain={mtn}
        mountains={mountains}
        fixMountain={fixMountain}
        duplicate={duplicate}
        date={cleanedDates[i]}
        dateInput={pastedDates[i]}
        index={i}
        key={mtn.id + i}
      />
    );
  });
  let errorMessage: React.ReactElement<any> | null = null;
  if (cleanedDates === null && cleanedMountains !== null) {
    errorMessage = <WarningBox>Please paste your list of dates</WarningBox>;
  } else if (cleanedMountains === null) {
    if (cleanedDates === null) {
      errorMessage = <WarningBox>Please paste your list of mountains</WarningBox>;
    }
    if (pastedMountains.length > mountains.length) {
      const pastedOut = pastedMountains.map((mtn, i) => <li key={mtn + i}>{mtn}</li>);
      errorMessage = (
        <WarningBox>
          <p>The list of mountains you pasted was longer than the amount of mountains on this list. Please review the output of what we recieved below, make changes, and try pasting again</p>
          <ol>
            {pastedOut}
          </ol>
        </WarningBox>
      );
    }
  } else if (cleanedDates !== null && cleanedMountains.length !== cleanedDates.length) {
    const biggerList = cleanedMountains.length > cleanedDates.length ? 'mountains' : 'dates';
    const smallerList = cleanedMountains.length > cleanedDates.length ? 'dates' : 'mountains';
    const pastedOutMountains = pastedMountains.map((mtn, i) => <li key={mtn + i}>{mtn}</li>);
    const pastedOutDates = pastedDates.map((date, i) => <li key={date + i}>{date}</li>);
    errorMessage = (
      <WarningBox>
        <p>Your list of {biggerList} is largers than your {smallerList}. Please adjust them so they are both the same size. Please review the output of what we recieved below.</p>
        <h4>Mountains</h4>
        <ol>
          {pastedOutMountains}
        </ol>
        <h4>Dates</h4>
        <ol>
          {pastedOutDates}
        </ol>
      </WarningBox>
    );
  }

  const table = errorMessage === null ? (
      <Table>
        <UserInput>Your Name Input</UserInput>
        <ExpectedName>Name Output</ExpectedName>
        <UserDate>Your Date Input</UserDate>
        <ExpectedDate>Date Output</ExpectedDate>
        {mountainList}
      </Table>
    ) : null;

  return (
    <Modal
      onClose={onCancel}
      width={'80%'}
      height={'auto'}
    >
      <h3>Import peaks</h3>
      <PasteContainer>
        <PasteArea placeholder='Paste Mountain Names Here' onChange={onMountainNamesPaste} />
        <PasteArea placeholder='Paste Dates Here' onChange={onMountainDatesPaste} />
      </PasteContainer>
      {errorMessage}
      {table}
      <ButtonWrapper>
        <CancelButton onClick={onCancel}>
          Close
        </CancelButton>
        <ButtonPrimary onClick={onConfirm}>
          Submit
        </ButtonPrimary>
      </ButtonWrapper>
    </Modal>
  );
};

export default ImportAscentsModal;
