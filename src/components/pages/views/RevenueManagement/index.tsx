import React, { useMemo, useEffect, useCallback, useState } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, HeaderWrapper, ContentWrapper } from './components/general';
import Table from 'rc-table';

/** Utils */
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';

/** Constatns */
import { columns } from './columns';

/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';
import Modal from '../../../../Modal';
const RevenueManagement: React.FC<Props> = (props: Props) => {
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
      organiser,
      organiser: {
        company: {
          id: companyId
        } 
      },
    }
  }: any = useQuery(GET_EVENT_INFO);
  const { employees, contents, data, setRefetch } = useData(eventId, companyId);

  const openCreatePricing = useCallback((item = null) => {
    showModal('CREATE_PRICING', null, null, 'lg', {
      contents,
      employees,
      setRefetch,
      item
    });
  }, [contents, employees, setRefetch])

  const columnWithAction = useMemo(() => {
    columns[0].render = (user: any) => {
      return <span onClick={() => setIsOpenModal(true)}>{user}</span>;
    };
    columns[columns.length - 1].render = (price: any) => {
      return (
        <span onClick={() => setIsOpenModal(true)} className="price">
          £ {price}
        </span>
      );
    };

    return [
      ...columns,
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',

        render: (_: any, record: any) => (
          <div>
            <button className="btn-edit btn-purple btn" onClick={() => openCreatePricing(record)}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
        ),
      },
    ];
  }, [])

  useEffect(() => {
    setCurrentPage('RevenueManagement')
  }, [])

  const isOrganiser = userIsOrganiser(user, organiser)

  if (!isOrganiser) {
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
        <h2>Revenue Management</h2>
        <button className="btn-edit btn-purple btn" onClick={() => openCreatePricing()}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </HeaderWrapper>
      <ContentWrapper>
        <Table
          columns={columnWithAction}
          data={data}
          style={{ width: '100%' }}
          scroll={{}}
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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(RevenueManagement)
