/** Hooks */
import { useState, useEffect, useCallback } from 'react';
import { getEventAttendees, getPlatformEventMembers } from '../../../../../providers/events';
export const useData = (eventId: any, ui: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAttendees = useCallback(async () => {
    try {
      setLoading(true);

      const { data }: any = await getPlatformEventMembers(eventId);

      if (data) {
        const { getPlatformEventMembers } = data;

        const newAttendees = getPlatformEventMembers.map((attendee) => {
          const profile = attendee?.profile ? attendee?.profile : attendee.user;

          return {
            ...attendee,
            companyId: profile?.company?.id,
            userId: attendee?.user?.id,
            avatar: profile?.avatar,
            name: [attendee?.user?.firstName, attendee.user.lastName].filter((item: any) => item).join(' '),
            company: profile?.company?.name,
            email: profile.email,
            status: attendee.status,
            profiles: profile.profiles,
            keywords:
              profile?.profiles?.filter((profile: any) => profile.locale === ui.language)[0] &&
              profile?.profiles?.filter((profile: any) => profile.locale === ui.language)[0].keywords.length > 0
                ? profile?.profiles?.filter((profile: any) => profile.locale === ui.language)[0].keywords
                : profile?.profiles?.filter((profile: any) => profile.locale === 'en')[0] &&
                  profile?.profiles?.filter((profile: any) => profile.locale === 'en')[0].keywords.length > 0
                ? profile?.profiles?.filter((profile: any) => profile.locale === 'en')[0].keywords
                : [''],
          };
        });

        setData(newAttendees);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [eventId, ui]);

  //break

  // const getAttendees = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const { data }: any = await getEventAttendees(eventId);

  //     if (data) {
  //       const { getEventAttendees } = data;

  //       const uniqueAttendeesDict = getEventAttendees
  //         .reduce((acc: any, curr: any) => {
  //           if (!(curr.invitee.id in acc)) {
  //             acc[curr.invitee.id] = curr;
  //           } else if (curr.invitationStatus === 'ACCEPTED') {
  //             acc[curr.invitee.id] = curr;
  //           }
  //           return acc;
  //         }, {});

  //       let counter = 0
  //       const newAttendees = Object.values(uniqueAttendeesDict).map((attendee: any, idx: number) => {
  //         if (attendee.invitationStatus === 'ACCEPTED') counter++;
  //         return {
  //           ...attendee,
  //           name: [attendee.invitee.user.firstName, attendee.invitee.user.lastName].filter((item: any) => item).join(' '),
  //           company: attendee.invitee.company.name,
  //           email: attendee.invitee.email || attendee.invitee.user.email,
  //           status: attendee.invitee.status,
  //           limited: counter > maximumAttendees
  //         }
  //       });

  //       setAttendees(newAttendees);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [eventId, maximumAttendees]);
  //break

  useEffect(() => {
    getAttendees();
  }, [getAttendees]);

  return {
    data,
    loading,
  };
};
