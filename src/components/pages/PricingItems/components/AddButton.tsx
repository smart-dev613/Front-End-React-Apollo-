import React from 'react';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

/** Utils */
import styled from 'styled-components';

interface Props {
  onClick?: () => void
}

const AddButton: React.FC<Props> = ({ onClick }) => {
  return (
    <StyledButton className={'btn-edit btn-purple btn'} onClick={() => onClick && onClick()}>
      <FontAwesomeIcon icon={faPlus} />
    </StyledButton>
  )
}

const StyledButton = styled.button`
  color: white;
  height: 40px;
  border: none;
  transition: ease-in-out 200ms;

  &:hover {
    background: #a47ead;
    transition: ease-in-out 200ms;
  }
`

export default AddButton;
