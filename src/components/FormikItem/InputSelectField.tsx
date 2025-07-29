import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Select from '../Form/Select';
import './util.css'
import Input from '../Form/Input';
import styled from 'styled-components'


const StyledHidden = styled.div`
  padding: 0;
  visibility: hidden;

  @media only screen and (min-width:330px) and (max-width:475px){
    display:none!important;
  }
`


const InputSelectField = ({
  containerClassName,
  name,
  width,
  label,
  options = [],
  type = 'string',
  placeholder = '',
  colSize = '6',
  disable_check,
  onChange,
  hideLabel,
  colSizeLabel,
  colSizeInput,
  noPadding,
  addClassName = '',
  labelClassName = '',
  style = {},
  masterInputClassName = '',
}: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup
          containerClassName={containerClassName}
          viewWidth={width}
          colSize={colSize}
          noPadding={noPadding}
          style={style}
        >
          {!hideLabel && (
            <Label
              colSize={`${width <= 1350 && width >= 751 ? '5 ' : ''}${width <= 750 ? '5 ' : ''}${width > 1350 && '3'}`}
              addClassName={`col-${
                colSizeLabel ||
                `${width <= 1350 && width >= 451 ? '4 ' : ''}${width <= 450 && width >= 351 ? '4' : ''}${
                  width <= 350 ? '4' : ''
                }${width > 1350 && '2'}  input-select ${labelClassName}`
              }`}
              labelFor={name}
            >
              {label}
            </Label>
          )}
      <StyledHidden className="col-1">
        <Input type='hidden'/>
      </StyledHidden>

          <Select
            colSize={
              colSizeInput ||
              (hideLabel
                ? 12
                : `${width <= 1350 && width >= 751 ? '6 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9'}`)
            }
            addClassName={
              masterInputClassName !== ''
                ? masterInputClassName
                : `${addClassName} ${width <= 350 ? 'col-6 ' : ''}${width > 1350 && 'col-8'}   ${
                    width <= 1350 && width >= 451 ? 'col-8 ' : ''
                  } ${width <= 450 && width >= 351 ? ' col-7 ' : ''}` + (colSizeInput && `col-${colSizeInput}`) ||
                  (hideLabel ? 'col-12' : ` input-select `)
            }
            type={type}
            disabled={disable_check}
            {...field}
            onChange={(value) => {
              onChange &&
                onChange({
                  target: {
                    value,
                    type,
                    name,
                  },
                });
              field.onChange({
                target: {
                  value,
                  type,
                  name,
                },
              });
            }}
            options={options}
            placeholder={placeholder}
          />
          {meta.touched && meta.error && (
            <div className="col-12 d-block invalid-feedback select-input">{meta.error}</div>
          )}
        </FormGroup>
      )}
    </Field>
  );
};

export default InputSelectField;
