import React from 'react';

/** Hooks */
import { useDataController } from './hooks/useDataController';

/** Copmonents */
import { ContentWrapper, ContentHeaderWrapper } from './components/General';

import Table from '../_shared/Table';


import TablePending from './components/TablePending';
import TableHistory from './components/TableHistory';

/** Request */
import { GET_EVENT_INFO } from '../../../gql/queries';

/** Utils */
import { bindActionCreators, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../store/root';
import { Dispatch } from 'redux';

const Cart: React.FC<Props> = ({ client }) => {
  
  const columns = [
    {
      name: '',
      accessor: 'user_name',
      isSearchFilter: true,
      sortFilter: true
    },
    {
      name: 'Item',
      accessor: 'name',
      isSearchFilter: true,
      sortFilter: true
    },
    {
      name: 'Time',
      accessor: 'duration',
      sortFilter: true
    },
    {
      name: 'Quantity',
      accessor: 'quantity',
      sortFilter: true
    },
    {
      name: 'Quantity',
      accessor: 'quantity',
      sortFilter: true
    },
    {
      name: 'Price',
      accessor: 'totalPrice',
      sortFilter: true
    },
    {
      name: '',
      accessor: 'cancel'
    }
  ]

  const { eventId } = client.readQuery({ query: GET_EVENT_INFO });

  const { dataPending, dataHistory, updateCartItem, deleteCartItem } = useDataController(eventId);

  return (
    <>
      <ContentWrapper className="main-container container-fluid">
        <ContentHeaderWrapper>
         
        </ContentHeaderWrapper>
        <TablePending
          data={dataPending}
          eventId={eventId}
          updateCartItem={updateCartItem}
          deleteCartItem={deleteCartItem}
        />
        <div style={{ margin: '40px 0' }} />
        <TableHistory
          data={dataHistory}
          eventId={eventId}
        />
      </ContentWrapper>
    </>
  )
}

const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page,
    user: state.user
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage
    },
    dispatch
  )
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Cart);
