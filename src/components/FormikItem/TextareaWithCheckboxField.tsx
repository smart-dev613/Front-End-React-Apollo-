import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import Textarea from '../Form/Textarea';

const TextareaWithCheckboxField = ({ name, width, label, type = 'text', disable_check, placeholder = '', colSize = '6' }: any) => {
  const { errors }: any = useFormikContext();


  return (
    <FormGroup viewWidth={width} colSize={colSize}>
      <Label
        colSize={`${width <= 1350 && width >= 751 ? '3 ' : ''}${width <= 750 ? '4 ' : ''}${width > 1350 && '2'}`}
        addClassName={`${width <= 1350 && width >= 451 ? 'col-3 ' : ''}${width <= 450 && width >= 351 ? 'col-4 ' : ''}${
          width <= 350 ? ' col-5 ' : ''
        }${width > 1350 && 'col-2 '}`}
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
              disabled={disable_check}
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
          <Textarea
            colSize={`${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9'}`}
            addClassName={`${width <= 1350 && width >= 451 ? 'col-8 ' : ''}${
              width <= 450 && width >= 351 ? 'col-7 ' : ''
            }${width <= 350 ? 'col-6 ' : ''}${width > 1350 && 'col-9'} ${disable_check ? ' disabled_color ' : ''}`}
            disabled={disable_check}
            name={name}
            id={name}
            type={type}
            {...field}
            fieldError={errors[name]}
            placeholder={placeholder}
          />
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroup>
  );
}

export default TextareaWithCheckboxField;
