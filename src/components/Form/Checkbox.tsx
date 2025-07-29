import React, { Component } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core'
import { Translation, Trans } from 'react-i18next'
import PropTypes from 'prop-types'

interface DefaultProps {
  checked: false,
  disabled: false
} 

interface CheckboxState {
  checked: boolean
}

type Props = DefaultProps

class Checkbox extends Component <Props, CheckboxState> {
    
  public constructor(props: Props) {
    super(props)
    this.state = {
      checked: false
    }
  }
  
  public _handleChange = () => {
    this.setState({
      checked: !this.state.checked
    })
  }
  
  public render() {
    const { disabled } = this.props
    const { checked } = this.state
    return (
      <Translation>
        {
          () =>
            <label>
              <input
                type="checkbox"
                className="React__checkbox--input"
                checked={checked}
                disabled={disabled}
                onChange={this._handleChange}
              />
              <span className="React__checkbox--span" />
            </label>
            
        }
      </Translation>
    )
  }
}

// Checkbox.propTypes = {
//   checked: PropTypes.bool,
//   disabled:PropTypes.bool
// }

const StyledCheckbox = styled.div`
$brand: #00CECC;
$checkboxSize: 50px;
$uncheckedBG: black;
$checkedBG: $brand;
$checkedColor: black;
$disabledBG: rgba(0, 0, 0, .35);

* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.App {
  display: flex;
  position: absolute;
  background: #111111;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.React__checkbox--input {
  display: none;
}

.React__checkbox--input {
  + span {
    color: red;
    display: flex;
    width: $checkboxSize;
    height: $checkboxSize;
    background: $uncheckedBG;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 5px;
    border: 0px solid $brand;
    box-sizing: border-box;
    transition: all 150ms;
  }
  &:checked {
    + span {
      border-width: $checkboxSize / 2;
      &::before {
        content: 'check';
        font-family: 'Material Icons';
        font-size: 40px;
        color: $checkedColor;
      }
    }
  }
  &:disabled {
    + span {
      background: $disabledBG;
    }
  }
}
`
  
export default Checkbox