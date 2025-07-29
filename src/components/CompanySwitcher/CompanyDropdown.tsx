import React, { Component } from 'react'
import styled from 'styled-components'
import { faCheck, faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface CompanyDropdownProps {
  items?: any[];
  text?: string;
  disabled?: boolean;
  bsClass?: string;
  isSelected?: boolean;
  img?: string;
  svg?: string;
  color?: string;
  toggleDisabled?: boolean;
}

interface CompanyDropdownState {
  width : number
}

class CompanyDropdown extends Component<CompanyDropdownProps,CompanyDropdownState> {
  public constructor(props: CompanyDropdownProps) {
    super(props)
    this.state = {
      width : 0
    }
    this.updateDimensions = this.updateDimensions.bind(this);
  }
   updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentDidUpdate(prevProps: Readonly<CompanyDropdownProps>, prevState: Readonly<CompanyDropdownState>, snapshot?: any): void {
    if(window !== undefined && this.state.width == 0){
      this.setState({width : window?.innerWidth});
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  public render() { 
    const checkWindowSizeAndRename=(companyName:string)=>{
      return this.state.width <= 425 ? companyName.split(" ").map(word => word.charAt(0)).join(".").toUpperCase() : companyName;
    }
    return (
      <StyledDropdown
        className={'dropdown ' + (this.props.bsClass ? this.props.bsClass : '')}
        style={{ color: this.props.color ? this.props.color : '#E2D4E5' }}
      >
        <a
          className={
            'btn depth-shadow ' +
            (this.props.toggleDisabled ? ' specific-icons_v2' : ' btn-white dropdown-toggle') +
            (this.props.disabled ? ' specific-icons_v3 disabled' : '')
          }
          // @ts-ignore
          width=""
          data-toggle="dropdown"
          disabled={this.props.disabled}
        >
          {this.props.text ? (
            checkWindowSizeAndRename(this.props.text)
          ) : this.props.svg ? (
            <FontAwesomeIcon icon={faFilter} size="1x" color="#A489AC" />
          ) : (
            ''
          )}
          {/* {this.props.svg ? <SVG icon={this.props.svg} width='40px' height='40px' /> : '' } */}
        </a>
        <div className="dropdown-menu dropdown-menu-right">
          {this.props.items.map((item: any, i: any) => (
            <a key={i} className={'dropdown-item' + (item.disabled ? ' disabled' : '')} onClick={item.onClick}>
              {item.isSelected === true ? <FontAwesomeIcon icon={faCheck} /> : ''} {checkWindowSizeAndRename(item.text)}
            </a>
          ))}
        </div>
      </StyledDropdown>
    )
  }
}

const StyledDropdown = styled.div`
  a {
    display: block;
  }
  a.dropdown-toggle {
    // color: white !important;
    color: #a489ac;
  }

  .btn-primary:focus {
    box-shadow: 0 2px 4px 0 rgba(184, 184, 184, 0.5) !important;
  }

  .dropdown-item:not(.disabled) {
    cursor: pointer;
  }

  .dropdown-item {
    font-size: 0.8em;
    font-weight: 700;
    -webkit-letter-spacing: 1px;
    -moz-letter-spacing: 1px;
    -ms-letter-spacing: 1px;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: block;
    width: 100%;
    padding: 0.25rem 1.5rem;
    clear: both;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
  }

  .dropdown-item.disabled {
    color: #e1e1e1;
  }

  .dropdown-item:hover {
    color: #16181b;
    text-decoration: none;
    background-color: #f8f9fa;
  }
  .dropdown-menu {
    position: absolute;
    // height:800px;
    overflow: scroll;
  }

  @media only screen and(max-width: 450px) {
     .btn {
      //padding: 0px!important;
      padding: 0.175rem 0.25rem !important;
    }

    .btn-white {
      padding: 0.175rem 0.25rem !important;
    }
  }
`;

export default CompanyDropdown
