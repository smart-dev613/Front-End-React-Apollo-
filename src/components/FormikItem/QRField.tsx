import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faQrcode, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { clear } from 'console';
import { useDispatch, useSelector } from 'react-redux';
// import { setAtt } from '../../../../store/att/action';
import {set_first,set_last,set_avatar,set_company} from '../../store/qr/action';


const QRField = ({
  name,
  options = [],
  label,
  width,
  type = 'text',
  placeholder = '',
  colSize = '6',
  disable,
  onChange,
  disable_text,
  disable_check,
  imageIcon = false,
  addClassName,
  cb = null,
}: any) => {
  const { errors }: any = useFormikContext();

  const [selectedOptions, setSelectedOptions] = useState<any>(()=>{
    localStorage.getItem('QR_Selected');
  });
    const dispatch = useDispatch();


  useEffect(()=>{
    // if (localStorage.getItem('QR_Selected'))
    // {
      // selectedOptions:(param:any) => (localStorage.getItem('QR_Selected'))
    // }else{
      setSelectedOptions([{ label: 'All', value: '*' }, ...options]);
    // }
    localStorage.setItem('QR_Selected',JSON.stringify(selectedOptions))
  },[disable_check])


  //e:React.FormEvent<HTMLFormElement>
  const onChangeHandler = (value: any )=>{
    // e.preventDefault();
    const qr_checked =[]; 
    localStorage.setItem('qr_checked',JSON.stringify(value.value))
    for(let val in value){
      if(value[val].value=='firstName'){
        // alert(value[val])
        dispatch(set_first(true))
      }
      if(value[val].value=='lastName'){
        dispatch(set_last(true))
      }
      if(value[val].value=='avatar'){
        dispatch(set_avatar(true))
      }
      if(value[val].value=='compay'){
        dispatch(set_company(true))
      }
      qr_checked.push(value[val].value)
    }


    localStorage.setItem('qr_checked',JSON.stringify(qr_checked))
    


  }

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
    <FormGroup viewWidth={width} colSize={colSize}>
      <Label
        colSize={`${width <= 1350 && width >= 751 ? '3 ' : ''}${width <= 750 ? '4 ' : ''}${width > 1350 && '2'}`}
        addClassName={`${width <= 1350 && width >= 451 ? 'col-3 ' : ''}${width <= 450 && width >= 351 ? 'col-4 ' : ''}${
          width <= 350 ? 'col-5 ' : ''
        }${width > 1350 && 'col-2'} ${addClassName}`}
        labelFor={name}
      >
        {label}
      </Label>
      <Field name={`${name}_check`}>
        {({
          field = true,
        }: // form,
        // meta,
        any) => {
          return (
            <div className="col-1" style={{ padding: 0 }}>
              <Input
                colSize="12"
                addClassName={'col-12'}
                name={`${name}_check`}
                id={`${name}_check`}
                type={'checkbox'}
                // disabled={disable_check || disable}
                {...field}
                checked={field.value ? field.value : true}
                // checked={true}
                fieldError={!!errors[name]}
                disabled={disable_check}
              />
            </div>
          );
        }}
      </Field>
      <Field name={name}>
        {({
          field,
        }: // form,
        // meta,
        any) => (
          <>
            {/* <Input
              colSize={`${width <= 1350 && width >= 751 ? '8 ' : ''}${width <= 750 ? '7 ' : ''}${width > 1350 && '9'}`}
              addClassName={`${width <= 1350 && width >= 451 ? 'col-8 ' : ''}${
                width <= 450 && width >= 351 ? 'col-7 ' : ''
              }${width <= 350 ? 'col-6 ' : ''}${width > 1350 && 'col-9'}`}
              name={name}
              id={name}
              type={type}
              disabled={disable_check || disable}
              {...field}
              fieldError={errors[name]}
              placeholder={placeholder}
            /> */}
            <div style={{ position: 'relative' }}>
              <>
                {/* {cb !== null && (
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
                )} */}
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

            <>
              <div style={disable_check ? /*{display:"none"}*/ { display: 'flex' } : { display: 'flex' }}>
                {!disable_check ? (
                  <ReactMultiSelectCheckboxes
                    placeholder={placeholder}
                    options={options}
                    value={selectedOptions}
                    // value={options}
                    disabled={true}
                    // disabled={disable_check ? true : false}
                    getDropdownButtonLabel={getDropdownButtonLabel}
                    className="checkBox"
                    {...field}
                    onChange={(value: any) => {
                      onChangeHandler(value);
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
                ) : (
                  <>
                    <FontAwesomeIcon icon={faQrcode} size={'2x'} color={'#ccc'} />
                  </>
                )}
              </div>
            </>
          </>
        )}
      </Field>
      {errors[name] && <div className="col-12 d-block invalid-feedback">{errors[name]}</div>}
    </FormGroup>
  );
};

export default QRField;




