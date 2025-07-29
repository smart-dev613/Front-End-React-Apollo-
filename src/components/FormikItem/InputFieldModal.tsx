import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';

const InputFieldModal = ({
  name,
  containerClassName,
  label,
  hideLabel,
  type = 'text',
  placeholder = '',
  disabled,
  inputStyle = {},
  onChange,
  addLabelClassName,
  addInputClassName,
  inputValue,
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
         
        >
          {!hideLabel && (
            <Label addClassName={addLabelClassName} labelFor={name} style={{ whiteSpace: 'noWrap' }}>
              {label}
            </Label>
          )}
          <div className={addInputClassName}>
          <Input
            disabled={disabled}
            name={name}
            id={name}
            type={type}
            inputValue={inputValue}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange && onChange(e);
            }}
            {...(type === 'checkbox' ? { checked: field.value } : {})}
            fieldError={meta.error}
            placeholder={placeholder}
          />
          </div>
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export default InputFieldModal;
