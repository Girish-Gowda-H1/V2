import { Pagination } from 'antd';

const CustomPagination = ({ ...props }) => {
  return (
    <Pagination
    //   showQuickJumper
    //   showTotal={(total) => `Total ${total} items`}
      {...props}
    />
  );
};

export default CustomPagination;
