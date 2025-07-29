import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import DatePicker from '../Form/DatePicker';

const DateRangeFieldModal = ({
  name,
  label,
  maxDate,
  minDate,
  formClassName,
  containerClassNames,
  labelClassNames,
  inputClassNames,
  inputSmallSize = 8,
  onChange,
}: any) => {
  const { values, errors, setValues }: any = useFormikContext();

  const startDate = useMemo(() => {
    return values[`start_${name}`];
  }, [values[`start_${name}`]]);

  const endDate = useMemo(() => {
    return values[`end_${name}`];
  }, [values[`end_${name}`]]);

  const dateMessage = useMemo(() => {
    if (!startDate || !endDate) {
      return '';
    }
    return startDate.format('D/MM/YYYY') + ' - ' + endDate.format('D/MM/YYYY');
  }, [startDate, endDate]);

  const changeDate = (e: any, picker: any) => {
    setValues(
      {
        ...values,
        [`start_${name}`]: picker.startDate,
        [`end_${name}`]: picker.endDate,
      
      },
      true
    );

    // 3. Call onDateApply if provided
    onChange(e, picker);
  };

  return (
    <FormGroup addClassName={formClassName}>
      <div className={containerClassNames}>
        <Label addClassName={labelClassNames} labelFor={name}>
          {label}
        </Label>
        <DatePicker
          drops="up"
          onDateApply={changeDate}
          size={inputSmallSize}
          addClassName={inputClassNames}
          inForm
          dateMessage={dateMessage}
          startDate={startDate ? startDate.format() : new Date()}
          endDate={endDate ? endDate.format() : ''}
          maxDate={maxDate}
          minDate={minDate}
          fieldError={errors[`start_${name}`] || errors[`end_${name}`]}
        />
      </div>
      {(errors[`start_${name}`] || errors[`end_${name}`]) && (
        <div className="col-12 d-block invalid-feedback">{errors[`start_${name}`] || errors[`end_${name}`]}</div>
      )}
    </FormGroup>
  );
};

export default DateRangeFieldModal;
