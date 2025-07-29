import React from 'react'
import styled from 'styled-components'
// @ts-ignore
import { SketchPicker } from 'react-color'

interface ColourPickerProps {
  onChange: (e: any) => void
  colour: any
  disabled?: boolean
}
interface ColourPickerState {
  displayColorPicker: boolean
  color: any
}

class ColourPicker extends React.Component<ColourPickerProps, ColourPickerState> {
  public constructor(props: ColourPickerProps) {
    super(props)
    this.state = {
      displayColorPicker: false,
      color: (this.props.colour ? this.props.colour : {})
     
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  public handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  public handleClose() {
    this.setState({ displayColorPicker: false })
  };

  public handleChange(color: any) {
    this.setState({ color: color.rgb })
    if (this.props.onChange) {
      this.props.onChange(color)
    }
  };

  public render() {
    return (
      <StyledColourPicker
        color={this.state.color}
        displayColorPicker={this.state.displayColorPicker}
      >
        <div className="cp-swatch"  onClick={!this.props.disabled ? this.handleClick : ()=>{}} style={{ cursor: this.props.disabled ? 'unset' : 'pointer' }}>
          <div className="cp-swatch-colour" />
        </div>
        {!this.props.disabled && this.state.displayColorPicker  ? (
          <div className="cp-popover">
            <div className="cp-cover" onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
              disableAlpha
              disabled={true}
            />
          </div>
        ) : null}
      </StyledColourPicker>
    );
  }
}

const StyledColourPicker = styled.div<ColourPickerState>`
  .cp-swatch {
    /* padding: 5px; */
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
    margin-left: 8px;
    // @media only screen and (max-width: 365px) {
    //   margin-left: 30px!important;
    // }

    @media only screen and (min-width: 365px) and (max-width: 480px) {
      margin-left: 30px!important;
    }

    @media only screen and (min-width: 650px) and (max-width: 1360px) {
      margin-left: 50px!important;
    }
  }

  .cp-swatch-colour {
    width: 30px;
    height: 30px;
    border-radius: 2px;
    background: rgba(
      ${(props) => props.color.r},
      ${(props) => props.color.g},
      ${(props) => props.color.b},
      ${(props) => props.color.a}
    );
    background: ${(props) => props.color};
  }

  .cp-popover {
    position: absolute;
    z-index: 2;
    right: -1px;
  }

  .cp-cover {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
`;

export default ColourPicker
