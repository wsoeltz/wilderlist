import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import {
  TextareaBase,
  TextareaBaseCompact,
} from '../../styling/styleUtils';

interface Props {
  id?: string;
  placeholder: string;
  setInputValue: (value: string) => void;
  initialValue: string;
  maxLength?: number;
  rows?: number;
  compact?: boolean;
}

const StandardSearch = (props: Props) => {
  const {
    id, placeholder, setInputValue, initialValue,
    maxLength, rows, compact,
  } = props;

  const textareaEl = useRef<HTMLTextAreaElement | null>(null);

  const onChange = debounce(() => {
    if (textareaEl !== null && textareaEl.current !== null) {
      setInputValue(textareaEl.current.value);
    }
  }, 400);

  useEffect(() => {
    const node = textareaEl.current;
    if (node && !node.value) {
      node.value = initialValue;
    }
  }, [textareaEl, initialValue]);

  const Textarea = compact ? TextareaBaseCompact : TextareaBase;

  return (
    <Textarea
      id={id}
      ref={textareaEl}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete={'off'}
      maxLength={maxLength}
      rows={rows}
    />
  );
};

export default StandardSearch;
