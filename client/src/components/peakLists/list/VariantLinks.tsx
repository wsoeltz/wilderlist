import { useMutation } from '@apollo/react-hooks';
import { faLeaf, faMountain, faSnowflake, faTh } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import usePrevious from '../../../hooks/usePrevious';
import {
  listDetailWithMountainDetailLink,
  searchListDetailLink,
} from '../../../routing/Utils';
import {
  BasicIconInText,
  CardFooterButton,
  CardFooterLink,
  lightBaseColor,
} from '../../../styling/styleUtils';
import { getColorSetFromVariant } from '../../../styling/styleUtils';
import { PeakList, PeakListVariants } from '../../../types/graphQLTypes';
import {
  mobileSize,
} from '../../../Utils';
import {AppContext} from '../../App';
import { CompactPeakListDatum } from './ListPeakLists';

const replaceCurrentPageId = (url: string, currentId: string, newId: string) => url.replace(currentId, newId);

const ADD_PEAK_LIST = gql`
  mutation addPeakList(
    $name: String!,
    $shortName: String!,
    $type: PeakListVariants!,
    $parent: ID!,
  ) {
    peakList: addPeakList(
      name: $name,
      shortName: $shortName,
      type: $type,
      parent: $parent,
    ) {
      id
    }
  }
`;

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
  };
}

interface AddChildListVariables {
  name: string;
  shortName: string;
  type: PeakListVariants;
  parent: string;
}

const allVariantsArray = [
  PeakListVariants.standard,
  PeakListVariants.winter,
  PeakListVariants.fourSeason,
  PeakListVariants.grid,
];
const variantsIconMapping = [
  faMountain,
  faSnowflake,
  faLeaf,
  faTh,
];

interface Props {
  peakList: CompactPeakListDatum;
  queryRefetchArray: Array<{query: any, variables: any}>;
  grayText?: boolean;
}

const VariantLinks = (props: Props) => {
  const {
    peakList: {id, name, shortName, type}, peakList,
    queryRefetchArray, grayText,
  } = props;

  const {windowWidth} = useContext(AppContext);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const history = useHistory();
  const match = useRouteMatch<{peakListId: string | undefined, id: string | undefined}>();
  let currentListId: string | null;
  if (match.params.peakListId && match.params.peakListId) {
    currentListId = match.params.peakListId;
  } else if (match.params.id && match.params.id) {
    currentListId = match.params.id;
  } else {
    currentListId = null;
  }

  const [addPeakList] = useMutation<SuccessResponse, AddChildListVariables>(ADD_PEAK_LIST, {
    refetchQueries: () => queryRefetchArray,
  });

  const [loadingNewList, setLoadingNewList] = useState<boolean>(false);

  const parent = peakList.parent !== null ? [peakList.parent] : [];
  const children = peakList.children !== null ? peakList.children : [];
  const siblings = peakList.siblings !== null ? peakList.siblings : [];

  const allListVariants = [{id, type}, ...parent, ...siblings, ...children];

  const previousListLength = usePrevious(allListVariants.length);

  useEffect(() => {
    if (loadingNewList === true && previousListLength && allListVariants.length > previousListLength) {
      setLoadingNewList(false);
    }
  }, [allListVariants.length, previousListLength, loadingNewList, setLoadingNewList]);

  const variantsLinks = allVariantsArray.map((variant, i) => {
    const target = allListVariants.find(list => list.type === variant);
    if (target) {
      let color: string;
      if (grayText && currentListId !== target.id) {
        color = lightBaseColor;
      } else {
        color = variant === PeakListVariants.grid
          ? getColorSetFromVariant(variant).primary :  getColorSetFromVariant(variant).tertiary;
      }
      const desktopURL = currentListId === null
        ? searchListDetailLink(target.id) + window.location.search
        : replaceCurrentPageId(match.url, currentListId, target.id) + window.location.search;
      return (
        <CardFooterLink
          key={name + type + variant}
          mobileURL={listDetailWithMountainDetailLink(target.id, 'none')}
          desktopURL={desktopURL}
          $isActive={currentListId === target.id}
          color={color}
        >
          <BasicIconInText icon={variantsIconMapping[i]} />
          {getFluentString('global-text-value-list-type', {type: variant})}
        </CardFooterLink>
      );
    } else {
      let color: string;
      if (grayText) {
        color = lightBaseColor;
      } else {
        color = variant === PeakListVariants.grid
          ? getColorSetFromVariant(variant).primary :  getColorSetFromVariant(variant).tertiary;
      }
      const onClick = () => {
        if (loadingNewList === false) {
          setLoadingNewList(true);
          addPeakList({variables: {
            name, shortName, type: variant, parent: id,
          }}).then(res => {
            if (res && res.data && res.data.peakList) {
              const desktopURL = currentListId === null
                ? searchListDetailLink(res.data.peakList.id) + window.location.search
                : replaceCurrentPageId(match.url, currentListId, res.data.peakList.id) + window.location.search;
              const url = windowWidth >= mobileSize
                ? desktopURL
                : listDetailWithMountainDetailLink(res.data.peakList.id, 'none');
              history.push(url);
            }
          }).catch(e => console.error(e));
        }
      };
      return (
        <CardFooterButton
          onClick={onClick}
          key={name + type + variant}
          disabled={loadingNewList}
          $isActive={false}
          color={color}
        >
          <BasicIconInText icon={variantsIconMapping[i]} />
          {getFluentString('global-text-value-list-type', {type: variant})}
        </CardFooterButton>
      );
    }
  });
  return (
    <>
      {variantsLinks}
    </>
  );
};

export default VariantLinks;
