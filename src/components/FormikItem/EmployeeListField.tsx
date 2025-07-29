import React, { useState, useEffect} from 'react';

/** Components */
import { FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import InputSelectPricingFieldModal from './InputSelectPricingFieldModal';
import InputFieldModal from './InputFieldModal';
import styled from 'styled-components';

const EmployeeListField = ({
  name,
  options = [],
  setTotalEmployeePrice,
}: any) => {
  const { values, setFieldValue }: any = useFormikContext();
  const selectedEmloyee = values[name]?.map((item : any) => item?.id?.value)
  const filteredOptions = options.filter((item: any) => !selectedEmloyee.includes(item.value))

  const [formValues, setFormValues] = useState({})
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    let employeeTotal = 0;

    values[name].map(employee => {
      let price = parseInt(formValues[employee.id?.value]?.price || 0)
      employeeTotal = employeeTotal + price

    })


    setTotalEmployeePrice(employeeTotal)
    
  }, [refresh])


  const calTax =  (id, taxRate) => {

    let total = 0;
    let price = values[name][id]?.price
    let employeeTax = (taxRate/100) * (parseInt(price || 0) ? price : 0)

    total = price + employeeTax

    setFieldValue(`${name}.${id}.total`, total)

    setRefresh(refresh+1)
  }

  const calEmployeeTotalPrice = (id, price) => {

    let total = 0;
    
    let tax = values[name][id]?.tax
    let employeeTax = (parseInt(tax || 0) ? (tax/100) : 0) * (price)

    total = price + employeeTax

    setFieldValue(`${name}.${id}.total`, total)
    setRefresh(refresh+1)

  }

  return (
    
      <FieldArray
        name={name}
        render={(arrayHelper: any) => {
          return (
            <div className="pb-2">
              {(values[name] || []).map((item: any, idx: number) => (
                <div
                  className="employee-list-items"
                  key={idx}
                >
                  <div className="employee-input-items">

               
                      <InputSelectPricingFieldModal
                         containerClassName={`field-container pr-2`}
                         addLabelClassName={'field-label col-sm-4'}
                        addInputClassName={'field-input'}
                         options={filteredOptions}
                         name={`${name}.${idx}.id`}
                         label={'Employee'} 
                      />
                     
                      
                       <InputFieldModal
                          containerClassName={`field-container px-2`}
                          addLabelClassName={'field-label col-sm-5'}
                          addInputClassName={'field-input'}
                          type="number"
                          defaultValue={0}
                          name={`${name}.${idx}.price`}
                          label={'Price'}
                          onChange={(e)=> {
	                          setFormValues({
                              ...formValues,  
                              [item?.id?.value]: {
                                ...formValues[item?.id?.value],
                                price: parseInt(e.target?.value || 0)
                              }
                            });
                            calEmployeeTotalPrice(idx, parseInt(e.target?.value || 0))
                          }}
                        />

                         <InputFieldModal
                          containerClassName={`field-container px-2 col-sm-2`}
                          addLabelClassName={'field-label col-sm-6'}
                          addInputClassName={'field-input'}
                          type="number"
                          defaultValue={0}
                          name={`${name}.${idx}.tax`}
                          label={'Tax (%)'}
                          onChange={(e)=> {
                            setFormValues({
                              ...formValues,  
                              [item?.id?.value]: {
                                ...formValues[item?.id?.value],
                                tax: parseInt(e.target?.value || 0)
                              }
                            });
                            calTax(idx, parseInt(e.target?.value || 0))
                          }}
                        />

                        <InputFieldModal
                          containerClassName={`field-container px-2 col-sm-2`}
                          addLabelClassName={'field-label col-sm-5'}
                          addInputClassName={'field-input'}
                          // defaultValue={formValues[item?.id?.value]?.total}
                          // value={formValues[item?.id?.value]?.total}
                          type="number"
                          defaultValue={0}
                          name={`${name}.${idx}.total`}
                          label={'Total'}
                          onChange={(e)=> {
                            calEmployeeTotalPrice(idx, parseInt(e.target.value || 0))
                          }}
                          disabled={true}
                        />               
                      
                </div>
      
                  <div
                      className=" "
                      style={{ padding: 0, marginLeft: 'auto' , marginRight:"1rem", marginBottom: "0.5rem" }}
                    >
                      <button
                        type="button"
                        className="btn btn-red m-0"
                        onClick={() => {
                          arrayHelper.remove(idx);
                          setRefresh(refresh+1)
                        }}
                      >
                        <FontAwesomeIcon icon="times" />
                      </button>
                    </div>
                </div>
              ))}

              <div className="pb-2">
                <button
                  type="button"
                  className="btn btn-purple d-sm-block float-right mr-3"
                  
                  onClick={() => {
                    
                    arrayHelper.push({
                      employee: '',
                      price: '',
                      show_rating: true,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          );
        }}
      />
 
  );
};

const EmployeeStyle = styled.div``;

export default EmployeeListField;
