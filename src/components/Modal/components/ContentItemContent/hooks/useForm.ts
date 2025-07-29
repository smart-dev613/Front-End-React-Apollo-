/** Hooks */
import { useCallback, useState, useEffect } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import { companyEmployeesAttendingEvent, employeesInCompany } from '../../../../../providers/pricing';
import { getAvatarUploadToken } from '../../../../../providers/user';
import { uploadPresignedS3 } from '../../../../../providers/core/common';
import {
  getEventVenues,
  getAllClusters,
  getEventSubCluster,
  getEventCustomCluster,
  newContent,
  updateContent,
} from '../../../../../providers/events';

export const useForm = (eventId: any, companyID: any, data: any) => {
  const { user, setRefetch, data: item } = data;
  const [employees, setEmployees] = useState([]);
  const [eventVenues, setEventVenues] = useState([]);
  const [eventClusters, setEventClusters] = useState([]);

  // const createContent = useCallback(async (values: any) => {
  //   try {
  //     return await newContent({
  //       eventId,
  //       ...values
  //     })
  //   } catch (error) {
  //     throw error;
  //   }
  // }, [setRefetch, eventId])
  const createContent = useCallback(
    async (values: any) => {
      try {
        let result : any;
        const contentId = await newContent({ eventId, ...values });
        // const pricingId = await newContent({ eventId, ...values });
        console.log('✅ Created content ID:', contentId);

        // Do something with contentId (e.g. navigate or update UI)
        return {contentId};
      } catch (error) {
        console.error('Failed to create content:', error);
        throw error;
      }
    },
    [eventId]
  );

  const patchContent = useCallback(
    async (values: any) => {
      try {
        return await updateContent({
          eventId,
          contentId: values.id,
          ...values,
        });
      } catch (error) {
        throw error;
      }
    },
    [setRefetch, eventId]
  );

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (files === null) return;
      try {
        const file = files[0];
        const key = file.name;
        let result: any = await getAvatarUploadToken(eventId, key);
        if (result.data.getS3POSTUploadToken) {
          const data = result.data.getS3POSTUploadToken;
          const url = data.generatedPresign;

          const res: any = await uploadPresignedS3(url, file);
          if (res.status !== 200) {
            // TODO: show nice error to user
            console.error('File could not be uploaded to S3');
          } else {
            let previewUrl = `https://user-assets.synkd.life/event-logo/${eventId}/${file.name}`;
            if (previewUrl) {
              return previewUrl;
            }
          }
        } else {
          alert('Error getting upload token for avatar upload');
        }
      } catch (error) {
        console.log(error);
      }
      return '';
    },
    [eventId]
  );

  const getEmployees = useCallback(async () => {
    try {
      // old GET employees query
      // Actually to GET Employees added to event
      const response: any = await companyEmployeesAttendingEvent({
        eventId,
      });

      // fixed GET employees of company query
      const { data: employeesResponse }: any = await employeesInCompany({
        companyID: data?.user?.companyData?.id,
      });

      const employeesList = employeesResponse?.employeesInCompany?.companyMemberships;

      if (data) {
        //const { companyEmployeesAttendingEvent: { companyMemberships } } = data;
        //setEmployees(companyMemberships);
        setEmployees(employeesList);
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  const getEventClusters = useCallback(async () => {
    try {
      const {
        data: { getEventCustomCluster: clusters },
      }: any = await getEventCustomCluster(eventId);
      const {
        data: { getEventSubCluster: crmClusters },
      }: any = await getEventSubCluster(eventId);

      const newData: any = [];
      const newClusters = [];

      if (crmClusters && crmClusters?.length > 0) {
        crmClusters.forEach((cluster: any) => {
          newClusters.push({
            ...cluster,
            totalMembers: cluster?.users?.length,
            totalSubClusters: cluster?.subClusters?.length,
          });
        });
      }

      clusters.forEach((cluster: any) => {
        newClusters.push({
          ...cluster,
          totalMembers: cluster?.users?.length,
          totalSubClusters: cluster?.subClusters?.length,
        });

        cluster.users &&
          cluster.users.forEach((user: any) => {
            newData.push({
              is_editable: true,
              user_name: [user.firstName, user.lastName].filter(Boolean).join(' '),
              cluster_name: cluster.name,
              cluster_id: cluster.id,
              sub_cluster_name: cluster.subClusters.map((e: any) => e.name).join(', '),
              cluster,
            });
          });

        cluster.subClusters.forEach((sub: any) => {
          sub.users &&
            sub.users.forEach((subUser: any) => {
              newData.push({
                is_editable: false,
                user_name: [subUser.firstName, subUser.lastName].filter(Boolean).join(' '),
                cluster_name: cluster.name,
                cluster_id: cluster.id,
                sub_cluster_id: sub.id,
                sub_cluster_name: sub.name,
                cluster,
                sub_cluster: sub,
              });
            });
        });
      });
      setEventClusters(newClusters);
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  const getVenues = useCallback(async () => {
    try {
      const response: any = await getEventVenues(eventId);
      if (response?.data && response?.data?.getEventVenues) {
        setEventVenues(response.data.getEventVenues);
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  useEffect(() => {
    getEmployees();
    getVenues();
    getEventClusters();
  }, [getEmployees, getVenues, getAllClusters]);

  return {
    createContent,
    patchContent,
    handleFileUpload,
    employees,
    eventVenues,
    eventClusters,
  };
};
