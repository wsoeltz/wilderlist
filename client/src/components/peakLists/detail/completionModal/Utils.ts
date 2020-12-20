import styled from 'styled-components/macro';
import {
  CheckboxList as CheckboxListBase,
  InputBase,
  Label,
  lightBorderColor,
} from '../../../../styling/styleUtils';

export const today = new Date();

export const years: number[] = [];
for (let i = 1900; i < today.getFullYear() + 1; i++) {
  years.push(i);
}

export const mobileWidth = 470; // in px

export const SectionTitle = styled(Label)`
  margin-top: 0;
  margin-bottom: 0.2rem;
  font-size: 0.9rem;
`;

export const ColumnRoot = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 2rem;

  @media (max-width: 600px) {
    grid-column-gap: 1rem;
  }

  @media (max-width: ${mobileWidth}px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
`;

export const LeftColumn = styled.div`
  grid-column: 1;
  grid-row: 1;

  @media (max-width: ${mobileWidth}px) {
    padding-right: 0;
    grid-row: auto;
  }
`;

export const RightColumn = styled.div`
  grid-column: 2;
  grid-row: 1;

  @media (max-width: ${mobileWidth}px) {
    padding-left: 0;
    grid-row: auto;
    grid-column: 1;
  }
`;

/* eslint-disable max-len */
/* tslint:disable:max-line-length */
export const SelectBoxBase = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  font-size: 1rem;
  padding: 7px;
  border-radius: 0;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;

  &:hover {
    cursor: pointer;
    background-color: #ddd;
  }
`;

export const SelectDateOption = styled.option`
  padding: 4px;
`;

export const NoDateText = styled.p`
  text-align: center;
  font-style: italic;
`;

export const Input = styled(InputBase)`
  margin-top: 0.3rem;
  margin-bottom: 0.6rem;
`;

export const ButtonWrapper = styled.div`
  &:not(:first-child) {
    margin-top: 0.75rem;
  }
`;

export const ListItem = styled.div`
  padding: 0.4rem 0;

  &:last-child {
    margin-bottom: 0.45rem;
  }

  &:not(:last-child) {
    border-bottom: solid 1px ${lightBorderColor};
  }
`;

export const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CheckboxList = styled(CheckboxListBase)`
  background-color: #fff;
  margin-top: 0.3rem;
`;
