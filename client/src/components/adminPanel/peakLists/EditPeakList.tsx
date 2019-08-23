import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mountain, PeakList, PeakListVariants } from '../../../types/graphQLTypes';
import { GET_PEAK_LISTS } from '../AdminPeakLists';

const GET_PEAK_LIST_AND_ALL_MOUNTAINS = gql`
  query GetPeakListAndAllMountains($id: ID!) {
    peakList(id: $id) {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
      mountains {
        id
      }
    }
    mountains {
      id
      name
    }
  }
`;

const REMOVE_MOUNTAIN_FROM_PEAK_LIST = gql`
  mutation($listId: ID!, $itemId: ID!) {
    removeItemFromPeakList(listId: $listId, itemId: $itemId) {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
      mountains {
        id
      }
    }
  }
`;

const ADD_MOUNTAIN_TO_PEAK_LIST = gql`
  mutation($listId: ID!, $itemId: ID!) {
    addItemToPeakList(listId: $listId, itemId: $itemId) {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
      mountains {
        id
      }
    }
  }
`;

const CHANGE_PEAK_LIST_NAME = gql`
  mutation($id: ID!, $newName: String!) {
    changePeakListName(id: $id, newName: $newName) {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
      mountains {
        id
      }
    }
  }
`;

const CHANGE_PEAK_LIST_SHORT_NAME = gql`
  mutation($id: ID!, $newShortName: String!) {
    changePeakListShortName(id: $id, newShortName: $newShortName) {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
      mountains {
        id
      }
    }
  }
`;

const CHANGE_PEAK_LIST_VARIANT = gql`
  mutation($id: ID!, $variant: String!, $value: Boolean!) {
    adjustPeakListVariant(id: $id, variant: $variant, value: $value) {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
      mountains {
        id
      }
    }
  }
`;

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    name: PeakList['name'];
    shortName: PeakList['shortName'];
    variants: PeakList['variants'];
    mountains: Array<{
      id: Mountain['id'];
    }>
  };
  mountains: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
  }>;
}

interface Variables {
  id: string;
}

interface CheckboxProps {
  name: string;
  id: string;
  defaultChecked: boolean;
  removeItemFromPeakList: (itemId: string) => void;
  addItemToPeakList: (itemId: string) => void;
}

const Checkbox = (props: CheckboxProps) => {
  const {
    name, id, defaultChecked,
    removeItemFromPeakList, addItemToPeakList,
  } = props;
  const [checked, setChecked] = useState<boolean>(defaultChecked);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    if (checkedWillBe === true) {
      addItemToPeakList(id);
    } else if (checkedWillBe === false) {
      removeItemFromPeakList(id);
    }
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
  peakListId: string;
  cancel: () => void;
}

const EditRegion = (props: Props) => {
  const { peakListId, cancel } = props;
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingShortName, setEditingShortName] = useState<boolean>(false);
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [inputShortNameValue, setInputShortNameValue] = useState<string>('');

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_PEAK_LIST_AND_ALL_MOUNTAINS, {
    variables: { id: peakListId },
  });
  const [removeItemFromPeakList] = useMutation(REMOVE_MOUNTAIN_FROM_PEAK_LIST, {
    refetchQueries: () => [{query: GET_PEAK_LISTS}],
  });
  const [addItemToPeakList] = useMutation(ADD_MOUNTAIN_TO_PEAK_LIST, {
    refetchQueries: () => [{query: GET_PEAK_LISTS}],
  });
  const [changePeakListName] = useMutation(CHANGE_PEAK_LIST_NAME);
  const [changePeakListShortName] = useMutation(CHANGE_PEAK_LIST_SHORT_NAME);
  const [adjustPeakListVariant] = useMutation(CHANGE_PEAK_LIST_VARIANT);

  let name: React.ReactElement | null;
  let shortName: React.ReactElement | null;
  let mountains: React.ReactElement | null;
  let variants: React.ReactElement | null;
  if (loading === true) {
    name = null;
    shortName = null;
    mountains = (<p>Loading</p>);
    variants = null;
  } else if (error !== undefined) {
    name = null;
    shortName = null;
    mountains = null;
    variants = null;
    console.error(error);
  } else if (data !== undefined) {
    if (editingName === false) {
      const setEditNameToTrue = () => {
        setEditingName(true);
        setInputNameValue(data.peakList.name);
      };
      name = (
        <>
          <h3>{data.peakList.name}</h3>
          <button onClick={setEditNameToTrue}>Edit Name</button>
        </>
      );
    } else if (editingName === true) {
      const handleNameSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changePeakListName({variables: { id: peakListId, newName: inputNameValue}});
        setEditingName(false);
      };
      name = (
        <>
        <form onSubmit={handleNameSubmit}>
          <input value={inputNameValue} onChange={(e) => setInputNameValue(e.target.value)} />
          <button type='submit' disabled={inputNameValue === ''}>Update</button>
        </form>
        <button onClick={() => setEditingName(false)}>Cancel</button>
        </>
      );
    } else {
      name = null;
    }
    if (editingShortName === false) {
      const setEditShortNameToTrue = () => {
        setEditingShortName(true);
        setInputShortNameValue(data.peakList.shortName);
      };
      shortName = (
        <>
          <h4>{data.peakList.shortName}</h4>
          <button onClick={setEditShortNameToTrue}>Edit ShortName</button>
        </>
      );
    } else if (editingShortName === true) {
      const handleShortNameSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changePeakListShortName({variables: { id: peakListId, newShortName: inputShortNameValue}});
        setEditingShortName(false);
      };
      shortName = (
        <>
        <form onSubmit={handleShortNameSubmit}>
          <input value={inputShortNameValue} onChange={(e) => setInputShortNameValue(e.target.value)} />
          <button type='submit' disabled={inputShortNameValue === ''}>Update</button>
        </form>
        <button onClick={() => setEditingShortName(false)}>Cancel</button>
        </>
      );
    } else {
      shortName = null;
    }
    const mountainList = data.mountains.map(mountain => {
      return (
        <li key={mountain.id}>
          <Checkbox
            id={mountain.id}
            name={mountain.name}
            defaultChecked={
              (data.peakList.mountains.filter(peakListMountain => peakListMountain.id === mountain.id).length > 0)
            }
            removeItemFromPeakList={(itemId) => removeItemFromPeakList({ variables: {listId: peakListId, itemId}}) }
            addItemToPeakList={(itemId) => addItemToPeakList({ variables: {listId: peakListId, itemId}}) }
          />
        </li>
      );
    });
    mountains = <>{mountainList}</>;
    const {
      peakList: {
        variants: {
          standard, winter, fourSeason, grid,
        },
      },
    } = data;
    variants = (
      <>
        <li key={'peakList-variant-' + PeakListVariants.standard}>
          <Checkbox
            id={PeakListVariants.standard}
            name={PeakListVariants.standard}
            defaultChecked={standard}
            removeItemFromPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: false}})
            }
            addItemToPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: true}})
            }
          />
        </li>
        <li key={'peakList-variant-' + PeakListVariants.winter}>
          <Checkbox
            id={PeakListVariants.winter}
            name={PeakListVariants.winter}
            defaultChecked={winter}
            removeItemFromPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: false}})
            }
            addItemToPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: true}})
            }
          />
        </li>
        <li key={'peakList-variant-' + PeakListVariants.fourSeason}>
          <Checkbox
            id={PeakListVariants.fourSeason}
            name={PeakListVariants.fourSeason}
            defaultChecked={fourSeason}
            removeItemFromPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: false}})
            }
            addItemToPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: true}})
            }
          />
        </li>
        <li key={'peakList-variant-' + PeakListVariants.grid}>
          <Checkbox
            id={PeakListVariants.grid}
            name={PeakListVariants.grid}
            defaultChecked={grid}
            removeItemFromPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: false}})
            }
            addItemToPeakList={
              (itemId) => adjustPeakListVariant({ variables: {id: peakListId, variant: itemId, value: true}})
            }
          />
        </li>
      </>
    );
  } else {
    name = null;
    shortName = null;
    mountains = null;
    variants = null;
  }

  return (
    <div>
      <button onClick={cancel}>Close</button>
        {name}
        {shortName}
        <fieldset>
          <ul>
            {variants}
          </ul>
        </fieldset>
        <fieldset>
          <ul>
            {mountains}
          </ul>
        </fieldset>
    </div>
  );

};

export default EditRegion;
