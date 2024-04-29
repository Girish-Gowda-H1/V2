import { useEffect, useMemo, useState } from 'react';
// import { Table, Button, Tag, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../../../api-config';
import { Button, Chip } from '@mui/material';
// import TableComponent from '../components/TableComponent';
import DataTable from '../components/Data-Table';
import './ViewServiceType.less';
import CustomSnackbar from '@components/common/CustomSnackbar';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import PaginationDropdown from '../components/pagination/PaginationDropdown';
import CustomPagination from '../components/pagination/CustomPagination';
import CommonHeader from '../components/services/CommonHeader';

const ServiceTypeHome = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [data, setAllData] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchText(e?.target?.value);
    setCurrentPage(0)
    const filtered = data.filter((item) => item.name.toLowerCase().includes(e?.target?.value.toLowerCase()));
    setDataSource(filtered);
  };

  const handleClear = () => {
    setSearchText('');
    setDataSource(data);
  };

  const handleSearchButton = () => {
    const filtered = data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setDataSource(filtered);
  };

  const fetchData = async () => {
    await axios
      .get(`${apiUrl}/service-types/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setDataSource(response.data);
        setAllData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sortedData = useMemo(() => {
    const data = [...dataSource]
    data.sort((a, b) => {
      const dateA = new Date(a?.updated_at);
      const dateB = new Date(b?.updated_at);
      return dateB - dateA;
    });
    return data;
  }, [dataSource]);

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: 'Service Type',
      selector: (row) => row.name,
      key: 'name',
    },
    {
      name: 'Linked to Rules',
      selector: (row) => row.service_rules_count,
      key: 'service_rules_count',
      center: true,
    },
    {
      name: 'Status',
      key: 'is_enabled',
      center: true,
      selector: (row, index) => (
        <div onClick={() => handleRowClick(row, index)}>
          <Chip className={row?.is_enabled ? 'enableStatus' : 'disableStatus'} label={row.is_enabled ? 'ENABLED' : 'DISABLED'} variant="outlined" />
        </div>
        // <Tag color={status ? "success" : "default"}>
        //   {/* {status.toUpperCase()} */}
        //   {status ? "ENABLED" : "DISABLED"}
        // </Tag>
      ),
    },
    {
      name: 'Quick Action',
      key: 'action',
      center: true,
      selector: (row, index) => (
        // render: (text, record) => (
        // <div onClick={() => handleAction(record)}>
        <div
          onClick={() => {
            const serviceType = row?.name.trim().toLowerCase();
            if(serviceType == 'first service' && row?.is_enabled == true) {
              console.log("Not possible to Disable Button")
            }
            else { 
            setLoading(true);
            axios
              .patch(`${apiUrl}/service-types/${row.id}/status/`, { is_enabled: row?.is_enabled ? 0 : 1 })
              .then(() => {
                setLoading(false);
                setSuccess('Status Changed');
                setTimeout(() => {
                  setSuccess('');
                }, 2000);
                fetchData();
              })
              .catch((error) => {
                setError('Faild to Change Status.');
                setLoading(false);
                console.log(error);
              });
           }
           }}
        >
          <img
              style={{ width: '20px', cursor: row.name.toLowerCase() === 'first service' ? 'not-allowed' : 'pointer' }}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAUxJREFUaEPtmU0SgjAMhcPJ1JMpJ9Ob6WTBjGBLfvoSZCbdsKBN35cHpSkTnbxNJ9dPBXC0gxYHHkR0IaJrsOgXEc1ExFexaQFY/F2Mhu3AEDzvbtMAHCF+ES1CSABHildB7AH0xItZkWzfuW+eswdgDjQgejvUNHcLgFeZJ1AQMtSP+y0AFh+9VHqheGm9fQ9uAby90ZPGrTQXQFLWu09NOVAO2DNQL7E9Z9gR4Q5IG8TR70wBSA9EOWApwiI+ZOVAlgPIysxSukJXIQSERTybAwXggCMQVvEhAF4Ij/gwACuEV3wogBZiRHw4gAQxKj4FoAeBEJ8GsIVAiU8FWCD4ijzZhn8HpN0p+n4BoDNqiac6WkS+cBZxmr4qAA40WrdqxHj68MHu6t9Zr/jg0+ll5fiHk+ruhlGqnjxZSh1TAKnpbkxWDpQDgxn4AFJKUDEPm6whAAAAAElFTkSuQmCC"
              disabled={row.name.toLowerCase() === 'first service'}
          />
        </div>
      ),
    },
  ];

  const handleRowClick = (record, rowIndex) => {
    if (record.is_enabled) navigate(`/service-types/view-enabled/${record.id}`, { state: { data: dataSource[rowIndex] } });
    if (!record.is_enabled) navigate(`/service-types/view-disabled/${record.id}`, { state: { data: dataSource[rowIndex] } });
  };

  const handleAction = (record) => {
    if (record.is_enabled === 'enabled') {
      navigate('/service-types/view-enabled');
    }
    if (record.status === 'disabled') {
      navigate('/service-types/view-disabled');
    }
  };

  const handleFilter = (is_enabled) => {
    // if (status === 'enabled' || status === 'disabled') {
      setCurrentPage(0)
    if (is_enabled || !is_enabled) {
      setFilteredStatus((prev) => {
        if (prev === is_enabled) {
          return null;
        } else {
          return is_enabled;
        }
      });
    } else {
      setFilteredStatus(null);
    }
  };

  const filtered = filteredStatus !== null ? sortedData.filter((item) => item.is_enabled === filteredStatus) : sortedData;

  // useEffect(() => {
  //   setDataSource(paginatedData)
  // }, [currentPage])

  let paginatedData = filtered.slice(Number(currentPage) * limit, (Number(currentPage) + 1) * limit);

  return (
    <div style={{ margin: '0 auto', padding: '2rem 4rem 2rem 4rem' }}>
      {error !== '' && <CustomSnackbar open={!loading} variant="error" message={error} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />}
      {success !== '' && (
        <CustomSnackbar
          open={!loading}
          variant="success"
          message={success}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          startEdornment={<SuccessSnackbarIcon width={20} />}
        />
      )}
      <CommonHeader
        handleSearch={handleSearch}
        handleSearchButton={handleSearchButton}
        title={'Service Types'}
        path={'/service-types/add-service'}
        searchPlaceholder={'Search by Service Type'}
        addButtonText="ADD NEW"
        searchText={searchText}
        handleClear={handleClear}
      />
      <div style={{ display: 'flex', marginTop: 16, justifyContent: 'space-between' }}>
        <div>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus ? 700 : 600,
              color: filteredStatus ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus ? '#ECE3F1' : '#fff',
            }}
            onClick={() => handleFilter(true)}
          >
            ENABLED
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === false ? 700 : 600,
              color: filteredStatus === false ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus === false ? '#ECE3F1' : '#fff',
            }}
            onClick={() => handleFilter(false)}
          >
            DISABLED
          </Button>
        </div>
        <PaginationDropdown data={filtered} limit={limit} setLimit={setLimit} setCurrentPage={setCurrentPage} />
      </div>
      <DataTable columns={columns} data={paginatedData} handleRowClick={(row, index) => handleRowClick(row, index)} />
      <CustomPagination currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} _filtered={filtered} />
    </div>
  );
};

export default ServiceTypeHome;
