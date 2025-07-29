export const columns = [
  // {
  //   name: 'Order Id',
  //   dataIndex: 'order',
  //   accessor: 'order',
  //   sortFilter: true,
  //   isSearchFilter: true
  // },
  {
    name: 'Txn ID',
    dataIndex: 'id',
    accessor: 'id',
    sortFilter: true,
    isSearchFilter: true
  },
  {
    name: 'Date',
    dataIndex: 'create_date',
    accessor: 'create_date',
    sortFilter: true,
   
  },
  {
    name: 'Time',
    dataIndex: 'create_time',
    accessor: 'create_time',
    sortFilter: true,
   
  },
  {
    name: 'User',
    dataIndex: 'user_fullname',
    accessor: 'user_fullname',
    sortFilter: true,
    isSearchFilter: true
   
  },
  {
    name: 'Amount',
    dataIndex: 'pricing_label',
    accessor: 'pricing_label',
    sortFilter: true
  }
]
