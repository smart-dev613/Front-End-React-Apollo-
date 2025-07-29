import React, { useMemo, useEffect, useCallback } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

import { Container, HeaderWrapper, ContentWrapper } from './components/general';
//import Table from 'rc-table';

import { useTable, useSortBy } from 'react-table'
// import 'antd/dist/antd.css';
 import Table  from '../../_shared/Table';
/* * Utils */
//import DataTable from 'react-data-table-component';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { refundTransaction } from '../../../../providers/pricing';
import { userIsOrganiser, userIsAuthorised } from '../../../../util/common';

/** Constatns */
import { columns } from './columns';

/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';


const handleRefund = async (txnId) => {
  
    const data = await refundTransaction(txnId)
    
}

//Sweet-Alert for archive confirmation
    const handleRefundConfirmation =(record)=> {
      swal({
        title: "Are you sure?",
        text: `Transaction: ${record.id} Amount: ${record.currency?.toUpperCase()} ${record.amount/100}`,
        "icon": "warning",
        "buttons": ['Cancel', 'Proceed'],
        dangerMode: true,
      })
      .then((isConfirmed) => {
        if (isConfirmed) {
          handleRefund(record.txnId)
          .then((next)=>{
            swal({
              text: "Refund successfull!",
              icon: "success",
              buttons: [false],
              timer: 2000,
            });
          })
        } else {
          swal({
            text: "Action Cancelled!",
            buttons: [false],
            timer: 1000
          });
        }
      });
    }


const TransactionHistory: React.FC<Props> = (props: Props) => {
  const {
    ui,
    user,
    setCurrentPage,
    showModal,
  } = props;

  const {
    data: {
      theme,
      slug,
      eventType,
      eventId,
      organiser,
      menus,
      organiser: {
        company: {
          id: companyId
        }
      },
    }
  }: any = useQuery(GET_EVENT_INFO);
  const { employees, contents, data, setRefetch, totalAmount } = useData(eventId, companyId);

  const configColumns = useMemo(() => {
    return [
      ...columns,
      {
        Header: 'Action',
        name: 'Action',
        sortFilter: false,
        accessor:  (record: any) => (
          (record.status === "INCOME") &&
          ((record.refunded) ? 
          "refunded"
          : <button className="btn btn-purple cart-btn-qr" onClick={() => handleRefundConfirmation(record)} style={{fontSize: '1.5rem'}}>refund</button>)
        ),
      },
      // {
      //   name: 'Refund',
      //   Header: 'refund',
      //   accessor: (record: any) => <FontAwesomeIcon style = {{cursor:"pointer", color:"rgb(164, 137, 172)", transform: 'scaleX(-1)'}} icon={faRedo} size={"lg"} />
      // }
    ]
  }, [data])
  useEffect(() => {
    setCurrentPage('TransactionHistory')
  }, [])

  const currentMenu = menus.find(menu => {
    let currentUrl = window.location.pathname.split("/").slice(-1)[0];
    return menu?.link?.includes(`/${currentUrl}`);;
  })

  const isAuthorised = userIsAuthorised(user, organiser, currentMenu)

  if (!isAuthorised) {
    return (
      <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
        <p>You do not have access to this page as you are not an event organiser.</p>
      </Container>
    )
  }

  return (
    <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
      <h2>Transaction History</h2>
      <ContentWrapper>
        <Table
          columns={configColumns}
          data={data}
          className='table table-design table-hover'
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          Revenue:  {organiser?.company?.currency} {totalAmount / 100}
        </div>
      </ContentWrapper>
    </Container>
  )
}

const mapStateToProps = function (state: AppState) {
  return {
    ui: state.ui,
    user: state.user
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      showModal,
      setCurrentPage,
      setIsEditPage
    },
    dispatch
  )
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(TransactionHistory)
