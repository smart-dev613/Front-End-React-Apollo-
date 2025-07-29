import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
/** Components */
import { Field, FieldArray, useFormikContext} from 'formik';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import InputWithCheckboxField from './InputWithCheckboxField';
import InputMultiSelectField from './InputMultiSelectField';
import InputField from './InputField';
import CheckboxGroupField from './CheckboxGroupField';
import "./ContentMenuStyle.css";
import MobileInputMultiSelectField from './MobileInputMultiSelectField';

const PageAccessField = ({ name, width, disable_check, label, placeholder, colSize = '6', attendees = [] }: any) => {
  
  const { values, setFieldValue }: any = useFormikContext();
 

  return (
    <>
    <FormGroup colSize={colSize} noPadding={true} >
     
      <div className={`col-12`} style={{ flex:1,padding: 0 }}>
          <PageSettingsContainer disable_check={disable_check} className="" >
              <InputWithCheckboxField
                disable_check={disable_check}
                width={width}
                name={name}
                label={label}
                colSize={6}
              />
              
            
              <div className="drop-down-container">
                  <div className="col-md-4 px-0">
                      <InputMultiSelectField
                        //addSelectClassName={"px-2"}
                        width={width}
                        disable={disable_check}
                        name={`${name}_select.userVisible`}
                        hideLabel={true}
                        colSize={2}
                        options={[
                          { label: 'All', value: 'all' },
                          ...attendees,
                        ]}
                        pageLabel={"Visible to"}
                      
                        onChange={(e: any) => {
                          if (e.action === "select-option" && e.option.value?.toLowerCase() === "all") {


                            // setFieldValue(`${name}_select.userVisible`, [
                            //   ...attendees,
                            // ])

                            setFieldValue(`${name}_showToAll`, true)
                          }
                        }}
                      />
                  </div>
                  {/* <div className='m-submenu'> */}
                  <div className='col-md-4 px-0'>
                    <InputMultiSelectField
                      //addSelectClassName={"px-2"}
                      width={width}
                      disable={disable_check}
                      name={`${name}_select.userAdmin`}
                      hideLabel={true}
                      colSize={2}
                      options={[
                        ...attendees,
                      ]}
                      pageLabel={"Admin"}
                      onChange={(e: any) => {
                        if (e.target.value.map((item: any) => item.value).includes('all')) {
                          setFieldValue(`${name}_select.userAdmin`, [
                            ...attendees,
                          ])
                        }
                      }}
                    />
                  </div>
                  <div className='col-md-4 px-0'>
                    <InputField
                      addClassNamelabel="col"
                      type="checkbox"
                      name={`${name}_isPublic`}
                      label={'Public'}
                      colSize={12}
                      colSizeLabel={1}
                      inputCol="col-md-4 col-sm-2"
                      disable_check={disable_check}
                    />
                    {/* <CheckboxGroupField
                      name={`${name}_isPublic`}
                      label={"public access"}
                      colSize={12}
                      disable={disable_check}
                    /> */}
                    
                  </div>
                  
              </div>
                 
          </PageSettingsContainer>
                
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



@media screen and (min-width: 767px) {
  flex-direction: row;

  .drop-down-container {
    flex-direction: row;
    align-items: center;
    justify-content : space-between;
    margin-left: 0;
  }
 

  // .end-select {
  //   margin-left: -0.25rem;
  // }
}
`


export default PageAccessField;
