import React, {useState} from 'react';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {
  CollapsedScrollContainer,
  EmptyBlock,
} from '../../../../styling/sharedContentStyles';
import {ButtonPrimary} from '../../../../styling/styleUtils';
import {Coordinate, CoordinateWithElevation} from '../../../../types/graphQLTypes';
import {downloadGPXString} from '../../../../utilities/trailUtils';
import SignUpModal from '../../../sharedComponents/SignUpModal';

interface Props {
  title: string;
  line: Coordinate[] | CoordinateWithElevation[];
}

const TrailDetails = (props: Props) => {
  const {title, line} = props;
  const getString = useFluent();
  const user = useCurrentUser();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const onClick = () => {
    if (user) {
      downloadGPXString({
        line,
        name: title,
        url: 'https://wilderlist.app' + window.location.pathname,
      });
    } else {
      setModalOpen(true);
    }
  };

  const signUp = modalOpen ? (
    <SignUpModal
      text={getString('global-text-value-modal-sign-up-today-download-gpx')}
      onCancel={() => setModalOpen(false)}
    />
  ) : null;
  return (
    <CollapsedScrollContainer hideScrollbars={false} $noScroll={true}>
      <EmptyBlock>
        <p>
          <ButtonPrimary onClick={onClick}>
            {getString('download-gpx-button')}
          </ButtonPrimary>
        </p>
      </EmptyBlock>
      {signUp}
    </CollapsedScrollContainer>
  );

};

export default TrailDetails;
