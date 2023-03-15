import ReactPaginate from "react-paginate";
import styles from './dashboard.module.css';

const Pagination = ({ totalPages, currentPage = 1, paginate }) => {
  return (
    <>
      <ReactPaginate
        previousLabel="<"
        breakLabel="..."
        nextLabel=">"
        onPageChange={(e) => {
          paginate(e.selected);
        }}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        forcePage={currentPage}
        renderOnZeroPageCount={null}
        className={`${styles.paginationNav} pagination mt-3`}
        activeClassName={`${styles.yellowColor}`}
        previousClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageClassName="page-item"
        pageLinkClassName="page-link"
      />
    </>
  );
};

export default Pagination;