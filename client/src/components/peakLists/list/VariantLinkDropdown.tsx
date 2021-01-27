import React, {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import usePrevious from '../../../hooks/usePrevious';
import {useAddPeakListVariant} from '../../../queries/lists/useAddPeakListVariant';
import {
  listDetailLink,
} from '../../../routing/Utils';
import {
  primaryColor,
} from '../../../styling/styleUtils';
import { PeakList, PeakListVariants } from '../../../types/graphQLTypes';

/* eslint-disable max-len */
/* tslint:disable:max-line-length */
const SelectBox = styled.select`
  color: ${primaryColor};
  text-decoration: underline;
  font-weight: 600;
  font-size: 0.85rem;
  border: none;
  outline: none;
  background: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${primaryColor.replace('#', '')}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#ffffff 100%);
  background-repeat: no-repeat, repeat;
  background-position: right 0 top 50%, 0 0;
  background-size: .65em auto, 100%;
  padding-right: 1rem;
`;

const allVariantsArray = [
  PeakListVariants.standard,
  PeakListVariants.winter,
  PeakListVariants.fourSeason,
  PeakListVariants.grid,
];

interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakListVariants;
  parent: null | {id: PeakList['id'], type: PeakList['type']};
  children: null | Array<{id: PeakList['id'], type: PeakList['type']}>;
  siblings: null | Array<{id: PeakList['id'], type: PeakList['type']}>;
}

interface Props {
  peakList: PeakListDatum;
}

const VariantLinks = (props: Props) => {
  const {
    peakList: {id, name, shortName, type}, peakList,
  } = props;

  const getString = useFluent();
  const history = useHistory();

  const match = useRouteMatch<{peakListId: string | undefined, id: string | undefined}>();
  let currentListId: string | null;
  if (match.params.peakListId && match.params.peakListId && match.params.peakListId !== 'search') {
    currentListId = match.params.peakListId;
  } else if (match.params.id && match.params.id && match.params.id !== 'search') {
    currentListId = match.params.id;
  } else {
    currentListId = null;
  }

  const addPeakList = useAddPeakListVariant();

  const [loadingNewList, setLoadingNewList] = useState<boolean>(false);

  const topLevelParentId = peakList.parent && peakList.parent.id ? peakList.parent.id : id;

  const parent = peakList.parent ? [peakList.parent] : [];
  const children = peakList.children && peakList.children.length ? peakList.children : [];
  const siblings = peakList.siblings && peakList.siblings.length ? peakList.siblings : [];

  const allListVariants = [{id, type}, ...parent, ...siblings, ...children];

  const previousListLength = usePrevious(allListVariants.length);

  useEffect(() => {
    if (loadingNewList === true && previousListLength && allListVariants.length > previousListLength) {
      setLoadingNewList(false);
    }
  }, [allListVariants.length, previousListLength, loadingNewList, setLoadingNewList]);

  let defaultValue = '';
  const variantsLinks = allVariantsArray.map((variant) => {
    const target = allListVariants.find(list => list.type === variant);
    if (target) {
      const url = listDetailLink(target.id);
      if (target.id === currentListId) {
        defaultValue = url;
      }
      return (
        <option
          value={url}
          key={target.id}
        >
          {getString('global-text-value-list-type', {type: variant})}
        </option>
      );
    } else {
      return (
        <option
          value={variant}
          key={'create-for' + name + variant}
        >
          {getString('global-text-value-list-type', {type: variant})}
        </option>
      );
    }
  });

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value.includes('/list/')) {
      history.push(value);
    } else {
      if (loadingNewList === false) {
        setLoadingNewList(true);
        addPeakList({variables: {
          name, shortName, type: value as PeakListVariants, parent: topLevelParentId,
        }}).then(res => {
          if (res && res.data && res.data.peakList) {
            window.location.href = listDetailLink(res.data.peakList.id);
          }
        }).catch(err => console.error(err));
      }
    }
  };

  return (
    <SelectBox onChange={onChange} defaultValue={defaultValue}>
      {variantsLinks}
    </SelectBox>
  );
};

export default VariantLinks;
