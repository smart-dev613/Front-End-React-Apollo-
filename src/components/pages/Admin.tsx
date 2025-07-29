import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, compose } from 'redux';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavTile from '../NavTile';

import { AppState } from '../../store/root';
import { UIState } from '../../store/ui/types';
import { UserState } from '../../store/user/types';
import { setCurrentPage } from '../../store/ui/action';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { GET_EVENT_INFO } from '../../gql/queries';
import LoadingPage from './LoadingPage';
import { userIsOrganiser } from '../../util/common';

interface HomeProps {
  ui: UIState;
  user: UserState;
  client: ApolloClient<any>;
  theme: any;
}

interface DispatchProps {
  setCurrentPage: any;
}

interface AdminState {
  slug: string;
  organiser: any;
  theme: any;
}

type Props = HomeProps & DispatchProps;

class Admin extends Component<Props, AdminState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      slug: '',
      organiser: {},
      theme: {},
    };
  }

  public componentDidMount() {
    this.props.setCurrentPage('Admin');
    const { slug, organiser, theme } = this.props.client.readQuery({
      query: GET_EVENT_INFO,
    });
    this.setState({ slug, organiser, theme });
  }

  public render() {
    if (Object.keys(this.state.organiser).length === 0) return null;
    let isOrganiser = userIsOrganiser(this.props.user, this.state.organiser);
    // if (!isOrganiser)
    //   return (
    //     <StyledAdmin isError={true}>
    //       <p className="error-message">
    //         You do not have access to this page as you are not an event organiser.
    //       </p>
    //     </StyledAdmin>
    //   );

    return (
      <StyledAdmin isError={false}>
        <NavTile theme={this.state.theme} icon="setup" target={`/${this.state.slug}/settings`}>
          Settings
        </NavTile>
        <NavTile theme={this.state.theme} icon="employees" target={`/${this.state.slug}/invited`}>
          Invited
        </NavTile>
        <NavTile theme={this.state.theme} icon="transactions" target={`/${this.state.slug}/transaction-history`}>
          Transactions
        </NavTile>
        <NavTile theme={this.state.theme} icon="spaces" target={`/${this.state.slug}/spaces`}>
          Spaces
        </NavTile>
        <NavTile theme={this.state.theme} icon="cluster-management" target={`/${this.state.slug}/cluster-management`}>
          Cluster Management
        </NavTile>
        <NavTile theme={this.state.theme} icon="request-management" target={`/${this.state.slug}/request-management`}>
          Request Management
        </NavTile>
      </StyledAdmin>
    );
  }
}

const StyledAdmin = styled.div<{ isError: boolean }>`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  margin: auto;
  /* margin-top: 20%; */
  width: ${({ isError }) => (isError ? '100%' : '250px')};

  .error-message {
    text-align: center;
    margin: 0 2em;
  }
`;

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      setCurrentPage,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Admin);
