import React, { useMemo, useEffect, useCallback } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';
import { useColumn } from './hooks/useColumn';

/** Components */
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Container, HeaderWrapper, ContentWrapper } from './components/general';
//import DataTable from 'react-data-table-component';
import Table from '../../_shared/Table';
import moment from 'moment';
import { DefaultColumnFilter } from '../../_shared/Table';
/** Components */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
/** Utils */
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';
import { columns } from './columns';
import Action from './components/Action';
/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';
import { backgrounds } from 'polished';

const RequestManagement: React.FC<Props> = (props: Props) => {
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
      organiser: {
        company: {
          id: companyId
        }
      },
    }
  }: any = useQuery(GET_EVENT_INFO);
  const { events, setRefetchCalendar } = useData(eventId, companyId);

  useEffect(() => {
    setCurrentPage('RequestManagement')
  }, [])

  const isOrganiser = userIsOrganiser(user, organiser)

  const configColumns = useMemo(() => {


    return [
      ...columns,
      {
        name: 'Product Type',
        isSearchFilter: true,
        id: 'table_start',
        sortFilter: true,
        accessor: (record: any) => record.table_start ? 'Service' : 'Item'
      },
      {
        name: 'Start Date',
        key: 'table_start',
        Header: 'startDate',
        sortFilter: true,
        isSearchFilter: true,
        accessor: (record: any) => record.table_start ? moment(record.table_start).format('DD/MM/YYY HH:mm a') : '-'
      },
      {
        name: 'End Date',
        key: 'table_end',
        Header: 'endDate',
        sortFilter: true,
        isSearchFilter: true,
        accessor: (record: any) => record.table_end ? moment(record.table_end).format('DD/MM/YYY HH:mm a') : '-'
      },
      {
        Header: 'Action',
        name: 'Status',
        // dataIndex: 'action',
        // key: 'action',
        // @ts-ignore
        Filter: () => null,
        sortFilter: false,
        isSearchFilter: false,
        accessor: (record: any) => record.table_status && <Action record={record} setRefetch={setRefetchCalendar} />
      }
    ];

    // let newColumns = JSON.parse(JSON.stringify([...columns]))

    // newColumns[newColumns.length-1].accessor = (val:any) => {
    //   switch (val.tableStatus) {
    //     case 'AWAITING':
    //       return (<div>
    //         <a href='#'> <FontAwesomeIcon icon={faCheckSquare} size={"lg"} /></a>
    //           <a href='#' style={{ margin: '0 10px',borderRadius: "25%", backgroundColor: 'red', padding:'0px 4px', textAlign: 'center', color:'white'}}>
    //             <FontAwesomeIcon icon={faTimes} size={"sm"} />
    //           </a>
    //       </div>)
    //     default:
    //       return (<span>{val.tableStatus}</span>)
    //   }
    // }
    // columns[columns.length-1] = newColumns[newColumns.length-1]
    // return [...columns];
  }, [events])

  if (!isOrganiser) {
    return (
      <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
        <p>You do not have access to this page as you are not an event organiser.</p>
      </Container>
    )
  }

  return (
    <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
      <h2>Request Management</h2>
      <ContentWrapper>
        <Table
          columns={configColumns}
          data={events}
          className="table table-design table-hover"
        />
      </ContentWrapper>
    </Container>
  );
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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(RequestManagement)
