import React from 'react';

/** Components */
import { Avatar } from '../General';

/** Utils */
import { generateListImage } from '../../utils';

/** Types */
import { Props } from './types';

const TableHistory: React.FC<Props> = ({ data, eventId })  => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Item</th>
            <th scope="col">Time</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total Price</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((item: any) => {
              return (
                <tr>
                  <td><Avatar background={generateListImage(item.item_detail.imageURL)} /></td>
                  <td>{ item.item_detail.name }</td>
                  <td>{ item.pricing.duration }</td>
                  <td>{ item.quantity }</td>
                  <td style={{ textTransform: 'uppercase' }}>{ item.pricing.currency } { item.quantity * item.pricing.price }</td>
                  <td>{ item.status }</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default TableHistory;
