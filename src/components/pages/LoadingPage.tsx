import React, { Component } from 'react'
import styled from 'styled-components'

interface LoadingPageProps {
  text?: string
  children?: any
  extra?: any
}

class LoadingPage extends Component<LoadingPageProps, {}> {
  public render () {
    return (
      <StyledLoadingPage>
        <div className='container'>
          <div className='card'>
            <div className='card-body'>
              <p className='card-text'>{this.props.text || this.props.children}</p>
              {this.props.extra}
            </div>
          </div>
        </div>
      </StyledLoadingPage>
    )
  }
}

const StyledLoadingPage = styled.div`
  background: #f5f5f5;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: center;

  > .container {
    width: 40rem;
    text-align: center;

    .card-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1.25rem;

      .brand-logo {
        width: 150px;
      }

      .btn {
        display: flex;

        img {
          height: 20px;
        }
      }
    }
  }

  .card-body > .card-text {
    margin-top: 1em;
  }
`

export default LoadingPage