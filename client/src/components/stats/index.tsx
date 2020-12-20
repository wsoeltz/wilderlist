import React, {useContext} from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../hooks/useFluent';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../styling/Grid';
import {
  SectionTitleH3,
} from '../../styling/styleUtils';
import { mobileSize } from '../../Utils';
import { AppContext } from '../App';
import AllMountains from '../stats/AllMountains';
import Stats from './Stats';

interface Props {
  userId: string;
}

const YourStats = (props: Props) => {
  const { userId } = props;

  const getString = useFluent();

  const { windowWidth } = useContext(AppContext);

  let content: React.ReactElement<any> | null;
  if (windowWidth < mobileSize) {
    content = (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <SectionTitleH3>
              {getString('your-stats-title')}
            </SectionTitleH3>
            <Stats
              userId={userId}
            />
            <AllMountains
              userId={userId}
            />
          </ContentBody>
        </ContentLeftLarge>
      </>
    );
  }  else {
    content = (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <SectionTitleH3>
              {getString('your-stats-title')}
            </SectionTitleH3>
            <Stats
              userId={userId}
            />
          </ContentBody>
        </ContentLeftLarge>
        <ContentRightSmall>
          <ContentBody>
            <AllMountains
              userId={userId}
            />
          </ContentBody>
        </ContentRightSmall>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-your-stats-default-title')}</title>
      </Helmet>
      {content}
    </>
  );
};

export default YourStats;
