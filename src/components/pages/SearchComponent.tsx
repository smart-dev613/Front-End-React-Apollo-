import React from 'react'
import styled from 'styled-components'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SearchComponentProps {
  filter: string,
  placeholder: string,
  click: (event: any) => void
}

// interface SearchComponentState {

// }

// type Props = SearchComponentProps & SearchComponentState

const SearchComponent = (props: SearchComponentProps) => (

  <StyledList>
    <div className='search-container row'>
      <span className='search-component'>
        <input type='text' className='form-control form-control-lg placeholder-text' placeholder={props.placeholder} value={props.filter} onChange={props.click} />
      </span>
      {/* <span className='search-icon'>
        <button><FontAwesomeIcon icon='sliders-h' className='fa-2x icon-size' /></button>
      </span> */}
    </div>
  </StyledList>
)

const StyledList = styled.div`
.search-container {
  width: 100%;
  margin-left: 0px;
  // position: absolute;
  // top: 55px;
  // right: -32px;
  z-index: 10;
  margin-right: 66px;
  }

  .search-component {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
  }

  .placeholder-text {
    font-size: 100%;
  }

  .search-icon {
    margin: 2%;
  }
`

export default SearchComponent