import React from 'react';

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Last Update',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: 'Status',
    dataIndex: 'invitationStatus',
    key: 'invitationStatus',
    render: (status: any, _: any) => {
      switch (status) {
        case 'ACCEPTED':
          return <span className="event-status accepted"></span>;
        case 'AWAITING':
          return <span className="event-status pending"></span>;
        case 'DECLINED':
          return <span className="event-status declined"></span>;
      }
      return status;
    },
  },
  {
    title: 'QR',
    dataIndex: 'qr',
    key: 'qr',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];
