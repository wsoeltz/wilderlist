/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import { faCode, faDatabase } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import AboutImg from '../../assets/logo/about-profile.jpg';
import useFluent from '../../hooks/useFluent';
import DetailSegment, {Panel} from '../sharedComponents/detailComponents/DetailSegment';
import MobileTab from '../template/contentHeader/MobileTab';
import AboutData from './AboutData';
import ReleaseHistory from './ReleaseHistory';

const AboutImage = styled.img`
  max-width: 100%;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.33);
`;

const Container = styled.div`
  max-width: 750px;
`;

const About = () => {
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: 'Release History',
      reactNode: <ReleaseHistory />,
      customIcon: false,
      icon: faCode,
    },
    {
      title: 'About the Data',
      reactNode: <AboutData />,
      customIcon: false,
      icon: faDatabase,
    },
  ];
  return (
    <>
      <Helmet>
        <title>{getString('meta-data-about-title')}</title>
        <meta property='og:title' content={getString('meta-data-about-title')} />
      </Helmet>
      <MobileTab hideTab={true} />
      <h2>{getString('header-text-menu-item-about')}</h2>
      <Container>
        <AboutImage
          src={AboutImg}
          alt={'Kyle Soeltz, founder of Wilderlist'}
          title={'Kyle Soeltz, founder of Wilderlist'}
        />
        <p>Wilderlist is an online tool for planning and tracking your hikes. It started as a small personal project of the founder, <a href='https://soeltz.com'><strong>Kyle Soeltz</strong></a>, and ended up blowing up into a full scale web application. The mission has since become to create a powerful way for hikers to not only track their progress, as was the original sole purpose of the tool, but to also plan their hikes using live weather forecasts, trail and campsite data, driving directions, trip reports, and more. The site is continually evolving with improvements and features actively being added every month.
        </p>
        <h3>Contact Us</h3>
        <p>
          Love Wilderlist? Hate it? Have a comment or suggestion? Please don't hesitate to email us at <a href='mailto:kyle@wilderlist.app'><strong>kyle@wilderlist.app</strong></a>! We are always looking to make this the best tool it can be for the hiking community.
        </p>
        <br />
        <DetailSegment
          panels={panels}
          panelId={'aboutInformationPanels'}
        />
      </Container>
    </>
  );
};

export default About;
