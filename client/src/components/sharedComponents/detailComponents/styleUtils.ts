import styled from 'styled-components/macro';

export const BasicRoot = styled.div`
  padding: 1rem;
`;

export const BasicRootRight = styled(BasicRoot)`
  padding-left: 0;

  @media (max-width: 500px) {
    padding-left: 1rem;
  }
`;
