import React, { useState, useMemo } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useForm } from './hooks/useForm';

/** Components */
import { Formik, Form } from 'formik';
import FormRow from '../../../Form/FormRow';
import { InputField, InputMultiSelectField, SubClusterListField } from '../../../FormikItem';
import { ModalBody } from './components/general';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheck, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

/** Utils */
import _ from 'lodash';
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Types */
import { Props } from './types';

const CreateClusterContent: React.FC<Props> = (props: Props) => {
  const [selectedMembers, setSelectedMembers] = useState([])
  const {
    ui,
    user,
    closeCurrentModal,
    data,
    data: {
      setRefetch,
      attendees,
      employees,
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

  const { createCluster, updateCluster } = useForm(eventId, {
    ...data,
    user
  });

  const [isSubmit, setIsSubmit] = useState(false)

  const closeModal = () => {
    closeCurrentModal('CREATE_CLUSTER')
  }

  const initialValues = useMemo(() => {
    if (!item) {
      return {
        name: '',
        users: [],
        subCluster: [],
      }
    }

    return {
      name: item.name,
      users: item.users.map((us: any) => ({
        label: [us.firstName, us.lastName].filter(Boolean).join(' '),
        value: us.user?.id
      })),
      subCluster: []
    }
  }, [item])

  const options = Object?.values([
    ...attendees?.map((val: any) => ({
      value: val?.user?.id,
      label: [val?.user?.firstName, val?.user?.lastName].filter(Boolean).join(' ')
    }))
  ].reduce((acc: any, curr: any) => {
    if (!acc[curr.value]) {
      acc[curr.value] = curr
    }
    return acc
  }, {}))

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema(isMeeting)}
      onSubmit={async (values: any) => {
        try {
          setIsSubmit(true)
          if (item) {
            await updateCluster({
              ...values,
              users: values.users.filter((item: any) => item.value !== "all").map((item: any) => item.value),
              crmClusterId: item.id,
            });
          } else {
            await createCluster({
              ...values,
              users: values.users.filter((item: any) => item.value !== "all").map((item: any) => item.value),
            });
          }
          setRefetch(true);
          closeModal()
        } catch (error) {
          console.log(error);
          alert(error.message)
        } finally {
          setIsSubmit(false)
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div className='modal-header'>
            <h4>
              {item ? 'Edit' : 'Add New'} Cluster
            </h4>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-purple btn-edit" disabled={isSubmit}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button type="button" className="btn btn-red" onClick={() => closeModal()}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          <ModalBody className="modal-body">
            <FormRow>
              <InputField
                name={'name'}
                label={'Name'}
                colSize={12}
                colSizeLabel={4}
                colSizeInput={8}
              />
                {/* <ReactMultiSelectCheckboxes
                          label="Members"
                          placeholder="Members"
                          colSize={12}
                          colSizeLabel={4}
                          colSizeInput={8}
                          addLabelClassName={'col-4'}
                          value={selectedMembers}
                          onChange={(selected: any) => setSelectedMembers(selected)}
                          options={options}
                        /> */}
              <InputMultiSelectField
                name={'users'}
                label={'Members'}
                colSize={12}
                colSizeLabel={4}
                colSizeInput={8}
                addLabelClassName={'col-4'}
                pageLabel="Members"
                options={[
                  { label: 'All', value: 'all' },
                  ...options,
                ]}
              />
              {
                (
                  <SubClusterListField
                    name={'subCluster'}
                    label={'Sub Cluster'}
                    
                    colSize={12}
                  />
                )
              }
            </FormRow>
          </ModalBody>
        </Form>
      )}
    </Formik>
  )
}

export default CreateClusterContent
