import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import InputWithCheckboxField from './InputWithCheckboxField';
import InputMultiSelectField from './InputMultiSelectField';
import InputField from './InputField'
import CheckboxGroupField from './CheckboxGroupField';
import "./ContentMenuStyle.css";
import MobileInputMultiSelectField from './MobileInputMultiSelectField';
import { doTypesOverlap } from 'graphql';
import { Content } from 'antd/lib/layout/layout';

const ContentMenuField = ({ name, width, disable_check, label, placeholder, colSize = '6', attendees = [], type }: any) => {
  const { values, setFieldValue }: any = useFormikContext();


  return (
    <>
    <FormGroup colSize={colSize} noPadding={true} >
     
      <div className={`col-12`} style={{ flex:1, padding: 0 }}>
        <FieldArray
          name={name}
          render={(arrayHelper: any) => {
            return (
              <>
                {(values[name] || []).map((item: any, idx: number) => {

                  console.log("ContentMenuField->item", item)
                  
                  
                  let options = (item?.type === "ADMIN") ? [ ...attendees ] : [
                    ...attendees,
                  ]

                return (

               
                  <PageSettingsContainer disable_check={disable_check} className="" >
                      <InputWithCheckboxField
                        disable_check={disable_check}
                        width={width}
                        name={`${name}.${idx}.name`}
                        label={item?.type !== "CONTENT_CUSTOM" ? `${item.name[0]?.toUpperCase() + item.name?.slice(1)}` :  `Page ${idx + 1}`}
                        colSize={6}
                      />
                  
                    {/* <div className="m-submenu"> */}

                      <div className="drop-down-container">
                        
                        <div className="col-md-4 px-0">
                          <InputMultiSelectField
                            //addSelectClassName=""
                            width={width}
                            disable={disable_check}
                            name={`${name}.${idx}.userVisible`}
                            hideLabel={true}
                            colSize={2}
                            options={[ 
                              { label: 'All', value: 'all' },
                              ...options
                            ]}
                            pageLabel={"Visible to"}
                            setFieldValue={setFieldValue}
                            onChange={(e: any) => {

                              console.log("userVisible changed", e)
                              if (e.action === "select-option" && e.option.value?.toLowerCase() === "all") {
    
                                console.log("Selecting all...")
    
                                // setFieldValue(`${name}_select.userVisible`, [
                                //   ...attendees,
                                // ])
    
                                setFieldValue(`${name}.${idx}.showToAll`, true)
                              }
                              
      
                            }}/>
                        </div>
                        {/* <div className='m-submenu'> */}
                        <div className='col-md-4 px-0'>
                          <InputMultiSelectField
                            width={width}
                            disable={disable_check}
                            name={`${name}.${idx}.userAdmin`}
                            hideLabel={true}
                            colSize={2}
                            options={[ 

                              ...options
                            ]}
                            pageLabel={"Admin"}
                            onChange={(e: any) => {
                                if (e.target.value.map((item: any) => item.value).includes('all') && item?.type !== "ADMIN") {

                                  setFieldValue(`${name}.${idx}.userAdmin`, [
                                    ...attendees,
                                  ])
                                }                        
                            }}/>
                        </div>
                        <div className='col-md-4 px-0'>
                        <InputField
                          addClassNamelabel="col"
                          type="checkbox"
                          name={`${name}.${idx}.isPublic`}
                          label={'public'}
                          colSize={12}
                          colSizeLabel={1}
                          inputCol="col-md-4 col-sm-2"
                          disable_check={disable_check}
                        />
                        </div>

                      </div>
                  
                      {item?.type === "CONTENT_CUSTOM" && (

                          <div  className="remove-icon" 
                          onClick={() => {
                            !disable_check && arrayHelper.remove(idx)
                          }}>
                              <FontAwesomeIcon className='times-icon' icon={faTimes} />

                          </div>
                        
                      )
                        
                      } 
                 
                  </PageSettingsContainer>
                
                )}
                
                )}
                {/* <FormGroup> */}
                {name === 'customMenus' && (
                  <AddPgeContainer>
                  {!disable_check ?
                  
                    <div className="setup_edit">
                        <button
                          type="button"
                          className="btn btn-purple"
                          onClick={() => {
                            arrayHelper.push({
                              name: '',
                              name_check: false,
                            });
                          }}
                        >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  : ''}
                </AddPgeContainer>
              )}

               

                {/* </FormGroup> */}
              </>
            );
          }}
        />
      </div>
    </FormGroup>


</>
  );
};

const PageSettingsContainer = styled.div<any>`
display: flex;
align-items: center;
flex-direction: column;


.select-field {
  display: flex;
  align-items: flex-end;
  justify-content : flex-end;
 margin-left: auto;
 flex-direction: column;
}

.drop-down-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content : flex-end;
 margin-left: auto;
}

.remove-icon {
  background: ${({disable_check}) => disable_check ? "#f87171" : "#b91c1c"}  !important;
  border-radius: 0.25rem;
  margin-right: 1rem;
  margin-bottom : 0.25rem; 
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
 }
.times-icon {
  color: #ffffff;
  height: 1rem;
  width 1rem;
}
@media screen and (min-width: 767px) {
  flex-direction: row;

  .select-field {
    margin-left: 0;
    width: 100%;
    align-items: center;
    justify-content : space-between;
    flex-direction: row;
  }

  .drop-down-container{
    margin-left: 0;
    flex-direction: row;
    align-items: center;
    justify-content : space-between;
  }

}
`

const AddPgeContainer = styled.div<any>`
padding: 1rem;
box-sizing: border-box;
display: flex;
align-items: flex-end;
justify-content: flex-end;
`

export default ContentMenuField;
