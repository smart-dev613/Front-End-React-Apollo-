import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import ColourPicker from '../Form/ColourPicker';
import styled from 'styled-components'
import Input from '../Form/Input';



const ColorPickerField = ({ name, width, label, type = 'color', disable_check, placeholder = '', colSize = '6' }: any) => {

  const StyledHidden = styled.div`
  padding: 0;
  visibility: hidden;

  @media only screen and (min-width:330px) and (max-width:475px){
    // display:none!important;
    
  }
`

  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup viewWidth={width} colSize={`${width <= 1240 && width >= 1090 ? '11' : '12'}`}>
          <Label
            colSize={`${width <= 1350 && width >= 1241 ? '8' : ''}${width <= 1240 && width >= 1001 ? '9' : ''}${width <= 1000 && width >= 751 ? '8' : ''}${
              width <= 750 && width >= 601 ? '6' : ''
            }${width <= 600 ? '8' : ''}${width > 1350 ? '8' : ''}`}
            addClassName={`${width <= 575 ? 'col-6' : ''}${width <= 1350 && width >= 1001 ? 'col-8' : ''}${width > 1350 ? 'col-8' : ''}`}
            labelFor={name}
          >
            {label}
          </Label>
          <StyledHidden className="col-1">
        <Input type='hidden'/>
      </StyledHidden>
          <ColourPicker
          disabled={disable_check}
            colour={field.value}
            onChange={(color) => {
              field.onChange({
                target: {
                  value: color.hex,
                  type,
                  name,
                },
              });
            }}
          />
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
}

export default ColorPickerField;
