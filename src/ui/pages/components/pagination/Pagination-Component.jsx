import React from 'react'
import ReactPaginate from "react-paginate";
import "./pagination.css"

const PaginationComponent = ({  currentPage,
  handlePagination,
  totalRecords,
  limit,}) => {
  return (
    <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          forcePage={currentPage}
          onPageChange={(page) => {            
            handlePagination(page)}}
          pageCount={totalRecords / limit}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName={"active"}
          pageClassName={"page-item"}
          nextLinkClassName={"page-link"}
          nextClassName={"page-item next"}
          previousClassName={"page-item prev"}
          previousLinkClassName={"page-link"}
          pageLinkClassName={"page-link"}
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName={
            "pagination react-paginate separated-pagination pagination-sm pl-0 pr-1 mt-1 col-sm-6 justify-content-lg-end justify-content-center"
          }
        />
  )
}

export default PaginationComponent