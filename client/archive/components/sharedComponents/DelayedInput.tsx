import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import {
  InputBase,
} from '../../styling/styleUtils';

interface Props {
  id?: string;
  placeholder: string;
  setInputValue: (value: string) => void;
  initialValue: string;
  maxLength?: number;
  type?: string;
  min?: number;
  max?: number;
}

const StandardSearch = (props: Props) => {
  const {
    id, placeholder, setInputValue, initialValue,
    maxLength, type, min, max,
  } = props;

  const inputEl = useRef<HTMLInputElement | null>(null);

  const onChange = debounce(() => {
    if (inputEl !== null && inputEl.current !== null) {
      setInputValue(inputEl.current.value);
    }
  }, 400);

  useEffect(() => {
    const node = inputEl.current;
    if (node && !node.value) {
      node.value = initialValue;
    }
  }, [inputEl, initialValue]);

  return (
    <InputBase
      id={id}
      ref={inputEl}
      type={type ? type : 'text'}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete={'off'}
      maxLength={maxLength}
      min={min}
      max={max}
    />
  );
};

export default StandardSearch;
