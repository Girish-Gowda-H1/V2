// import React, { Fragment } from 'react'
import DataTable from 'react-data-table-component';
import './table.css';
import { useNavigate } from 'react-router-dom';

const DataTableComponent = ({ columns, data, handleRowClick, rowsPadding, headPadding }) => {
  const navigate = useNavigate();

  const customStyles = {
    rows: {
      style: {
        border: '1px solid #f3f2f7',
        backgroundColor: 'transparent',
        height: '65px',
        padding: rowsPadding ? rowsPadding :"15px 0px 15px 50px"
      },
    },
    headCells: {
      style: {
        minHeight: '80px',
        fontSize: '16px',
        fontFamily: 'MulishBold',
        letterSpacing: '0.9px',
        color: '#000000',
        padding: '0 5px'
      },
    },
    headRow: {
      style: {
        borderRadius: '15px 15px 0px 0px',

        backgroundColor: '#EEEEEE',
        paddingLeft: headPadding ? headPadding : "50px"
      },
    },
    table: {
      style: {
        borderRadius: '15px 15px 0px 0px',
        // minHeight: preview || expandHeight ? "" : window.innerHeight - 315,
        // padding: expandHeight ? "1rem 0" : "1rem",
        backgroundColor: 'transparent'
      },
    },
    cells: {
      style: {
        textTransform: 'capitalize',
        fontSize: '14px',
        fontFamily: 'MulishBold',
        color: '#222222',
      },
    },
  };
  return (
    <div className="react-dataTable" id="data-table">
      <DataTable
        // conditionalCellStyles={conditionalCellStyles}s
        noHeader
        className="react-dataTable"
        columns={columns}
        // sortIcon={<ChevronDown size={10} />}
        data={data}
        customStyles={customStyles}
        onRowClicked={handleRowClick}
        // conditionalRowStyles={conditionalRowStyles}
        // expandableRows={expand && true}
        // // expandableRowExpanded={row => row?.defaultExpanded}

        // onSort={handleSort}
      />
    </div>
  );
};

export default DataTableComponent;
