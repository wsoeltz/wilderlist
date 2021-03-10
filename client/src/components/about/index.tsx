/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Octokit } from '@octokit/core';
import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import AboutImg from '../../assets/logo/about-profile.jpg';
import useFluent from '../../hooks/useFluent';
import {
  BasicIconInText,
  DetailBoxTitle,
  DetailBoxWithMargin,
  Section,
  SemiBold,
} from '../../styling/styleUtils';
import MobileTab from '../template/contentHeader/MobileTab';

const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });

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

interface Release {
  name: string;
  createdAt: Date;
  descriptionHTML: string;
}

const About = () => {
  const getString = useFluent();
  const [releases, setReleases] = useState<Release[] | null>(null);

  useEffect(() => {
    const fetchReleaseHistory = async () => {
      try {
        const response: any = await octokit.graphql(
            `
              {
                repository(owner: "wsoeltz", name: "wilderlist") {
                  releases(last: 20) {
                    edges {
                      node {
                        name
                        createdAt
                        descriptionHTML
                      }
                    }
                  }
                }
              }
            `,
            {
              headers: {
                authorization: process.env.REACT_APP_GITHUB_TOKEN,
              },
            },
          );
        if (response) {
          setReleases(response.repository.releases.edges.map(({node}: {node: Release}) => node).reverse());
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (releases === null) {
      fetchReleaseHistory();
    }
  }, [releases]);

  const releaseItems = releases && releases.length ? releases.map(({name, createdAt, descriptionHTML}) => {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
    const amOrPm = hours < 12 ? 'AM' : 'PM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : '' + minutes;
    const formattedTime = `${hours}:${minutes}${amOrPm} on ${month}/${day}/${year}`;
    return (
      <div key={createdAt + name}>
        <SemiBold>{name}</SemiBold><br />
        <SemiBold><small>{formattedTime}</small></SemiBold>
        <Section>
          <small><div dangerouslySetInnerHTML={{__html: descriptionHTML}} /></small>
        </Section>
        <hr />
      </div>
    );
  }) : null;

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-about-title')}</title>
        <meta property='og:title' content={getString('meta-data-about-title')} />
      </Helmet>
      <MobileTab hideTab={true} />
      <h1>{getString('header-text-menu-item-about')}</h1>
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
        <h3>How We Make Money</h3>
        <p>
          We don't! Everything on here has been a complete passion project and is done in the freetime of the creators with any costs coming out of their own pockets. There are ideas on how to make some money to help pay for some those costs, but any sort of premium features that come along later would be a bonus. Anything currently available for free will never cost money in the future.
        </p>
        <DetailBoxTitle><BasicIconInText icon={faCode} /> Releases</DetailBoxTitle>
        <DetailBoxWithMargin>
          {releaseItems}
        </DetailBoxWithMargin>
      </Container>
    </>
  );
};

export default About;
