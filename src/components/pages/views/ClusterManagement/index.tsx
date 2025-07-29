import React, { useMemo, useEffect, useCallback, useState, Fragment } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faPen, faPenAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { Container, HeaderWrapper, ContentWrapper } from './components/general';
// import Table from 'rc-table';
import Table from '../../_shared/Table';

/** Utils */
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser, userIsAuthorised } from '../../../../util/common';

/** Constatns */
import { columns } from './columns';

/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';
import Modal from '../../../../Modal';


const ClusterManagement: React.FC<Props> = (props: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
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
      eventName,
      organiser,
      menus,
      organiser: {
        company: {
          id: companyId
        } 
      },
    }
  }: any = useQuery(GET_EVENT_INFO);

  const { clusters, attendees, employees, data, setRefetch } = useData(eventId, companyId);


  const openCreateCluster = useCallback((item = null) => {
    showModal('CREATE_CLUSTER', null, null, 'lg', {
      attendees,
      employees,
      setRefetch,
      cluster: item
    });
  }, [attendees, employees, setRefetch])

  const viewCluster = ((item = null) => {

    showModal('VIEW_CLUSTER', 'lg', null, 'xl', {
      attendees,
      employees,
      setRefetch,
      cluster: item
    });

  })

  const columns = [
    {
      name: 'Cluster Name',
      accessor: 'name',
      isSearchFilter: true,
      sortFilter: true,
      thClass: 'text-left',
      tdClass: 'text-left',
    },
    {
      name: 'Members',
      accessor: 'totalMembers',
      sortFilter: true
    },
    {
      name: 'Sub Clusters',
      accessor: 'totalSubClusters',
      sortFilter: true
    }
  ]

  const columnWithAction = useMemo(() => {
    return [
      ...columns,
      {
        Header: 'Action',
        // dataIndex: 'action',
        // key: 'action',
        // @ts-ignore
        name: 'Action',
        Filter: () => null,
        tdClass: 'pr-0',
        accessor: (record: any) => record.is_editable && (
          <div className='d-flex justify-content-center'>
           <div>
            <button className="btn-edit btn-purple btn float-right" onClick={() => viewCluster(record)}>
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
          {/* <div>
            <button className="btn-edit btn-purple btn float-right" onClick={() => openCreateCluster(record)}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </div> */}
          </div>
        ),
      },
    ];
  }, [openCreateCluster])

  useEffect(() => {
    setCurrentPage('ClusterManagement')
  }, [clusters])

  const getData = useMemo(() => {
    return data;
  },[data]);



  const currentMenu = menus.find(menu => {
    let currentUrl = window.location.pathname.split("/").slice(-1)[0];
    return menu?.link?.includes(`/${currentUrl}`);;
})

  const isOrganiser = userIsOrganiser(user, organiser)
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
      {isOpenModal ? <Modal isOpeModal={isOpenModal} onClick={() => setIsOpenModal((prevCheck) => !prevCheck)} /> : ''}
      <HeaderWrapper>
        <h2>Cluster Management</h2>
        <button className="btn-edit btn-purple btn" onClick={() => openCreateCluster()}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </HeaderWrapper>
      <ContentWrapper>
        <Table
          columns={columnWithAction}
          data={clusters}
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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(ClusterManagement)
