
import React, { Component, ReactElement } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { match } from 'react-router'
// import { setLoadingOverlay } from '../../store/ui/action'
// import { validatePublicKey } from '../utils/helper'
import { appAuthenticateResponse } from '../../providers/apps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store/root'
import { loginApp } from '../../store/user/action'
import queryString from 'query-string'
import Cookies from 'universal-cookie'
import { History } from 'history'

interface Params {
  usagetoken: string
}

interface ParentProps {
  match: match<Params>
  location: string
  history: History
}

interface DispatchProps {
  loginApp: () => void  
}

type Props = ParentProps & DispatchProps

interface AuthorisationState {
  usagetoken: string
  dataLoaded: boolean
  appInfo: any // @@TODO - fix app info type
  token: any
  redirectRequired: boolean
  redirectUrl: string
  companyDataLoaded: boolean
  companies: any[]
}

let _isMounted = false

class Authorisation extends Component<Props, AuthorisationState> {
  public constructor (props: Props) {
    super(props)

    this.state = {
      redirectRequired: false,
      redirectUrl: null,
      usagetoken: null,
      dataLoaded: false,
      appInfo: {
        Name: '',
        CompanyName: '',
        CompanyLogo: '',
        RequestedScopes: [
          'PROFILE_INFO',
          'CONTACT_INFO', // Email address & phone number
          'FRIENDS', // Who your friends are (if they've allowed access also?)
          'COMPANY_INFO', // Execute stuff on a company level?
          'CALENDAR', // Ability to sync calendar
          'FAMILY', // Execute stuff on a family level?
        ]
      },
      token: null,
      companyDataLoaded: false,
      companies:[]
    }
    this.externalRedirect = this.externalRedirect.bind(this)
  }

  public componentDidMount() {
    _isMounted = true
    this.completeVerificationLWI()
  }

  public componentWillUnmount() {
    _isMounted = false
  }

  public completeVerificationLWI () {
    const { loginApp } = this.props
    const queryStr = queryString.parse(location.search)
    const token = queryStr.usagetoken as string
    console.log('token',queryStr.usagetoken)

    // setLoadingOverlay(true)
    let formData = {
      token: token,
      response: true
    }

    appAuthenticateResponse(token, formData)
      .then((result: any) => {
        if (result.result !== 'success') {
          // handle error
          console.log('uh oh')
          // setLoadingOverlay(false)
        } else if (result.result === 'success' && result.data === 'LOGGED_IN') {
          const cookies = new Cookies()
          loginApp()
          this.props.history.push('/')
          // this.setState({
          //   redirectRequired: true,
          //   redirectUrl: '/'
          // }, () => loginApp())
          // cookies.set('isAuthenticated', true, {expires: new Date(Date.now() + 8.64e+7)})

        } else {
          console.log('how did you end up here?!')
          // setLoadingOverlay(false)
          // handle this scenario
        }
      })
      .catch(err => {
        if (err instanceof DOMException) {
          // @TOOD - HANDLE ERRORRR gc 20/09/19
          // setLoadingOverlay(false)
        } else {
          // @TOOD - HANDLE ERRORRR gc 20/09/19
          // setLoadingOverlay(false)
          console.log(err)
        }
      })
  }

  public externalRedirect () {
    if (this.state.redirectRequired) window.location.href = this.state.redirectUrl
  }

  public render() {
    const { dataLoaded, appInfo, companyDataLoaded } = this.state
    return (
      <StyledAuthorisation className='authorisation'>
        {
          this.externalRedirect()
        }
        
        {
          dataLoaded && appInfo && 
          <div className='auth-card'>
            
            
            
          </div>
        }
      </StyledAuthorisation>
    )
  }
}

const StyledAuthorisation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  position: relative;

  .auth-card {
    display: flex;
    flex-direction: column;

    .app-info-name {
      color: var(--inspired);
      font-weight: bold;
    }

    .scopes {
      width: 80%;
      align-self: center;
      margin-top: 1rem;
    }
  }

  .auth-scope {
    align-self: center;
  }

  .agree-btns {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 1rem;

    .no-allow-btn {
      color: var(--inspired);
    }
  }

  @media (max-width: 576px) {
    padding: 15px;
  }

  @media (min-width: 577px) {
    & .auth-card {
      min-width: 375px;
      max-width: 500px;
      padding: 30px;
      background-color: #fff;
      background-clip: border-box;
      border: 1px solid rgba(0,0,0,.125);
      border-radius: .25rem;
    }
  }
`

const mapStateToProps = function (state: AppState) {
  return {
    
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      loginApp
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Authorisation)