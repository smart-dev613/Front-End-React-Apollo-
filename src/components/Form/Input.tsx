import React, { useEffect } from 'react';
import styled from 'styled-components';

interface InputProps {
  colSize?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  value?: any;
  inputValue?: any;
  disabled?: boolean;
  fieldError?: boolean;
  fieldWarning?: boolean;
  isRequired?: boolean;
  checked?: boolean;
  min?: number;
  max?: number;
  addClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  inputCol?: string;
  style?: any;
  masterClassName?: string;
}

class Input extends React.Component<InputProps> {
  public render() {
    const {
      colSize,
      id,
      name,
      onChange,
      onKeyUp,
      onBlur,
      placeholder,
      type,
      value,
      inputValue,
      disabled,
      fieldError,
      fieldWarning,
      isRequired,
      checked,
      // disable,
      containerClassName,
      inputClassName,
      min,
      max,
      addClassName,
      inputCol,
      style,
      masterClassName,
    } = this.props;

    let colClass = inputCol === '' ? (colSize ? ' col-sm-' + colSize + ' ' : ' col-sm-12 ') : inputCol;
    let moreClasses = addClassName ? addClassName : '';
    return (
      <StyledInput
        type={type}
        id={id}
        name={name}
        style={style}
        className={
          masterClassName
            ? masterClassName
            : `${addClassName} form-control input-design  ${inputClassName ? inputClassName : ''} ${
                colClass ? colClass : ''
              }  ${containerClassName ? containerClassName : ''} ${moreClasses ? moreClasses : ''}
          ${fieldError ? 'red-b' : ''} ${fieldWarning ? 'warn-b' : ''} ${disabled ? 'disabled_color' : ''}`
        }
        placeholder={placeholder}
        onChange={onChange}
        onKeyUp={onKeyUp}
        value={inputValue || value}
        disabled={disabled}
        // {disable ? disabled : ''}
        onBlur={onBlur}
        required={isRequired}
        checked={checked}
        min={min}
        max={max}
      />
    );
  }
}

const StyledInput = styled.input`
display: flex!important;
  &.red-b {
    border: 1px solid red;
  }
  &.warn-b {
    border: 1px solid var(--warning);
  }
  &:focus {
    /* outline: #2DC3CA auto 5px; */
    outline: none;
    box-shadow: none;
  }
  &[type='checkbox'] {
    width: 20px;
    height: 20px;
  }
`;

export default Input;
