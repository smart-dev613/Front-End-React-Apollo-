import React from 'react'
import styled from 'styled-components'

interface ToggleState {
  isChecked: boolean
}

interface ToggleProps {
  isChecked: boolean
}

class Toggle extends React.Component<ToggleProps, ToggleState> {
  public constructor(props: ToggleProps) {
    super(props)
    this.state = {
      isChecked: props.isChecked || false,
    }
    
    this.handleChange = this.handleChange.bind(this)
  }

  public handleChange() {
    this.setState({ isChecked: !this.state.isChecked })
  }
  public render () {
    return (
      <StyledComponents>
        <label className="switch">
          <input type="checkbox" />
          {/* value={this.state.isChecked} onChange={this.handleChange} */}
          <div className="slider"></div>
        </label>
      </StyledComponents>
    )
  }
}

const StyledComponents = styled.div`
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    outline: none;
  }
  .switch input {
    position: absolute;
    top: -99999px;
    left: -99999px;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 34px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #2196F3;
  }
  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`

export default Toggle