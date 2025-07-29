import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';

const InputField = ({
  name,
  inputClassName,
  addLabelClass,
  label,
  width,
  hideLabel,
  type = 'text',
  placeholder = '',
  colSize = '6',
  disable_check,
  noPadding,
  style,
  colSizeLabel,
  colSizeInput,
  onChange,
  inputStyle,
  labelStyle,
  inputValue,
  containerClassName = '',
  masterLabelClassName = '',
  masterInputClassName = '',
}: any) => {
  useEffect(() => {
  }, []);
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
          colSize={colSize}
          noPadding={noPadding}
          style={style}
        >
          {!hideLabel && (
            <Label
              colSize={'5'}
              addClassName={
                masterLabelClassName !== ''
                  ? masterLabelClassName
                  : `col-${colSizeLabel || (width <= 1350 && width >= 451) ? '4 ' : ''}${
                      width <= 450 && width >= 351 ? '5 ' : ''
                    }${width <= 350 && '5 '}${width > 1350 && '2 '}` + addLabelClass
              }
              labelFor={name}
              style={labelStyle}
            >
              {label}
            </Label>
          )}
      <div className=''>
      <Field  name={`${name}_check`}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <div className="col-1 hiddenEle" style={{ padding: 0 }}>
          </div>
        )}
      </Field>
      </div>
          <Input
            inputClassName={inputClassName}
            style={inputStyle}
            colSize={
              colSizeInput ||
              (hideLabel
                ? 12
                : `${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9 '} `)
            }
            addClassName={
              masterInputClassName !== ''
                ? masterInputClassName
                : (colSizeInput && `col-${colSizeInput}`) ||
                  (hideLabel
                    ? 'col-12'
                    : `${width <= 1350 && width >= 451 ? 'col-8 ' : ''}${width <= 450 && width >= 351 ? 'col-7 ' : ''}${
                        width <= 350 ? 'col-7 ' : ''
                      }${width > 1350 && 'col-8'}`)
            }
            disabled={disable_check}
            name={name}
            id={name}
            type={type}
            value={inputValue}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange && onChange(e);
            }}
            {...(type === 'checkbox' ? { checked: field.value } : {})}
            fieldError={meta.error}
            placeholder={placeholder}
          />
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export default InputField;
