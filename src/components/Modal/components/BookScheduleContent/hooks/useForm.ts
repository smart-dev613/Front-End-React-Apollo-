/** Hooks */
import { useCallback } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import {
  newPlatformEventSlot,
  newPlatformEventPricingSlot,
  updateEventSchedule,
} from '../../../../../providers/events';
import { addContentToCart } from '../../../../../providers/pricing';
import { useHistory } from 'react-router';

export const useForm = (eventId: any, data: any) => {
  const {
    user,
    isView,
    event,
    eventsRaw,
    isMeeting,
    employees,
    contents,
    venues,
    selectedEmployee,
    selectedContent,
    selectedVenue,
  } = data;
  const history = useHistory();
  const bookMeeting = useCallback(
    async (values: any) => {
      try {
        // Parse the time slot into start and end moments
        const [startTime, endTime] = values.time_slot.split(' - ');
        const startAtValue = moment(`${values.date} ${startTime}`, 'YYYY-MM-DD HH:mm');
        const endAtValue = moment(`${values.date} ${endTime}`, 'YYYY-MM-DD HH:mm');

        // Find the selected content
        const content = contents?.find((c) => c.id === selectedContent[0]?.value);
        // Set default availability weeks if not provided
        const availabilityWeeks =
          content.pricingMaster?.availability_weeks?.length > 0
            ? content.pricingMaster.availability_weeks
            : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        // Validate availability if constraints are enabled
        if (content?.startDate && content?.endDate && content?.isConstraintAvailable) {
          const contentStart = moment(new Date(content.startDate), 'YYYY-MM-DD HH:mm');
          const contentEnd = moment(new Date(startAtValue.toDate()))
            .startOf('day')
            .add(moment.duration(moment(content.endDate).format('HH:mm')));

          const day = startAtValue.format('dddd').toLowerCase();

          if (
            !(
              startAtValue.isSameOrAfter(contentStart) &&
              endAtValue.isSameOrBefore(contentEnd) &&
              availabilityWeeks.includes(day)
            )
          ) {
            alert(
              `Slot not available. Booking available on ${availabilityWeeks.join(', ')} between ${
                content.startDate
              } to ${content.endDate}`
            );
            return;
          }
        }

        // Prepare the payload
        const venueId = content?.selectedVenue ? JSON.parse(content.selectedVenue).value : undefined;
        const invitees = [
          ...selectedEmployee.map((item) => item.value),
          ...(values.attendees?.map((item) => item.value) ?? []),
        ];
        const eventType = invitees.length ? 'PLATFORM_EVENT_SLOT' : 'PLATFORM_EVENT_SLOT';

        const payload = {
          name: 'Meeting',
          eventID: eventId,
          startAt: startAtValue.toISOString(),
          endAt: endAtValue.toISOString(),
          venueID: values.venue?.value ?? venueId,
          invitees,
          eventType,
        };
        console.log('payload', payload);
        // Call the API
        const { errors, data }: any = await newPlatformEventSlot(payload);
        if (errors) {
          if (!errors.msg) throw new Error(errors[0].message);
        }
        // history.push('/');
        return data?.createEvent;
      } catch (error) {
        console.error('Error creating event:', error);
        throw error;
      }
      // try {

      //   const timeToken = values.time_slot.split(' - ');
      //   const startAtValue = moment(`${values.date} ${timeToken[0]}`, 'YYYY-MM-DD HH:mm');
      //   const endAtValue = moment(`${values.date} ${timeToken[1]}`, 'YYYY-MM-DD HH:mm');
      //   console.log(`startAtValue: ${startAtValue} endAtValue: ${endAtValue}`)

      //   const content = contents?.find((c) => c.id === selectedContent[0]?.value);
      //   console.log(`content.startDate: ${content.startDate} content.endDate: ${content.endDate}`)
      //   let availability_weeks = content.pricingMaster?.availability_weeks
      //   availability_weeks = availability_weeks > 0 ?  availability_weeks : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

      //   if (content?.startDate && content?.endDate && content?.isConstraintAvailable) {

      //     console.log("availability validation: ", content)

      //     const contentStart = moment(new Date(content.startDate), 'YYYY-MM-DD HH:mm');
      //     const contentEnd = moment(new Date(startAtValue.toDate()))
      //       .startOf('day')
      //       .add(moment.duration(moment(content.endDate).format('HH:mm')));

      //     console.log(`contentStart: ${contentStart} contentEnd: ${contentEnd}`)

      //     const day = moment(startAtValue).format('dddd').toLowerCase();

      //     if (
      //       !(
      //         moment(startAtValue.format('YYYY-MM-DD HH:mm')) >= contentStart &&
      //         endAtValue <= contentEnd &&
      //         availability_weeks?.includes(day)
      //       )
      //     ) {
      //       console.log("availability: ", content.pricingMaster?.availability_weeks)
      //        alert(
      //          `Slot not available. Booking available on ${content.pricingMaster?.availability_weeks} between ${content.startDate} to ${content.endDate}`
      //        );
      //       return;
      //     }
      //   }

      //   const venueId = content?.selectedVenue ? JSON.parse(content.selectedVenue).value : undefined;
      //   const invitees = [...selectedEmployee.map((item: any) => item.value),...(values.attendees?.map((item: any) => item.value)) ?? []]

      //   const eventType = invitees?.length ? `PLATFORM_EVENT_SLOT` : "PLATFORM_EVENT_SLOT"

      //   const payload = {
      //     name: 'Meeting',
      //     eventID: eventId,
      //     startAt: startAtValue.toISOString(),
      //     endAt: endAtValue.toISOString(),
      //     venueID: values.venue?.value ?? venueId,
      //     invitees: invitees,
      //     eventType: eventType,
      //   };

      //   const { errors, data }: any = await newPlatformEventSlot(payload);
      //   if (errors) throw new Error(errors[0].message);

      //   return data?.createEvent

      // } catch (error) {
      //   console.log(error);
      //   throw error;
      // }
    },
    [selectedEmployee]
  );

  const updateEventBookingSchedules = useCallback(
    async (values) => {
      try {
        const timeToken = values.time_slot.split(' - ');
        const startAtValue = moment(`${values.date} ${timeToken[0]}`, 'YYYY-MM-DD HH:mm');
        const endAtValue = moment(`${values.date} ${timeToken[1]}`, 'YYYY-MM-DD HH:mm');
        const calendarSlotId = values.calendarSlotId;

        const content = contents.find((c) => c.id == values?.contentId);

        const venueId = values?.venue?.value;
        // const invitees = [...selectedEmployee.map((item: any) => item.value),...(values.attendees?.map((item: any) => item.value)) ?? []]

        const payload = {
          eventID: eventId,
          calendarSlotID: calendarSlotId,
          startAt: startAtValue.toISOString(),
          endAt: endAtValue.toISOString(),
          ...(venueId && { venueID: venueId }),
          ...(content?.id && { contentID: content?.id }),
          eventType: content?.id ? 'PLATFORM_EVENT_PRICING_SLOT' : 'PLATFORM_EVENT_SLOT',
        };

        const { errors }: any = await updateEventSchedule(payload);
        // const { errors }: any = await newPlatformEventSlot(payload);
        if (errors) throw new Error(errors[0].message);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    [eventId, selectedContent]
  );

  const createPlatformEventPricingSlot = useCallback(
    async (values) => {
      console.log('input', values);
      try {
        const timeToken = values.time_slot.split(' - ');
        const startAtValue = moment(`${values.date} ${timeToken[0]}`, 'YYYY-MM-DD HH:mm');
        const endAtValue = moment(`${values.date} ${timeToken[1]}`, 'YYYY-MM-DD HH:mm');
        const content = contents.find((c) => c.id == selectedContent[0].value);

        const venueId = content?.selectedVenue ? JSON.parse(content.selectedVenue).value : undefined;
        const invitees = [
          ...selectedEmployee.map((item: any) => item.value),
          ...(values.attendees?.map((item: any) => item.value) ?? []),
        ];

        const payload = {
          name: 'Meeting',
          eventID: eventId,
          startAt: startAtValue.toISOString(),
          endAt: endAtValue.toISOString(),
          contentID: selectedContent[0].value,
          pricingID: values.content_package?.value ?? content?.pricingMaster?.id,
          venueID: values.venue?.value ?? venueId,
          invitees: invitees,
          eventType: 'PLATFORM_EVENT_PRICING_SLOT',
        };
        const { errors }: any = await newPlatformEventPricingSlot(payload);
        // const { errors }: any = await newPlatformEventSlot(payload);
        if (errors) {
          !errors.msg;
          throw new Error(errors[0].message);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    [eventId, selectedContent]
  );

  const checkBookingMeetingSlot = useCallback(
    (values: any) => {
      try {
        const timeToken = values.time_slot.split(' - ');
        const startAtValue = moment(`${values.date} ${timeToken[0]}`, 'YYYY-MM-DD HH:mm');
        const endAtValue = moment(`${values.date} ${timeToken[1]}`, 'YYYY-MM-DD HH:mm');

        for (let idx = 0; idx < selectedEmployee.length; idx++) {
          const employee = selectedEmployee[idx];
          if (eventsRaw[employee.value]) {
            const existingEvents = eventsRaw[employee.value].filter((item: any) => {
              if (!item.platformEventSlot) return false;

              const {
                invitationStatus,
                platformEventSlot: { startAt, endAt, venue },
              } = item;

              let statusBool = invitationStatus !== 'DECLINED';
              let dateBool = false;
              let venueBool = venue && values.venue.value && values.venue.id === venue.id;

              const startAtEvent = moment(startAt);
              const endAtEvent = moment(endAt);

              if (startAtEvent.isBetween(startAtValue, endAtValue)) dateBool = true;
              if (endAtEvent.isBetween(startAtValue, endAtValue)) dateBool = true;

              return statusBool && dateBool && venueBool;
            });

            if (existingEvents.length) return false;
          }
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    [eventsRaw, selectedEmployee, selectedVenue]
  );

  const checkBookingContentSlot = useCallback(
    (values: any) => {
      try {
        const timeToken = values.time_slot.split(' - ');
        const startAtValue = moment(`${values.date} ${timeToken[0]}`, 'YYYY-MM-DD HH:mm');
        const endAtValue = moment(`${values.date} ${timeToken[1]}`, 'YYYY-MM-DD HH:mm');

        const packageEmployees = values.content_package.employee;
        if (packageEmployees && packageEmployees.length) {
          for (let idx = 0; idx < packageEmployees.length; idx++) {
            const employee = packageEmployees[idx];
            // test fetch value appropriately
            const empValue = values.content_package.value;

            if (eventsRaw[employee.value]) {
              const existingEvents = eventsRaw[employee.value].filter((item: any) => {
                const {
                  invitationStatus,
                  platformEventSlot: { startAt, endAt, venue },
                } = item;

                let statusBool = invitationStatus !== 'DECLINED';
                let dateBool = false;

                const startAtEvent = moment(startAt);
                const endAtEvent = moment(endAt);

                if (startAtEvent.isBetween(startAtValue, endAtValue)) dateBool = true;
                if (endAtEvent.isBetween(startAtValue, endAtValue)) dateBool = true;

                return statusBool && dateBool;
              });

              if (existingEvents.length) return false;
            }
          }
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    [eventsRaw]
  );

  const checkBookingSlot = useCallback(
    (values: any) => {
      try {
        return isMeeting ? checkBookingMeetingSlot(values) : checkBookingContentSlot(values);
      } catch (error) {
        console.log(error);
      }
    },
    [isMeeting, checkBookingMeetingSlot, checkBookingContentSlot]
  );

  return {
    bookMeeting,
    createPlatformEventPricingSlot,
    checkBookingSlot,
    updateEventBookingSchedules,
  };
};
