/** Hooks */
import { useCallback, useState, useEffect } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import { createNewEventCluster, updateEventCustomCluster } from '../../../../../providers/events';
import { companyEmployeesAttendingEvent, employeesInCompany } from '../../../../../providers/pricing';


export const useForm = (eventId: any, data: any) => {

  const {
    user,
    setRefetch,
    item
  } = data;

  const createCluster = useCallback(async (values: any) => {
    try {
      await createNewEventCluster({
        id: eventId,
        name: values.name,
        userIds: values.users,
        subCluster: values.subCluster
      })
    } catch (error) {
      throw error;
    }
  }, [setRefetch, eventId])

  const updateCluster = useCallback(async (values: any) => {
    try {
      await updateEventCustomCluster({
        eventId,
        name: values.name,
        crmClusterId: values.crmClusterId,
        users: values.users
      })
    } catch (error) {
      throw error;
    }
  }, [setRefetch, eventId])

 

  return {
    createCluster,
    updateCluster,
  }
}
