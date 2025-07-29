import { AiOutlineConsoleSql } from 'react-icons/ai';
import { parseFenixToken, parseCurrentCompany } from '../util/session';
import { graphQLManual } from './core/common';
import { makePostRequest, makeGetRequest } from './core/common';

const apiEndpoint: any = process.env.GRAPHQL_ENDPOINT;

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

export const getMe = async () => {
  const query = `
   query me {
      me
    }
  `;

  return ((await graphQLManual({ query })) as any).json();
};

/**
 * Checks to see if user is already logged in/has a session
 * @returns JSON object
 */
export const sessionRequest = async (eventID: string) => {
  const r = {
    result: 'error',
    User: null as any,
    Company: null as any,
    Attendance: null as any,
    AllCompanies: null as any,
    action: '',
  };

  let meQuery = `
    query me {
      me
    }
  `;

  let getMe = await ((await graphQLManual({ query: meQuery })) as any).json();

  console.log('getMe: ', getMe);

  if (getMe.data && getMe.data.me) {
    r.User = getMe.data.me;
  } else {
    // Probably not logged in
    return r;
  }

  let currentCompanyQuery = `
    {
      getCurrentCompany
    }
  `;

  let getCurrentCompany = await ((await graphQLManual({ query: currentCompanyQuery })) as any).json();

  let currMem;

  if (getCurrentCompany.data && getCurrentCompany.data.getCurrentCompany) {
    currMem = getCurrentCompany.data.getCurrentCompany.membership;

    let currCompany = getCurrentCompany.data.getCurrentCompany.company;

    if ((!currMem || currMem.length === 0) && !r.action) {
      r.action = 'COMPANY_REQUIRED';
    }

    r.Company = currCompany;
  } else {
    // Something is wrong?

    return r;
  }

  let res: any = {};

  if (r.Company) {
    const query = `
      {
        checkEventAttendance(data: {
          eventID: "${eventID}",
          eventType: PLATFORM_EVENT
        })
      }
    `;
    res = await ((await graphQLManual({ query })) as any).json();
  }

  if (res.data && res.data.checkEventAttendance) {
    r.Attendance = res.data.checkEventAttendance;
  } else {
    r.Attendance = [];
  }

  const query = `
    {
      myCompanies
    }
  `;

  let mcres = await ((await graphQLManual({ query })) as any).json();

  if (mcres.data && mcres.data.myCompanies && mcres.data.myCompanies.companyMemberships) {
    r.AllCompanies = mcres.data.myCompanies.companyMemberships;
  } else {
    r.AllCompanies = [];
  }

  r.result = 'success';

  return r;
};

export const updateContentStatus = (eventId: string, contentId: string, status: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation {
        archiveRestorePlatformEventContent(data: {
          eventId: "${eventId}",
          contentId:"${contentId}",
          contentStatus: "${status}"
        })
      }
    `;
    return graphQLManual({ query })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};
export const eventInvitationUpdate = (attendeeID: string, status: string, cartId = '') => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation {
        respondToInvite(data: {
          ${cartId ? `cartId: "${cartId}",` : ''}
          invitationID: "${attendeeID}",
          invitationStatus: ${status}
        })
      }
    `;
    return graphQLManual({ query })
      .then((response: Response) => {
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

export const archiveInvitation = (attendeeID: string, status: string, cartId = '') => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation {
        archiveInvitation(data: {
          ${cartId ? `cartId: "${cartId}",` : ''}
          invitationID: "${attendeeID}",
          invitationStatus: ${status}
        })
      }
    `;
    return graphQLManual({ query })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};

export const recordQRCodeScan = (userId: string, eventId: string, companyMembershipId: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation {
        QRCodeScan(data: {
          ${companyMembershipId ? `companyMembershipId: "${companyMembershipId}",` : ''}
          userId: "${userId}",
          eventId: "${eventId}"
        })
      }
    `;
    return graphQLManual({ query })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};
export const getAvatarUploadToken = (eventID: string, key: string) => {
  return new Promise((resolve, reject) => {
    const query = `
        mutation($key : String!) {
          getS3POSTUploadToken(type: 3, data:{
            eventId: "${eventID}",
            key: $key
          })
        }
      `;
    return graphQLManual({ query, variables: { key } })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};

export const switchCompany = (_id: string, id: string, eventId: string) => {
  console.log(`switching _id: ${_id}, id: ${id} eventId: ${eventId}`);
  return new Promise((resolve, reject) => {
    // Notice _id and id are exchanged in the mutation query below
    // Temporal fix to clear Type mismatch error

    const query = `
      mutation switchCompany($data: SwitchCompanyInput!) {
        switchCompany(data: $data)
      }
    `;

    const variables = {
      data: {
        id: id,
        eventID: eventId,
      },
    };

    return graphQLManual({ query, variables })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err: any) => {
        console.log('Switching error: ', err);
        alert(JSON.stringify(err));
        reject(err);
      });
  });
};

// export const switchCompany = (id: string, _id: number) => {
//   return new Promise((resolve, reject) => {
//     const requestPayload = {
//       query: `
//         mutation switchCompany($_id: Int!, $id: String!) {
//           switchCompany(data: {_id: $_id, id: $id})
//         }
//       `,
//       variables: {
//         _id: _id,
//         id: id
//       }
//     }

//     fetch(process.env.GRAPHQL_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       mode: 'cors',
//       credentials: 'include',
//       body: JSON.stringify(requestPayload)
//     })
//       .then((response) => {
//         resolve(response.json())
//       })
//       .catch(err => reject(err))
//   })
// }

export const getUserCompanies = () => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        myCompanies
      }
    `;

    return graphQLManual({ query })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err: any) => reject(err));
  });
};
