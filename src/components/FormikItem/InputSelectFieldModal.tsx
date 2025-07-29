import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Select from '../Form/Select';

const InputSelectFieldModal = ({
  name,
  width,
  label,
  options = [],
  type = 'string',
  placeholder = '',
  colSize = '6',
  inputColSize='12',
  disable_check,
  onChange,
  hideLabel,
  smLabelCol,
  addSelectClassName,
  noPadding,
  addLableClassName,
  addFormGroupClassName,
  style = {},
  labelStyle = {},
  fieldStyle = {},
  isFlexOne = false,
}: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup
          style={style}
          viewWidth={width}
          colSize={colSize}
          noPadding={noPadding}
          addClassName={addFormGroupClassName}
        >
          {!hideLabel && (
            <Label
              labelCol={smLabelCol}
              addClassName={addLableClassName}
              labelFor={name}
              style={{ display: 'flex', whiteSpace: 'nowrap', maxWidth: 'unset', ...labelStyle }}
            >
              {label}
            </Label>
          )}
          <Select
            isFlexOne={isFlexOne}
            sidePadding={true}
            addClassName={addSelectClassName}
      
            type={type}
            inputCol={inputColSize}
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

export default InputSelectFieldModal;
