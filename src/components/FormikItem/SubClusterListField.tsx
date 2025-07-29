import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import InputField from './InputField';

const SubClusterListField = ({ name, width, label, placeholder, colSize = '6' }: any) => {
  const { values }: any = useFormikContext();

  return (
    <FieldArray
      name={name}
      render={(arrayHelper: any) => {
        return (
          <>
            <FormGroup colSize={colSize} noPadding={true} addClassName={'align-items-baseline'}>
              <div className="col-12 col-sm-4" style={{ padding: 0 }}>
                <FormGroup colSize={'12'} noPadding={true} addClassName={'justify-content-between'}>
                  <Label colSize="12" addClassName={'col-10 col-sm-12'} labelFor={name}>
                    {label}
                  </Label>
                  <div className="col-2 d-sm-none">
                    <button
                      type="button"
                      className="btn btn-purple content-link-btn"
                      onClick={() => {
                        arrayHelper.push('');
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </FormGroup>
              </div>
              <div className={'col-12 col-sm-8'} style={{ padding: 0 }}>
                {(values[name] || []).map((item: any, idx: number) => (
                  <FormGroup colSize={colSize} noPadding={true}>
                    <InputField
                      containerClassName="col-4"
                      name={`${name}.${idx}`}
                      colSize={10}
                      hideLabel={true}
                      noPadding={true}
                      style={{ margin: 0 }}
                    />
                    <div className="col-2" style={{ padding: 0, textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-red"
                        onClick={() => {
                          arrayHelper.remove(idx);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </FormGroup>
                ))}
                <FormGroup addClassName=" justify-content-end content-plus-div" colSize={colSize} noPadding={true}>
                  <button
                    type="button"
                    className="btn btn-purple content-link-btn d-none d-sm-block"
                    onClick={() => {
                      arrayHelper.push('');
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </FormGroup>
              </div>
            </FormGroup>
          </>
        );
      }}
    />
  );
};

export default SubClusterListField;
