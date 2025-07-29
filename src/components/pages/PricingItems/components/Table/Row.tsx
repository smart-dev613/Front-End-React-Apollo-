import React from 'react';

/** Utils */
import styled from 'styled-components';

const Row = (item: any) => {
  return (
    <RowStyled>
      <CellStyled width={'120px'}>
        <Avatar backgroundImage={'/images/whitepaper.png'} />
      </CellStyled>
      <CellStyled>x</CellStyled>
      <CellStyled>x</CellStyled>
      <CellStyled>x</CellStyled>
      <CellStyled>x</CellStyled>
      <CellStyled>x</CellStyled>
    </RowStyled>
  )
}

const RowStyled = styled.tr`
  border-radius: 5px;
  color: black;
  margin: 10px 0;
  
  td:first-child { border-top-left-radius: 10px; }
  td:last-child { border-top-right-radius: 10px; }
  td:first-child { border-bottom-left-radius: 10px; }
  td:last-child { border-bottom-right-radius: 10px; }
`

const CellStyled = styled.td<{ width?: string }>`
  padding: 1em;
  width: ${(props: any)=> props.width};
  background: #e1e1e1;
  height: 120px;
`

const Avatar = styled.div<{ backgroundImage: string }>`
  background-image: url(${(props: any)=> encodeURI(props.backgroundImage)});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 50px;
  text-align: center;
`

export default Row;
