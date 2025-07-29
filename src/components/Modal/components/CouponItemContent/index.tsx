import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useRouterQuery } from '../../../pages/_hooks/useRouterQuery';
import { newCoupon } from '../../../../providers/pricing';
/** Components */
import { Form, Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setAtt } from '../../../../store/att/action';

import { ModalBody, ModalHeader } from './components/general';
import InputSelectPricingFieldModal from '../../../FormikItem/InputSelectPricingFieldModal';
import InputFieldModal from '../../../FormikItem/InputFieldModal';
import DateRangeFieldModal from '../../../FormikItem/DateRangeFieldModal';
/** Utils */
import moment from 'moment';
import _ from 'lodash';
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Types */
import { Props } from './types';
import styled from 'styled-components';
import { isStaging } from '../../../../util/helper';

const CouponItemContent: React.FC<Props> = (props: Props) => {
  const {
    ui,
    user,
    closeCurrentModal,
    data: { data, props: parentProps },
  } = props;
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const CouponUnits = [
    { label: 'Percentage', value: 'PERCENTAGE' },
    { label: 'Fixed', value: 'FIXED' },
  ];

  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [queries] = useRouterQuery();

  const {
    data: { eventId, theme, slug, eventType, organiser },
  }: any = useQuery(GET_EVENT_INFO);

  const closeModal = () => {
    closeCurrentModal('CREATE_COUPON');
    closeCurrentModal('CREATE_COUPON');
  };

  const dispatch = useDispatch();

  const initialValues = useMemo(() => {
    const values = {
      couponName: '',
      couponCode: '',
      couponValue: '',
      couponUnit: '',
      startDate: '',
      endDate: '',
      companyID: [organiser.company.id],
      oneUsePerCompany: false,
      oneUsePerUser: false,
      maximumUses: 1,
    };

    if (data) {
      //values.name = 'Dharmil';
      //values.startDate = values.startDate && moment(values.startDate);
      //alues.endDate = values.endDate && moment(values.endDate);
    }
    return values;
  }, [data]);

  React.useEffect(() => {
    dispatch(setAtt(0));
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const newValues = JSON.parse(JSON.stringify(values));
      newValues.startDate = moment(values.start_date).unix();
      newValues.endDate = moment(values.end_date).unix();

      newValues.couponUnit = newValues.couponUnit.value;
      newValues['name'] = newValues.couponName;
      newValues['unit'] = newValues.couponUnit;
      newValues['value'] = Number(newValues.couponValue);
      newValues['promoCode'] = newValues.couponCode;
      delete newValues.companyID;
      console.log('newValues', newValues);

      const { errors }: any = await newCoupon(newValues);

      if (errors) {
        console.log(errors);
        throw new Error(errors[0].message || 'Failed to save content');
      }

      closeModal();
    } catch (error) {
      if (error.message === 'Need to setup Connect Account first') {
        // alert("We require you to have a connected account for future payments. We appreciate it may not be currently relevant but it helps in future.")
        if (
          window.confirm(
            'We require you to have a connected account for future payments. We appreciate it may not be currently relevant but it helps in future.'
          )
        ) {
          window.open('https://my.synkd.life/');
        }
      } else {
        // need for better alert UI
        alert(error.message);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema(isMeeting)}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className={`formContainer`}>
          <ModalHeader className={`formHeader`}>
            <div className="mt-2 ml-2 mb-2">
              <button type="submit" className="btn btn-purple btn-edit">
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>

            <div className="mt-2 ml-2 mb-2">
              <button type="button" className="btn btn-red" onClick={() => closeModal()}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className={`formBody`}>
              <div className="col-md-12 col-sm-12">
                <div className="row">
                  <GridInputContainer>
                    <InputFieldModal
                      containerClassName={`field-container`}
                      addLabelClassName={'field-label'}
                      addInputClassName={'field-input'}
                      type="text"
                      name={'couponName'}
                      label={'Coupon Name'}
                      colSize={12}
                      containerStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: windowDimensions > 992 ? 10 : 0,
                        flex: 1,
                        minWidth: windowDimensions > 992 ? '50%' : '100%',
                        paddingRight: 0,
                      }}
                    />
                  </GridInputContainer>
                  <GridInputContainer>
                    <InputFieldModal
                      containerClassName={`field-container`}
                      addLabelClassName={'field-label'}
                      addInputClassName={'field-input'}
                      type="text"
                      name={'couponValue'}
                      label={'Value'}
                    />
                    <InputSelectPricingFieldModal options={CouponUnits} name={'couponUnit'} label={'Unit'} />
                  </GridInputContainer>
                  <GridInputContainer>
                    <InputFieldModal
                      containerClassName={`field-container`}
                      addLabelClassName={'field-label'}
                      addInputClassName={'field-input'}
                      type="text"
                      name={'couponCode'}
                      label={'Coupon Code'}
                    />
                    <DateRangeFieldModal
                      formClassName={'field-form'}
                      containerClassNames={'field-container'}
                      labelClassNames={'field-label'}
                      inputClassNames={'field-input'}
                      name={'date'}
                      label={'Validity Period'}
                    />
                  </GridInputContainer>
                  <GridInputContainer>
                    <InputFieldModal
                      type="checkbox"
                      containerClassName={`field-container`}
                      addLabelClassName={'field-label'}
                      addInputClassName={'field-input px-2'}
                      name={'oneUsePerUser'}
                      label={'One use per User'}
                    />
                    <InputFieldModal
                      type="checkbox"
                      containerClassName={`field-container`}
                      addLabelClassName={'field-label'}
                      addInputClassName={'field-input px-2'}
                      name={'oneUsePerCompany'}
                      label={'One use per Company'}
                    />
                  </GridInputContainer>
                </div>
              </div>
            </div>
          </ModalBody>
        </Form>
      )}
    </Formik>
  );
};

const NotificationMainContainer = styled.div`
  #notification_bar_users > div > button {
    width: 100%;
  }
  #notification_bar_attendees > div > button {
    width: 100%;
  }
  #notification_bar_users > div {
    width: 80%;
  }
  #notification_bar_attendees > div {
    width: 80%;
  }
  #notification_bar_users {
    display: inline-flex;
  }
  #notification_bar_attendees {
    display: inline-flex;
  }
`;

const GridInputContainer = styled.div`
  display: grid;
  width: 100%;

  .field-form {
    display: grid;
    width: 100%;
  }

  .field-container {
    display: flex;
    align-items: center;
    align-self: start;
    width: 100%;
  }

  .field-label {
    flex: 35%;
  }
  .field-input {
    flex: 65%;
    justify-content: flex-start;
  }

  .field-input-flex {
    flex: 60%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
  }
  .time-select-input {
    flex: 0.5;
    height: 2.5rem;
    // border: 1px solid red;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const EmployeeListContainer = styled.div`
  width: 100%;
  .employee-list {
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .employee-list-items {
    display: flex;
    flex-direction: column;
  }
  .employee-input-items {
    display: grid;
    flex: 1;
  }
  .field-container {
    display: flex;
    align-items: center;
    align-self: start;
  }
  .field-label {
    flex: 40%;
  }
  .field-input {
    flex: 60%;
    justify-content: flex-start;
  }

  @media (min-width: 768px) {
    .employee-list-items {
      flex-direction: row;
      align-items: center;
    }

    .employee-input-items {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
  }
`;

export default CouponItemContent;
