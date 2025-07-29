import { DefaultColumnFilter } from '../../_shared/Table';

export const columns = [
  {
    name: 'No',
    accessor: 'table_idx',
    isSearchFilter: true,
    sortFilter: true,
  },
  {
    name: 'Product Name',
    accessor: 'table_name',
    sortFilter: true,
    isSearchFilter: true
  },
  {
    name: 'Buyer',
    accessor: 'table_user',
    isSearchFilter: true,
    sortFilter: true,
  },
  {
    name: 'Quantity',
    accessor: 'table_quantity',
    isSearchFilter: true,
    sortFilter: true,
  }
]
