import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';

const InputField = ({ name, label, hideLabel, type = 'text', placeholder = '', colSize = '6', disable }: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize}>
          {!hideLabel && <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>}
          <Input
            colSize={hideLabel ? '12' : '10'}
            addClassName={hideLabel ? 'col-12' : 'col-10'}
            disabled={disable}
            name={name}
            id={name}
            type={type}
            {...field}
            {...(type ==='checkbox' ? { checked: field.value } : {})}
            fieldError={meta.error}
            placeholder={placeholder}
          />
          {
            meta.touched && meta.error && (
              <div className="col-12 d-block invalid-feedback">
                {meta.error}
              </div>
            )
          }
        </FormGroup>
      )}
    </Field>
  )
}

export default InputField;
