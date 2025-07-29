import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import InputField from './InputField';

const KeywordsField = ({ name, width, label, placeholder, colSize = '6', containerStyle = {} }: any) => {
  const { values }: any = useFormikContext();
  const [inputValue, setInputValue] = useState('');

  return (
    <FormGroup colSize={colSize}>
      <FieldArray
        name={name}
        render={(arrayHelper: any) => (
          <>
            <div className="col-12">
              <div className="row position-relative">
                <Label addClassName=" col-2 mb-2" labelCol={'2'} labelFor={name}>
                  {label}
                </Label>
                <div className=" col-md-10 p-0" style={{ margin: '0px', paddingLeft: 0, ...containerStyle }}>
                  <div className={' '} style={{ display: 'flex', maxWidth: '100%', flex: 1, gap: 15 }}>
                    <input
                      type="text"
                      name={`dummy_${name}`}
                      id={`dummy_${name}`}
                      style={{ margin: 0, maxWidth: '83%', flex: 1 }}
                      className={`form-control input-design col-md-12 col-sm-12 p-2`}
                      placeholder={'Keywords'}
                      onChange={(e: any) => {
                        setInputValue(e.target.value);
                      }}
                      value={inputValue}
                    />
                    <button
                      type="button"
                      className="btn btn-purple"
                      style={{position: 'absolute', right: '1px'}}
                      onClick={() => {
                        if (inputValue) {
                          arrayHelper.push(inputValue);
                          setInputValue('');
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap" style={{maxWidth: '83%'}}>
                    {values[name].length > 0 &&
                      values[name].map((keyword: any, idx: number) => (
                        <div className="keyword-item ml-1">
                          #{keyword}
                          <span
                            className="remove-keyword"
                            onClick={() => arrayHelper.remove(idx)}
                            style={{ color: '#c83f3f', marginLeft: 5 }}
                          >
                            <FontAwesomeIcon icon="times" />
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      />
    </FormGroup>
  );
};

export default KeywordsField;
