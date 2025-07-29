import React, { useState } from 'react';
import styled from 'styled-components';
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table';
import { faChevronDown, faChevronUp, faSort, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import matchSorter from 'match-sorter';
import { columns } from '../../views/Template/columns';
import { showModal } from '../../../../store/modal/action';
// Define a default UI for filtering

export function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  );
}

// Define a default UI for filtering
export function DefaultColumnFilter({
  column: { accessor, name, filterValue, preFilteredRows, setFilter, onToggle },
}: any) {
  return (
    <span style={{ padding: '0 10px' }}>{name}</span>
    // <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
    // <label>{name}</label>

    // </div>
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option: any, i: any) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
export function SliderColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: any) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }: any) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old: any = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old: any = []) => [old[0], val ? parseInt(val, 10) : undefined]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  );
}

export function fuzzyTextFilterFn(rows: any, id: any, filterValue: any) {
  // @ts-ignore
  return matchSorter(rows, filterValue, { keys: [(row: any) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val;

interface Props {
  columns: any;
  data: any;
  className?: any;
}

const Table: React.FC<Props> = ({ columns, data, className }) => {
  if (data.length === 0) {
    return <div style={{ width: '100%', overflow: 'auto' }}>{/* No Data. */}</div>;
  }

  //should not be called when data.length is 0
  const [visibleFilters, setVisibleFilter] = useState([...columns.map(() => false)]);

  //toggling visible filters
  function toggleFilter(index: any) {
    let newFilters = [...visibleFilters];
    newFilters[index] = !newFilters[index];
    setVisibleFilter(newFilters);
  }

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  }: any = useTable(
    {
      columns,
      data,
      // @ts-ignore
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy // useSort
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 10)

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <StyledTable className={className} {...getTableProps()}>
        <TableHeadContainer>
          {headerGroups.map((headerGroup: any) => (
            <tr  {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, index: any) => (
                <th
                  {...column.getHeaderProps()}
                  className={column.thClass ? column.thClass : 'text-center'}
                  style={{ border: 'none', maxWidth: column.width ?  column.width : `${columns.length / 12}vw`, verticalAlign: 'top' }}
                >
                  <div className="d-flex table-row" style={{ flexDirection: 'column' }}>
                    <div>
                      <span className="mr-2" style={{ color: '#a489ac' }}>
                        {column.name}
                      </span>
                      {column.sortFilter ? (
                        <span
                          {...column.getSortByToggleProps()}
                          className="mr-2"
                          style={{ color: '#a489ac', cursor: 'pointer' }}
                        >
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon icon={faChevronDown} size={'sm'} />
                            ) : (
                              <FontAwesomeIcon icon={faChevronUp} size={'sm'} />
                            )
                          ) : (
                            <FontAwesomeIcon icon={faSort} size={'sm'} />
                          )}
                        </span>
                      ) : (
                        ''
                      )}
                      {column.isSearchFilter ? (
                        <span
                          style={{ color: '#a489ac', cursor: 'pointer' }}
                          onClick={() => {
                            toggleFilter(index);
                          }}
                        >
                          <FontAwesomeIcon icon={faFilter} size={'sm'} />
                        </span>
                      ) : (
                        ''
                      )}
                    </div>

                    {visibleFilters[index] ? (
                      <input
                        placeholder={`Search ${column.name}`}
                        className="m-1 w-full"
                        value={column.filterValue || ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                  {/* Render the columns filter UI */}
                </th>
              ))}
            </tr>
          ))}
          {/* <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr> */}
        </TableHeadContainer>
        <TableBodyContainer {...getTableBodyProps()}>
          {rows.map((row: any, i: any) => {
            prepareRow(row);
            return (
              <tr style={{  border: 'none' }} {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      onClick={() => {
                        showModal('ATTENDEE_DETAILS', 'lg', null, null, { data: data });
                      }}
                      className={cell.column.tdClass || ''}
                      style={{ textAlign: 'center', wordWrap: 'break-word' }}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </TableBodyContainer>
      </StyledTable>
      {/* <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div> */}
    </div>
  );
};

const StyledTable = styled.table<any>`
// .table td,  .table th{
// padding: 0 !important;
// }
`

const TableHeadContainer = styled.thead<any>`
//  border: 1px solid green;
 .table-row {
  overflow: hidden;
  white-space: normal;
  word-wrap: break-word;
  // border: 1px solid black;
  // padding: 0 !important;
 }
`

const TableBodyContainer = styled.tbody<any>`
// border : 1px solid red;
.btn {
  scale: 60%;
}
@media screen and (min-width: 767px) {
 
}
`

export default Table;
