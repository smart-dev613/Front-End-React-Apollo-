import React, { useMemo } from 'react';

/** Components */
import { Field, useFormikContext } from 'formik';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'
import TimePicker from 'rc-time-picker'
import Input from '../../../../Form/Input'
import FormGroup from '../../../../Form/FormGroup'
import Label from '../../../../Form/Label'
import Textarea from '../../../../Form/Textarea'
import DatePicker from '../../../../Form/DatePicker'
import Select from '../../../../Form/Select'
import ColourPicker from '../../../../Form/ColourPicker'

/** Utils */
import moment from 'moment';

/** Styles */
import 'rc-time-picker/assets/index.css';

const FieldGroup = ({ label, error, children }: any) => {
  return (
    <div className="row">
      <div className="col-4">
        <label>{label}</label>
      </div>
      <div className="col-8">
        {children}
      </div>
      <div className="col-12 d-block invalid-feedback">
        {error}
      </div>
    </div>
  )
}

export const InputField = ({ name, label, type = 'text', placeholder = '', colSize = '6', disable }: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize}>
          <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
          <Input
            colSize='10'
            addClassName={'col-10'}
            disabled={disable}
            name={name}
            id={name}
            type={type}
            {...field}
            fieldError={meta.error}
            placeholder={placeholder}
          />
          {
            meta.touched && meta.error && (
              <div className="col-12 d-block invalid-feedback">
                {meta.error}
              </div>
            )
          }
        </FormGroup>
      )}
    </Field>
  )
}

export const ColorPickerField = ({ name, label, type = 'color', placeholder = '', colSize = '6' }: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize}>
          <Label colSize='4' addClassName={'col-4'} labelFor={name}>{label}</Label>
          <ColourPicker
            colour={field.value}
            onChange={(color) => {
              field.onChange({
                target: {
                  value: color.hex,
                  type,
                  name
                }
              })
            }}
          />
          {
            meta.touched && meta.error && (
              <div className="col-12 d-block invalid-feedback">
                {meta.error}
              </div>
            )
          }
        </FormGroup>
      )}
    </Field>
  )
}

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
      return ''
    }
    return startDate.format('D/MM/YYYY, h:mm:ss a') + ' - ' + endDate.format('D/MM/YYYY, h:mm:ss a')
  }, [startDate, endDate])

  const changeDate = (e: any, picker: any) => {
    setValues({
      [`start_${name}`]: picker.startDate,
      [`end_${name}`]: picker.endDate,
    }, true)
  }

  return (
    <FormGroup colSize={colSize}>
      <Label colSize='4' addClassName={'col-4'} labelFor={name}>{label}</Label>
      <DatePicker
        drops='up'
        onDateApply={changeDate}
        size={8}
        addClassName={'col-8'}
        inForm
        dateMessage={dateMessage}
        startDate={startDate ? startDate.format() : ''}
        endDate={endDate ? endDate.format() : ''}
        fieldError={(errors[`start_${name}`] || errors[`end_${name}`])}
      />
      {
        (errors[`start_${name}`] || errors[`end_${name}`]) && (
          <div className="col-12 d-block invalid-feedback">
            {(errors[`start_${name}`] || errors[`end_${name}`])}
          </div>
        )
      }
    </FormGroup>
  )
}

export const TimePickerField = ({ name, label, type = 'time', placeholder = '', colSize = '6' }: any) => {
  const { values, errors, setValues }: any = useFormikContext();
  const format = 'HH:mm a';

  const changeTimeStart = (timeSelected: any) => {
    setValues({
      ...values,
      [`start_${name}`]: timeSelected,
    }, true)
  }

  const changeTimeEnd = (timeSelected: any) => {
    setValues({
      ...values,
      [`end_${name}`]: timeSelected,
    }, true)
  }

  return (
    <FormGroup colSize={colSize}>
      <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
      <div className={`col-10`} style={{ padding: 0, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <TimePicker
          showSecond={false}
          value={values[`start_${name}`]}
          className="xxx"
          onChange={changeTimeStart}
          format={format}
          use12Hours
          inputReadOnly
        />
        <span>-</span>
        <TimePicker
          showSecond={false}
          value={values[`end_${name}`]}
          className="xxx"
          onChange={changeTimeEnd}
          format={format}
          use12Hours
          inputReadOnly
        />
      </div>
      {
        (errors[`start_${name}`] || errors[`end_${name}`]) && (
          <div className="col-12 d-block invalid-feedback">
            {(errors[`start_${name}`] || errors[`end_${name}`])}
          </div>
        )
      }
    </FormGroup>
  )
}

export const InputSelectField = ({ name, label, options, type = 'string', placeholder = '', colSize = '6', disable, onChange }: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize}>
          <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
          <Select
            colSize={10}
            addClassName={'col-10 p-0'}
            type={type}
            disabled={disable}
            {...field}
            onChange={(value) => {
              onChange && onChange({
                target: {
                  value,
                  type,
                  name
                }
              })
              field.onChange({
                target: {
                  value,
                  type,
                  name
                }
              })
            }}
            options={options}
            placeholder={placeholder}
          />
          {
            meta.touched && meta.error && (
              <div className="col-12 d-block invalid-feedback">
                {meta.error}
              </div>
            )
          }
        </FormGroup>
      )}
    </Field>
  )
}

export const InputMultiSelectField = ({ name, label, options, type = 'string', placeholder = '', colSize = '6', disable, onChange }: any) => {
  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize}>
          <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
          <div className={`col-10`} style={{ padding: 0 }}>
            <ReactMultiSelectCheckboxes
              placeholder={placeholder}
              options={options}
              disabled={disable}
              {...field}
              onChange={(value: any) => {
                onChange && onChange({
                  target: {
                    value,
                    type,
                    name
                  }
                })
                field.onChange({
                  target: {
                    value,
                    type,
                    name
                  }
                })
              }}styles={{
                dropdownButton: () => ({
                  color: '#212529',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(0,0,0,.2)',
                  padding: '4px 8px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  textAlign: 'left',
                })
              }}
            />
          </div>
          {
            meta.touched && meta.error && (
              <div className="col-12 d-block invalid-feedback">
                {meta.error}
              </div>
            )
          }
        </FormGroup>
      )}
    </Field>
  )
}

export const InputWithCheckboxField = ({ name, label, type = 'text', placeholder = '', colSize = '6', disable, disable_text, disable_check }: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup colSize={colSize}>
      <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
      <Field name={`${name}_check`}>
        {({
          field,
          // form,
          // meta,
        }: any) => (
          <Input
            colSize='2'
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
          // form,
          // meta,
        }: any) => (
          <Input
            colSize='8'
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
      {
        errors[name] && (
          <div className="col-12 d-block invalid-feedback">
            {errors[name]}
          </div>
        )
      }
    </FormGroup>
  )
}

export const TextareaWithCheckboxField = ({ name, label, type = 'text', placeholder = '', colSize = '6' }: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup colSize={colSize}>
      <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
      <Field name={`${name}_check`}>
        {({
          field,
          // form,
          // meta,
        }: any) => (
          <Input
            colSize='2'
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
          // form,
          // meta,
        }: any) => (
          <Textarea
            colSize='8'
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
      {
        errors[name] && (
          <div className="col-12 d-block invalid-feedback">
            {errors[name]}
          </div>
        )
      }
    </FormGroup>
  )
}

export const InputSelectWithCheckboxField = ({ name, label, options, type = 'string', placeholder = '', colSize = '6' }: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup colSize={colSize}>
      <Label colSize='2' addClassName={'col-2'} labelFor={name}>{label}</Label>
      <Field name={`${name}_check`}>
        {({
          field,
          // form,
          // meta,
        }: any) => (
          <Input
            colSize='2'
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
          // form,
          // meta,
        }: any) => (
          <Select
            colSize={8}
            addClassName={'col-8'}
            type={type}
            {...field}
            onChange={(value) => field.onChange({
              target: {
                value,
                type,
                name
              }
            })}
            options={options}
            placeholder={placeholder}
          />
        )}
      </Field>
      {
        errors[name] && (
          <div className="col-12 d-block invalid-feedback">
            {errors[name]}
          </div>
        )
      }
    </FormGroup>
  )
}

export default FieldGroup;
