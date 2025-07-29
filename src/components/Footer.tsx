import React, { Component } from 'react'
import styled from 'styled-components'

import logo from '../assets/images/inspired_logo.png'

class Footer extends Component {
  public render () {
    return (
      <StyledFooter>
        <div className='footer-left'>
          <span>Powered by <a href='https://synkd.life' target='_blank' rel='noopener noreferrer'><img src={logo} /></a></span>
        </div>
        <div className='footer-right'>
          <span><a href='https://synkd.life/privacypolicy.pdf'>Privacy</a></span>
        </div>
      </StyledFooter>
    )
  }
}

const StyledFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  font-size: 0.75em;
  padding: 0.5em 1em;
  background: #efeded;
  font-weight: 100;
   .footer-left {
    float: left;

    img {
      width: 60px;
      margin-left: 0.25em;
      display: inline-block;
      position: relative;
      top: -0.5px;
    }
  }

  .footer-right {
    float: right;
  }
`;

export default Footer