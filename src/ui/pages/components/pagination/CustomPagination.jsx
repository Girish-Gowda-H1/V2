import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PaginationComponent from './Pagination-Component';
import "./pagination.css"

const CustomPagination = (props) => {
    return (<div className='paginate'>
    <div className='paginate' style={{
      maxWidth: "40%"
    }}>
      <a className={props?.currentPage === 0 ? "prev" : "next"} onClick={() => props?.currentPage && props?.setCurrentPage(props?.currentPage - 1)}>
        <LeftOutlined /> Previous
      </a>
      <PaginationComponent currentPage={props?.currentPage} handlePagination={val => {
        props?.setCurrentPage(val?.selected);
      }} totalRecords={props?._filtered?.length} limit={props?.limit} pagination />
      <a className={props?.currentPage + 1 < props?._filtered?.length / props?.limit ? "next" : "prev"} onClick={() => props?.currentPage + 1 < props?._filtered?.length / props?.limit ? props?.setCurrentPage(props?.currentPage + 1) : {}}>
        Next <RightOutlined />
      </a>

    </div>

  </div>);
}

export default CustomPagination