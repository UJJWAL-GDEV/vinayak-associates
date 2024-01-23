import React, { useRef } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  useFilters,
} from "react-table";
import PropTypes from "prop-types";

function CustomTable2 ({ columns, data, filterEnabled }) {
  const {
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
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

    </div>
  );
}

CustomTable2.propTypes = {
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

CustomTable2.defaultProps = {
  searchEnabled: true,
};

export default CustomTable2;
