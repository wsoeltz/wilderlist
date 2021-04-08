/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import { Octokit } from '@octokit/core';
import React, { useEffect, useState } from 'react';
import {
  ContainerContent,
  Section,
  SemiBold,
} from '../../styling/styleUtils';

const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
interface Release {
  name: string;
  createdAt: Date;
  descriptionHTML: string;
}

const ReleaseHistory = () => {
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
    <ContainerContent>
      {releaseItems}
    </ContainerContent>
  );
};

export default ReleaseHistory;
