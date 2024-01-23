import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className={`mx-1 px-3 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-300 text-black cursor-not-allowed"
            : "bg-blue-500 text-white"
        } hover:bg-blue-700 transition`}
        disabled={currentPage === 1}
      >
        {"<<"}
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-2 rounded-md ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }
          //  hover:bg-blue-700 transition`
          }
        >
        {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={`mx-1 px-3 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-300 text-black cursor-not-allowed"
            : "bg-blue-500 text-white"
        } hover:bg-blue-700 transition`}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
