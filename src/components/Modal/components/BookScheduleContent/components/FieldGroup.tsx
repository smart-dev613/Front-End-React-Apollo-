import React, { useMemo } from 'react';

/** Components */
import { Field, useFormikContext } from 'formik';
import Input from '../../../../Form/Input';
import FormGroup from '../../../../Form/FormGroup';
import Label from '../../../../Form/Label';
import Textarea from '../../../../Form/Textarea';
import DatePicker from '../../../../Form/DatePicker';
import Select from '../../../../Form/Select';
import ColourPicker from '../../../../Form/ColourPicker';

const FieldGroup = ({ label, error, children }: any) => {
  return (
    <div className="row">
      <div className="col-4">
        <label>{label}</label>
      </div>
      <div className="col-8">{children}</div>
      <div className="col-12 d-block invalid-feedback">{error}</div>
    </div>
  );
};

export const InputField = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  colSize = '6',
  disable,
  labelCol,
  inputCol,
  value,
  addClassName = 'col-8',
  addClassNameLabel = 'col-2',
}: any) => {
  if(name == 'content_price') {
  }
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize} containerClassName={'p-0'}>
          <Label colSize="2" addClassName={addClassNameLabel} labelFor={name} labelCol={labelCol}>
            {label}
          </Label>
          <Input
            colSize="10"
            inputCol={inputCol}
            addClassName={addClassName}
            disabled={disable}
            name={name}
            id={name}
            type={type}
            {...field}
            fieldError={meta.error}
            placeholder={placeholder}
          />
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export const ColorPickerField = ({ name, label, type = 'color', placeholder = '', colSize = '6' }: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize}>
          <Label colSize="4" addClassName={'col-4'} labelFor={name}>
            {label}
          </Label>
          <ColourPicker
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
        </FormGroup>
      )}
    </Field>
  );
};

export const DateRangeField = ({ name, label, type = 'date', placeholder = '', colSize = '6' }: any) => {
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
    return startDate.format('D/MM/YYYY, h:mm:ss a') + ' - ' + endDate.format('D/MM/YYYY, h:mm:ss a');
  }, [startDate, endDate]);

  const changeDate = (e: any, picker: any) => {
    setValues(
      {
        [`start_${name}`]: picker.startDate,
        [`end_${name}`]: picker.endDate,
      },
      true
    );
  };

  return (
    <FormGroup colSize={colSize}>
      <Label colSize="4" addClassName={'col-4'} labelFor={name}>
        {label}
      </Label>
      <DatePicker
        drops="up"
        onDateApply={changeDate}
        size={8}
        addClassName={'col-8'}
        inForm
        dateMessage={dateMessage}
        startDate={startDate ? startDate.format() : ''}
        endDate={endDate ? endDate.format() : ''}
        fieldError={errors[`start_${name}`] || errors[`end_${name}`]}
      />
      {(errors[`start_${name}`] || errors[`end_${name}`]) && (
        <div className="col-12 d-block invalid-feedback">{errors[`start_${name}`] || errors[`end_${name}`]}</div>
      )}
    </FormGroup>
  );
};

export const InputSelectField = ({
  containerClassName,
  name,
  label,
  options,
  type = 'string',
  placeholder = '',
  colSize = '6',
  disable,
  onChange,
  labelCol,
  inputCol,
  value,
  defaultValue

}: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize} containerClassName={containerClassName}>
          <Label colSize="2" addClassName={'col-2'} labelFor={name} labelCol={labelCol}>
            {label}
          </Label>
          <Select
            colSize={8}
            name={name}
            defaultValue={defaultValue}
            inputCol={inputCol}
            addClassName={'col-8 p-0'}
            type={type}
            disabled={disable}
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
            value={value}
            placeholder={placeholder}
          />
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export const InputWithCheckboxField = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  colSize = '6',
  disable,
  disable_text,
  disable_check,
}: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup colSize={colSize}>
      <Label colSize="2" addClassName={'col-2'} labelFor={name}>
        {label}
      </Label>
      <Field name={`${name}_check`}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <Input
            colSize="2"
            addClassName={'col-2'}
            name={`${name}_check`}
            id={`${name}_check`}
            type={'checkbox'}
            disabled={disable_check || disable}
            {...field}
            checked={field.value}
            fieldError={!!errors[name]}
          />
        )}
      </Field>
      <Field name={name}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <Input
            colSize="8"
            addClassName={'col-8'}
            name={name}
            id={name}
            type={type}
            disabled={disable_text || disable}
            {...field}
            fieldError={errors[name]}
            placeholder={placeholder}
          />
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroup>
  );
};

export const TextareaWithCheckboxField = ({ name, label, type = 'text', placeholder = '', colSize = '6' }: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup colSize={colSize}>
      <Label colSize="2" addClassName={'col-2'} labelFor={name}>
        {label}
      </Label>
      <Field name={`${name}_check`}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <Input
            colSize="2"
            addClassName={'col-2'}
            name={`${name}_check`}
            id={`${name}_check`}
            type={'checkbox'}
            {...field}
            checked={field.value}
            fieldError={!!errors[name]}
          />
        )}
      </Field>
      <Field name={name}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <Textarea
            colSize="8"
            addClassName={'col-8'}
            name={name}
            id={name}
            type={type}
            {...field}
            fieldError={errors[name]}
            placeholder={placeholder}
          />
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroup>
  );
};

export const InputSelectWithCheckboxField = ({
  name,
  label,
  options,
  type = 'string',
  placeholder = '',
  colSize = '6',
}: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup colSize={colSize}>
      <Label colSize="2" addClassName={'col-2'} labelFor={name}>
        {label}
      </Label>
      <Field name={`${name}_check`}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <Input
            colSize="2"
            addClassName={'col-2'}
            name={`${name}_check`}
            id={`${name}_check`}
            type={'checkbox'}
            {...field}
            checked={field.value}
            fieldError={!!errors[name]}
          />
        )}
      </Field>
      <Field name={name}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <Select
            colSize={8}
            addClassName={'col-8'}
            type={type}
            {...field}
            onChange={(value) =>
              field.onChange({
                target: {
                  value,
                  type,
                  name,
                },
              })
            }
            options={options}
            placeholder={placeholder}
          />
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroup>
  );
};

export default FieldGroup;
