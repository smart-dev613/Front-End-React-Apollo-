import React, { SFC } from 'react'
import styled from 'styled-components'

interface FormProps {
  addClassName?: string
  id: string
  onSubmit: (e: React.MouseEvent | React.FormEvent) => void
}

const Form: SFC<FormProps> = ({ addClassName = '', id, onSubmit, children }) => (
  <StyledForm
    id={id}
    className={addClassName}
    onSubmit={onSubmit}
  >
    {children}
  </StyledForm>
)

const StyledForm = styled.form`
  .modal-header {
    background: red !important;
  }
`;

export default Form
