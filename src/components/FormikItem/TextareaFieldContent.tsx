import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Textarea from '../Form/Textarea';

export const TextareaFieldContent = ({
  name,
  width,
  label,
  type = 'text',
  placeholder = '',
  style = {},
  textAreaStyle = {},
  colSize = '6',
  disable,
}: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={'12'} addClassName={`align-items-baseline ${width <= 992 ? '' : ''}`} style={style}>
          <Label colSize="2" addClassName={'col-2'} labelFor={name}>
            {label}
          </Label>
          <Textarea
            style={textAreaStyle}
            colSize="9"
            addClassName={width <= 992 ? 'col-9' : 'col-11'}
            disabled={disable}
            name={name}
            id={name}
            type={type}
            {...field}
            fieldError={meta.error}
            placeholder={placeholder}
          />
          {meta.touched && meta.error && <div className="col-8 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export default TextareaFieldContent;
