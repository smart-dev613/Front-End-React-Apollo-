import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroupFontColor from '../Form/FormGroupFontColor';
import Label from '../Form/Label';
import ColourPicker from '../Form/ColourPicker';

const ColorPickerFontField = ({ name, width, label, type = 'color', disable_check, placeholder = '', colSize = '6' }: any) => {


  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroupFontColor
          viewWidth={width}
          colSize={`${width <= 1240  && width <= 710 && width >= 367 ? '13' : ''}${width <=366 ? '12' : ''}`}
        >
          <Label
            colSize={`${width <= 1345 ? '9' : ''}${width < 1500 && width > 1345 ? '8' : ''}`}
            addClassName={`${width <= 1350 && width >= 1001 ? 'col-6' : ''}${width <= 575 && width >= 367 ? 'col-9' : ''}${width <= 366 ? 'col-8' : ''}${
              width > 1350 ? 'col-6' : ''
            }`}
            labelFor={name}
          >
            {label}
          </Label>
          <ColourPicker
            disabled={disable_check}
            colour={field.value}
            onChange={(color) => {
              field.onChange({
                target: {
                  value: color.hex,
                  type,
                  name,
                },
              });
            }}
          />
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroupFontColor>
      )}
    </Field>
  );
}

export default ColorPickerFontField;
