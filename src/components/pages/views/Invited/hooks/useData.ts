/** Hooks */
import { useState, useEffect, useCallback } from 'react';

/** API */
import { getEventAttendees, resendEventInvite, sendEventInvitation, createNewEventSubCluster, getRequestToJoinEventList, reponseRequestToJoinEvent } from '../../../../../providers/events'
import { archiveInvitation as archiveInvitationReq, recordQRCodeScan } from '../../../../../providers/user'
import { AttendeePreferenceList } from '../../../../enum/preference';

export const useData = (eventId: any, isOrganiser: boolean, maximumAttendees: number) => {

  const [attendees, setAttendees] = useState([]);
  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAttendees = useCallback(async () => {
    try {
      setLoading(true);
      const { data }: any = await getEventAttendees(eventId);
   
      
      if (data) {
        const { getEventAttendees } = data;

        const uniqueAttendeesDict = getEventAttendees
          attendees.reduce((acc: any, curr: any) => {
            console.log("acc: ", acc)
            console.log("curr: ", curr)
            if (!(curr.invitee?.user?.id in acc)) {
              acc[curr.invitee?.user?.id] = curr;
            } else if (curr.invitationStatus === 'ACCEPTED') {
              acc[curr.invitee?.user?.id] = curr;
            }

            return acc;
          }, {});
        
        let counter = 0
        const newAttendees = Object.values(uniqueAttendeesDict.attendees).map((attendee: any, idx: number) => {
          console.log("attendee: ", attendee)
          if (attendee.invitationStatus === 'ACCEPTED') counter++;
          return {
            ...attendee,
            name: [attendee.invitee?.user?.firstName, attendee.invitee?.user?.lastName].filter((item: any) => item).join(' '),
            company: attendee.invitee?.company?.name,
            email: attendee?.invitationEmail || attendee.invitee?.user?.email || attendee?.invitee?.email,
            status: attendee?.invitee?.status,
            limited: counter > maximumAttendees
          }
        });

        setAttendees(newAttendees);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [eventId, maximumAttendees]);

  const getRequesters = useCallback(async () => {
    try {
      setLoading(true);
      const { data }: any = await getRequestToJoinEventList(eventId);
      
      if (data) {
        const { getRequestToJoinEventList } = data;

        const uniqueAttendeesDict = getRequestToJoinEventList
          // .filter((item: any) => item.status === 'AWAITING')
          .map((attendee: any) => {
            return {
              ...attendee,
              name: [attendee.requester.firstName, attendee.requester.lastName].filter((item: any) => item).join(' '),
              company: attendee.requesterMembership.company.name,
              email: attendee.requesterMembership.email || attendee.requester.email,
              status: attendee.status,
            }
          });
        setRequesters(uniqueAttendeesDict);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const sendInvitation = useCallback(async (email) => {
    try {
      const response: any = await sendEventInvitation({
        id: eventId,
        inviteeEmails: [
          email
        ]
      });

      if (response.data == null) {
        // alert('Failed: Check the USER email again, make sure USER has an Inspired account');
        return 'Failed: Check the USER email again, make sure USER has an Inspired account';
      } else if (response.data?.createEventInvitation?.memberExist?.length) {
        alert(`${response.data.createEventInvitation.memberExist.join(', ')}, already a member`)
      } else if (response.data?.createEventInvitation?.notSendEmail?.length) {
        alert(`there's been a problem inviting: ${response.data.createEventInvitation.notSendEmail.join(', ')}, ... please check the email address again`)
      } else {
        alert(`Email Invitation sent`)
        getAttendees();
      }

      return response.data.createEventInvitation
      
    } catch (error) {
      console.log(error)
      return error
      // alert(error.message);
    }
  }, [eventId])

  const archiveInvitation = useCallback(async (invitationID) => {
    try {
      const response: any = await archiveInvitationReq(invitationID, 'ARCHIVED');
      if (response.data == null) {
        alert('Failed to archive the invitation');
      } else {
        getAttendees();
      }
    } catch (error) {
      console.log(error)
      alert(error.message);
    }
  }, [])

  const QRCodeScan = useCallback(async (userId, eventId, companyMembershipId) => {
    try {
      const response: any = await recordQRCodeScan(userId, eventId, companyMembershipId);
      if (response.data == null) {
        console.log('Failed to QRCode scan')
        //alert('Failed to QRCode scan');
      } 
    } catch (error) {
      console.log(error)
      //alert(error.message);
    }
  }, [])

  const responseToRequest = useCallback(async (requestId, status) => {
    try {
      const response: any = await reponseRequestToJoinEvent({ requestId, response: status });

      if (response.data == null) {
        alert('Failed to response the request');
      } else {
        getAttendees();
        getRequesters();
      }
      return response

    } catch (error) {
      console.log(error)
      alert(error.message);

      return error.message
    }
  }, [])

  const resendInvitation = useCallback(async (record: any) => {
    try {
      const res: any = await resendEventInvite(record.id);
      if (res.data) {
        alert(`Successfully re-sent invite. You will not be able to send another for 24 hours.`)
      } else if (res.errors && res.errors[0].message) {
        alert(res.errors[0].message)
      } else {
        alert(`There was a problem re-sending the invite. Please try again later.`)
      }
    } catch (error) {
      console.log(error)
      alert(error.message);
    }
  }, [eventId, isOrganiser])

  const createSubCluster = useCallback(async (name, userIds) => {
    try {
      const res: any = await createNewEventSubCluster({
        id: eventId,
        name,
        userIds
      });
      if (res.data) {
        alert(`Successfully create new sub cluster.`)
      } else if (res.errors && res.errors[0].message) {
        alert(res.errors[0].message)
      } else {
        alert(`There was a problem create new sub cluster. Please try again later.`)
      }
    } catch (error) {
      console.log(error)
      alert(error.message);
    }
  }, [eventId, isOrganiser])

  useEffect(() => {
    getAttendees();

  }, [getAttendees])

  useEffect(() => {
    getRequesters();
  }, [getRequesters])

  return {
    attendees,
    requesters,
    loading,
    QRCodeScan,
    sendInvitation,
    resendInvitation,
    createSubCluster,
    archiveInvitation,
    responseToRequest,
  }
}
