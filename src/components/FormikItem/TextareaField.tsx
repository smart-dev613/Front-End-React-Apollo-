import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Textarea from '../Form/Textarea';

export const TextareaField = ({ name, label, type = 'text', placeholder = '', colSize = '6', disable }: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize} addClassName={'align-items-baseline '}>
          <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
          <Textarea
            colSize='10'
            addClassName={'col-10'}
            disabled={disable}
            name={name}
            id={name}
            type={type}
            {...field}
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

export default TextareaField;
