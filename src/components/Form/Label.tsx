import React, { SFC } from 'react'
import styled from 'styled-components'

interface LabelProps {
  addClassName?: string
  colSize?: string
  labelFor: string
  labelCol?: string,
  style?:any
}

const Label: SFC<LabelProps> = ({ addClassName = '', colSize = '2', labelFor, children, labelCol, style }) => (
  <StyledLabel
    className={`col-form-label no-side-padding col-sm-${labelCol === '' ? colSize: labelCol} ${addClassName} `}
    htmlFor={labelFor}
    style={style}
  >
    {children}
  </StyledLabel>
)

const StyledLabel = styled.label`

`

export default Label
