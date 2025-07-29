import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';

const SingleRowInputWithCheckboxField = ({
  name,
  label,
  width,
  type = 'text',
  placeholder = '',
  colSize = '12',
  disable,
  disable_text,
  disable_check,
  imageIcon = false,
  addClassName,
  cb = null,
}: any) => {
  const { errors }: any = useFormikContext();

  return (
    <FormGroup viewWidth={width} colSize={colSize}>
      <Label
        colSize={`${width <= 1350 && width >= 751 ? '2 ' : ''}${width <= 750 ? '2 ' : ''}${width > 1350 && '2 '}`}
        addClassName={`${width <= 1350 && width >= 451 ? 'col-2 ' : ''}${width <= 450 && width >= 351 ? 'col-2 ' : ''}${
          width <= 350 ? 'col-5 ' : ''
        }${width > 1350 && 'col-3'} ${addClassName}`}
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
          <div className="col-2" style={{ padding: 0 }}>
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
      <Field name={name}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <>
            <Input
              colSize={`${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9'}`}
              addClassName={`${width <= 1350 && width >= 451 ? 'col-8 ' : ''}${
                width <= 450 && width >= 351 ? 'col-7 ' : ''
              }${width <= 350 ? 'col-6 ' : ''}${width > 1350 && 'col-6'}`}
              name={name}
              id={name}
              type={type}
              disabled={disable_check || disable}
              {...field}
              fieldError={errors[name]}
              placeholder={placeholder}
            />
            <div style={{ position: 'relative' }}>
              <>
                {cb !== null && (
                  <input
                    id={name + '_file'}
                    type="file"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                    }}
                    onChange={(e) => cb(e, name)}
                    disabled={disable_check || disable}
                  />
                )}
              </>
              {imageIcon ? (
                field.value ? (
                  <div>
                    <img src={field?.value} style={{ maxHeight: '100px', maxWidth: '200px' }} />
                  </div>
                ) : (
                  <div style={{ color: 'rgb(230,230,230)' }}>
                    <FontAwesomeIcon icon={faImage} size={'9x'} />
                    {/* <span className="text-center" style={{position: "relative", height: "25px",  width:"25px", top: "20px", left: "-27px",background:"red", float: "right", color: "white"}}><FontAwesomeIcon icon={faTimes} size={"sm"} /></span> */}
                  </div>
                )
              ) : (
                ''
              )}
            </div>
          </>
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroup>
  );
};

export default SingleRowInputWithCheckboxField;
