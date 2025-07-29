import React, { useState, useMemo } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useForm } from './hooks/useForm';

/** Components */
import { Formik, Form } from 'formik';
import FormRow from '../../../Form/FormRow';
import { InputField, InputSelectField, InputMultiSelectField, TimePickerField } from '../../../FormikItem';
import { ModalBody } from './components/general';

/** Utils */
import moment from 'moment';
import _ from 'lodash';
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Constants */
import { validationSchema } from './validationSchema';

/** Types */
import { Props } from './types';

const INTERVAL = [
  { label: '30 m', value: 30 },
  { label: '1 hr', value: 60 },
  { label: '1 hr 3 m', value: 90 },
  { label: '2 hr', value: 120 },
]

const CreatePricingContent: React.FC<Props> = (props: Props) => {
  const {
    ui,
    user,
    closeCurrentModal,
    data,
    data: {
      setRefetch,
      employees,
      contents,
      item,
    }
  } = props;

  const {
    data: {
      eventId,
      theme,
      slug,
      eventType,
      organiser,
    }
  }: any = useQuery(GET_EVENT_INFO);

  const { createPricing, updatePricing } = useForm(eventId, {
    ...data,
    user
  });

  const closeModal = () => {
    closeCurrentModal('CREATE_PRICING')
  }

  const initialValues = useMemo(() => {
    if (!item) {
      return {
        interval: INTERVAL[0],
        content: '',
        price: '',
        slots: '',
        employee: '',
        start_time: '',
        end_time: '',
        weeks: [],
      }
    }
    const itemDuration = INTERVAL.find((interval: any) => interval.value === item.pricing_duration)

    return {
      interval: itemDuration || INTERVAL[0],
      content: {
        value: item.id,
        label: item.name
      },
      price: item.pricing_price,
      slots: item.pricing_slots,
      employee: {
        value: item.pricing[0].employee[0].id,
        label: [item.pricing[0].employee[0].user.firstName, item.pricing[0].employee[0].user.lastName].filter(Boolean).join(' '),
      },
      start_time: item.pricing_availability_hours && item.pricing_availability_hours.length === 2 ? moment(item.pricing_availability_hours[0], 'HH:mm a') : '',
      end_time: item.pricing_availability_hours && item.pricing_availability_hours.length === 2 ? moment(item.pricing_availability_hours[1], 'HH:mm a') : '',
      weeks: (item.pricing_availability_weeks || []).map((val: any) => ({
        label: _.startCase(val),
        value: val,
      })),
    }
  }, [item])

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema(isMeeting)}
      onSubmit={async (values: any) => {
        try {
          if (item) {
            await updatePricing(values);
          } else {
            await createPricing(values);
          }
          setRefetch(true);
          closeModal()
        } catch (error) {
          console.log(error);
          alert(error.message)
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div className='modal-header'>
            <h4>
              {item ? 'Edit' : 'Add New'} Pricing
            </h4>
            <button type='submit' className="btn">
              Submit
            </button>
            <button type='button' className='close' aria-label='Close' onClick={() => closeModal()}>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <ModalBody className="modal-body">
            <FormRow>
              <InputMultiSelectField
                name={'weeks'}
                label={'Days'}
                colSize={12}
                options={[
                  { label: 'Monday', value: 'monday' },
                  { label: 'Tuesday', value: 'tuesday' },
                  { label: 'Wednesday', value: 'wednesday' },
                  { label: 'Thursday', value: 'thursday' },
                  { label: 'Friday', value: 'friday' },
                  { label: 'Saturday', value: 'saturday' },
                  { label: 'Sunday', value: 'sunday' },
                ]}
              />
              <TimePickerField
                name={'time'}
                label={'Time'}
                colSize={12}
              />
              <InputSelectField
                name={'interval'}
                label={'Session Length'}
                colSize={12}
                options={INTERVAL}
              />
              <InputSelectField
                name={'content'}
                label={'Content'}
                colSize={12}
                options={[
                  ...contents.map((val: any) => ({
                    value: val.id,
                    label: val.name,
                  }))
                ]}
              />
              <InputSelectField
                name={'employee'}
                label={'Employee'}
                colSize={12}
                options={[
                  ...employees?.map((val: any) => ({
                    value: val.id,
                    label: [val.user.firstName, val.user.lastName].filter((item: any) => item).join(' '),
                  }))
                ]}
              />
              <InputField name={'price'} label={'Price'} colSize={12} />
              <InputField type="number" name={'slots'} label={'Slots'} colSize={12} />
            </FormRow>
          </ModalBody>
        </Form>
      )}
    </Formik>
  )
}

export default CreatePricingContent
