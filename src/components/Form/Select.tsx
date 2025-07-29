import React, { Component, CSSProperties } from 'react';
import styled from 'styled-components';

import ReactSelect from 'react-select';

interface SelectProps {
  children?: void;
  colSize?: string;
  id: string;
  name: string;
  onChange?: (e: any) => void;
  options?: object[];
  placeholder?: string;
  type: string;
  value?: object;
  // value?: string;
  maxMenuHeight?: number;
  disabled?: boolean;
  addClassName?: string;
  defaultValue?: object;
  // defaultValue?: string;
  fieldError?: boolean;
  isRequired?: string;
  multiple?: boolean;
  autoFocus?: boolean;
  sidePadding?: boolean;
  inputCol?: string;
  isFlexOne?: boolean;
  masterInputClassName?: string;
}

class Select extends Component<SelectProps> {
  public render() {
    let colClass =
      this.props.inputCol === ''
        ? this.props.colSize
          ? 'col-sm-' + this.props.colSize
          : 'col-sm-12'
        : this.props.inputCol;

    let disable = !(this.props.options.length > 0);
    let addClass = this.props.addClassName ? this.props.addClassName : '';
    return (
      <StyledReactSelect
        type={this.props.type}
        id={this.props.id}
        name={this.props.name}
        className={
          this.props.masterInputClassName
            ? this.props.masterInputClassName
            : (this.props.isFlexOne ? 'full-width-flex' : '') +
              ' select-input ' +
              (!this.props.sidePadding ? 'no-side-padding  ' : '') +
              colClass +
              ' ' +
              addClass +
              ' ' +
              (this.props.fieldError ? 'red-b' : '')
        }
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        options={this.props.options}
        defaultValue={this.props.defaultValue}
        value={this.props.value}
        maxMenuHeight={this.props.maxMenuHeight}
        isDisabled={disable || this.props.disabled}
        required={this.props.isRequired}
        isMulti={this.props.multiple}
        autoFocus={this.props.autoFocus}
        styles={{
          menu: (provided: any, state: any) => ({
            ...provided,
            zIndex: 100,
          }),
        }}
        isOptionSelected={(value: any, options: any) => options.some((i: any) => i === value)} //override default logic and compare all options with selected value to determine the object that is actually selected
      >
        {this.props.children}
      </StyledReactSelect>
    );
  }
}

const StyledReactSelect = styled(ReactSelect)`
  &.red-b {
    > div:first-child {
      border: 1px solid red;
    }
  }
  &.campaign-select > div:first-of-type {
    box-shadow: 0 2px 4px 0 rgba(184, 184, 184, 0.5);
    width: 100%;
  }
`;

export default Select;
