import React, { useMemo } from 'react';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Avatar, PriceSummary } from '../General';
import PayButton from  '../PayButton';
import { getEventCartItem, updateCartItemQuantity, deleteEventCartItem } from '../../../../../providers/pricing';
/** Utils */
import { generateListImage } from '../../utils';

/** Types */
import { Props } from './types';

const TablePending: React.FC<Props> = ({ data, updateCartItem, deleteCartItem, eventId })  => {

  const totalPrice = useMemo(() => data.reduce((acc: any, curr:any) => acc + curr.quantity * curr.pricing.price, 0), [data])
  const currency = useMemo(() => data.length > 0 ? data[0].pricing.currency : '', [data])

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
            <th scope="col"></th>
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
                  <td>
                    <button
                      className="btn btn-primary btn-sm btn-tick"
                      onClick={() => updateCartItem(item.id, -1)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span style={{ margin: '0 10px' }}>{ item.quantity }</span>
                    <button
                      className="btn btn-primary btn-sm btn-tick"
                      onClick={() => updateCartItem(item.id, 1)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </td>
                  <td style={{ textTransform: 'uppercase' }}>{ item.pricing.currency } { item.quantity * item.pricing.price }</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm btn-tick"
                      onClick={() => deleteCartItem(item.id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <PriceSummary>
        <div>
          <div style={{ textTransform: 'uppercase' }}>Total: {currency} {totalPrice}</div>
          
          <PayButton eventId={eventId} />
        </div>
      </PriceSummary>
    </div>
  )
}

export default TablePending;
