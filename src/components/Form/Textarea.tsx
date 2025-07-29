import React, { Component, CSSProperties, useEffect } from 'react';
import styled from 'styled-components';

interface TextareaProps {
  colSize?: string;
  id: string;
  name: string;
  onChange?: (e: any) => void;
  onBlur?: () => void;
  placeholder?: string;
  value?: string | number;
  addClassName?: string;
  disabled?: boolean;
  fieldError?: boolean;
  fieldWarning?: boolean;
  isRequired?: boolean;
  rows?: number;
  addClass?: string;
  style?: CSSProperties;
}

// class Textarea extends Component<TextareaProps> {
const Textarea: React.FC<TextareaProps> = (props:TextareaProps)=>{

  const [textAreaCount,setTextAreaCount] = React.useState('')

    let colClass = props.colSize ? 'col-sm-' + props.colSize : 'col-sm-12';
    let addClass = props.addClass ? props.addClass : '';

    const recalculate = e => {
      // textAreaCount = e.target.value.length;
      setTextAreaCount(e.target.value)
      props.onChange
    }

    useEffect(()=>{
      // for(let i in props)
      // {
      //   console.log(i)
      // }
    },[])



    return (
  
      <StyledTextArea
        style={props.style}
        id={props.id}
        name={props.name}
        className={
          'form-control ' +
          colClass +
          ' ' +
          addClass +
          ' ' +
          (props.fieldError ? 'red-b' : '') +
          ' ' +
          (props.fieldWarning ? 'warn-b' : '' + ' ' + (props.addClassName || '')) +
          (props.disabled ? 'disabled_color' : '')
        }
        disabled={props.disabled}
        // placeholder={props.placeholder}
        placeholder={""}
        onChange={props.onChange}
        // onChange={e=>  setTextAreaCount(e.target.value)}
        value={props.value}
        onBlur={props.onBlur}
        required={props.isRequired}
        rows={props.rows}
        maxLength={160}
      />

    );
  
}

  

  // public render() {
  //   let colClass = this.props.colSize ? 'col-sm-' + this.props.colSize : 'col-sm-12';
  //   let addClass = this.props.addClass ? this.props.addClass : '';
  //   return (
  //     <StyledTextArea
  //       style={this.props.style}
  //       id={this.props.id}
  //       name={this.props.name}
  //       className={
  //         'form-control ' +
  //         colClass +
  //         ' ' +
  //         addClass +
  //         ' ' +
  //         (this.props.fieldError ? 'red-b' : '') +
  //         ' ' +
  //         (this.props.fieldWarning ? 'warn-b' : '' + ' ' + (this.props.addClassName || '')) +
  //         (this.props.disabled ? 'disabled_color' : '')
  //       }
  //       disabled={this.props.disabled}
  //       // placeholder={this.props.placeholder}
  //       placeholder={""}
  //       onChange={this.props.onChange}
  //       value={this.props.value}
  //       onBlur={this.props.onBlur}
  //       required={this.props.isRequired}
  //       rows={this.props.rows}
  //       maxLength={160}
  //     />
  //   );
  // }
// }

const StyledTextArea = styled.textarea`
  width:100%!important;

  &.red-b {
    border: 1px solid red;
  }
  &.warn-b {
    border: 1px solid var(--warning);
  }
  &:focus {
    /* outline: #2DC3CA auto 5px; */
    outline: none;
  }
`;

const StyledDiv = styled.div`
  width:100%!important;
  display:flex;
  flex-direction:column;
`;

export default Textarea;
