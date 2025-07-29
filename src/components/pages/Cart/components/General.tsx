import React from 'react';

/** Utils */
import styled from 'styled-components';

export const Avatar = styled.div<{ background: string }>`
  background-image: ${(props: any) => encodeURI(props.background)};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 50px;
`

export const PriceSummary = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

export const ContentWrapper = styled.div`
  margin-top: 1em;
`

export const ContentHeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`