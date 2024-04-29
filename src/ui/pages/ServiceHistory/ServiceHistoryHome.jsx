import EastIcon from '@mui/icons-material/East';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Checkbox, Chip, ClickAwayListener, Divider, Grid, Modal, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LicenseInfo } from '@mui/x-license-pro';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import apiUrl from '../../../../api-config';
import DataTableComponent from '../components/Data-Table';
import CustomPagination from '../components/pagination/CustomPagination';
import PaginationDropdown from '../components/pagination/PaginationDropdown';
import CheckboxDropdown from '../components/services/CheckboxDropdown';
import CommonHeader from '../components/services/CommonHeader';
import CustomSnackbar from '@components/common/CustomSnackbar';
import FormData from 'form-data';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import { operationsError } from '../../../../errorConstant';
import dayjs from 'dayjs';
import { Tag } from 'antd';
// import fs from 'fs';



LicenseInfo.setLicenseKey('363b4a526f1a385ec60089831d149c99Tz03NzYxMCxFPTE3MzAwOTczMDYwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

// import { useNavigate } from 'react-router-dom';

// const { RangePicker } = DatePicker;

const ServiceHistoryHome = () => {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openServiceDate, setOpenServiceDate] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [locations, setSelectedLocation] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [fillterDateRange, setFillterDateRange] = useState([null, null]);
  const [locationList, setLocationList] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState([]);
  const [locationSelectedList, setLocationSelectedList] = useState([]);
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false);


  const isDisabled = false;
  const theme = useTheme();
  let dropdownOptions = dropdownServiceTypes.map((obj) => {
    // Mapping id with value and name with label
    return {
      value: obj.id,
      label: obj.name,
    };
  });

  const handleFilterChange = (selected) => {
    // Handle the selected values, e.g., apply filter
    setSelectedOptions(selected);
  };

  const getServiceTypes = () => {
    axios
      .get(`${apiUrl}/service-types/partial/`)
      .then((response) => {
        setDropdownServiceTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = (e) => {
    setSearchText(e?.target?.value);
    setCurrentPage(0);
    const filtered = data.filter((item) => {
      return (
        item.vehicle_registration_number.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        item.service_vendor.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        item.service_vendor_location.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        item.vehicle_model.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        item.vehicle_make.toLowerCase().includes(e?.target?.value.toLowerCase())
      );
    });
    setDataSource(filtered);
  };

  const handleClear = () => {
    setSearchText('');
    setDataSource(data);
  };

  useEffect(() => {
    localStorage.removeItem('serviceId')
  }, [])

  const handleSearchButton = () => {
    const filtered = data.filter((item) => {
      return (
        item.vehicle_registration_number.toLowerCase().includes(searchText.toLowerCase()) ||
        item.service_vendor.toLowerCase().includes(searchText.toLowerCase()) ||
        item.service_vendor_location.toLowerCase().includes(searchText.toLowerCase()) ||
        item.vehicle_model.toLowerCase().includes(searchText.toLowerCase()) ||
        item.vehicle_make.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setDataSource(filtered);
  };

  const fetchData = async () => {
    await axios
      .get(`${apiUrl}/api/vehicle-service-list/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setDataSource(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getchLocationList = async () => {
    axios
      .get(`${apiUrl}/cities-with-locations/`)
      .then((response) => {
        setLocationList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [filteredStatus, setFilteredStatus] = useState(null);

  console.log(setFilteredStatus);

  const checkMultiData = (e) => {
    if (e.target.checked === true) {
      setSelectedItems([...selectedItems, e.target.value]);
    } else {
      const updatedItems = selectedItems.filter((item) => item !== e.target.value);
      setSelectedItems(updatedItems);
    }
  };

  const statusColor = {
    "Pending": "#307E98",
    "Rejected": "#EF4723",
    "Accepted": "#2D9B00",
    "Drafted": "#4B3D76",
  }
  const statusBackgroundColor = {
    "Pending": "#EFFAFF",
    "Rejected": "#FFBEA9",
    "Accepted": "#E6F9DA",
    "Drafted": "#ECE3F1",
  }

  const columns = [
    {
      name: 'Registration No.',
      width: '200px',
      selector: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={selectedItems.includes(row?.vehicle_registration_number)}
            value={row?.vehicle_registration_number}
            onChange={(e) => checkMultiData(e)}
          />

          {row?.has_invoice === false && (
            <Tooltip
              placement="right"
              title="Upload Invoice/Bills"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#FFF5D7',
                    color: '#222222',
                    padding: '12px 17px',
                    fontSize: '12px',
                    fontFamily: 'MulishBold',
                    letterSpacing: '0.6px',
                  },
                },
                arrow: {
                  sx: {
                    color: '#FFF5D7',
                  },
                },
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                  background: '#FED250 0% 0% no-repeat padding-box',
                  borderRadius: '3px',
                  textAlign: 'center',
                  height: '20px',
                  padding: '0px 9px',
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontFamily: 'MulishExtraBold',
                  width: '20px',
                }}
              >
                !
              </div>
            </Tooltip>
          )}
          <span
            onClick={() => navigate(`/service-history/view-service-history/${row.vehicle_registration_number}`)}
            style={{ marginLeft: row?.has_invoice ? '30px' : '10px' }}
          >
            {row?.vehicle_registration_number}
          </span>
        </div>
      ),
      key: 'registrationNo',
    },
    {
      name: 'Vehicle Make & Model',
      dataIndex: 'vehicleMake',
      selector: (row) => (
        <div onClick={() => navigate(`/service-history/view-service-history/${row.vehicle_registration_number}`)}>
          {row?.vehicle_make}
          <p style={{ fontFamily: 'MulishBold', fontSize: '12px', color: '#7A7A7A', marginTop: '5px' }}>{row?.model_year}</p>
        </div>
      ),
    },
    {
      name: 'Service Vendor',
      dataIndex: 'location',
      selector: (row) => (
        <div onClick={() => {navigate(`/service-history/view-service-history/edit/${row.vehicle_registration_number}/${row?.invoice_id||""}`); localStorage.setItem("serviceId",row?.id);}}>
          {row?.service_vendor}
          <p style={{ fontFamily: 'MulishBold', fontSize: '12px', color: '#7A7A7A', marginTop: '5px' }}>{row?.service_vendor_location}</p>
        </div>
      ),
    },
    {
      name: 'Service Type',
      selector: (row) => row?.service_type,
      key: 'nextServiceDate',
      center: false,
    },
    {
      name: 'Review Status',
      selector: (row) => <>
        <Chip className={"status"} label={row?.status} variant="outlined" style={{ color: statusColor[row?.status], backgroundColor: statusBackgroundColor[row?.status], border: `1px solid ${statusColor[row?.status]}` }} />

      </>,
      key: 'ServiceStatus',
      center: false,
    },
    {
      name: 'Serviced On',
      selector: (row) => dayjs(row?.service_date).format('DD MMM YYYY'),
      key: 'nextService',
      center: true,
    },
    // {
    //   name: 'Serviced At',
    //   selector: (row) => parseInt(row?.odometer_reading) + ' km',
    //   key: 'nextService',
    //   center: true,
    // },
    {
      name: 'View',
      key: 'action',
      center: true,
      selector: (row, index) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
           <Tooltip
              placement="right"
              title="View"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#FED250',
                    color: '#222222',
                    padding: '12px 17px',
                    fontSize: '12px',
                    fontFamily: 'MulishBold',
                    letterSpacing: '0.6px',
                  },
                },
                arrow: {
                  sx: {
                    color: '#FFF5D7',
                  },
                },
              }}
            >
          <div className='fileView' style={{ background: "#FED250",cursor: "pointer" }} onClick={() => {
            localStorage.setItem("serviceId",row?.id)
            navigate(`/service-history/view-service-history/edit/${row.vehicle_registration_number}/${row?.invoice_id||""}`)}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" className="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>

          </div>
              
            </Tooltip>
            
          {["Pending", "Accepted"]?.includes(row?.status) ? 
          <Tooltip
          placement="right"
          title="View History"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: '#4B3D76',
                color: '#FFFFFF',
                padding: '12px 17px',
                fontSize: '12px',
                fontFamily: 'MulishBold',
                letterSpacing: '0.6px',
              },
            },
            arrow: {
              sx: {
                color: '#FFF5D7',
              },
            },
          }}
        >
          <div onClick={() => navigate(`/service-history/view-service-history/${row.vehicle_registration_number}`)} className='fileView' style={{ background: "#4B3D76", position: "relative" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF" className="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>


          </div>
          </Tooltip>
           : <div className='' style={{ width: "30px", height: "20px" }}></div>}

        </div>
      )
    }
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   render: (status) => (
    //     <Tag color={status === "upcoming" ? "success" : status === "critical" ? "processing" : status === "priority" ? "error" :"default"}>
    //       {status.toUpperCase()}
    //     </Tag>
    //   ),
    // },
  ];

  // const handleRowClick = (record, rowIndex) => {
  //   if (record.status === "critical") navigate("/service-rules/view-rule");
  //   if (record.status === "priority") navigate("/service-rules/view-disabled-rule");
  // };

  // const handleAction = (record) => {
  //   if(record.status === "enabled"){navigate('/view-enabled');}
  //   if(record.status === "disabled"){navigate('/view-disabled');}
  // };

  // const handleFilter = (value) => {
  //   if (value === 'critical' || value === 'priority' || value === 'upcoming') {
  //     setFilteredStatus((prev) => {
  //       if (prev === value) {
  //         return null;
  //       } else {
  //         return value;
  //       }
  //     });
  //   } else {
  //     setFilteredStatus(null);
  //   }
  // };

  // const filtered = filteredStatus
  //   ? dataSource.filter((item) => item.status === filteredStatus)
  //   : dataSource;


  const getAllFilterData = (dates) => {
    console.log('dates', dateRange);
    const filterData = data?.filter((item) => {
      let checkDate = new Date(item.invoice_date);
      let sDate = dateRange?.[0] !== null ? new Date(dateRange[0]) : new Date(dates?.[0]);
      let eDate = dateRange?.[1] !== null ? new Date(dateRange[1]) : new Date(dates?.[1]);
      const checkSelectOption = dropdownServiceTypes
        .filter((it) => selectedOptions.includes(+it.id))
        .map((it) => it.name);

      const isMatchingOption = checkSelectOption.includes(item.service_type);
      const isMatchingLocation = locations.includes(item.service_vendor_location);
      const isMatchingCity = item.city === locationName;
      const isWithinDateRange = checkDate > sDate && checkDate < eDate;
      const isMatchingLocationName = locationName !== '';

      // Check and combine conditions for filtering
      if (
        (dates !== undefined || dateRange?.[0] !== null) &&
        locations.length > 0 &&
        selectedOptions.length > 0 &&
        isMatchingLocationName
      ) {
        return isMatchingOption && isMatchingLocation && isWithinDateRange && isMatchingCity;
      } else if ((dates !== undefined || dateRange?.[0] !== null) && locations.length && isMatchingLocationName) {
        return isMatchingLocation && isWithinDateRange && isMatchingCity;
      } else if (locations.length && selectedOptions.length > 0 && isMatchingLocationName) {
        return isMatchingOption && isMatchingLocation && isMatchingCity;
      } else if ((dates !== undefined || dateRange?.[0] !== null) && selectedOptions.length > 0 && isMatchingLocationName) {
        return isMatchingOption && isWithinDateRange && isMatchingCity;
      } else if ((dates !== undefined || dateRange?.[0] !== null) && isMatchingLocationName) {
        return isWithinDateRange && isMatchingCity;
      } else if (locations.length && isMatchingLocationName) {
        return isMatchingLocation && isMatchingCity;
      } else if (selectedOptions.length > 0 && isMatchingLocationName) {
        return isMatchingOption && isMatchingCity;
      } else if ((dates !== undefined || dateRange?.[0] !== null)) {
        return isWithinDateRange
      } else if (locations.length > 0) {
        return isMatchingLocation
      } else if (selectedOptions.length > 0) {
        return isMatchingOption
      } else if (isMatchingLocationName) {
        return isMatchingCity
      } else {
        return true;
      }
    });

    setDataSource(filterData);
  };


  let filteredData = filter ? dataSource?.filter((item) => item.status === filter) : dataSource
  let paginatedData = filteredData?.slice(Number(currentPage) * limit, (Number(currentPage) + 1) * limit);
  console.log("🚀 ~ ServiceHistoryHome ~ paginatedData:", paginatedData)

  const showModal = () => {
    setOpenLocation(openLocation === true ? false : true);
    if (dropdownServiceTypes.length === 0) getServiceTypes();
  };

  const exportData = () => {
    const data = [];
    if (selectedItems.length > 0) {
      dataSource.map((item) => selectedItems.includes(item.vehicle_registration_number) && data.push(item));
    } else {
      dataSource.map((item) => data.push(item));
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'ServiceHistoryData.xlsx');
  };

  const [uploadModal, setUploadModal] = useState(false);

  const showUploadModal = () => {
    setUploadModal(true);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    setLoading(true)

    if (files[0]?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      try {
        const formData = new FormData();
        formData.append('file', files[0]);

        const config = {
          maxBodyLength: Infinity,
          // url: 'http://127.0.0.1:8000/api/operations/v1/service_projections/ops_service_log_upload/',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Disposition': `attachment; filename="${files[0].name}"`,
          }
        }

        const response = await axios
          .post(`${apiUrl}/ops_service_log_upload/`, formData,
            config
          )

        if (response.status === 200 || response.status === 201) {
          setLoading(false)
          setSuccess('File Uploaded Successfully');
          setTimeout(() => {
            setSuccess('');
            fetchData();
          }, 2000);
        } else {
          setError(operationsError.serviceHistoryUploadFile);
          setLoading(false)
        }

        // const response = await axios.request(config);

        // formData.append('file', createReadStream(files[0]));
        // const headers = {
        //   ...formData.getHeaders(),
        // }

        // axios
        //   .post(`${apiUrl}/ops_service_log_upload/`,formData, 
        //     headers
        //   )
        //   .then((response) => {
        //     if (response.status === 200) {
        //       setSuccess('File Uploaded Successfully');
        //       setTimeout(() => {
        //         setSuccess('');
        //         fetchData();
        //       }, 2000);
        //     }})
      } catch (error) {
        setError(error.message);
        // setError('somthing went wrong');
        setLoading(false)
        console.log(error);
      } finally {
        setLoading(false)
        setUploadModal(false)
      }
    } else {
      setError('Please Upload Excel File Only');
      setLoading(false)
      setUploadModal(false)
    }

  };

  const handleReset = () => {
    setOpenLocation(false);
    // setDataSourceLocation(data);
    setLocationSelectedList([]);
    setSelectedLocation([]);
    setLocationName('');
    setLocation();
    getAllFilterData()
    // setDataSource(data);
  }

  useEffect(() => {
    dateRange[0] === null && getAllFilterData();
  }, [dateRange])

  useEffect(() => {
    !selectedOptions.length && getAllFilterData();
  }, [selectedOptions])
  useEffect(() => {
    !locations.length && getAllFilterData();
  }, [locations])
  useEffect(() => {
    !locationName && getAllFilterData();
  }, [locationName])
  useEffect(() => {
    if (filter)
      setCurrentPage(0)
  }, [filter])

  console.log("paginatedData",paginatedData);

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
        title={'Service History'}
        path={'/service-types/add-service'}
        searchPlaceholder={'Search by Vehicle Registration No., or Invoice No.'}
        addButtonText="ADD"
        onAdd={() => showUploadModal(true)}
        searchText={searchText}
        handleClear={handleClear}
      />
      <div style={{ display: 'flex', marginTop: 16, justifyContent: 'space-between' }}>
        <div>
          <Button
            className="filterButton"
            ˀ style={{ fontWeight: open !== false ? 700 : 600, color: open !== false ? '#4B3D76' : '#000000', backgroundColor: open !== false ? '#ECE3F1' : '#fff' }}
            onClick={() => {
              setOpen(open === true ? false : true), setOpenLocation(false), setOpenServiceDate(false);
              if (dropdownOptions.length === 0) getServiceTypes();
            }}
          >
            SERVICE TYPE <span style={{ display: 'flex' }}>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === 1 ? 700 : 600,
              color: filteredStatus === 1 ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus === 1 ? '#ECE3F1' : '#fff',
            }}
            onClick={() => {
              showModal(), setOpen(false), getchLocationList(), setOpenServiceDate(false);
            }}
          >
            LOCATION <span style={{ display: 'flex' }}>{openLocation ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
          </Button>

          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === false ? 700 : 600,
              color: filteredStatus === false ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus === false ? '#ECE3F1' : '#fff',
              padding: '0'
            }}
          // onClick={() => {
          //   setOpenServiceDate(openServiceDate === true ? false : true), setOpenLocation(false), setOpen(false);
          // }}
          >
            {/* SERVICE DATE <span style={{ display: 'flex' }}>{openServiceDate ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span> */}
            <CustomDatePicker
              placeholder="SERVICE DATE"
              sx={{ width: 150 }}
              onOk={(dates) => {
                setFillterDateRange(dates);
                getAllFilterData(dates);
                setDateRange(dates);
                setOpenServiceDate(false);
              }}
              changeset={(dates) => {
                setDateRange([dates[0], dates[1]]);
              }}
              onReset={() => {
                setFillterDateRange([null, null]);
                setDateRange([null, null]);
                setOpenServiceDate(false);
                getAllFilterData();
              }}
              defaultValue={fillterDateRange}
            />
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filter === "Pending" ? 700 : 600,
              color: filter === "Pending" ? '#4B3D76' : '#000000',
              backgroundColor: filter === "Pending" ? '#ECE3F1' : '#fff',
            }}
            onClick={() => filter === "Pending" ? setFilter():setFilter("Pending")}
          >
            PENDING
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filter === "Accepted" ? 700 : 600,
              color: filter === "Accepted" ? '#4B3D76' : '#000000',
              backgroundColor: filter === "Accepted" ? '#ECE3F1' : '#fff',
            }}
            onClick={() => filter === "Accepted" ? setFilter():setFilter("Accepted")}
          >
            ACCEPTED
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filter === "Drafted" ? 700 : 600,
              color: filter === "Drafted" ? '#4B3D76' : '#000000',
              backgroundColor: filter === "Drafted" ? '#ECE3F1' : '#fff',
            }}
            onClick={() => filter === "Drafted" ? setFilter():setFilter("Drafted")}
          >
            DRAFT
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filter === "Rejected" ? 700 : 600,
              color: filter === "Rejected" ? '#4B3D76' : '#000000',
              backgroundColor: filter === "Rejected" ? '#ECE3F1' : '#fff',
            }}
            onClick={() => filter === "Rejected" ? setFilter():setFilter("Rejected")}
          >
            REJECTED
          </Button>
        </div>
        <PaginationDropdown data={dataSource} limit={limit} setLimit={setLimit} setCurrentPage={setCurrentPage} />
      </div>
      {open ? (
        <CheckboxDropdown
          options={dropdownServiceTypes.slice().sort((a, b) => a.name.localeCompare(b.name))}
          selectedValues={selectedOptions}
          onChange={handleFilterChange}
          submitFilter={() => {
            // setDataSource(data?.filter((item) => selectedOptions?.includes(item?.service_type)));
            getAllFilterData();
            setOpen(false);
          }}
          resetFilter={() => {
            setOpen(false);
            // setDataSource(data);
            setSelectedOptions([]);
            getAllFilterData()
          }}
          hasCheckbox={true}
          setOpen={setOpen}
        />
      ) : null}

      {openLocation ? (
        <CheckboxDropdown
          options={locationList}
          locationName={locationName}
          setLocationName={setLocationName}
          location={location}
          setLocation={setLocation}
          selectedValues={locationSelectedList}
          noCheckBox={true}
          secondmenu={true}
          onChange={setLocationSelectedList}
          onLocation={setSelectedLocation}
          locations={locations}
          submitFilter={() => {
            // setDataSourceLocation(locations?.length ? data?.filter((item) => locations?.includes(item?.location)) : data);
            getAllFilterData();
            setOpenLocation(false);
          }}
          resetFilter={() => handleReset()}
          setOpen={setOpenLocation}
        />
      ) : null}

      {openServiceDate === true && (
        <ClickAwayListener onClickAway={() => setOpenServiceDate(false)}>
          <div className="date-picker-range-popup-wrapper">
            <div className="date-picker-range-popup">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangeCalendar
                  calendars={1}
                  size="small"
                  form
                  format="YYYY-MM-DD"
                  defaultValue={fillterDateRange}
                  onChange={(dates, isFinish) => {
                    setDateRange([dates[0], dates[1]]);
                  }}
                />
              </LocalizationProvider>
              {/* <div><button>RESET ALL</button><button>APPLY FILTER</button></div> */}
              <Grid container justifyContent="space-between" pt={2} px={'23px'} pb={'20px'}>
                <Button
                  variant="text"
                  onClick={() => {
                    setFillterDateRange([null, null]);
                    setOpenServiceDate(false);
                    setDateRange([null, null]);
                    getAllFilterData();
                    setDataSource(data);
                  }}
                >
                  <Typography variant="h4" fontSize="14px" color={theme.palette.allMainTextColor} letterSpacing="0.5px">
                    RESET ALL
                  </Typography>
                </Button>
                <Button
                  variant="rb-yellow-primary"
                  sx={{
                    p: '10px 26px',
                    borderRadius: 1.5,
                    background: isDisabled ? theme.palette.button.greyPrimary : theme.palette.button.yellowPrimary,
                    '&:hover': {
                      background: isDisabled ? theme.palette.button.greyPrimary : theme.palette.button.yellowPrimary,
                      '& h4': {
                        color: isDisabled ? theme.palette.button.text.greyText : theme.palette.button.text.blackPrimary,
                      },
                    },
                  }}
                  onClick={() => {
                    setFillterDateRange(dateRange);
                    getAllFilterData();
                    setOpenServiceDate(false);
                  }}
                >
                  <Typography
                    variant="h4"
                    fontSize="14px"
                    color={isDisabled ? theme.palette.button.text.greyText : theme.palette.button.text.blackPrimary}
                    letterSpacing="0.5px"
                  >
                    APPLY FILTER
                  </Typography>
                </Button>
              </Grid>
            </div>
          </div>
        </ClickAwayListener>
      )}
      <DataTableComponent
        columns={columns}
        data={paginatedData}
        handleRowClick={(row) => {navigate(`/service-history/view-service-history/edit/${row.vehicle_registration_number}/${row?.invoice_id||""}`); localStorage.setItem("serviceId",row?.id)}}
        rowsPadding={'15px 0px 15px 0px'}
        headPadding={'10px'}
      />
      <CustomPagination currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} _filtered={filteredData} />
      <div style={{ position: 'fixed', bottom: '50px', right: '50px' }}>
        <button
          style={{
            background: '#FED250 0% 0% no-repeat padding-box',
            boxShadow: '0px 0px 6px #00000029',
            border: '1px solid #E0E0E0',
            borderRadius: '10px',
            opacity: 1,
            padding: '18px 46px',
          }}
          onClick={() => exportData()}
        >
          <span style={{ textAlign: 'left', fontSize: '16px', letterSpacing: '0.9px', color: '#000000', fontFamily: 'MulishBold', fontWeight: 'semibold' }}>EXPORT DATA</span>
        </button>
      </div>
      <Modal open={uploadModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <ClickAwayListener onClickAway={() => setUploadModal(false)}>
            <Box
              sx={{
                position: 'absolute',
                zIndex: 1,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60%',
                bgcolor: '#FAFAFA',
                border: '3px dashed #B7B7B7',
                borderRadius: '20px',
                boxShadow: '0px 0px 6px #00000029',
                p: 4,
              }}
            >
              <div style={{ padding: '0 40px 40px 40px' }}>
                    <Typography
                      variant="h3"
                      sx={{
                        letterSpacing: '1.2px',
                        color: '#222222',
                        fontFamily: 'MulishBold',
                        fontSize: '24px',
                        marginBottom: '70px',
                      }}
                    >
                      Add Service History
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        letterSpacing: '1px',
                        color: '#222222',
                        fontFamily: 'MulishRegular',
                        fontSize: '20px',
                        marginBottom: '16px',
                      }}
                    >
                      Bulk Upload
                    </Typography>
                    <Grid container spacing={3} >
                    <Grid item xs={5}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: '20px',
                        boxShadow: '0px 0px 6px #00000029',
                        marginBottom: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: '20px',
                      }}
                    >
                      <Box mt={2}>
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          id="file-upload"
                          onChange={handleFileChange}
                          multiple
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                        <label htmlFor="file-upload">
                          <Button
                            variant="contained"
                            component="span"
                            style={{
                              width: '140px',
                              height: '60px',
                              borderRadius: '5px',
                              fontFamily: 'MulishBold',
                              backgroundColor: '#fed250',
                              color: '#000',
                              letterSpacing: 0.9,
                              fontSize: '18px',
                              boxShadow: '0px 0px 6px #00000029',
                            }}
                          >
                            Browse
                          </Button>
                        </label>
                      </Box>

                      <Box mt={2}>
                        <Typography variant="body2" sx={{ fontSize: '14px' }}>
                          OR
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <Typography variant="body2" sx={{ fontSize: '14px', letterSpacing: 0.7, color: '#000', fontFamily: 'MulishBold' }}>
                          Drag and drop files here
                        </Typography>
                      </Box>
                    </Paper>

                    </Grid>
                    <Grid item xs={2}>
                    <Box mt={4} textAlign="center">
                      <Typography variant="body2" sx={{ fontSize: '14px',marginTop:'52px' }}>
                        OR
                      </Typography>
                    </Box>
</Grid>
<Grid item xs={5} style={{padding:0,display:'flex',justifyContent:'center',marginTop:'30px'}}>
                    <Box mt={4} textAlign="center">
                      <Button
                        endIcon={<EastIcon />}
                        variant="contained"
                        color="primary"
                        style={{
                          width: '315px',
                          fontSize: '18px',
                          backgroundColor: '#307E98',
                          textDecoration: 'none',
                          color: '#fff',
                          letterSpacing: '0.9px',
                          fontFamily: 'MulishBold',
                          boxShadow: '0px 0px 6px #00000029',
                          borderRadius: '5px',
                        }}
                        onClick={() => navigate('/service-history/create-service-log')}
                      >
                        ADD SINGLE RECORD
                      </Button>
                    </Box>
                    </Grid>

                    </Grid>
                <Grid container spacing={1}>
               
                
                  <Grid item xs={12} style={{ margin: '0 auto', maxWidth: '350px' }}>
                  </Grid>
                </Grid>
              </div>
            </Box>
          </ClickAwayListener>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceHistoryHome;
