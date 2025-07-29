import React from 'react';

export const columns = [
  {
    title: 'Type',
    dataIndex: 'name',
    key: 'name',
    
  },
  {
    title: 'Employee',
    dataIndex: 'pricing_employee',
    key: 'pricing_employee',
   
    render: (val: any) => {
      return val
        .map((item: any) => [item.user.firstName, item.user.lastName].filter(user => user).join(' '))
        .join(', ')
    }
  },
  {
    title: 'Day & Time',
    dataIndex: 'pricing_availability_weeks',
    key: 'pricing_availability_weeks',
    
    render: (val:any, record:any) => {
      return [
        (record.pricing_availability_weeks || []).join(', '),
        (record.pricing_availability_hours || []).join(' - ')
      ].join(' ')
    }
  },
  {
    title: 'Session',
    dataIndex: 'pricing_duration',
    key: 'pricing_duration',
    
  },
  {
    title: 'Slots',
    dataIndex: 'pricing_slots',
    key: 'pricing_slots',
   
  },
  {
    title: 'Price',
    dataIndex: 'pricing_price',
    key: 'pricing_price',
   
  },
]
