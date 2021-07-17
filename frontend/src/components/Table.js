import React, { Component } from "react";
import { Button, Table, Label, Input, FormGroup, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";
import { useTable, usePagination } from 'react-table';

function FunctionTable({ columns, data, handleEditItem }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  )

  const fontSize = "15px";

  return (
    <>
      <div className="pagination d-flex align-items-center justify-content-center">
        <Pagination size="sm" aria-label="Page navigation example">
          <PaginationItem>
            <PaginationLink first onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink previous onClick={() => previousPage()} disabled={!canPreviousPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>
              {pageIndex + 1} di {pageOptions.length}
            </PaginationLink>
          </PaginationItem>          
          <PaginationItem>
            <PaginationLink next onClick={() => nextPage()} disabled={!canNextPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
          </PaginationItem>
        </Pagination>
      </div>
      <Table responsive hover {...getTableProps()}>
        <thead style={{fontSize: fontSize}} align="center">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody style={{fontSize: fontSize}} align="center" {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} onClick={() => handleEditItem(row)}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      {/* <div className="pagination d-flex align-items-center justify-content-center">
        <Pagination aria-label="Page navigation example">
          <PaginationItem>
            <PaginationLink first onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink previous onClick={() => previousPage()} disabled={!canPreviousPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>
              {pageIndex + 1} di {pageOptions.length}
            </PaginationLink>
          </PaginationItem>          
          <PaginationItem>
            <PaginationLink next onClick={() => nextPage()} disabled={!canNextPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
          </PaginationItem>
        </Pagination>
      </div> */}
        {/* <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      {/* </div> */}
    </>
  )
}

class MyTable extends Component {

  render() {

    const { columns, data, handleEditItem } = this.props;

    return (
      <FunctionTable data={data} columns={columns} handleEditItem={handleEditItem} />
    )
  }
}

export default MyTable;