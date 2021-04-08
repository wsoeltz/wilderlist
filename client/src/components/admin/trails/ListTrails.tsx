import { ApolloError } from '@apollo/client';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {
  useUpdateTrailFlag,
} from '../../../queries/trails/flagTrail';
import {trailDetailLink, userProfileLink} from '../../../routing/Utils';
import {
  LinkButton,
  warningColor,
} from '../../../styling/styleUtils';
import { Trail } from '../../../types/graphQLTypes';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { ListItem } from '../sharedStyles';
import { SuccessResponse } from './';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteTrail: (id: string) => void;
  searchQuery: string;
}

const ListTrails = (props: Props) => {
  const {loading, error, data, deleteTrail, searchQuery} = props;

  const [trailToDelete, setTrailToDelete] = useState<Trail | null>(null);

  const updateTrailFlag = useUpdateTrailFlag();

  const clearFlag = (trailId: string) => {
    if (trailId) {
      updateTrailFlag({variables: {id: trailId, flag: null}});
    }
  };

  const closeAreYouSureModal = () => {
    setTrailToDelete(null);
  };
  const confirmRemove = () => {
    if (trailToDelete !== null) {
      deleteTrail(trailToDelete.id);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = trailToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete trail ' + trailToDelete.name + '? This cannot be undone.'}
      confirmText={'Confirm'}
      cancelText={'Cancel'}
    />
  );

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { trails } = data;
    const trailElms = trails.map(trail => {
      if (trail.name && trail.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        let flag: React.ReactElement<any> | null;
        if (trail.flag) {
          const [flagText, flagUserData] = trail.flag.split('__USERID__');
          const flagUser = flagUserData ? flagUserData.split('__USERNAME__') : null;
          const flaggedBy = flagUser && flagUser.length === 2 ? (
            <Link to={userProfileLink(flagUser[0])}>{flagUser[1]}</Link>
          ) : 'Unknown';
          flag = (
            <div style={{marginTop: '1rem', color: warningColor}}>
              Flagged for: <strong>{flagText}</strong>
              <small style={{marginLeft: '1rem'}}>
                [<LinkButton
                  onClick={() => clearFlag(trail.id)}
                >
                  Clear flag
                </LinkButton>]
              </small>
              <br />
              <small>Flagged by {flaggedBy}</small>
            </div>
          );
        } else {
          flag = null;
        }
        const trailName = trail && trail.name ? trail.name : 'Unamed trail';
        const content = (
          <>
            {flag}
          </>
        );
        let titleColor: string | undefined;
        if (trail.flag !== null) {
          titleColor = warningColor;
        } else {
          titleColor = undefined;
        }
        return (
          <ListItem
            key={trail.id}
            title={trailName}
            content={content}
            onDelete={() => setTrailToDelete(trail)}
            titleColor={titleColor}
            url={trailDetailLink(trail.id)}
          />
        );
      } else {
        return null;
      }
    });
    const noItemsText = trails.length ? null : <p style={{textAlign: 'center'}}>No items</p>;
    return(
      <>
        {noItemsText}
        {trailElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListTrails;
