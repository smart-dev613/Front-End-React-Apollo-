import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';

const InputMultiSelectField = ({
  name,
  label,
  options = [],
  groupHeading,
  type = 'string',
  placeholder = '',
  disable,
  onChange,
  hideLabel,
  setFieldValue,
  addFormGroupClassName,
  addLabelClassName = '',
  addSelectClassName,
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
          return `${pageLabel} All`;
        }
        else if (value && value.length == 0) {
          return `${pageLabel} ...`;
        }
        else {
          return `  ${value ? value.length : ''} selected`;
        }
      } else {
        return placeholder && placeholder != '' ? placeholder : `${pageLabel}...`;
      }
    } catch (error) {
      return 'Select...';
    }
  };
  
  function _onChange(value: any, event: any, field:any){

    let selectedValues =[]

    if (event.action === "select-option" && event.option.value?.toLowerCase() === "all") {
      selectedValues = options;
    
    } else if (
      event.action === "deselect-option" &&
      event.option.value?.toLowerCase() === "all"
    ) {
      selectedValues = [];
    } else if (event.action === "deselect-option") {
      
    // } else if (value.length ===  options.length - 1) {
    //   //selectedValues = options;
    } else {
      selectedValues = value;
    }



    field.onChange({
      target: {
        value: selectedValues,
        type,
        name,
      },
    });

    onChange(event)

  }
  
  

  return (
    <Field name={name}>
      {({
        field,
        // form,
        meta,
      }: any) => (
        <FormGroup  addClassName={addFormGroupClassName} >
          {!hideLabel && (
            <Label
              addClassName={`${addLabelClassName}`}
              labelFor={name}
            >
              {label}
            </Label>
          )}

          <div className={addSelectClassName} style={{
          }}>
            {disable ? (
              <Input
               
                addClassName={
                  addSelectClassName
                }
                disabled={disable}
                name={name}
                id={name}
                type={type}
                inputValue={(field?.value || [])?.length ? `${(field?.value || [])?.length} selected` : ''}
                
              
                {...(type === 'checkbox' ? { checked: field.value } : {})}
                fieldError={meta.error}
                placeholder={pageLabel}
                
              />
            ) : (
           
              
              <ReactMultiSelectCheckboxes
                placeholder={placeholder}
                options={options}
                disabled={disable}
                getDropdownButtonLabel={getDropdownButtonLabel}
                groupHeading={groupHeading}
                className="checkBox"
                rightAligned={true}
                {...field} o

                onChange={(value: any, event: any) => {
                    _onChange(value, event, field)

                 
                }}
          
                styles={{
                  input: () => ({
                    width: '100%',
                    minWidth: "150px"
                  }),
                  dropdownButton: () => ({
                    color: '#212529',
                    width: '100%',
                    minWidth: "150px",
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(0,0,0,.2)',
                    padding: '4px 8px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    textAlign: 'left',
                    height:"calc(1.5em + .75rem + 2px)",
                    zIndex: "999px",
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

export default InputMultiSelectField;
