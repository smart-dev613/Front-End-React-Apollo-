import React, { SFC } from 'react'
import styled from 'styled-components'

interface ModalFooterProps {
  justifyBetween?: boolean
  addClassName?: string
}

const ModalFooter: SFC<ModalFooterProps> = ({ justifyBetween, addClassName = '', children }) => (
  <StyledModalFooter
    className={`modal-footer ${justifyBetween ? 'justify-content-between' : ''} ${addClassName}`}
  >
    {children}
  </StyledModalFooter>
)

const StyledModalFooter = styled.div`

`

export default ModalFooter
