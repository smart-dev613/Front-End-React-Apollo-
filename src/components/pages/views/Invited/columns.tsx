import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { DefaultColumnFilter, SelectColumnFilter  } from '../../_shared/Table'

export const columns = [
  {
    name: 'Name',
    accessor: 'name',
    isSearchFilter: true,
    sortFilter: true,
  },
  {
    name: 'Company',
    accessor: 'company',
    isSearchFilter: true,
    sortFilter: true
  },
  {
    name: 'Email',
    accessor: 'email',
    isSearchFilter: true,
    sortFilter: true
  },
  {
    Header: 'DateInvited',
    name: 'Date Invited',
    accessor: 'updatedAt',
    isSearchFilter: true,
    // @ts-ignore
    Filter: () => null,
  },
  {
    Header: 'status',
    name: 'Status',
    accessor: 'invitationStatus',
    // @ts-ignore
    Filter: () => null,
  },
  {
    Header: 'remove',
    name: 'Remove',
    accessor: 'action',
    // @ts-ignore
    Filter: () => null,
  },
];
// export const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: 'Company',
//     dataIndex: 'company',
//     key: 'company',
//   },
//   {
//     title: 'Email',
//     dataIndex: 'email',
//     key: 'email',
//   },
//   {
//     title: 'Last Active',
//     dataIndex: 'updatedAt',
//     key: 'updatedAt',
//   },
//   {
//     title: 'Status',
//     dataIndex: 'invitationStatus',
//     key: 'invitationStatus',
//   },
//   {
//     title: 'Remove',
//     dataIndex: 'action',
//     key: 'action',
//   },
// ];
