import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMinus, faPlus, faQrcode, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Avatar, PriceSummary, CartMobile } from '../general';
import PayButton from  '../PayButton';

/** Utils */
import { generateListImage } from '../../utils';

/** Types */
import { Props } from './types';

const TablePending: React.FC<Props> = ({ data, updateCartItem, deleteCartItem, eventId })  => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const totalPrice = useMemo(() => data.reduce((acc: any, curr:any) => acc + curr.quantity * curr.pricing.price, 0), [data])
  const totalTax = useMemo(() => data.reduce((acc: any, curr:any) => acc + (isNaN(curr.pricing.tax) ? 0 : (curr.quantity * curr.pricing.price * curr.pricing.tax / 100)), 0), [data])
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
            {/* <th scope="col">Card</th> */}
            {/* <th scope="col">Discount</th> */}
            <th scope="col">Price</th>
            <th scope="col">Tax</th>

            {/* <th scope="col">QR</th>s */}
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => {
            return (
              <tr>
                <td>
                  <Avatar background={generateListImage(item.item_detail.imageURL)} />
                </td>
                <td>{item.item_detail.name}</td>
                <td>{item.pricing.duration}</td>
                <td>
                  <button className="btn btn-purple btn-sm btn-tick" onClick={() => updateCartItem(item.id, -1)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <button className="btn btn-purple btn-sm btn-tick" onClick={() => updateCartItem(item.id, 1)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </td>
                {/* <td>
                  Personal <FontAwesomeIcon icon={faChevronDown} />
                </td> */}
                {/* <td>
                  <div className="cart-discount">10%</div>
                </td> */}
                <td style={{ textTransform: 'uppercase' }}>
                  {isNaN(item.pricing.tax)
                    ? '-'
                    : `${item.pricing.currency} ${(item.quantity * item.pricing.price * +item.pricing.tax) / 100}`}
                </td>
                <td style={{ textTransform: 'uppercase' }}>
                  {item.pricing.currency} {(item.quantity * item.pricing.price).toFixed(2)}
                </td>
                {/* <td>
                  <button className="btn btn-purple cart-btn-qr">
                    <FontAwesomeIcon icon={faQrcode} />
                  </button>
                </td> */}
                <td>
                  <button
                    className="btn btn-danger btn-sm btn-tick cart-btn-qr float-right"
                    onClick={() => deleteCartItem(item.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <CartMobile>
        <div>
          <div>
            <button className="btn btn-purple btn-sm btn-tick">
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span style={{ margin: '0 10px' }}>2</span>
            <button className="btn btn-purple btn-sm btn-tick">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div>
            Card: Personal <FontAwesomeIcon className="icon-down" icon={faChevronDown} />
          </div>
        </div>

        <div>
          <div>
            <button className="btn btn-purple cart-btn-qr">
              <FontAwesomeIcon icon={faQrcode} />
            </button>
          </div>
          <div>
            <button className="btn btn-danger btn-sm btn-tick cart-btn-qr">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      </CartMobile>
      <PriceSummary>
        <div className="pr-2">
          <div style={{ textTransform: 'uppercase' }}>
            Total: {currency} {(totalPrice + totalTax).toFixed(2)}
          </div>

          <PayButton eventId={eventId} addClassName="float-right" />
        </div>
      </PriceSummary>
    </div>
  );
}

export default TablePending;
