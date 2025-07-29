import React, { useMemo, useEffect } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Container } from './components/general';

/** Utils */
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';

/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';

const Home: React.FC<Props> = (props: Props) => {
  const { ui, user, setCurrentPage } = props;

  const {
    data: { theme, slug, eventType, organiser },
  }: any = useQuery(GET_EVENT_INFO);

  useEffect(() => {
    setCurrentPage('Cart');
  }, []);

  const isOrganiser = userIsOrganiser(user, organiser);

  return <Container ui={ui} theme={theme} className="container-fluid page-container py-4"></Container>;
};

const mapStateToProps = function (state: AppState) {
  return {
    ui: state.ui,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      showModal,
      setCurrentPage,
      setIsEditPage,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Home);
