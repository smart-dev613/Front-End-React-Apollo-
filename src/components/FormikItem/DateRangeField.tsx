import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import DatePicker from '../Form/DatePicker';
import Input from '../Form/Input';
import './util.css'

const DateRangeField = ({ name, label, width, type = 'date', placeholder = '', colSize = '6', noPadding = false, labelClassName="",disable_check }: any) => {
  const { values, errors, setValues }: any = useFormikContext();

  useEffect(()=>{
  },[])

  const startDate = useMemo(() => {
    return values[`start_${name}`];
  }, [values[`start_${name}`]]);

  const endDate = useMemo(() => {
    return values[`end_${name}`];
  }, [values[`end_${name}`]]);

  const dateMessage = useMemo(() => {
    if (!startDate || !endDate) {
      return ''
    }
    return startDate.format('D/MM/YYYY, h:mm:ss a') + ' - ' + endDate.format('D/MM/YYYY, h:mm:ss a')
  }, [startDate, endDate])

  const changeDate = (e: any, picker: any) => {
    setValues({
      ...values,
      [`start_${name}`]: picker.startDate,
      [`end_${name}`]: picker.endDate,
    }, true)
  }

  return (
    <FormGroup viewWidth={width} colSize={colSize} noPadding={noPadding}>
      <Label
        colSize={`${width <= 1350 && width >= 751 ? '4 ' : ''}${width <= 750 ? '5 ' : ''}${width > 1350 && '3'}`}
        addClassName={`${width <= 1350 && width >= 451 ? 'col-4 ' : ''}${width <= 450 && width >= 351 ? 'col-4 ' : ''}${
          width <= 350 ? 'col-4 ' : ''
        }${width > 1350 && 'col-2 '}  input-select ${labelClassName?labelClassName:""}`}
        labelFor={name}
      >
        {label}
      </Label>
          <div className="col-1 hiddenEle" style={{ padding: 0 ,visibility:"hidden"}}>
            <Input
              colSize="4"
              addClassName={'col-4'}
              name={`${name}_check`}
              id={`${name}_check`}
              type={'checkbox'}
              // disabled={disable_check || disable}
              fieldError={!!errors[name]}
            />
          </div>
      <DatePicker
        drops="down"
        onDateApply={changeDate}
        size={`${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9'}`}
        addClassName={`${width <= 350 ? 'col-7 ' : ''}${width > 1350 && 'col-8'}   ${
          width <= 1350 && width >= 451 ? 'col-8 ' : ''
        } ${width <= 450 && width >= 351 ? ' col-7 ' : ''}`}
        inForm
        dateMessage={dateMessage}
        startDate={startDate ? startDate.format() : ''}
        endDate={endDate ? endDate.format() : ''}
        fieldError={errors[`start_${name}`] || errors[`end_${name}`]}
        disabled={disable_check}
      />
      {(errors[`start_${name}`] || errors[`end_${name}`]) && (
        <div className="col-12 d-block invalid-feedback">{errors[`start_${name}`] || errors[`end_${name}`]}</div>
      )}
    </FormGroup>
  );
}

export default DateRangeField;
