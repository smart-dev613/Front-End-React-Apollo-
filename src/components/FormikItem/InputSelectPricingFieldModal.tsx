import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Select from '../Form/Select';

const InputSelectPricingFieldModal = ({
  name,
  options = [],
  label,
  type = 'string',
  onChange,
  disable_check,
  hideLabel,
  placeholder,
  containerClassName,
  addLabelClassName,
  addInputClassName,
}: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup containerClassName={containerClassName} addClassName="field-container">
          {!hideLabel && (
            <Label addClassName={addLabelClassName ? addLabelClassName : 'field-label'} labelFor={name}>
              {label}
            </Label>
          )}
          <div className={addInputClassName}>
            <Select
              addClassName="field-input"
              type={type}
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
          </div>
          {meta.touched && meta.error && (
            <div className="col-12 d-block invalid-feedback select-input">{meta.error}</div>
          )}
        </FormGroup>
      )}
    </Field>
  );
};

export default InputSelectPricingFieldModal;
