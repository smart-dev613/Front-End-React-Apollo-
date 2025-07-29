import React, { useMemo } from 'react';

/** Hooks */
import { useDataController } from './hooks/useDataController';

/** Copmonents */
import { ContentWrapper, ContentHeaderWrapper } from './components/general';
import Table from '../../_shared/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMinus, faPlus, faQrcode, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Avatar, PriceSummary, CartMobile } from './components/general';
import PayButton from './components/PayButton';
import { getEventCartItem, updateCartItemQuantity, deleteEventCartItem } from '../../../../providers/pricing';
import TablePending from './components/TablePending';
import TableHistory from './components/TableHistory';

/** Request */
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Utils */
import { bindActionCreators, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../../../store/ui/action';
import { fetchCarts } from '../../../../store/user/action';
import { generateListImage } from './utils';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';
import { Dispatch } from 'redux';

const Cart: React.FC<Props> = ({ client, fetchCarts }) => {
  const { eventId } = client.readQuery({ query: GET_EVENT_INFO });

  const { dataPending, dataHistory, updateCartItem, deleteCartItem } = useDataController(eventId, fetchCarts);
  const totalPrice = useMemo(() => dataPending.reduce((acc: any, curr: any) => acc + curr.quantity * curr.price, 0), [
    dataPending,
  ]);
  const totalTax = useMemo(
    () =>
      dataPending.reduce(
        (acc: any, curr: any) => acc + (isNaN(curr.tax) ? 0 : (curr.quantity * curr.price * curr.tax) / 100),
        0
      ),
    [dataPending]
  );
  const currency = useMemo(() => (dataPending.length > 0 ? dataPending[0].currency : ''), [dataPending]);
  const columns = [
    {
      Header: 'Avtar',
      accessor: (record: any) => record.imageURL && <Avatar background={generateListImage(record.imageURL)} />,
    },
    {
      name: 'Item',
      accessor: 'name',
      isSearchFilter: true,
      sortFilter: true,
    },
    // {
    //   Header: 'Family Links',
    //   name: 'Family Links',
    //   accessor: (record: any) => <div style={{ textTransform: 'uppercase' }}>{'family links'}</div>,
    //   sortFilter: true,
    // },
    {
      Header: 'duration',
      // name: 'Time',
      name: 'Time',
      accessor: (record: any) => (
        <div style={{ display: 'flex', textTransform: 'uppercase' }}>{record.duration || 'N/A'}</div>
      ),
      // accessor: 'duration',
      sortFilter: true,
    },
    {
      Header: 'quantity',
      name: 'Quantity',
      accessor: (record: any) =>
        record.quantity && (
          <div>
            <button className="btn btn-purple btn-sm btn-tick" onClick={() => updateCartItem(record.id, -1)}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span style={{ margin: '0 10px' }}>{record.quantity}</span>
            <button className="btn btn-purple btn-sm btn-tick" onClick={() => updateCartItem(record.id, 1)}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        ),
      sortFilter: true,
    },
    {
      name: 'Price',
      accessor: 'totalPrice',
      sortFilter: true,
    },
    {
      Header: 'tax',
      name: 'Tax',
      sortFilter: false,
      accessor: (record: any) => (
        <div style={{ textTransform: 'uppercase' }}>
          {currency} {isNaN(record.tax) ? 0 : (record.quantity * record.price * record.tax) / 100}
        </div>
      ),
    },
    {
      Header: 'total price',
      name: 'Total Price',
      sortFilter: false,
      accessor: (record: any) => (
        <div style={{ textTransform: 'uppercase' }}>
          {currency} {(record.quantity * record.price + (record.quantity * record.price * record.tax) / 100).toFixed(2)}
        </div>
      ),
    },
    // {
    //   Header: 'QR',
    //   name: 'QR',
    //   sortFilter: false,
    //   accessor: (record: any) => (
    //     <button className="btn btn-purple btn-sm btn-tick" onClick={() => console.log('open qr code')}>
    //       <FontAwesomeIcon size={'lg'} icon={faQrcode} />
    //     </button>
    //   ),
    // },
    {
      Header: 'Cancel',
      name: '',
      tdClass: '',
      accessor: (record: any) => (
        <button
          className="btn btn-danger btn-sm btn-tick cart-btn-qr float-right"
          onClick={() => deleteCartItem(record.id)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      ),
    },
  ];

  return (
    <>
      <ContentWrapper className="main-container container-fluid page-container py-4">
        <ContentHeaderWrapper>
          <h2>Cart</h2>
        </ContentHeaderWrapper>
          {(dataPending.length > 0) ? (
            <>
               <Table columns={columns} data={dataPending} className="table table-design table-hover" />
                <div className="mt-6 w-lg-35 w-100 float-right">
                <div className="bg-gray-50 rounded-lg px-4 w-30 py-6 sm:p-6 lg:p-8">
                <h2 className="sr-only">Order summary</h2>

                <div className="flow-root">
                  <dl className="-my-4 text-sm">
                    <div className="py-2 d-flex justify-content-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd className="font-medium text-gray-900">{currency?.toUpperCase()} {totalPrice.toFixed(2)}</dd>
                    </div>
                    <div className="py-2 d-flex justify-content-between">
                      <dt className="text-gray-600">Tax</dt>
                      <dd className="font-medium text-gray-900">{currency?.toUpperCase()} {totalTax.toFixed(2)}</dd>
                    </div>
                    <div className="py-2 d-flex justify-content-between">
                      <dt className="text-base font-medium text-gray-900">Order total</dt>
                      <dd className="text-base font-medium text-gray-900">{currency?.toUpperCase()} {(totalPrice + totalTax).toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="mt-10">
                <PayButton eventId={eventId} addClassName="btn-lg" />
              </div>
            </div>
            </>
          ) : (
            <div className="d-flex justify-content-center">
              <p>Cart is empty</p>
            </div>
          )}
           

            {/* <div style={{ margin: '40px 0' }} /> */}
            {/* <CartMobile>
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
            </CartMobile> */}

         
            <PriceSummary>

            </PriceSummary>
            {/* <div className="container">
        `<div className="row">
          <div className="col-12">
            <h2 className="mb-3">Your Shopping Cart</h2>
          </div>
        </div>
        
        <div className="row border-bottom py-3">
          <div className="col-12">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <p className="mb-2 text-muted">Product</p>
              <div className="mb-2">
                <span className="font-weight-bold">Price</span>
              </div>
              <div className="mb-2">
            
              <span className="font-weight-bold">Qty</span>
              </div>
              <div className="mb-2">
                <span className="font-weight-bold">Total</span>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div className="col-12 col-md-5">
                <h4 className="mb-1">Product Title</h4>
                <p className="mb-2 text-muted">Product Description</p>
              </div>
              <div className="mb-2">
                <span className="font-weight-bold">$19.99</span>
              </div>
              <div className="mb-2">
              <div>
                  <button className="btn btn-purple btn-sm" onClick={() => updateCartItem('1', -1)}>
                    <FontAwesomeIcon icon={faMinus} size={'sm'} />
                  </button>
                  <span style={{ margin: '0 10px' }}>{1}</span>
                  <button className="btn btn-purple btn-sm" onClick={() => updateCartItem('1', 1)}>
                    <FontAwesomeIcon icon={faPlus} size={'sm'} />
                  </button>
                </div>
              <span className="font-weight-bold">$19.99</span>
              </div>
              <div className="mb-2">
                <span className="font-weight-bold">$19.99</span>
              </div>
            </div>
          </div>
        </div> */}
       

       

        
      </ContentWrapper>
    </>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage,
      fetchCarts,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Cart);
