import React, { useState, useMemo } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useForm } from './hooks/useForm';

/** Components */
import { Formik, Form } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormRow from '../../../Form/FormRow';
import { CheckboxGroupField } from '../../../FormikItem';
import { ModalBody } from './components/general';

/** Utils */
import moment from 'moment';
import _ from 'lodash';
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Constants */
import { AttendeePreferenceList } from '../../../enum/preference';

/** Types */
import { Props } from './types';

const AttendeePreferenceContent: React.FC<Props> = (props: Props) => {
  const {
    ui,
    user,
    closeCurrentModal,
    client,
  } = props;

  const {
    data,
    data: {
      eventId,
      event: {
        attendee_preferences
      }
    }
  }: any = useQuery(GET_EVENT_INFO);

  const { update } = useForm(eventId, client, {
    ...data,
  });

  const closeModal = () => {
    closeCurrentModal('ATTENDEE_PREFERENCE')
  }

  const initialValues = useMemo(() => {
    return {
      attendee_preferences: attendee_preferences || [],
    }
  }, [attendee_preferences])

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema(isMeeting)}
      onSubmit={async (values: any) => {
        try {
          await update(values);
          closeModal();
        } catch (error) {
          console.log(error);
          alert(error.message);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div className="modal-header">
            <h4>MSL Data</h4>
            <div style={{ display: 'flex', gap: 5 }}>
              <button type="submit" className="btn btn-purple btn-edit" style={{ color: '#fff' }}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button type="button" className="btn btn-red" onClick={() => closeModal()}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          <ModalBody className="modal-body">
            <FormRow>
              {AttendeePreferenceList.map((list: any) => (
                <CheckboxGroupField
                  name="attendee_preferences"
                  value={list.value}
                  label={list.label}
                  colSize={12}
                  disable={list.disable}
                />
              ))}
            </FormRow>
          </ModalBody>
        </Form>
      )}
    </Formik>
  );
}

export default AttendeePreferenceContent
