import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Region } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import { AddPeakListVariables } from '../AdminPeakLists';

const GET_MOUNTAINS = gql`
  query ListMountains{
    mountains {
      id
      name
    }
  }
`;

interface SuccessResponse {
  mountains: Array<{
    id: Region['id'];
    name: Region['name'];
  }>;
}

enum VariantEnum {
  Standard = 'Standard',
  Winter = 'Winter',
  FourSeason = 'FourSeason',
  Grid = 'Grid',
}

interface CheckboxProps {
  name: string;
  id: string;
  toggleItem: (id: string, checked: boolean) => void;
  startChecked: boolean;
}

const Checkbox = ({name, id, toggleItem, startChecked}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(startChecked);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    toggleItem(id, checkedWillBe);
  };

  return (
    <>
      <input
        type='checkbox'
        value={id}
        id={`state-checkbox-${id}`}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={`state-checkbox-${id}`}>{name}</label>
    </>
  );

};

interface Props {
  addPeakList: (input: AddPeakListVariables) => void;
  cancel: () => void;
}

const AddPeakList = (props: Props) => {
  const { addPeakList, cancel } = props;

  const [name, setName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [selectedMountains, setSelectedMountains] = useState<Array<Region['id']>>([]);
  const [standardVariant, setStandardVariant] = useState<boolean>(true);
  const [winterVariant, setWinterVariant] = useState<boolean>(true);
  const [fourSeasonVariant, setFourSeasonVariant] = useState<boolean>(true);
  const [gridVariant, setGridVariant] = useState<boolean>(true);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    addPeakList({
      name, shortName, mountains: selectedMountains,
      standardVariant, winterVariant, fourSeasonVariant, gridVariant,
    });
    cancel();
  };

  const toggleMountainListItem = (id: string, checked: boolean) => {
    if (checked === true) {
      setSelectedMountains([...selectedMountains, id]);
    } else if (checked === false) {
      setSelectedMountains(selectedMountains.filter(idInList => idInList !== id));
    }
  };

  const toggleVariantType = (id: VariantEnum, checked: boolean) => {
    if (id === VariantEnum.Standard) {
      setStandardVariant(checked);
    } else if (id === VariantEnum.Winter) {
      setWinterVariant(checked);
    } else if (id === VariantEnum.FourSeason) {
      setFourSeasonVariant(checked);
    } else if (id === VariantEnum.Grid) {
      setGridVariant(checked);
    } else {
      failIfValidOrNonExhaustive(id, 'Invalid variant enum ' + id);
    }
  };

  const {loading, error, data} = useQuery<SuccessResponse>(GET_MOUNTAINS);

  let mountains: React.ReactElement | null;
  if (loading === true) {
    mountains = (<p>Loading</p>);
  } else if (error !== undefined) {
    mountains = null;
    console.error(error);
  } else if (data !== undefined) {
    const mountainList = data.mountains.map(mountain => {
      return (
        <li key={mountain.id}>
          <Checkbox
            id={mountain.id}
            name={mountain.name}
            toggleItem={toggleMountainListItem}
            startChecked={false}
          />
        </li>
      );
    });
    mountains = <>{mountainList}</>;
  } else {
    mountains = null;
  }
  return (
    <div>
      <button onClick={cancel}>Cancel</button>
      <form
        onSubmit={handleSubmit}
      >
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Name'
        />
        <input
          value={shortName}
          onChange={e => setShortName(e.target.value)}
          placeholder='shortName'
        />
        <fieldset>
          Variants
          <ul>
            <li key={VariantEnum.Standard}>
              <Checkbox
                id={VariantEnum.Standard}
                name={VariantEnum.Standard}
                toggleItem={toggleVariantType}
                startChecked={true}
              />
            </li>
            <li key={VariantEnum.Winter}>
              <Checkbox
                id={VariantEnum.Winter}
                name={VariantEnum.Winter}
                toggleItem={toggleVariantType}
                startChecked={true}
              />
            </li>
            <li key={VariantEnum.FourSeason}>
              <Checkbox
                id={VariantEnum.FourSeason}
                name={VariantEnum.FourSeason}
                toggleItem={toggleVariantType}
                startChecked={true}
              />
            </li>
            <li key={VariantEnum.Grid}>
              <Checkbox
                id={VariantEnum.Grid}
                name={VariantEnum.Grid}
                toggleItem={toggleVariantType}
                startChecked={true}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          Mountains
          <ul>
            {mountains}
          </ul>
        </fieldset>
        <button type='submit' disabled={name === '' || shortName === ''}>Add Peak List</button>
      </form>
    </div>
  );

};

export default AddPeakList;
