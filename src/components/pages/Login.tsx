import React, { Component } from 'react'
import ApolloClient from 'apollo-client'
import { withApollo } from 'react-apollo'

import LoadingPage from './LoadingPage'
import { GET_EVENT_INFO } from '../../gql/queries'
import Button from '../Form/Button'
import styled from 'styled-components'

interface LoginProps {
  client: ApolloClient<any>
}

class Login extends Component<LoginProps, {}> {
  public constructor (props: LoginProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  public handleLogin () {
    const { eventId, slug } = this.props.client.readQuery({ query: GET_EVENT_INFO })
    const baseURL = process.env.REACT_APP_INS_ENV ==="staging" ? 'https://my-dev.synkd.life' : 'https://my.synkd.life'
    console.log("REACT_APP_INS_ENV: ", process.env.REACT_APP_INS_ENV)
    let redirTo = baseURL
    let qsp = ['redirect=event', `id=${slug}`]
    window.location.href = `${redirTo}?${qsp.join('&')}`
  }

  public handleSignup () {
    const { eventId, slug } = this.props.client.readQuery({ query: GET_EVENT_INFO })

     const baseURL = process.env.REACT_APP_INS_ENV ==="staging" ? 'https://my-dev.synkd.life' : 'https://my.synkd.life'
    let redirTo = baseURL

    let qsp = ['redirect=event', `id=${slug}`]
    window.location.href = `${redirTo}/signup?${qsp.join('&')}`
  }

  public render () {
    const { eventName } = this.props.client.readQuery({ query: GET_EVENT_INFO })

    return (
      <LoadingPage>
        <StyledLogin>
          <p>Welcome to <strong>{eventName}</strong>.<br />You must login or signup to access this event.</p>
          <Button text='Login' addClassName='loginbtn btn-purple' style={{display:'inline-block'}} 
          onClick={this.handleLogin} />
          <Button text='Signup' addClassName='signupbtn btn-purple' style={{display:'inline-block'}} 
                  onClick={this.handleSignup} />
        </StyledLogin>
      </LoadingPage>
    )
  }
}

const StyledLogin = styled.div`
  .btn-primary {
    display: inline-block !important;
  }

  .signupbtn {
    margin-left: 1em;
  }
`

export default withApollo(Login)