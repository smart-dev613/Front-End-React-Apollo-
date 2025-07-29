import React from 'react';

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 300,
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
    width: 300,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 400,
  },
  {
    title: 'Last Update',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 200,
  },
  {
    title: 'Status',
    dataIndex: 'invitationStatus',
    key: 'invitationStatus',
    render: (status: any, _: any) => {
      switch (status) {
        case 'ACCEPTED':
          return <span className="event-status accepted"></span>
        case 'AWAITING':
          return <span className="event-status pending"></span>
        case 'DECLINED':
          return <span className="event-status declined"></span>
      }
      return status
    }
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 100,
  },
]
