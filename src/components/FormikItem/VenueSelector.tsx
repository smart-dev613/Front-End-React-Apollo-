import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Select from '../Form/Select';
import VenueSelect from '../Form/VenueSelect';
import './util.css';
import Input from '../Form/Input';
import styled from 'styled-components';

const StyledHidden = styled.div`
  padding: 0;
  visibility: hidden;

  @media only screen and (min-width: 330px) and (max-width: 475px) {
    display: none !important;
  }
`;

const VenueSelector = ({
  containerClassName,
  addLabelClassName,
  addInputClassName,
  name,
  width,
  label,
  options = [],
  type = 'string',
  placeholder = '',
  disable_check,
  onChange,
  hideLabel,
  value,
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
          
        >
          <div className={addLabelClassName}>
          {!hideLabel && (
            <Label
             
              labelFor={name}
            >
              {label}
            </Label>
          )}
          </div>
          {/* <StyledHidden className="col-1">
            <Input type="hidden" />
          </StyledHidden> */}

          

          <VenueSelect
           
            addClassName={addInputClassName}
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
            value={value}
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

export default  VenueSelector
;
