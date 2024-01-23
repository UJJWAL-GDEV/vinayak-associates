import React, { useRef } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  useFilters,
} from "react-table";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PropTypes from "prop-types";

function CustomTable({ columns, data, searchEnabled, filterEnabled }) {
  const {
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, globalFilter, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const inputRef = useRef();
  return (
    <div className="bg-white p-4 rounded-xl overflow-x-auto">
      {searchEnabled && (
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-blue-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5   "
            ref={inputRef}
            type="text"
            value={globalFilter || ""}
            onChange={(e) => {
              setGlobalFilter(e.target.value || undefined);
            }}
            placeholder={`Search...`}
          />
          {globalFilter && (
            <button
              className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              onClick={() => {
                setGlobalFilter("");
              }}
            >
              &#x2715;
            </button>
          )}
        </div>
      )}

      <table className="table-auto min-w-full text-sm text-left rtl:text-right text-black overflow-x-auto">
        <thead className="text-xs text-black uppercase bg-teal-300 ">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span>{column.render("Header")}</span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span>↓</span>
                      ) : (
                        <span>↑</span>
                      )
                    ) : (
                      <span style={{ width: "20px" }} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            {headerGroups.map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <td key={column.id} className="px-4 py-2">
                    {filterEnabled && (
                      <input
                        type="text"
                        className="border border-gray-300 px-2 py-1"
                        onChange={(e) => {
                          column.setFilter(e.target.value || "");
                        }}
                        placeholder="Filter"
                      />
                    )}
                  </td>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-x-auto" {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                className="odd:bg-white even:bg-teal-300"
                key={row.id}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td
                    key={cell.id}
                    {...cell.getCellProps()}
                    className="px-4 py-2"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex mt-4 space-x-2">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 w-[300px]"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <span className="text-sm text-black">
          Page <strong>{pageIndex + 1}</strong> of <strong>{pageCount}</strong>
        </span>
        <button
          className="px-2 py-1 disabled:opacity-50  text-black"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          1
        </button>{" "}
        <button
          className="px-2 py-1 disabled:opacity-50  text-black"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <FiChevronLeft />
        </button>{" "}
        <button
          className="px-2 py-1 disabled:opacity-50  text-black"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <FiChevronRight />
        </button>{" "}
        <button
          className="px-2 py-1 disabled:opacity-50  text-black"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          last
        </button>{" "}
      </div>
    </div>
  );
}

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      cell: PropTypes.any,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchEnabled: PropTypes.bool,
};

CustomTable.defaultProps = {
  searchEnabled: true,
};

export default CustomTable;
