import gql from "graphql-tag"

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      startAt
      endAt
      organiser {
        id
        name
        company {
          id
          name
        }
      }
      theme {
        primaryColor
        secondaryColor
      }
      menus {
        id
        label
        link
        type
        userVisible {
          id
          name
        }
        userAdmin {
          id
          name
        }
      }
    }
  }
`;


export const GET_EVENT_INFO = gql`
  {
    eventId @client
    eventName @client
    eventType
    description
    startTime
    endTime
    status
    slug
    menus {
      label
      type
      parameter
      link
      isPublic
      showToAll
      show
      adminOnly
      userVisible
      userAdmin
    }
    menusOrder
    organiser {
      id
      company {
        id
        currency
        name
      }
    }
    theme {
      logoURL
      primaryColour
      secondaryColour
      calendarPrimaryColour
      calendarSecondaryColour
    }
    timezone
    timezoneLocation
    maximumAttendees
    language
    event {
      _id
      name
      name_check
      slug
      description
      description_check
      startAt
      endAt
      id
      createdAt
      updatedAt
      status
      platformEventType
      theme {
        logoURL
        primaryColour
        secondaryColour
        calendarPrimaryColour
        calendarSecondaryColour
      }
      language
      location
      location_check
      timezone
      timezone_check
      timezoneLocation
      maximumAttendees
      qr_code_url
      qr_code_url_check
      privacy
      privacy_check
      legal
      legal_check
      contact_us
      contact_us_check
      your_data
      your_data_check
      header_image
      logo_image_check
      header_image_check
      left_image
      left_image_check
      right_image
      right_image_check
     
      company_preferences
      attendee_preferences
      menus {
        label
        type
        parameter
        link
        isPublic
        showToAll
        show
        adminOnly
        userVisible
        userAdmin
      }
    }
  }
`

export const GET_USER_DATA = gql`
  {
    isLoggedIn
    userData
    companyData
  }
`