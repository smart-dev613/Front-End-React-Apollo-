import React, { SFC } from 'react';
import styled from 'styled-components';

interface FormGroupProps {
  colSize?: string;
  addClassName?: string;
  noPadding?: boolean;
  style?: any;
  viewWidth?: any;
  containerClassName?: any;
}

const FormGroup: SFC<FormGroupProps> = ({
  style,
  containerClassName,
  addClassName = '',
  colSize = '12',
  noPadding,
  children,
  viewWidth,
}) => (
  <StyledFormGroup
    style={style}
    className={`form-group d-flex align-items-center ${containerClassName} ${
      !addClassName.includes('row') ? (viewWidth <= 1000 ? 'col-sm-12' : `col-sm-${colSize}`) : ''
    }  ${noPadding ? 'no-side-padding' : ''} ${addClassName}`}
  >
    {children}
  </StyledFormGroup>
);

const StyledFormGroup = styled.div`
  margin-bottom: 0.5rem;
  // flex-wrap: wrap;

  @media only screen and (max-width:375px){
    flex-wrap: no-wrap!important;
  }
`;

export default FormGroup;
