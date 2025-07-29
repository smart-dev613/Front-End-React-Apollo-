import React, { useState, useEffect } from 'react';

/** Hooks */
import { useDataController } from './hooks/useDataController';

/** Components */
import AddButton from './components/AddButton';
import PayButton from './components/PayButton';
import DummyAddForm from './components/DummyAddForm';
import Table from './components/Table';
import ListFormat from '../ListFormat';

/** Request */
import { GET_EVENT_INFO } from '../../../gql/queries';

/** Utils */
import styled from 'styled-components';
import { bindActionCreators, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../store/root';
import { Dispatch } from 'redux';

const PricingItems: React.FC<Props> = ({ client }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { eventId, organiser } = client.readQuery({ query: GET_EVENT_INFO });

  const { data, contents, employees } = useDataController(eventId, organiser.company.id);

  return (
    <>
      <ContentWrapper className="main-container container-fluid">
        {/* <ContentHeaderWraooer>
          <AddButton onClick={() => setOpenModal(true)} />
        </ContentHeaderWraooer> */}
        <DummyAddForm employees={employees} contents={contents} eventId={eventId} />
        {/* <Table data={data} /> */}

        {
          data.map((list: any) => (
            <ListFormat
              key={list.id}
              type="content"
              ListData={{ ...list, type: 'content' }}
              truncateText={(str: string) => {
                if (str.length > 140) return str.substring(0, 140) + " ...";
                else return str;
              }}
              loadEvents={() => {}}
            />
          ))
        }
      </ContentWrapper>
    </>
  )
}

const ContentWrapper = styled.div`
  margin-top: 1em;
`

const ContentHeaderWraooer = styled.div`
  display: flex;
  justify-content: flex-end;
`

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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(PricingItems);
