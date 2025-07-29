import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import Select from '../Form/Select';

const InputSelectWithCheckboxField = ({
  name,
  width,
  label,
  options = [],
  type = 'string',
  placeholder = '',
  colSize = '6',
}: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup viewWidth={width} colSize={colSize}>
      <Label colSize="2" addClassName={'col-2'} labelFor={name}>
        {label}
      </Label>
      <Field name={`${name}_check`}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <div className="col-1" style={{ padding: 0 }}>
            <Input
              colSize="12"
              addClassName={'col-12'}
              name={`${name}_check`}
              id={`${name}_check`}
              type={'checkbox'}
              {...field}
              checked={field.value}
              fieldError={!!errors[name]}
            />
          </div>
        )}
      </Field>
      <Field name={name}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <Select
            colSize={9}
            addClassName={'col-9'}
            type={type}
            {...field}
            onChange={(value) =>
              field.onChange({
                target: {
                  value,
                  type,
                  name,
                },
              })
            }
            options={options}
            placeholder={placeholder}
          />
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroup>
  );
};

export default InputSelectWithCheckboxField;
