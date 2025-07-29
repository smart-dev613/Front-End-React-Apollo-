import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/root'
import styled from 'styled-components'
import { MetroSpinner } from 'react-spinners-kit'
import SynkdLogo from '../assets/images/synkd-icon.png'
interface StateProps {
  isStateLoading: boolean
}

interface ParentProps {
  isParentloading?: boolean
}

type Props = StateProps & ParentProps

export class Loading extends Component<Props, {}> {

  public render() {
    const { isStateLoading, isParentloading } = this.props
    return (
      <>
        {isStateLoading || isParentloading
          ? <StyledPending>
                        <img className='loadingBackground' src={SynkdLogo} alt='Loading' />
            <MetroSpinner
              size={95}
              loading={isStateLoading || isParentloading}
              // backColor='#0C2136'
              // frontColor='#2DC3CA'
            />
          </StyledPending>
          : null}
      </>
    )
  }
}

const StyledPending = styled.div`
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
    
  img.loadingBackground{
    position:absolute;
    /* background-color: rgba(0, 0, 0, 0.4); */
    height: 60px;
    width: 60px;
  }
`

const mapStateToProps = function (state: AppState) {
  return {
    isStateLoading: state.ui.isLoading
  }
}

export default connect(mapStateToProps)(Loading)