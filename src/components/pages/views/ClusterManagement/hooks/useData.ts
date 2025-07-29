/** Hooks */
import { useState, useCallback, useEffect } from 'react';

/** Request */
import { getEventCustomCluster, getEventAttendees, getEventClusters,getPlatformEventMembers } from '../../../../../providers/events';
import { companyEmployeesAttendingEvent } from '../../../../../providers/pricing';

export const useData = (eventId: any, companyID: any) => {
  const [data, setData] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const getData = useCallback(async () => {
    try {
      // Fetch event clusters
      const { data: eventCrmCluster }: any = await getEventClusters(eventId);
      const { getEventClusters: crmClusters } = eventCrmCluster;
    
      // Combine clusters and custom clusters into a single array
      const getAllClusters = [
        ...(crmClusters?.cluster || []),
        ...(crmClusters?.customCluster || []),
      ];
    
      // Transform clusters with additional metadata
      const newClusters = getAllClusters.map((cluster: any) => ({
        ...cluster,
        is_editable: true,
        totalMembers: cluster?.users?.length || 0,
        totalSubClusters: cluster?.subClusters?.length || 0,
      }));
    
      // Filter data to include only entries with a valid `user_name`
      const newData = newClusters.filter((val: any) => val.user_name);
    
      // Update state
      setClusters(newClusters);
      setData(newData);
      
    } catch (error) {
      console.error("Error fetching or processing clusters:", error);
    } finally {
      setRefetch(false); // Reset refetch flag
    }
  }, [eventId, refetch])

  const getAttendees = useCallback(async () => {
    try {

      const { data }: any = await getPlatformEventMembers(eventId);
      
      if (data) {
        const { getPlatformEventMembers } = data;
        setAttendees(getPlatformEventMembers)
      }
    } catch (error) {
      console.log(error);
    } 
  }, [eventId]);

  const getEmployees = useCallback(async () => {
    try {
      const { data }: any = await companyEmployeesAttendingEvent({
        eventId
      });
      
      if (data) {
        const { companyEmployeesAttendingEvent: { companyMemberships } } = data;
        setEmployees(companyMemberships);
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId])

  useEffect(() => {
    getEmployees();
  }, [getEmployees])

  
  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    if (refetch) getData()
  }, [refetch, getData])

  useEffect(() => {
    getAttendees();
  }, [getAttendees])

  return {
    data,
    clusters,
    setRefetch,
    attendees,
    employees,
  }
}
