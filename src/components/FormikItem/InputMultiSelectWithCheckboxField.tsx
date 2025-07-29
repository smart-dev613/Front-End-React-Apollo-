import React from 'react';

/** Components */
import { Field, useFormikContext } from 'formik';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';

const InputMultiSelectWithCheckboxField = ({
  name,
  label,
  options = [],
  type = 'string',
  placeholder = '',
  colSize = '12',
  disable,
  disable_check,
  onChange,
  noPadding,
  width,
  colSizeLabel,
  colSizeInput,
  hideLabel,
  addFormGroupClassName,
  addLabelClassName = '',
  addSelectClassName,
  style = {},
}: any) => {
  const { errors }: any = useFormikContext();

  const getDropdownButtonLabel = ({ value }) => {
    try {
      if (value) {
        if (value && value.some((o: any) => o.value === 'all')) {
          return `All`;
        } else {
          return `${value ? value.length : ''} selected `;
        }
      } else {
        return placeholder && placeholder != '' ? placeholder : 'Select...';
      }
    } catch (error) {
      return 'Select...';
    }
  };
  return (
    <Field name={name}>
      {({ field, meta }: any) => (
        <FormGroup colSize={colSize} noPadding={noPadding} addClassName={addFormGroupClassName} style={style}>
          {!hideLabel && (
            <>
              <Label
                colSize={colSizeLabel || `1`}
                addClassName={`${addLabelClassName !== '' ? addLabelClassName : 'col-2'}`}
                labelFor={name}
              >
                {label}
              </Label>
              <Field name={`${name}_check`}>
                {({
                  field,
                }: // form,
                // meta,
                any) => (
                  <div className="col-1" style={{ padding: 0 }}>
                    <Input
                      colSize="12"
                      addClassName={'col-12'}
                      name={`${name}_check`}
                      id={`${name}_check`}
                      type={'checkbox'}
                      disabled={disable_check || disable}
                      {...field}
                      checked={field.value}
                      fieldError={!!errors[name]}
                    />
                  </div>
                )}
              </Field>
            </>
          )}
          <div className={addSelectClassName} style={{ padding: 0 }}>
            {disable ? (
              <Input
                colSize={
                  colSizeInput ||
                  (hideLabel
                    ? 12
                    : `${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9 '} `)
                }
                addClassName={addSelectClassName}
                disabled={disable}
                name={name}
                id={name}
                type={type}
                inputValue={(field.value || []).length ? `${(field.value || []).length} selected` : ''}
                onChange={(e) => {
                  onChange && onChange(e);
                }}
                {...(type === 'checkbox' ? { checked: field.value } : {})}
                fieldError={meta.error}
                placeholder={placeholder}
              />
            ) : (
              <ReactMultiSelectCheckboxes
                placeholder={placeholder}
                options={options}
                disabled={disable}
                getDropdownButtonLabel={getDropdownButtonLabel}
                className="checkBox"
                {...field}
                onChange={(value: any) => {
                  field.onChange({
                    target: {
                      value,
                      type,
                      name,
                    },
                  });
                  onChange &&
                    onChange({
                      target: {
                        value,
                        type,
                        name,
                      },
                    });
                }}
                styles={{
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
                  }),
                }}
              />
            )}
          </div>
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export default InputMultiSelectWithCheckboxField;
