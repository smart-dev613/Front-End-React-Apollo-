import React, { SFC } from 'react'

import Logo from '../assets/images/favicon.ico'

interface LWI {
  appKey: string
}

const handleLogin = (key: string) => {
}

const LoginWithInspired: SFC<LWI> = ({ appKey }) => {
  return (
    <a href={`https://my.synkd.life/authorise/${appKey}`} className='btn btn-secondary' onClick={() => handleLogin(appKey)}>
      <img src={Logo} />
      Login with Inspired
    </a>
  )
}

export default LoginWithInspired
