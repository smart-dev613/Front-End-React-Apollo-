import React from 'react'
import styled from 'styled-components'

interface ParentProps {
  dataArray: string[]
  dataType: string
  colSize?: string
  width?: string
  callbackFunctions?: (arg0: string) => void
  // show: boolean
  // value: string
  // font: string
  
}

interface StateProps {
  show: boolean
  value: string
  code: string
  // font: string
  
}

type Props = ParentProps

class Dropdown extends React.Component<Props, StateProps> {

  public constructor (props: Props) {
    super(props)
    this.state = {
      value: '',
      code: '',
      show: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    
  }

  public handleChange = (item: string, data: any[]) => () => {
    this.setState({ code: item, show: false, value: data[item as keyof typeof data] })
    if(item){
      this.props.callbackFunctions(item)
    }
  }
      
  public handleToggle = (e: any) => { //@to provide required type
    e.target.focus()
    this.setState({ show: !this.state.show })
  }
      
  public handleBlur = (e: any) => {
    // firefox onBlur issue workaround
    if (e.nativeEvent.explicitOriginalTarget &&
        e.nativeEvent.explicitOriginalTarget === e.nativeEvent.originalTarget) {
      return
    }
    
    if (this.state.show) {
      setTimeout(() => {
        this.setState({ show: false })
      }, 200)
    }
  }

  public render () {
    const {
      dataArray,
      dataType
    } = this.props

    
    // const dataArrays = Object.keys(dataArray).forEach((item, indx) => {
    //   console.log('key', item, dataArray[item])
    //   // return <li key={key+indx} className="option" onClick={() => this.handleChange.bind(this, key)}>{key}</li>
    //   dataFilteredArray.push( <li key={indx} className="option" onClick={() => this.handleChange.bind(this, item)}>{dataArray[item]}</li>)
    // })
    // const result = Object.keys(dataArray).map((key) => {
    //   return {key: dataArray[key]}
    // })
    // Object.keys(dataArray).forEach((key, index) => {
    //   console.log(key, dataArray[key])
    //   dataFilteredArray.push[{key : dataArray[key]]
    // })
    // console.log('dataArray', dataArrays)

    const {
      value,
      show 
    } = this.state
    const defaultLabel = `${dataType}`
    
    return (
      <DropdownStyled>
        <div className='dropdown-container'>
          <label className="arrow">
            <input
              type="button"
              value={value?value:defaultLabel}
              className="dropdown-btn"
              onClick={this.handleToggle}
              onBlur={this.handleBlur}
            />
          </label>
          <ul className="dropdown-list" hidden={!show}>
            {Object.keys(dataArray).map((item) => (
              <li key={item}
                className="option"
                onClick={this.handleChange(item, dataArray)}
              >
                {dataArray[item as keyof typeof dataArray]}
              </li>
            ))}
          </ul>
        </div>
      </DropdownStyled>
    )
  }
}

const DropdownStyled = styled.div`
font-size: 1rem;
font-weight: 400;
.dropdown-container {
  
  .dropdown-btn {
    width: 100%;
    border-radius: .25rem;
    font-family: 'robotoregular';
    color: #495057;
    border-radius: 3px;
    background: #fff;
    border: 1px solid #ced4da;
    text-align: left;
    padding: 6px 12px;
    outline: none;
    
    &:focus {
      
    }
  }

  .arrow {
    position: relative;
    width: 100%;

    &::after {
      color: #495057;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 5px 0 5px;
      border-color: #495057 transparent transparent transparent;
      position: absolute;
      right: 10px;
      top: 7px;
    }
  }

  .dropdown-list {
    list-style-type: none;
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 200px;
    border: none;
    background: white;
    box-shadow: 0 2px 4px 0 rgba(black, .5);
    z-index: 9;
    overflow: auto;
    border-radius: 3px;
    
    .option {
      padding: 5px;
      cursor: pointer;
      
      &:hover {
        color: white;
        background: #4db8ff;
      }
    }
  }
}

`


export default Dropdown