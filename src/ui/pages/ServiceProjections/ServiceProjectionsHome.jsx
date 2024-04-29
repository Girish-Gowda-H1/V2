import { useEffect, useState } from 'react';
// import { Table, Button, Tag, Input, Space, Dropdown } from 'antd';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Checkbox, ClickAwayListener, useTheme } from '@mui/material';
import { LicenseInfo } from '@mui/x-license-pro';
import axios from 'axios';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import apiUrl from '../../../../api-config';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import DataTableComponent from '../components/Data-Table';
import CustomPagination from '../components/pagination/CustomPagination';
import PaginationDropdown from '../components/pagination/PaginationDropdown';
import CheckboxDropdown from '../components/services/CheckboxDropdown';
import CommonHeader from '../components/services/CommonHeader';

LicenseInfo.setLicenseKey('363b4a526f1a385ec60089831d149c99Tz03NzYxMCxFPTE3MzAwOTczMDYwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
// import { useNavigate } from 'react-router-dom';

// const { RangePicker } = DatePicker;

const ServiceProjectionsHome = () => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [openServiceDate, setOpenServiceDate] = useState(false);
  const [openUpcooming, setOpenUpcoming] = useState(false);
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [selectedUpcoming, setSelectedUpcoming] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [locations, setSelectedLocation] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState([]);
  const theme = useTheme();
  const [selectedItems, setSelectedItems] = useState([]);
  // const isDisabled = locationFilterData.city.length === 0 && locationFilterData.locations.length === 0;
  const isDisabled = false;
  const [dateRange, setDateRange] = useState([null, null]);
  const [fillterDateRange, setFillterDateRange] = useState([null, null]);
  //   const navigate = useNavigate();
  // const { RangePicker } = DatePicker;
  // const [selectedRange, setSelectedRange] = useState(null);

  // const handleRangeChange = (dates) => {
  //   setSelectedRange(dates);
  // }

  // const handleSubmit = () => {
  //   if (selectedRange) {
  //     const [start, end] = selectedRange;
  //   } else {
  //   }
  // }

  const handleSearch = (e) => {
    setSearchText(e?.target?.value);
    const filtered = data.filter((item) => {
      return (
        item.vehicle_make.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        item.registration_number.toLowerCase().includes(e?.target?.value.toLowerCase())
      );
    });
    setDataSource(filtered);
  };

  const handleClear = () => {
    setSearchText('');
    setDataSource(data);
  };

  const handleSearchButton = () => {
    const filtered = data.filter((item) => {
      return (
        item.vehicle_make.toLowerCase().includes(searchText.toLowerCase()) ||
        item.registration_number.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setDataSource(filtered);
  };
  const items = [
    {
      label: '1st menu item',
      key: '1',
    },
    {
      label: '2nd menu item',
      key: '2',
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleMenuClick = (e) => { };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const fetchData = async () => {
    await axios
      .get(`${apiUrl}/custom-service-projections/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setData(response?.data);
        setDataSource(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [filteredStatus, setFilteredStatus] = useState(null);

  const checkMultiData = (e) => {
    if (e.target.checked === true) {
      setSelectedItems([...selectedItems, e.target.value]);
    } else {
      const updatedItems = selectedItems.filter((item) => item !== e.target.value);
      setSelectedItems(updatedItems);
    }
  };

  const columns = [
    {
      name: 'Registration No.',
      // selector: (row) => row?.registration_number,
      selector: (row) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Checkbox checked={selectedItems.includes(row?.registration_number)} value={row?.registration_number} onChange={(e) => checkMultiData(e)} />
          {row?.registration_number}
        </div>
      ),
      key: 'registrationNo',
    },
    {
      name: 'Vehicle Make & Model',
      selector: (row) => row?.vehicle_make,
      key: 'vehicleMake',
      center: true,
    },
    {
      name: 'Location',
      selector: (row) => row?.location,
      key: 'location',
      center: true,
    },
    {
      name: 'Next Service Date',
      selector: (row) => dayjs(row?.next_service_date).format('DD MMM YYYY'),
      key: 'nextServiceDate',
      center: true,
    },
    {
      name: 'Next Service Odo',
      selector: (row) => row?.next_service_odo + ' km',
      key: 'nextService',
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => {
        if (row.critical_odo === 'Critical' || row.critical_date === 'Critical') {
          return <div className={'status-badge info'}>PRIORITY</div>;
        } else if (row.critical_odo === 'Warning' || row.critical_date === 'Warning') {
          return <div className={'status-badge error'}>CRITICAL</div>;
        } else if (row.critical_odo === 'Normal' || row.critical_date === 'Normal') {
          return <div className={'status-badge success'}>UPCOMING</div>;
        }
      },
      key: 'status',
      center: true,
    },
  ];

  // const handleRowClick = (record, rowIndex) => {
  //   if (record.status === "critical") navigate("/service-rules/view-rule");
  //   if (record.status === "priority") navigate("/service-rules/view-disabled-rule");
  // };

  // const handleAction = (record) => {
  //   if(record.status === "enabled"){navigate('/view-enabled');}
  //   if(record.status === "disabled"){navigate('/view-disabled');}
  // };

  const handleFilter = (value) => {
    setDataSource(data);
    if (value === 'Critical' || value === 'Warning' || value === 'Normal') {
      setFilteredStatus((prev) => {
        if (prev === value) {
          return null;
        } else {
          return value;
        }
      });
    } else {
      setFilteredStatus(null);
    }
  };

  const getServiceTypes = () => {
    axios
      .get(`${apiUrl}/cities-locations/`)
      .then((response) => {
        setDropdownServiceTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showModal = () => {
    setOpen(open === true ? false : true);
    if (dropdownServiceTypes.length === 0) getServiceTypes();
  };

  console.log('dateRange', dateRange);

  const getFilterData = (dates, location) => {
    const filterData =
      data?.filter((item) => {
        const currentDate = new Date();
        const nextServiceDate = new Date(item.next_service_date);
        let dateRangeMatch;
        switch (selectedUpcoming) {
          case 'today':
            dateRangeMatch = nextServiceDate.toDateString() === currentDate.toDateString();
            break;
          case 'next7days':
            dateRangeMatch = nextServiceDate >= currentDate && nextServiceDate <= new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'next15days':
            dateRangeMatch = nextServiceDate >= currentDate && nextServiceDate <= new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000);
            break;
          case 'next30days':
            dateRangeMatch = nextServiceDate >= currentDate && nextServiceDate <= new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            break;
        }

        const isMatchingOption = item.critical_odo === filteredStatus || item.critical_date === filteredStatus;
        const isWithinDateRange =
          dates !== undefined &&
          dates[0] !== null &&
          dates[1] !== null &&
          nextServiceDate >= new Date(dates[0]) &&
          nextServiceDate <= new Date(dates[1]);
        const isMatchingLocation = locations.includes(item.location);
        const isMatchingLocationName = locationName !== '';
        const isMatchingCity = item.city === locationName;

        // Check and combine conditions for filtering
        if (dates !== undefined && locations.length && filteredStatus !== null && selectedUpcoming && isMatchingLocationName) {
          return isMatchingOption && isMatchingLocation && isWithinDateRange && dateRangeMatch && isMatchingCity;
        } else if (dates !== undefined && locations.length && filteredStatus !== null && isMatchingLocationName) {
          return isMatchingOption && isMatchingLocation && isWithinDateRange && isMatchingCity;
        } else if (selectedUpcoming && locations.length && filteredStatus !== null && isMatchingLocationName) {
          return isMatchingOption && isMatchingLocation && dateRangeMatch && isMatchingCity;
        } else if (selectedUpcoming && dates !== undefined && filteredStatus !== null && isMatchingLocationName) {
          return isMatchingOption && isWithinDateRange && dateRangeMatch && isMatchingCity;
        } else if (selectedUpcoming && locations.length && dates !== undefined && isMatchingLocationName) {
          return isWithinDateRange && isMatchingLocation && dateRangeMatch && isMatchingCity;
        } else if (locations.length && filteredStatus !== null && isMatchingLocationName) {
          return isMatchingOption && isMatchingLocation && isMatchingCity;
        } else if (filteredStatus !== null && dates !== undefined && isMatchingLocationName) {
          return isMatchingOption && isWithinDateRange && isMatchingCity;
        } else if (selectedUpcoming && dates !== undefined && isMatchingLocationName) {
          return isWithinDateRange && dateRangeMatch && isMatchingCity;
        } else if (filteredStatus !== null && selectedUpcoming && isMatchingLocationName) {
          return isMatchingOption && dateRangeMatch && isMatchingCity;
        } else if (locations.length && selectedUpcoming && isMatchingLocationName) {
          return isMatchingLocation && dateRangeMatch && isMatchingCity;
        } else if (locations.length && dates !== undefined && isMatchingLocationName) {
          return isWithinDateRange && isMatchingLocation && isMatchingCity;
        } else if (filteredStatus !== null && isMatchingLocationName) {
          return isMatchingOption && isMatchingCity;
        } else if (dates !== undefined && isMatchingLocationName) {
          return isWithinDateRange && isMatchingCity;
        } else if (locations.length && isMatchingLocationName) {
          return isMatchingLocation && isMatchingCity;
        } else if (selectedUpcoming && isMatchingLocationName) {
          return dateRangeMatch && isMatchingCity;
        } else if (isMatchingLocationName) {
          return isMatchingCity;
        } else if (selectedUpcoming) {
          return dateRangeMatch;
        } else if (locations.length) {
          return isMatchingLocation;
        } else if (dates !== undefined) {
          return isWithinDateRange;
        } else if (filteredStatus !== null) {
          return isMatchingOption;
        } else {
          return true;
        }
      }) || [];

    setDataSource(filterData);
  };

  useEffect(() => {
    getFilterData();
  }, [filteredStatus, selectedUpcoming]);

  console.log('dataSource', { dataSource, locationName });

  const exportData = () => {
    const data = [];
    if (selectedItems.length > 0) {
      dataSource.map((item) => selectedItems.includes(item.registration_number) && data.push(item));
    } else {
      dataSource.map((item) => data.push(item));
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'ServiceProjectionsData.xlsx');
  };

  let paginatedData = dataSource?.slice(Number(currentPage) * limit, (Number(currentPage) + 1) * limit);
  return (
    <div style={{ margin: '0 auto', padding: '2rem 4rem 2rem 4rem' }}>
      <CommonHeader
        handleSearch={handleSearch}
        handleSearchButton={handleSearchButton}
        title={'Service Projections'}
        searchPlaceholder={'Search by Vehicle Registration No.'}
        searchText={searchText}
        handleClear={handleClear}
      />
      <div style={{ display: 'flex', marginTop: 16, justifyContent: 'space-between' }}>
        <div>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === 1 ? 700 : 600,
              color: filteredStatus === 1 ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus === 1 ? '#ECE3F1' : '#fff',
            }}
            onClick={() => showModal()}
          >
            LOCATION <span style={{ display: 'flex' }}>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: fillterDateRange[0] !== null ? 700 : 600,
              color: fillterDateRange[0] !== null ? '#4B3D76' : '#000000',
              backgroundColor: fillterDateRange[0] !== null ? '#ECE3F1' : '#fff',
              padding: '0',
            }}
          // onClick={() => setOpenServiceDate(openServiceDate === true ? false : true)}
          >
            {/* SERVICE DATE <span style={{ display: 'flex' }}>{openServiceDate ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span> */}
            <CustomDatePicker
              placeholder="SERVICE DATE"
              sx={{ width: 150 }}
              onOk={(dates) => {
                getFilterData(dates);
                setOpenServiceDate(false);
              }}
              changeset={(dates) => {
                setDateRange([dates[0], dates[1]]);
              }}
              onReset={() => {
                getFilterData();
                setDateRange([null, null]);
                setOpenServiceDate(false);
                // setDataSource(data);
              }}
              defaultValue={fillterDateRange}
            />
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === 'Warning' ? 700 : 600,
              color: filteredStatus === 'Warning' ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus === 'Warning' ? '#ECE3F1' : '#fff',
            }}
            onClick={() => handleFilter('Warning')}
          >
            CRITICAL
          </Button>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <Button
              className="filterButton"
              style={{
                fontWeight: filteredStatus === 'Normal' ? 700 : 600,
                color: filteredStatus === 'Normal' ? '#4B3D76' : '#000000',
                backgroundColor: filteredStatus === 'Normal' ? '#ECE3F1' : '#fff',
              }}
              // onClick={() => handleFilter('Normal')}
              onClick={() => setOpenUpcoming(openUpcooming === true ? false : true)}
            >
              UPCOMING<span style={{ display: 'flex' }}>{openUpcooming ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
            </Button>
            {openUpcooming && (
              <ClickAwayListener onClickAway={() => setOpenUpcoming(false)}>
                <div
                  style={{
                    position: 'absolute',
                    zIndex: 2,
                    left: 0,
                    top: '100%',
                    boxShadow: '0px 1px 6px #00000029',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '7px 12px',
                    width: '130px',
                  }}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                      padding: '10px 12px',
                      backgroundColor: selectedUpcoming === 'today' ? '#ebe3f1' : '#fff',
                      borderRadius: '5px',
                      fontSize: '12px',
                      letterSpacing: '0.3px',
                      color: '#5C5C5C',
                      fontFamily: 'MulishRegular',
                    }}
                    onClick={() => {
                      setSelectedUpcoming((prev) => (prev === 'today' ? '' : 'today'));
                      setOpenUpcoming(false);
                    }}
                  >
                    Today
                  </div>
                  <div
                    style={{
                      cursor: 'pointer',
                      padding: '10px 12px',
                      backgroundColor: selectedUpcoming === 'next7days' ? '#ebe3f1' : '#fff',
                      borderRadius: '5px',
                      fontSize: '12px',
                      letterSpacing: '0.3px',
                      color: '#5C5C5C',
                      fontFamily: 'MulishRegular',
                    }}
                    onClick={() => {
                      setSelectedUpcoming((prev) => (prev === 'next7days' ? '' : 'next7days'));
                      setOpenUpcoming(false);
                    }}
                  >
                    Next 7 Days
                  </div>
                  <div
                    style={{
                      cursor: 'pointer',
                      padding: '10px 12px',
                      backgroundColor: selectedUpcoming === 'next15days' ? '#ebe3f1' : '#fff',
                      borderRadius: '5px',
                      fontSize: '12px',
                      letterSpacing: '0.3px',
                      color: '#5C5C5C',
                      fontFamily: 'MulishRegular',
                    }}
                    onClick={() => {
                      setSelectedUpcoming((prev) => (prev === 'next15days' ? '' : 'next15days'));
                      setOpenUpcoming(false);
                    }}
                  >
                    Next 15 Days
                  </div>
                  <div
                    style={{
                      cursor: 'pointer',
                      padding: '10px 12px',
                      backgroundColor: selectedUpcoming === 'next30days' ? '#ebe3f1' : '#fff',

                      borderRadius: '5px',
                      fontSize: '12px',
                      letterSpacing: '0.3px',
                      color: '#5C5C5C',
                      fontFamily: 'MulishRegular',
                    }}
                    onClick={() => {
                      setSelectedUpcoming((prev) => (prev === 'next30days' ? '' : 'next30days'));
                      setOpenUpcoming(false);
                    }}
                  >
                    Next 30 Days
                  </div>
                </div>
              </ClickAwayListener>
            )}
          </div>

          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === 'Critical' ? 700 : 600,
              color: filteredStatus === 'Critical' ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus === 'Critical' ? '#ECE3F1' : '#fff',
            }}
            onClick={() => handleFilter('Critical')}
          >
            PRIORITY
          </Button>
        </div>
        <PaginationDropdown data={dataSource} limit={limit} setLimit={setLimit} setCurrentPage={setCurrentPage} />
      </div>
      {open ? (
        <CheckboxDropdown
          options={dropdownServiceTypes}
          selectedValues={selectedOptions}
          locationName={locationName}
          setLocationName={setLocationName}
          location={location}
          setLocation={setLocation}
          noCheckBox={true}
          secondmenu={true}
          onChange={setSelectedOptions}
          onLocation={setSelectedLocation}
          locations={locations}
          submitFilter={(location) => {
            getFilterData(undefined, location);
            setOpen(false);
          }}
          data={data}
          resetFilter={() => {
            setOpen(false);
            setDataSource(data);
            setSelectedLocation([]);
            setSelectedOptions([]);
            setLocationName('');
            setLocation([]);
            getFilterData()
          }}
          setOpen={setOpen}
        />
      ) : null}

      {openServiceDate === true && (
        <ClickAwayListener onClickAway={() => setOpenServiceDate(false)}>
          {/* <div className="date-picker-range-popup-wrapper">
            <div className="date-picker-range-popup">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangeCalendar
                  calendars={1}
                  size="small"
                  slotProps={
                    {
                      day: {
                        sx: {
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.primary.main,
                          },
                        },
                      },
                    }
                  }
                  form
                  format="YYYY-MM-DD"
                  defaultValue={fillterDateRange}
                  onChange={(dates, isFinish) => {
                    setDateRange([dates[0], dates[1]]);
                  }}
                />
              </LocalizationProvider>
              <Grid container justifyContent="space-between" pt={2} px={'23px'} pb={'20px'}>
                <Button
                  variant="text"
                  onClick={() => {
                    setDateRange([null, null]);
                    setOpenServiceDate(false);
                    getFilterData()
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
                    getFilterData()
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
          </div> */}
          {/* <CustomDatePicker
            placeholder="Date Filled"
            sx={{ width: 150 }}
            onOk={(dates) => {
              getFilterData()
              setOpenServiceDate(false);
            }}
            onReset={() => {
              setDateRange([null, null]);
              setOpenServiceDate(false);
              getFilterData()
            }}
            defaultValue={fillterDateRange}
          /> */}
        </ClickAwayListener>
      )}
      <DataTableComponent columns={columns} data={paginatedData} />
      <CustomPagination currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} _filtered={dataSource} />
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
          <span
            style={{
              textAlign: 'left',
              fontSize: '16px',
              letterSpacing: '0.9px',
              color: '#000000',
              fontFamily: 'MulishBold',
              fontWeight: 'semibold',
            }}
          >
            EXPORT DATA
          </span>
        </button>
      </div>
    </div>
  );
};

export default ServiceProjectionsHome;
