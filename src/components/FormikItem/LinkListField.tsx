import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import InputField from './InputField';

const LinkListField = ({ name, width, label, placeholder, colSize = '6', style = {}, containerStyle = {} }: any) => {
  const { values }: any = useFormikContext();

  return (
    <FieldArray
      name={name}
      render={(arrayHelper: any) => {
        return (
          <FormGroup colSize={'12'} addClassName={'align-items-baseline'} style={style}>
            <Label colSize="2" addClassName={'col-2'} labelFor={name}>
              {label}
            </Label>
            <div className="col-md-10" style={{ margin: '0px', paddingLeft: 0, ...containerStyle }}>
              {(values[name] || []).map((item: any, idx: number) => (
                <div
                  className="col-sm-reverse mb-0 "
                  style={{
                    borderTop: width < 992 && '1px solid purple',
                    display: 'flex',
                    flexDirection: width > 992 ? 'row' : 'column',
                    justifyContent: 'flex-start',
                    alignItems: width > 992 ? 'center' : 'flex-start',
                    gap: width > 992 ? 15 : 2,
                  }}
                >
                  <InputField
                    // containerClassName="col-md-5 col-sm-5 p-0"
                    name={`${name}.${idx}.link`}
                    hideLabel={true}
                    style={{ margin: 0, maxWidth: width > 992 ? '40%' : '100%', flex: 1 }}
                    defaultValue={'https://'}
                    noPadding
                  />
                  <Label labelCol={'1'} addClassName={'col-sm-1'} labelFor={name}>
                    {width > 992 && 'Label'}
                  </Label>

                  <InputField
                    containerClassName="col-sm-4 p-0"
                    name={`${name}.${idx}.name`}
                    hideLabel={true}
                    style={{ margin: 0, maxWidth: width > 992 ? '30%' : '100%', }}
                    placeholder={'Enter link label...'}
                    noPadding
                  />
                  <button
                    type="button"
                    className="btn btn-red"
                    style={{ position: 'absolute', right: '0.5px', alignSelf: 'flex-end', marginTop: width > 992 ? 0 : 1 }}
                    onClick={() => {
                      arrayHelper.remove(idx);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              <div className="row flex-row-reverse" style={{ marginRight: 0 }}>
                <button
                  type="button"
                  className="btn btn-purple"
                  onClick={() => {
                    arrayHelper.push({
                      name: 'https://www.',
                      link: 'https://www.',
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </FormGroup>
        );
      }}
    />
  );
};

export default LinkListField;
