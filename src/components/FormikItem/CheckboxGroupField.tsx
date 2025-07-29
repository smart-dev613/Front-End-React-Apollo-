import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';

const CheckboxGroupField = ({ name, label, hideLabel, type = 'checkbox', placeholder = '', colSize = '6', disable, noPadding, style, colSizeLabel, colSizeInput, value }: any) => {
  const { values }: any = useFormikContext();

  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize} noPadding={noPadding} style={style} >
          <Input
            colSize={colSizeInput || 2}
            addClassName={(colSizeInput && ` col-${colSizeInput} `) || 'col-2'}
            disabled={disable}
            name={name}
            id={`${name}.${value}`}
            type={type}
            {...field}
            checked={values[name] && values[name]?.includes(value)}
            value={value}
            fieldError={meta.error}
            placeholder={placeholder}
          />
          {!hideLabel && <Label colSize={colSizeLabel || 10} addClassName={`col-${colSizeLabel || 10}`} labelFor={`${name}.${value}`}>{label}</Label>}
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

export default CheckboxGroupField;
