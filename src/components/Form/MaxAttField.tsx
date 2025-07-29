import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import { useDispatch, useSelector } from 'react-redux';
import { maxAtt } from '../../store/att/action';
import { AppState } from '../../store/root';

const MaxAttField = ({
  name,
  containerClassName,
  label,
  width,
  hideLabel,
  type = 'text',
  placeholder = '',
  colSize = '6',
  disabled,
  noPadding,
  style,
  inputStyle = {},
  colSizeLabel,
  colSizeInput,
  onChange,
  addLabelClassName,
  addInputClassName,
  value,
}: any) => {

    const maxAtt = useSelector((state:AppState) => state.att.max_att);
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
          {!hideLabel && (
            <Label addClassName={addLabelClassName} labelFor={name} style={{ whiteSpace: 'noWrap' }}>
              {label}
            </Label>
          )}
          <Input
            style={inputStyle}
            inputClassName={addInputClassName}
            disabled={disabled}
            name={name}
            id={name}
            type={type}
            inputValue={value}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange && onChange(e);
            }}
            {...(type === 'checkbox' ? { checked: field.value } : {})}
            fieldError={meta.error}
            placeholder={placeholder}
            value={value}
          />
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export default MaxAttField;
