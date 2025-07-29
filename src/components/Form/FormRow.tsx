import React, { SFC } from 'react'
import styled from 'styled-components'

interface FormRowProps {
  addClassName?: string
  noPadding?: boolean
  style?: any
}

const FormRow: SFC<FormRowProps> = ({ noPadding, addClassName = '', style,  children }) => (
  <StyledFormRow className={`form-row no-side-margin ${addClassName} ${noPadding ? 'no-side-padding' : ''}`} style={style}>
    {children}
  </StyledFormRow>
)

const StyledFormRow = styled.div`
`;

export default FormRow
