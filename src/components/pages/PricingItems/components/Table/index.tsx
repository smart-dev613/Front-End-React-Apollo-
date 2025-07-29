import React from 'react';

/** Utils */
import styled from 'styled-components';

/** Components */
import Row from './Row';

/** Types */
import { Props } from './types';

const Table: React.FC<Props> = ({ data }) => {
  return (
    <TableStyled>
      {data.map((item: any) => (<Row item={item} />))}
    </TableStyled>
  )
}

const TableStyled = styled.table`
  margin: 1em .5em;
  width: 100%;
  border-collapse:separate; 
  border-spacing:0 10px; 
`

export default Table;
