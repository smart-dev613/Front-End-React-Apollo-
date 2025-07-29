import React, { Component, CSSProperties } from 'react';
import styled from 'styled-components';
import {useDispatch,useSelector} from 'react-redux'
import {setAtt} from '../../store/att/action';

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

// class VenueSelect extends Component<SelectProps> {
const VenueSelect = (props) =>{
//   public render() {

    const dispatch = useDispatch();

    for(let c in props.options);
    // console.log('props.options', props)
   
    let colClass =
      props.inputCol === ''
        ? props.colSize
          ? 'col-sm-' + props.colSize
          : 'col-sm-12'
        : props.inputCol;

    let disable = !(props.options.length > 0);
    let addClass = props.addClassName ? props.addClassName : '';
    function changeHandler(e){
      // alert(e.max+" att:"+e.att)
      // dispatch(setAtt(e.max - e.att));
      if (e.max - e.att > 0) {
        localStorage.setItem('selectedVenue', JSON.stringify(e));
        dispatch(setAtt(e.max - e.att));
      } else {
        dispatch(setAtt(0));
      }
      props.onChange(e);
    }
    const [selectedValue, setSelectedValue] = React.useState(0);
    React.useEffect(()=>{
    //    alert(props.defaultValue); 
    },[])
    return (
      <StyledReactSelect
        type={props.type}
        id={props.id}
        name={props.name}
        className={
          props.masterInputClassName
            ? props.masterInputClassName
            : (props.isFlexOne ? 'full-width-flex' : '') +
              ' select-input ' +
              (!props.sidePadding ? 'no-side-padding  ' : '') +
              colClass +
              ' ' +
              addClass +
              ' ' +
              (props.fieldError ? 'red-b' : '')
        }
        // onChange={this.props.onChange}
        // onChange={()=>{props.onChange; 
        //     changeHandler;
        // }}
        onChange={(e) => {
          changeHandler && changeHandler(e)
        }}
        placeholder={props.placeholder}
        options={props.options}
        defaultValue={props.defaultValue}
        value={props.value}
        maxMenuHeight={props.maxMenuHeight}
        isDisabled={disable || props.disabled}
        required={props.isRequired}
        isMulti={props.multiple}
        autoFocus={props.autoFocus}
        styles={{
          menu: (provided: any, state: any) => ({
            ...provided,
            zIndex: 100,
          }),
        }}
        isOptionSelected={(value: any, options: any) =>{ 
            options.some((i: any) => i === value)
            // alert("value: "+value.max)
          
            // dispatch(setAtt(value.max - 4));
        
        }} //override default logic and compare all options with selected value to determine the object that is actually selected
      >
        {props.children}
      </StyledReactSelect>
    );
  }
// }

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

export default VenueSelect;
