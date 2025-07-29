import { graphQLManual, makePostRequest } from './core/common';

const apiEndpoint: any = process.env.REACT_APP_GRAPHQL_ENDPOINT;

interface NotificationItem {
  id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  type: string;
  invitationStatus: string;
  notificationStatus: string;
  sender: string;
  created_at: string;
  read: boolean;
}

export const updateEventSettings = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateEvent(
        $id: String!,
        $name: String!,
        $name_check: Boolean,
        $description: String,
        $description_check: Boolean,
        $startAt: DateTime,
        $endAt: DateTime,
        $primaryColour: String,
        $secondaryColour: String,
        $calendarPrimaryColour: String,
        $calendarSecondaryColour: String,
        $logoURL: String,
        $timezone: String,
        $timezoneLocation: String,
        $location: String,
        $location_check: Boolean,
        $qr_code_url: String,
        $qr_code_url_check: Boolean,
        $privacy: String,
        $privacy_check: Boolean,
        $legal: String,
        $legal_check: Boolean,
        $contact_us: String,
        $contact_us_check: Boolean,
        $your_data: String,
        $your_data_check: Boolean,
        $logo_image_check: Boolean,
        $header_image: String,
        $header_image_check: Boolean,
        $left_image: String,
        $left_image_check: Boolean,
        $right_image: String,
        $right_image_check: Boolean,
        $menus: [PlatformEventMenuSettings!],
      ) {
        updateEvent(data: {
          id: $id,
          eventType: PLATFORM_EVENT,
          name: $name,
          name_check: $name_check,
          description: $description,
          description_check: $description_check,
          startAt: $startAt,
          endAt: $endAt,
          platformEventTheme: {
            logoURL: $logoURL,
            primaryColour: $primaryColour,
            secondaryColour: $secondaryColour
            calendarPrimaryColour: $calendarPrimaryColour,
            calendarSecondaryColour: $calendarSecondaryColour,
          }
          timezone: $timezone,
          timezoneLocation: $timezoneLocation,
          language: ${formData.language},
          location: $location,
          location_check: $location_check,
          qr_code_url: $qr_code_url,
          qr_code_url_check: $qr_code_url_check,
          privacy: $privacy,
          privacy_check: $privacy_check,
          legal: $legal,
          legal_check: $legal_check,
          contact_us: $contact_us,
          contact_us_check: $contact_us_check,
          your_data: $your_data,
          your_data_check: $your_data_check,
          logo_image_check: $logo_image_check,
          header_image: $header_image,
          header_image_check: $header_image_check,
          left_image: $left_image,
          left_image_check: $left_image_check,
          right_image: $right_image,
          right_image_check: $right_image_check,
          menus: $menus
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const updateEventThemeField = (id: any, value: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateEvent(
        $id: String!,
        $primaryColour: String,
        $secondaryColour: String,
        $logoURL: String,
      ) {
        updateEvent(data: {
          id: $id,
          eventType: PLATFORM_EVENT,
          platformEventTheme: {
            logoURL: $logoURL,
            primaryColour: $primaryColour,
            secondaryColour: $secondaryColour
          }
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        id,
        ...value,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const updateEventOneField = (id: any, field: any, value: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateEvent(
        $id: String!
      ) {
        updateEvent(data: {
          id: $id,
          eventType: PLATFORM_EVENT,
          ${field}: "${value}"
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        id,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const updateEventArrayOneField = (id: any, field: any, value: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateEvent(
        $id: String!
      ) {
        updateEvent(data: {
          id: $id,
          eventType: PLATFORM_EVENT,
          ${field}: [${value.join(', ')}]
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        id,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const publishEvent = (eventId: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation publishEvent($id: String!) {
        publishEvent(data: {
          id: $id,
          eventType: PLATFORM_EVENT
        })
      }
    `;

    graphQLManual({
      query,
      variables: { id: eventId },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const sendEventInvitation = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createEventInvitation($id: String!, $inviteeEmails: [String!]!) {
        createEventInvitation(data: {
          eventID: $id,
          eventType: PLATFORM_EVENT,
          inviteeEmails: $inviteeEmails
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const createNewEventSubCluster = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createNewEventSubCluster($id: String!, $name: String!, $userIds: [String!]!) {
        createNewEventSubCluster(data: {
          eventId: $id,
          name: $name,
          userIds: $userIds
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const createNewEventCluster = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createNewEventCluster($id: String!, $name: String!, $userIds: [String!]!, $subCluster: [String!]!) {
        createNewEventCluster(data: {
          eventId: $id,
          name: $name,
          userIds: $userIds,
          subCluster: $subCluster
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getPlatformEventMembers = (id: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getPlatformEventMembers(data: {
          id: "${id}",
          eventType: PLATFORM_EVENT
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getUserQRCodeScan = (userId: string, eventId: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getUserQRCodeScan(data: {
          eventId: "${eventId}",
          userId: "${userId}",
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventAttendees = (id: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getEventAttendees(data: {
          id: "${id}",
          eventType: PLATFORM_EVENT
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventInvitation = (invitationID: string) => {
  return new Promise((resolve, reject) => {
    const query = `{
        getEventInvitation (invitationID : "${invitationID}")
       }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getIndividualCalendar = (id: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getIndividualCalendar(companyMembershipID: "${id}")
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEmployeeCalendar = (ids: string[]) => {
  return new Promise((resolve, reject) => {
    const query = `
      query getEmployeeCalendar($ids: [String!]!){
        getEmployeeCalendar(companyMembershipIDs: $ids)
      }
    `;

    graphQLManual({
      query,
      variables: {
        ids: Array.isArray(ids) ? ids.filter((id) => id !== null) : [ids],
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventCompanies = (id: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getEventCompanies(data: {
          id: "${id}",
          eventType: PLATFORM_EVENT
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventVenues = (id: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getEventVenues(data: {
          id: "${id}",
          eventType: PLATFORM_EVENT
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};
export const getAllClusters = () => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getAllClusters
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};
export const getItems = (id: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getEventVenues(data: {
          id: "${id}",
          eventType: PLATFORM_EVENT
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};
export const getAllEventContents = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getAllEventContents(data: {
          eventId: "${id}"
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getCalendarInvitationList = (id: string[]) => {
  return new Promise((resolve, reject) => {
    const query = `
      query getCalendarInvitationList($memIds: [String!]!) {
        getCalendarInvitationList(data: {
          memIds: $memIds
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        memIds: id?.filter((id) => id !== null),
      },
    })
      .then((response: any) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

// export const updatePlatformEventContent = (formData: any) => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       mutation updatePlatformEventContent($id: String!, $name: String!, $description: String, $startAt: DateTime, $endAt: DateTime) {
//         updateEvent(data: {
//           id: $id,
//           eventType: PLATFORM_EVENT,
//           name: $name,
//           description: $description,
//           startAt: $startAt,
//           endAt: $endAt
//         })
//       }
//     `

//     graphQLManual({
//       query,
//       variables: formData
//     })
//       .then((response: Response) => {
//         resolve(response.json())
//       })
//       .catch(err => reject(err))
//   })
// }

export const newVenue = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createPlatformEventVenue($name: String!, $maxAttendees: Int!, $platformEventID: String!, $type: EventVenueType!, $link: String!) {
        createPlatformEventVenue(data: {
          platformEventID: $platformEventID,
          name: $name,
          maxAttendees: $maxAttendees,
          link: $link,
          type: $type
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const deleteVenue = (id: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation deletePlatformEventVenue($id: String!) {
        deletePlatformEventVenue(data: {
          id: $id
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        id,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const updateVenue = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updatePlatformEventVenue($name: String!, $maxAttendees: Int!, $id: String!, $type: EventVenueType!, $link: String!) {
        updatePlatformEventVenue(data: {
          id: $id,
          name: $name,
          maxAttendees: $maxAttendees,
          type: $type,
          link: $link
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const newPlatformEventSlot = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createEvent($eventID: String, $name: String!, $startAt: DateTime!, $endAt: DateTime!, $venueID: String!, $invitees: [String!], $eventType: EventType!) {
        createEvent(data:{
          name: $name,
          eventID: $eventID
          startAt: $startAt,
          endAt: $endAt,
          venueID: $venueID,
          invitees: $invitees,
          eventType: $eventType
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const newPlatformEventPricingSlot = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createEvent($eventID: String!, $name: String!, $startAt: DateTime!, $endAt: DateTime!, $contentID: String!, $pricingID: String, $invitees: [String!], $eventType: EventType!, $venueID: String) {
        createEvent(data:{
          name: $name,
          eventID: $eventID,
          startAt: $startAt,
          endAt: $endAt,
          contentID: $contentID,
          pricingID: $pricingID,
          eventType: $eventType
          venueID: $venueID,
          invitees: $invitees,
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const updateEventSchedule = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateEventSchedule($eventID: String!, $name: String, $startAt: DateTime!, $endAt: DateTime!,  $calendarSlotID: String!, $venueID: String, $contentID: String, $eventType: EventType!) {
        updateEventSchedule(data:{
          name: $name,
          eventID: $eventID,
          startAt: $startAt,
          endAt: $endAt,
          calendarSlotID: $calendarSlotID,
          contentID: $contentID,
          venueID: $venueID,
          eventType: $eventType
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const newContent = (formData: any) => {
  console.log('response', 'THis is response');
  console.log('response_data', formData);
  return new Promise((resolve, reject) => {
    const query = `
      mutation createPlatformEventContent(
        $eventId: String!,
        $name: String!,
        $body: String,
        $imageURL: String,
        $linkURL: String,
        $keywords: [String!],
        $links: [ContentLinkInput!],
        $images: [String!],
        $subContentType: String!,
        $selectedVenue: String,
        $isCartAvailable: Boolean,
        $isScheduleAvailable: Boolean,
        $isPricingAvailable: Boolean,
        $isConstraintAvailable: Boolean,
        $isVenueChecked: Boolean,
        $startDate: DateTime,
        $endDate: DateTime,
        $pricingType: PricingContentType,
        $pricingMaster: CreatePricingInput,
        $pricingEmployee: [CreatePricingEmployeeInput!],
        $userNotificationList: [String!]
      ) {
        createPlatformEventContent(data: {
          eventId: $eventId,
          name: $name,
          body: $body,
          imageURL: $imageURL,
          linkURL: $linkURL,
          keywords: $keywords,
          links: $links,
          images: $images,
          subContentType: $subContentType,
          isCartAvailable: $isCartAvailable,
          isScheduleAvailable: $isScheduleAvailable,
          isPricingAvailable: $isPricingAvailable,
          isConstraintAvailable: $isConstraintAvailable,
          isVenueChecked: $isVenueChecked,
          selectedVenue: $selectedVenue,
          startDate: $startDate,
          endDate: $endDate,
          pricingType: $pricingType,
          pricingMaster: $pricingMaster,
          pricingEmployee: $pricingEmployee,
          userNotificationList: $userNotificationList
        })
      }
    `;
    graphQLManual({
      query,
      variables: formData,
    }).then(async (response: Response) => {
      const res = await response.json();
      const result = res.data?.createPlatformEventContent;
      const contentId = result?.id;
      const pricingId = result?.pricingId;
      console.log('New Content ID:', contentId, pricingId);
      resolve({contentId, pricingId}); // or return whole res if needed
      // resolve(pricingId);
    });
    // .then((response: Response) => {
    //   // console.log('response_data', response.json());
    //   resolve(response.json());
    // })
    // .catch((err) => reject(err));
  });
};

export const updateContent = (formData: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updatePlatformEventContent(
        $contentId: String!, 
        $eventId: String!,
        $name: String!,
        $body: String,
        $imageURL: String,
        $linkURL: String,
        $keywords: [String!],
        $links: [ContentLinkInput!],
        $images: [String!],
        $subContentType: String!,
        $isCartAvailable: Boolean,
        $isScheduleAvailable: Boolean,
        $isPricingAvailable: Boolean,
        $isConstraintAvailable: Boolean,
        $isVenueChecked: Boolean,
        $selectedVenue: String,
        $startDate: DateTime,
        $endDate: DateTime,
        $pricingType: PricingContentType,
        $pricingMaster: CreatePricingInput,
        $pricingEmployee: [CreatePricingEmployeeInput!],
        $userNotificationList: [String!]
      ) {
        updatePlatformEventContent(data: {
          contentId: $contentId,
          eventId: $eventId,
          name: $name,
          body: $body,
          imageURL: $imageURL,
          linkURL: $linkURL,
          keywords: $keywords,
          links: $links,
          images: $images,
          subContentType: $subContentType,
          isCartAvailable: $isCartAvailable,
          isScheduleAvailable: $isScheduleAvailable,
          isPricingAvailable: $isPricingAvailable,
          isConstraintAvailable: $isConstraintAvailable,
          isVenueChecked: $isVenueChecked,
          selectedVenue: $selectedVenue,
          startDate: $startDate,
          endDate: $endDate,
          pricingType: $pricingType,
          pricingMaster: $pricingMaster,
          pricingEmployee: $pricingEmployee,
          userNotificationList: $userNotificationList
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventSchedule = (id: string) => {
  // console.log('ids', id)
  return new Promise((resolve, reject) => {
    const query = `
      {
        getIndividualCalendar(companyMembershipID: "${id}")
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

//Make a booking from calendar
export const makeBooking = (id: string) => {
  // console.log('ids', id)
  return new Promise((resolve, reject) => {
    const query = ``;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

// Get event data
export const getEventData = (eventID: string) => {
  // console.log('ids', id)
  return new Promise((resolve, reject) => {
    const query = `
    query getEvent {
      getEvent(data: {
        slug: "${eventID}",
        eventType: PLATFORM_EVENT
      })
    }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

// Resend event invite
export const resendEventInvite = async (eventInvitationID: string) => {
  const query = `
    mutation {
      resendEventInvitation(data: {
        eventInvitationID: "${eventInvitationID}",
        eventType: PLATFORM_EVENT
      })
    }
  `;

  // @ts-ignore
  let res: Response = await graphQLManual({ query });
  return await res.json();
};

export const sendContentNotification = async (formData: { eventId: string; contentId: string; emails: string[] }) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation sendContentNotification(
        $eventId: String!,
        $contentId: String!,
        $emails: [String!]!
      ) {
        sendContentNotification(data: {
          eventId: $eventId,
          contentId: $contentId,
          emails: $emails
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEmployeeDetails = (employeeID: String) => {
  return new Promise((resolve, reject) => {
    makePostRequest(process.env.GRAPHQL_ENDPOINT, {
      query: `
        query getEmployeeDetails($employeeID: String!) {
          getEmployeeDetails(data: { employeeID: $employeeID })
        }
      `,
      variables: {
        employeeID,
      },
    })
      // @ts-ignore
      .then((response: Response) => resolve(response.json()))
      // @ts-ignore
      .catch((err) => console.log(err));
  });
};

export const getAllEventContentsPricing = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getAllEventContentsPricing(data: {
          eventId: "${id}"
        })
      }
    `;

    graphQLManual({
      query,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventPricingDetail = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query getEventContentPricing ($eventId: String!, $contentId: String!, $contentPricingId: String!) {
        getEventContentPricing(data: {
          eventId: $eventId,
          contentId: $contentId,
          contentPricingId: $contentPricingId
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        ...data,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventSubCluster = (eventId: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query getEventSubCluster ($eventId: String!) {
        getEventSubCluster(data: {
          eventId: $eventId
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        eventId,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getEventClusters = (eventId: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query getEventClusters ($eventId: String!) {
        getEventClusters(data: {
          eventId: $eventId
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        eventId,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};
export const getEventCustomCluster = (eventId: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query getEventCustomCluster ($eventId: String!) {
        getEventCustomCluster(data: {
          eventId: $eventId
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        eventId,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const updateEventSubCluster = async (formData: {
  eventId: string;
  crmSubclusterId: string;
  name: string;
  users: string[];
}) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateEventSubCluster(
        $eventId: String!,
        $crmSubclusterId: String!,
        $name: String!,
        $users: [String!]!
      ) {
        updateEventSubCluster(data: {
          eventId: $eventId,
          crmSubclusterId: $crmSubclusterId,
          name: $name,
          users: $users
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const updateEventCustomCluster = async (formData: {
  eventId: string;
  crmClusterId: string;
  name: string;
  users: string[];
}) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateEventCustomCluster(
        $eventId: String!,
        $crmClusterId: String!,
        $name: String!,
        $users: [String!]!
      ) {
        updateEventCustomCluster(data: {
          eventId: $eventId,
          crmClusterId: $crmClusterId,
          name: $name,
          users: $users
        })
      }
    `;

    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getRequestToJoinEventList = async (eventId: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      query getRequestToJoinEventList(
        $eventId: String!
      ) {
        getRequestToJoinEventList(data: {
          eventId: $eventId
        })
      }
    `;

    graphQLManual({
      query,
      variables: {
        eventId,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const requestToJoinEvent = async (data: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation requestToJoinEvent(
        $eventId: String!,
        $user: String!,
        $companyMembership: String
      ) {
        requestToJoinEvent(data: {
          eventId: $eventId,
          user: $user,
          companyMembership: $companyMembership
        })
      }
    `;

    graphQLManual({
      query,
      variables: data,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const reponseRequestToJoinEvent = async (data: any) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation reponseRequestToJoinEvent(
        $requestId: String!,
        $response: InvitationStatus!
      ) {
        reponseRequestToJoinEvent(data: {
          requestId: $requestId,
          response: $response
        })
      }
    `;

    graphQLManual({
      query,
      variables: data,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const eventInvitationUpdate = (invitationID: string, invitationStatus: string) => {
  const notificationStatus = 'READ';
  return new Promise((resolve, reject) => {
    makePostRequest(apiEndpoint, {
      query: `
        mutation respondToInvite($invitationID: String!, $invitationStatus: InvitationStatus!, $notificationStatus: NotificationStatus!) {
          respondToInvite(data: {
            invitationID: $invitationID,
            invitationStatus: $invitationStatus,
            notificationStatus: $notificationStatus,
          })
        }
      `,
      variables: {
        invitationID,
        invitationStatus,
        notificationStatus,
      },
    })
      // return graphQLManual({query})
      .then((response: any) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};

export const eventInviteBulkResponse = (notifications: any, invitationStatus: string) => {
  const notificationData = notifications.map((notification: NotificationItem) => ({
    notificationID: notification.id,
    invitationStatus: invitationStatus,
    notificationStatus: 'READ',
    type: notification.type,
  }));

  return new Promise((resolve, reject) => {
    makePostRequest(apiEndpoint, {
      query: `
        mutation eventInviteBulkResponse($notifications: [NotificationInput!]!, $invitationStatus: InvitationStatus!) {
          eventInviteBulkResponse(data: {
            notifications: $notifications,
            invitationStatus: $invitationStatus
          })
        }
      `,
      variables: {
        notifications: notificationData,
        invitationStatus: invitationStatus,
      },
    })
      // return graphQLManual({query})
      .then((response: any) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};

export const updateBulkNotifications = (notifications: any, notificationStatus: string) => {
  const notificationData = notifications.map((notification: NotificationItem) => ({
    notificationID: notification.id,
    notificationStatus: notification.notificationStatus,
    type: notification.type,
  }));

  return new Promise((resolve, reject) => {
    makePostRequest(apiEndpoint, {
      query: `
        mutation updateBulkNotications($notifications: [NotificationInput!]!, $notificationStatus: NotificationStatus!) {
          updateBulkNotifications(data: {
            notifications: $notifications,
            notificationStatus: $notificationStatus
          })
        }
      `,
      variables: {
        notifications: notificationData,
        notificationStatus,
      },
    })
      // return graphQLManual({query})
      .then((response: any) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};
export const updateNotification = (notificationID: string, type: string, notificationStatus: string) => {
  return new Promise((resolve, reject) => {
    makePostRequest(apiEndpoint, {
      query: `
        mutation updateNoticationStatus($notificationID: String!, $type: String!, $notificationStatus: NotificationStatus!) {
          updateNoticationStatus(data: {
            notificationID: $notificationID,
            type: $type,
            notificationStatus: $notificationStatus
          })
        }
      `,
      variables: {
        notificationID,
        type,
        notificationStatus,
      },
    })
      // return graphQLManual({query})
      .then((response: any) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};

export const getEventNotificationList = async (eventId: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      query getEventNotificationList(
        $eventId: String!
      ) {
        getEventNotificationList(eventId: $eventId)
      }
    `;

    graphQLManual({
      query,
      variables: {
        eventId,
      },
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};
