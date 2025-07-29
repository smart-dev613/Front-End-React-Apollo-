import React, { SFC } from 'react'
import styled from 'styled-components'

interface FormGroupProps {
  colSize?: string;
  addClassName?: string;
  noPadding?: boolean;
  style?: any;
  viewWidth? : any;
}

const FormGroupFontColor: SFC<FormGroupProps> = ({ addClassName = '', colSize = '12', noPadding, children, style, viewWidth }) => (
  <StyledFormGroup className={`form-group d-flex align-items-center  col-sm-${colSize}  ${noPadding ? 'no-side-padding' : ''} ${addClassName}`} style={style}>
    {children}
  </StyledFormGroup>
)

const StyledFormGroup = styled.div`
  margin-bottom: 0.5rem;
  flex-wrap: wrap;

  @media only screen and (min-width:330px) and (max-width:475px){
    flex-wrap: no-wrap!important;
    webkit-flex-wrap: no-wrap;
  }
`

export default FormGroupFontColor
