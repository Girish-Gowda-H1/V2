import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Chip, FormControl, Grid, Modal, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import * as yup from 'yup';
import apiUrl from '../../../../api-config';
import DataTableComponent from '../components/Data-Table';
import CustomPagination from '../components/pagination/CustomPagination';
import PaginationDropdown from '../components/pagination/PaginationDropdown';
import CheckboxDropdown from '../components/services/CheckboxDropdown';
import CommonHeader from '../components/services/CommonHeader';
const ServiceVendorHome = () => {
  const [dataSource, setDataSource] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState(false);

  const [limit, setLimit] = useState(10);
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectLocation, setSelectedLocation] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState([]);
  const [city, setCity] = useState([]);

  const clickAwayRef = useRef(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: '#FAFAFA',
    border: '3px dashed #B7B7B7',
    borderRadius: '20px',
    boxShadow: '0px 0px 6px #00000029',
    p: 4,
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
  const handleMenuClick = (e) => { };
  const handleSearch = (e) => {
    setSearchText(e?.target?.value);
    setCurrentPage(0);
    const filtered = data.filter((item) => item.name?.toLowerCase().includes(e?.target?.value.toLowerCase()));
    setDataSource(filtered);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const statusUpdate = async (id, status) => {
    setLoading(true);
    try {
      axios.patch(`${apiUrl}/opsvendors/${id}/status/`, { is_enabled: status === true ? false : true }).then((response) => {
        setLoading(false);
        setSuccess('Status Changed.');
        fetchData();
      });
    } catch (error) {
      setLoading(false);
      setError('Faild to Change Status');
      console.log('Error:', error);
    }
  };

  const fetchData = () => {
    axios
      .get(`${apiUrl}/partial-vendors/`)
      .then((response) => {
        let data = [];
        // const transformedData = response.data.flatMap((item) => {
        //   return item?.locations?.map((location) => ({
        //     main_vendor_id: item.id,
        //     name: item.name,
        //     ...location,
        //   }));
        // });
        // response?.data?.map((item) => {
        //   if (item?.locations?.length) {
        //     item?.locations?.map((location) => {
        //       location.name = item?.name;
        //       data = [...data, location];
        //     });
        //   } else {
        //     data = [...data, item];
        //   }
        // });
        setVendorList(response?.data?.map(item => ({ label: item?.name, value: item?.id })))
        setData(response.data);
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

  const columns = [
    {
      name: 'Vendor Name',
      selector: (row) => row?.name,
      key: 'vendorName',
    },
    {
      name: 'Vendor City',
      selector: (row) => row?.locations?.city,
      key: 'vendorCity',
    },
    {
      name: 'Vendor Location',
      selector: (row) => (
        <div
          onClick={() =>
            row?.is_enabled ? navigate(`/service-vendors/view-vendor/${row?.id}`) : navigate(`/service-vendors/view-disabled-vendor/${row?.id}`)
          }
        >
          {row?.locations?.location_name}
          <p style={{ fontFamily: 'MulishBold', fontSize: '12px', color: '#7A7A7A', marginTop: '5px' }}>{row?.locations?.landmark}</p>
        </div>
      ),
      key: 'vendorLocation',
    },
    {
      name: 'Status',
      key: 'status',
      center: true,
      selector: (row, index) => {
        return row?.is_enabled === false || row?.is_enabled === true ? (
          <div
            onClick={() =>
              row?.is_enabled ? navigate(`/service-vendors/view-vendor/${row?.id}`) : navigate(`/service-vendors/view-disabled-vendor/${row?.id}`)
            }
          >
            <Chip
              className={row?.is_enabled ? 'enableStatus' : 'disableStatus'}
              label={row?.is_enabled ? 'ENABLED' : 'DISABLED'}
              variant="outlined"
            />
          </div>
        ) : null;
      },
    },
    {
      name: 'Action',
      // selector: (row) => row?.action,
      key: 'action',
      selector: (row, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '24px' }}>
              <Tooltip title="Change Status">
                <button
                  onClick={() => statusUpdate(row.id, row?.is_enabled , console.log(row.is_enabled))}
                  style={{ cursor: 'pointer', background: 'transparent', width: '100%', padding: '0px' }}
                >
                  <img
                    style={{ width: '24px', objectFit: 'cover' }}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAUxJREFUaEPtmU0SgjAMhcPJ1JMpJ9Ob6WTBjGBLfvoSZCbdsKBN35cHpSkTnbxNJ9dPBXC0gxYHHkR0IaJrsOgXEc1ExFexaQFY/F2Mhu3AEDzvbtMAHCF+ES1CSABHildB7AH0xItZkWzfuW+eswdgDjQgejvUNHcLgFeZJ1AQMtSP+y0AFh+9VHqheGm9fQ9uAby90ZPGrTQXQFLWu09NOVAO2DNQL7E9Z9gR4Q5IG8TR70wBSA9EOWApwiI+ZOVAlgPIysxSukJXIQSERTybAwXggCMQVvEhAF4Ij/gwACuEV3wogBZiRHw4gAQxKj4FoAeBEJ8GsIVAiU8FWCD4ijzZhn8HpN0p+n4BoDNqiac6WkS+cBZxmr4qAA40WrdqxHj68MHu6t9Zr/jg0+ll5fiHk+ruhlGqnjxZSh1TAKnpbkxWDpQDgxn4AFJKUDEPm6whAAAAAElFTkSuQmCC"
                  />
                </button>
              </Tooltip>
            </div>
            <Tooltip title="Edit">
              <button
                onClick={() => {
                  navigate(`/service-vendors/edit-vendor/${row?.id}`);
                }}
                style={{ marginLeft: '22px', cursor: 'pointer', background: 'transparent' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    id="Icon_material-edit"
                    data-name="Icon material-edit"
                    d="M4.5,23.5v5h5L24.244,13.752l-5-5ZM28.11,9.886a1.328,1.328,0,0,0,0-1.88l-3.12-3.12a1.328,1.328,0,0,0-1.88,0l-2.44,2.44,5,5,2.44-2.44Z"
                    transform="translate(-4.5 -4.496)"
                  />
                </svg>
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const handleSearchButton = () => {
    const filtered = data.filter((item) => item.name?.toLowerCase().includes(searchText.toLowerCase()));
    setDataSource(filtered);
  };

  const handleClear = () => {
    setSearchText('');
    setDataSource(data);
  };
  const handleRowClick = (record, rowIndex) => {
    if (record.is_enabled === 'enabled') navigate('/service-vendors/view-vendor');
    if (record.is_enabled === 'disabled') navigate('/service-vendors/view-disabled-vendor');
  };

  const handleAction = (record) => {
    if (record.is_enabled === 'enabled') {
      navigate('/service-types/view-enabled');
    }
    if (record.is_enabled === 'disabled') {
      navigate('/service-types/view-disabled');
    }
  };

  const handleFilter = (is_enabled) => {
    // if (status === 'enabled' || status === 'disabled') {
    setCurrentPage(0);
    setFilteredStatus((prev) => (prev === is_enabled ? null : is_enabled));
  };

  const getFilterData = () => {
    // Assuming data is an array and locations is an array
    const filterData = data?.filter((item) => {
      if (locationName !== '' && selectLocation?.length === 0 && filteredStatus !== null) {
        return item.locations.city === locationName && item.is_enabled === filteredStatus;
      } else if (filteredStatus !== null && selectLocation?.length > 0) {
        return selectLocation.includes(item.locations.location_name) && item.is_enabled === filteredStatus;
      } else if (selectLocation?.length > 0 && locationName !== '') {
        return selectLocation.includes(item.locations.location_name) && item.locations.city === locationName;
      } else if (locationName !== '' && filteredStatus !== null) {
        return item.locations.city === locationName && item.is_enabled === filteredStatus;
      } else if (selectLocation?.length > 0) {
        return selectLocation.includes(item.locations.location_name);
      } else if (filteredStatus !== null) {
        // Use strict equality if filteredStatus is a specific type
        return item.is_enabled === filteredStatus;
      } else if (locationName !== '') {
        return item.locations.city === locationName;
      }
      // If both locations and filteredStatus are not provided, include all items
      return true;
    }) || [];


    // Assuming setDataSource is a function that sets the data source
    setDataSource(filterData);
  };


  useEffect(() => {
    getFilterData();
  }, [filteredStatus]);

  let paginatedData = dataSource.slice(Number(currentPage) * limit, (Number(currentPage) + 1) * limit);

  const getServiceTypes = () => {
    axios
      .get(`${apiUrl}/cities-with-locations/`)
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

  const handleReset = (e) => {
    setDataSource(data);
    setSelectedLocation([]); // Reset the locations state
    setSelectedOptions([]); // Reset the options state
    setLocationName('');
    setOpen(false);
  };

  useEffect(() => {
    selectLocation.length === 0 && getFilterData();
  }, [selectLocation]);

  const handleOk = (data) => {
    localStorage.setItem('vendor_name', data?.vendor_name);
    setModal(false);
    data?.vendor?.__isNew__ ? navigate('/service-vendors/add-vendor') :
      navigate(`/service-vendors/edit-vendor/${data?.vendor?.value}`)
  }

  const AddServiceVendorFormSchema = yup.object().shape({
    vendor_name: yup.string()
      .required('Vender name is Required')
      .matches(/^[a-zA-Z0-9 _-]+$/, 'Alpha numeric with spaces, dot, hash and dash'),
  })

  const methods = useForm({
    resolver: yupResolver(AddServiceVendorFormSchema),
    mode: 'all',
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    clearErrors,
    // formState,
    trigger,
    watch,
    formState: { errors, isValid },
  } = methods;

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
        title={'Service Vendors'}
        path={'/service-rules/create-service'}
        searchPlaceholder={'Search by Service Vendor Name'}
        addButtonText={'ADD NEW'}
        onAdd={() => setModal(true)}
        searchText={searchText}
        handleClear={handleClear}
      />
      <div style={{ display: 'flex', marginTop: 16, justifyContent: 'space-between' }}>
        <div>
          {/* <Dropdown menu={menuProps}>
      <Button>
          SERVICE TYPE
          <DownOutlined />
      </Button>
    </Dropdown> */}
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
              fontWeight: filteredStatus ? 700 : 600,
              color: filteredStatus ? '#4B3D76' : '#000000',
              backgroundColor: filteredStatus ? '#ECE3F1' : '#fff',
            }}
            onClick={() => {
              handleFilter(true);
              setOpen(false);
            }}
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
            onClick={() => {
              handleFilter(false);
              setOpen(false);
            }}
          >
            DISABLED
          </Button>
        </div>
        <PaginationDropdown data={dataSource} limit={limit} setLimit={setLimit} setCurrentPage={setCurrentPage} />
      </div>
      {open ? (
        <CheckboxDropdown
          options={dropdownServiceTypes}
          locationName={locationName}
          setLocationName={setLocationName}
          location={location}
          setLocation={setLocation}
          selectedValues={selectedOptions}
          noCheckBox={true}
          secondmenu={true}
          onChange={setSelectedOptions}
          onLocation={setSelectedLocation}
          locations={selectLocation}
          submitFilter={(location) => {
            setCurrentPage(0);
            // setDataSource(data?.filter((item) => item?.locations?.location_name));
            getFilterData();
            setOpen(false);
          }}
          resetFilter={(e) => handleReset(e)}
          setOpen={setOpen}
        />
      ) : null}
      <DataTableComponent
        columns={columns}
        data={paginatedData}
        handleRowClick={(row) =>
          row?.is_enabled ? navigate(`/service-vendors/view-vendor/${row?.id}`) : navigate(`/service-vendors/view-disabled-vendor/${row?.id}`)
        }
      />
      <CustomPagination currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} _filtered={dataSource} />
      <Modal
        open={modal}
        onClose={() => { setModal(false); setType(''); reset({}) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      // onOk={handleOk}
      // onCancel={handleCancel}
      // width={650}
      // footer={[
      //   <Button
      //     key="submit"
      //     onClick={handleOk}
      //     style={{ backgroundColor: "#FED250" }}
      //   >
      //     ADD SERVICE DETAILS
      //   </Button>,
      // ]}
      >
        <div>
          <Box sx={{ ...style }}>
            <div style={{ padding: '0 40px' }}>
              <div>
                <p className="modal-title">Add New Service Vendor</p>
              </div>
              <FormControl
                // form={form}
                // name="basic"
                // onFinish={onFinish}
                // // initialValues={{ type: "option1" }}
                // //   style={{ marginLeft: "100px" }}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                }}
              >
                {/* <Form.Item
              label="Service Type"
              name="type"
              rules={[{ required: true, message: "Please select a type!" }]}
              style={{ marginLeft: "10%", width: "70%" }}
            >
      
            </Form.Item> */}
                <div className="inputView" style={{}}>
                  <Grid container spacing={2} style={{ alignItems: 'center' }}>
                    <Grid item xs={3}>
                      <p className="inputLabel">Vendor Name</p>
                    </Grid>
                    <Grid item xs={8} style={{ paddingTop: '30px', }}>
                      <Controller
                        control={control}
                        name={"vendor"}
                        render={({ field: { onChange, onBlur, value } }) => {
                          console.log("vendor", value);
                          return (
                            <CreatableSelect
                              isClearable
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  // borderColor: state.isFocused ? 'grey' : 'red',
                                  boxShadow: '0 1px 6px #00000029',
                                  padding: "6px 10px",
                                  border: "none"
                                }),
                                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                  return ({
                                    ...styles,
                                    backgroundColor: isDisabled
                                      ? undefined : isSelected ? "#EBE3F1" : undefined,
                                    color: isDisabled
                                      ? undefined : isSelected ? "#4B3D76" : undefined,
                                    ':active': {
                                      ...styles[':active'],
                                      backgroundColor: !isDisabled ? isSelected ? "#EBE3F1" : undefined : undefined,
                                    },
                                  })
                                }
                              }}
                              placeholder="Enter Vendor Name"
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              onChange={(newValue) => {
                                setValue("vendor_name", newValue?.label)
                                clearErrors()
                                onChange(newValue)
                              }}
                              // onCreateOption={handleCreate}
                              options={vendorList}
                              value={value}
                            />
                          )
                        }}
                      />
                      {errors?.vendor_name && <p className='vendorName'>Please enter a vendor name</p>}
                      {/* <Select
                        defaultValue={dropdownOptionsAsd[0]?.value || ""}
                        value={type}
                        onChange={(e) => {
                          setType(e?.target?.value);
                        }}
                        // defaultChecked={dropdownOptionsAsd?.[0]?.label}
                        sx={{ '& legend': { display: 'none' }, '& fieldset': { top: 0 }, }}
                        className="inputType"
                        label={null}
                        style={{ width: '100%', color: type === 0 ? 'gray' : 'black' }}
                      >
                        {dropdownOptionsAsd?.map((item, i) => {
                          return (
                            <MenuItem disabled={i === 0 ? true : false} key={item?.value} style={{ paddingLeft: '31px' }} sx={{ color: item?.label === '-- Select Service Type --' ? 'gray' : '#5C5C5C', '&:hover': { color: '#4B3D76' } }} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select> */}
                    </Grid>
                    <div></div>
                  </Grid>
                  {/* <Input
                  type="text"
                  // style={{ width: "450px" }}
                  className="input-field inputType"
                  // onChange={(e) => { setType(e?.target?.value) }}

                  placeholder="Enter service type"
                /> */}
                </div>

                <div className="bottomView" style={{ marginTop: '5rem' }}>
                  <Button sx={{ '&.Mui-disabled': { color: '#5C5C5C', backgroundColor: '#EEEEEE', padding: '9px 41px', border: 'none', boxShadow: '0px 0px 4px #00000029', fontSize: '18px' } }} style={{ fontFamily: 'MulishBold' }} className="newButton" onClick={handleSubmit(handleOk)}>
                    ADD VENDOR DETAILS
                  </Button>
                </div>
              </FormControl>
            </div>
            {/* <ChildModal /> */}
          </Box>
        </div>
      </Modal>
      {/* <CustomPagination total={500} /> */}
      {/* <Outlet /> */}
    </div>
  );
};

export default ServiceVendorHome;
