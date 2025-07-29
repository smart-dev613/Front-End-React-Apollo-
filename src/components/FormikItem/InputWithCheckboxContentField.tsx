import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroupContent from '../Form/FormGroupContent';
import Label from '../Form/Label';
import Input from '../Form/Input';
import './ContentMenuStyle.css'

const InputWithCheckboxContentField = ({ name, label, width, type = 'text', placeholder = '', colSize = '11', disable, disable_text, disable_check }: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroupContent viewWidth={width} colSize={colSize}>
      <Label
        colSize={`${width <= 1350 && width >= 751 ? '2 ' : ''}${width <= 750 ? '5 ' : ''}${width > 1350 && '2'}`}
        addClassName={`${width <= 1350 && width >= 451 ? 'col-3 ' : ''}${width <= 450 && width >= 351 ? 'col-4 ' : ''}${
          width <= 350 ? 'col-5 ' : ''
        }${width > 1350 && 'col-2'}`}
        labelFor={name}
      >
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
              addClassName={'col-12 sub-menu'}
              name={`${name}_check`}
              id={`${name}_check`}
              type={'checkbox'}
              disabled={disable_check || disable}
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
          <Input
            colSize={`${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9'}`}
            addClassName={`${width <= 1350 && width >= 451 ? 'col-8 ' : ''}${
              width <= 450 && width >= 351 ? 'col-7 ' : ''
            }${width <= 350 ? 'col-6 ' : ''}${width > 1350 && 'col-9'}`}
            name={name}
            id={name}
            type={type}
            disabled={disable_check || disable}
            {...field}
            fieldError={errors[name]}
            placeholder={placeholder}
          />
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroupContent>
  );
}

export default InputWithCheckboxContentField;
