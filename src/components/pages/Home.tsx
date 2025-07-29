import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GET_EVENT_INFO } from '../../gql/queries'
import NavTile from '../NavTile'
import { AppState } from '../../store/root'
import { UIState } from '../../store/ui/types'
import { UserState } from '../../store/user/types'
import { setCurrentPage } from '../../store/ui/action'
import { Translation, Trans } from 'react-i18next'

interface HomeState {
  eventDescription: string;
  eventName: string
  slug: string
  theme: any
  
}

interface HomeProps {
  ui: UIState,
  user: UserState,
  client: ApolloClient<any>
}

interface DispatchProps {
  setCurrentPage: any
}

type Props = HomeProps & DispatchProps

class Home extends Component<Props, HomeState> {

  public constructor(props: Props) {
    super(props)
    this.state = {
      eventDescription: '',
      eventName: '',
      slug: '',
      theme: {},
     
    }
  }

  public componentDidMount() {
    this.props.setCurrentPage('Dashboard')
    this.getEventInfo()
  }

  public getEventInfo() {
    const { description, eventName, slug, theme } = this.props.client.readQuery({ query: GET_EVENT_INFO })
    this.setState({
      eventDescription: description,
      eventName,
      slug,
      theme,
      
    })
  }

  public render() {
    return (
      <>
        <Translation>
          {() => (
            <StyledHome className="main-container container">
              {this.state.eventDescription && (
                <>
                  <div
                    className="event-info"
                    style={{
                      marginTop: '30px',
                      padding: '10px 10px',
                      border: '1px solid rgb(237, 237, 237)',
                      borderRadius: '4px',
                    }}
                  >
                    <h5>{this.state.eventName}</h5>
                  </div>
                  <div
                    className="event-info"
                    style={{
                      marginTop: '30px',
                      marginBottom: '30px',
                      padding: '10px 10px',
                      border: '1px solid rgb(237, 237, 237)',
                      borderRadius: '4px',
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {this.state.eventDescription}
                      {'jnjdfnskndjfsdfkjl'}
                    </p>
                  </div>
                </>
              )}
              <div className="home-nav icon-style">
                {/* <div className='icon-placement'> */}
                <div className="row no-side-margin">
                  <NavTile theme={this.state.theme} icon="cal" target={`/${this.state.slug}/calendar`}>
                    {' '}
                    <Trans i18nKey="DashCalendar">trans</Trans>
                  </NavTile>
                  {/* <NavTile theme={this.state.theme} icon="tic" target={`/${this.state.slug}/ticket`}>
                    {' '}
                    <Trans i18nKey="DashCalendar">trans</Trans>
                  </NavTile> */}
                  <NavTile theme={this.state.theme} icon="company" target={`/${this.state.slug}/companies`}>
                    <Trans i18nKey="DashCompany">trans</Trans>
                  </NavTile>
                  <NavTile theme={this.state.theme} icon="qr" target={`/${this.state.slug}/qr`} comingSoon>
                    <Trans i18nKey="DashQrCode">trans</Trans>
                  </NavTile>
                  <NavTile theme={this.state.theme} icon="agenda" target={`/${this.state.slug}/content`}>
                    <Trans i18nKey="DashContent">trans</Trans>
                  </NavTile>
                  <NavTile theme={this.state.theme} icon="attendees" target={`/${this.state.slug}/attendees`}>
                    <Trans i18nKey="DashAttendees">trans</Trans>
                  </NavTile>
                  <NavTile theme={this.state.theme} icon="admin" target={`/${this.state.slug}/admin`}>
                    <Trans i18nKey="DashAdmin">trans</Trans>
                  </NavTile>
                </div>
                {/* </div> */}
                {/* <div className='row'>
                    <NavTile icon='cal' target='/calendar' fontAwesome>Calendar</NavTile>
                    <NavTile icon='notes' target='/notes' fontAwesome>Notes</NavTile>
                    <NavTile icon='agenda' target='/events'>Events</NavTile>
                    <NavTile icon='company' target='/companies' >Company Search</NavTile>
                    <NavTile icon='admin' target='/' >Company Search</NavTile>
                  </div> */}
              </div>
            </StyledHome>
          )}
        </Translation>
      </>
    );
  }
}

const StyledHome = styled.div`
  .overview {
    .brandIcon { 
      width: 50px;
    }
  }

  .event-info{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 560px;

    .col-sm {
      height: 130px;
      .nav-tile {
        height: 100%;
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: #ffffff;
        /* background: #343a40; */
        box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.3);
        border-radius: 5px;
        font-size: 1.25em;

        p {
          margin: auto;
        }
      }
    }
    @media only screen and (max-width: 576px) {
      width: 250px;
    }
    @media only screen and (min-width: 576px) {
      .no-side-margin {
        /* height: calc(64vh - 54px); */
        width: 250px;
        /* position: absolute; */
        /* left: 11%; */
        /* top: 27%; */
        /* padding: 0%; */
      }

      .icon-style {
        display: flex;
        justify-content: center;
        align-items: center;
        
      }
    }  
      @media only screen and (min-width: 577px) and (max-width: 1023px) {
      .no-side-margin {
        /* height: calc(44vh - 54px); */
        width: 250px;
        /* position: absolute; */
        /* left: 11%; */
        /* top: 27%; */
        padding: 0%;
      }
    }
 
        // @media only screen and (max-width: 320px) {
        //   .icon-placement{
        //     height: calc(100vh - 54px);
        //     width: 100%;
        //     position: absolute;
        //     left: 0%;
        //     top: 11%;
        //     padding: 8%;
        //   }
        // }
        // @media only screen and (min-width: 576px) {
        //   .icon-placement {
        //     height: calc(100vh - 54px);
        //     width: 100%;
        //     position: absolute;
        //     left: 11%;
        //     top: 27%;
        //     padding: 14%;
        //   }
        // }
        // @media only screen and (min-width: 1024px) {
        //   .icon-placement {
        //     position: absolute;
        //     left: 8%;
        //     top: 18%;
        //     padding:25%;
        //   }
        // }
        // @media only screen and (min-width: 1025px) {
        //   .icon-placement {
        //     position: absolute;
        //     left: 5%;
        //     top:-30%;
        //     padding:32%;
        //   }    
        // }
`

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setCurrentPage
  },
    dispatch)
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Home)
