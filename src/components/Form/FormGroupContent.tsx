import React, { SFC } from 'react'
import styled from 'styled-components'

interface FormGroupProps {
  colSize?: string;
  addClassName?: string;
  noPadding?: boolean;
  style?: any;
  viewWidth? : any;
}

const FormGroupContent: SFC<FormGroupProps> = ({ addClassName = '', colSize = '12', noPadding, children, style, viewWidth }) => (
  <StyledFormGroup className={`form-group d-flex align-items-center ${viewWidth <= 1000 && viewWidth >= 100 ? 'col-sm-11 col-11' : `col-sm-${colSize}`}  ${noPadding ? 'no-side-padding' : ''} ${addClassName}`} style={style}>
    {children}
  </StyledFormGroup>
)

const StyledFormGroup = styled.div`
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`

export default FormGroupContent
