/** Hooks */
import { useState, useEffect, useCallback } from 'react';

/** API */
import { getEventAttendees, getPlatformEventMembers} from '../../../../../providers/events'

export const useData = (eventId: any, isUserSelected: boolean) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAttendees = useCallback(async () => {
    try {

      const { data }: any = await getPlatformEventMembers(eventId);
      
      if (data) {
        const { getPlatformEventMembers } = data;

        const newAttendees = getPlatformEventMembers.map((attendee) => {
          const profile = attendee?.profile ? attendee?.profile : attendee.user
      
          return {
            ...attendee,
            companyId: profile.company?.id,
            userId: attendee.user.id,
            avatar: profile.avatar,
            name: [attendee.user.firstName, attendee.user.lastName].filter((item: any) => item).join(' '),
            company: profile.company?.name,
            email: profile.email,
            status: attendee.status,
            profiles:  profile.profiles,
          }
        })
        
        setData(newAttendees)
      }
    } catch (error) {
      console.log(error);
    } 
  }, [eventId, isUserSelected]);



  useEffect(() => {
    getAttendees();
  }, [getAttendees])

  return {
    data,
    loading,
  }
}
