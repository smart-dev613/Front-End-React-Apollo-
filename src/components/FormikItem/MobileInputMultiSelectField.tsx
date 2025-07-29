import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';

const MobileInputMultiSelectField = ({
  name,
  label,
  options = [],
  type = 'string',
  placeholder = '',
  colSize = '',
  disable,
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
  pageLabel
}: any) => {
  //@ts-ignore
  const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
    //@ts-ignore
    // console.log('o.value', value.some((o) => o.value === "all")
    //@ts-ignore
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
  const [selected, setSelected] = useState([]);

  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup colSize={colSize} noPadding={noPadding} addClassName={addFormGroupClassName} style={{justifyContent:"center"}}>
          {!hideLabel && (
            <Label
              colSize={colSizeLabel || `2`}
              addClassName={`${addLabelClassName !== '' ? addLabelClassName : 'col-2'}`}
              labelFor={name}
            >
              {label}
            </Label>
          )}
          <div>
            {disable ? (
                <div style={{marginLeft:"1rem"}}>
                    {/* <Input
                     colSize={
                     colSizeInput ||
                     (hideLabel
                    ? 12
                       : `${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '10' : ''}${width > 1350 && '9 '} `)
                    }
                addClassName={
                  addSelectClassName
                }
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
              /> */}
                </div>
            ) : (
              <div style={{paddingLeft:"1rem"}}>
              <div className="row">
                <div style={{marginLeft:"1rem"}}>
                <input type="hidden"/>
                <label>{pageLabel}</label>
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
                    textAlign: 'right',
                  }),
                }}
              />
                </div>
              </div>
              </div>
            )}
          </div>
          {meta.touched && meta.error && <div className="col-12 d-block invalid-feedback">{meta.error}</div>}
        </FormGroup>
      )}
    </Field>
  );
};

export default MobileInputMultiSelectField;
