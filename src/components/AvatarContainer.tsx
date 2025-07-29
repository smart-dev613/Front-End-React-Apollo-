import React from 'react';
import styled from 'styled-components';

const AvatarContainer = ({ children, width = 120, className = '' }) => {
  const Avatar = styled.div`
    width: ${width}px;
    height: ${width}px;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    flex-direction: column;
    
    img {
      width: ${width}px;
      height: ${width}px;
      border-radius: 50%;
      object-fit: cover;
    }
  `;

  return <Avatar className={className}>{children}</Avatar>;
};

export default AvatarContainer;
