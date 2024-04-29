import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../components/services/CommonHeader";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import apiUrl from "../../../../api-config";
import DataTableComponent from "../components/Data-Table";
import CustomPagination from "../components/pagination/CustomPagination";
import PaginationDropdown from "../components/pagination/PaginationDropdown";
import CheckboxDropdown from "../components/services/CheckboxDropdown";
// import { Form, Select } from 'antd';
import Recursive from "../../../assets/svgs/Recursive.svg";
import "../ServiceType/serviceType.less";
import "./serviceRule.less";

const ServiceRulesHome = () => {
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredStatus1, setFilteredStatus1] = useState(false);
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modal, setModal] = useState(false);
  const [type, setType] = useState("");
  const [data, setData] = useState();
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchText(e?.target?.value);
    setCurrentPage(0);
    const filtered = data.filter((item) =>
      item.bike_model
        .toString()
        .toLowerCase()
        .includes(e?.target?.value.toString().toLowerCase())
    );
    setDataSource(filtered);
  };

  const handleClear = () => {
    setSearchText("");
    setDataSource(data);
  };

  let dropdownOptions = useMemo(() => {
    const data = [];
    dropdownServiceTypes.map((obj) => {
      // Mapping id with value and name with label
      data.push({
        value: obj.id,
        label: obj.name,
      });
    });
    data.push({ value: 0, label: "-- Select Service Type --" });
    return data;
  }, [dropdownServiceTypes]);

  const dropdownOptionsAsd =
    dropdownOptions &&
    dropdownOptions.slice().sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    if (modal === true) {
      setType(dropdownOptionsAsd[0]?.label);
    } else {
      setType("");
    }
  }, [modal]);

  const fetchData = () => {
    // axios.get(`${apiUrl}/service-rules/`)
    axios
      .get(`${apiUrl}/service-rules/partial/`)
      .then((response) => {
        setData(response.data);
        setDataSource(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const serviceTypesPartialData = () => {
  //   axios.get(`${apiUrl}/service-types/partial/`)
  //     .then((response) => {
  //       setServiceTypesPartial(response.data)
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // useEffect(()=> setDataSource([
  //   { key: '1', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '2', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '3', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'disabled', cycle: "recursive" },
  //   { key: '4', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "non-recursive" },
  //   { key: '5', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "non-recursive" },
  //   { key: '6', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '7', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'disabled', cycle: "recursive" },
  //   { key: '8', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'disabled', cycle: "recursive" },
  //   { key: '9', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "non-recursive" },
  //   { key: '10', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '11', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '12', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '13', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '14', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '15', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '16', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '17', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'disabled', cycle: "recursive" },
  //   { key: '18', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '19', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '20', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '21', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'disabled', cycle: "recursive" },
  //   { key: '22', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'disabled', cycle: "recursive" },
  //   { key: '23', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '24', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '25', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '26', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '27', vehicleModel: "Activa 5G", year: "2022", serviceType: 'John Doe', status: 'enabled', cycle: "recursive" },
  //   { key: '28', vehicleModel: "Activa 5G", year: "2022", serviceType: 'Jane Doe', status: 'enabled', cycle: "recursive" },
  // ]),[])

  useEffect(() => {
    fetchData();
    getServiceTypes();
    // serviceTypesPartialData()
  }, []);

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
  const columns = [
    {
      name: "Vehicle Model",
      selector: (row) => {
        return row?.bike_model;
      },
      key: "bike_model",
    },
    {
      name: "Year",
      selector: (row) => row?.year,
      key: "year",
      center: true,
    },
    {
      name: "Service Type",
      selector: (row) => {
        return row?.service_type_name;
      },
      key: "service_type",
      center: true,
    },
    {
      name: "Rule Status",
      key: "status",
      center: true,
      selector: (row) => {
        return (
          <div
            onClick={() => {
              if (row.status === 1)
                navigate(`/service-rules/view-rule/${row.id}`);
              if (row.status === 0 || row.status === 2)
                navigate(`/service-rules/view-disabled-rule/${row.id}`);
              // axios
              //   .patch(`${apiUrl}/service-rules/${row.id}/status/`, { status: row?.status ? 0 : 1 })
              //   .then(() => {
              //     fetchData()
              //   })
              //   .catch((error) => {
              //     console.log(error);
              //   })
            }}
          >
            <Chip
              className={
                row?.status === 1
                  ? "enableStatus"
                  : row?.status === 0
                    ? "draftStatus"
                    : "disableStatus"
              }
              label={
                row?.status === 1
                  ? "ENABLED"
                  : row?.status === 0
                    ? "DRAFTED"
                    : "DISABLED"
              }
              variant="outlined"
            />
          </div>

          // <Chip  color={status === 1 ? "success" : "default"}>
          //   {status === 1 ? "ENABLED" : "DISABLED"}
          // </Tag>
        );
      },
    },
    {
      name: "Service Cycle",
      key: "is_recursive",
      selector: (row) => {
        if (row?.is_recursive)
          return (
            <div
              onClick={() => {
                if (row.status === 1)
                  navigate(`/service-rules/view-rule/${row.id}`);
                if (row.status === 2 || row.status === 0)
                  navigate(`/service-rules/view-disabled-rule/${row.id}`);
              }}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <img src={Recursive} alt="Recursive" /> Recursive
            </div>
          );
        if (!row?.is_recursive) return <div>Non - Recursive</div>;
        else return <div></div>;
      },
    },
  ];

  const showModal = () => {
    setModal(true);
  };

  const handleOk = () => {
    // setModalText('The modal will be closed after two seconds');
    navigate("/service-rules/create-service", {
      state: { data: { serviceType: type, recursiveFlag: isChecked } },
    });
    setOpen(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "#FAFAFA",
    border: "3px dashed #B7B7B7",
    borderRadius: "20px",
    boxShadow: "0px 0px 6px #00000029",
    p: 4,
  };

  // const handleCancel = () => {
  //   setOpen(false);
  // };
  const onCheckboxChange = () => {
    setIsChecked((prevValue) => !prevValue);
  };

  // const onSelectChange = (value) => {
  //   selectedServiceType = value;
  // };

  // const handleAction = (record) => {
  //   if(record.status === "enabled"){navigate('/view-enabled');}
  //   if(record.status === "disabled"){navigate('/view-disabled');}
  // };

  const handleFilter = (value) => {
    setCurrentPage(0);
    if (value || value === 0) {
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

  const filtered = useMemo(() => {
    if ((filteredStatus || filteredStatus === 0) && filteredStatus1) {
      return dataSource.filter(
        (item) =>
          item.status === filteredStatus &&
          item.is_recursive === filteredStatus1
      );
    } else if (filteredStatus || filteredStatus === 0) {
      return dataSource.filter((item) => item.status === filteredStatus);
    } else if (filteredStatus1) {
      return dataSource.filter((item) => item.is_recursive === filteredStatus1);
    } else {
      return dataSource;
    }
  }, [filteredStatus, filteredStatus1, dataSource]);

  let paginatedData = filtered.slice(
    Number(currentPage) * limit,
    (Number(currentPage) + 1) * limit
  );
  const handleSearchButton = () => {
    const filtered = data.filter((item) =>
      item.bike_model
        .toString()
        .toLowerCase()
        .includes(searchText.toString().toLowerCase())
    );
    setDataSource(filtered);
  };
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleFilterChange = (selected) => {
    // Handle the selected values, e.g., apply filter
    setSelectedOptions(selected);
  };

  return (
    <div style={{ margin: "0 auto", padding: "2rem 4rem 2rem 4rem" }}>
      <CommonHeader
        handleSearch={handleSearch}
        handleSearchButton={handleSearchButton}
        title={"Service Rules"}
        path={"/service-rules/create-service"}
        searchPlaceholder={"Search by Vehicle Model"}
        addButtonText={"ADD NEW RULE"}
        onAdd={() => showModal(true)}
        searchText={searchText}
        handleClear={handleClear}
      />

      <div
        style={{
          display: "flex",
          marginTop: 16,
          justifyContent: "space-between",
        }}
      >
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
              fontWeight: selectedOptions?.length ? 700 : 600,
              color: selectedOptions?.length ? "#4B3D76" : "#000000",
              backgroundColor: selectedOptions?.length ? "#ECE3F1" : "#fff",
            }}
            onClick={() => {
              setOpen(open === true ? false : true);
              if (dropdownOptions.length === 0) getServiceTypes();
            }}
          >
            SERVICE TYPE{" "}
            <span style={{ display: "flex" }}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </span>
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === 1 ? 700 : 600,
              color: filteredStatus === 1 ? "#4B3D76" : "#000000",
              backgroundColor: filteredStatus === 1 ? "#ECE3F1" : "#fff",
            }}
            onClick={() => handleFilter(1)}
          >
            ENABLED
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === 2 ? 700 : 600,
              color: filteredStatus === 2 ? "#4B3D76" : "#000000",
              backgroundColor: filteredStatus === 2 ? "#ECE3F1" : "#fff",
            }}
            onClick={() => handleFilter(2)}
          >
            DISABLED
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus === 0 ? 700 : 600,
              color: filteredStatus === 0 ? "#4B3D76" : "#000000",
              backgroundColor: filteredStatus === 0 ? "#ECE3F1" : "#fff",
            }}
            onClick={() => handleFilter(0)}
          >
            DRAFTED
          </Button>
          <Button
            className="filterButton"
            style={{
              fontWeight: filteredStatus1 === true ? 700 : 600,
              color: filteredStatus1 === true ? "#4B3D76" : "#000000",
              backgroundColor: filteredStatus1 === true ? "#ECE3F1" : "#fff",
            }}
            onClick={() => {
              setCurrentPage(0);
              setFilteredStatus1(!filteredStatus1);
            }}
          >
            RECURSIVE
          </Button>
        </div>
        <PaginationDropdown
          data={filtered}
          limit={limit}
          setLimit={setLimit}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {open ? (
        <CheckboxDropdown
          options={dropdownServiceTypes
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))}
          selectedValues={selectedOptions}
          onChange={handleFilterChange}
          submitFilter={() => {
            setCurrentPage(0);
            setDataSource(
              data?.filter((item) =>
                selectedOptions?.includes(item?.service_type)
              )
            );
            setOpen(false);
          }}
          resetFilter={() => {
            setOpen(false);
            setDataSource(data);
            setSelectedOptions([]);
          }}
          hasCheckbox={true}
          setOpen={setOpen}
        />
      ) : null}
      <DataTableComponent
        columns={columns}
        data={paginatedData}
        handleRowClick={(row) => {
          if (row.status === 1) navigate(`/service-rules/view-rule/${row.id}`);
          if (row.status === 2)
            navigate(`/service-rules/view-disabled-rule/${row.id}`);
        }}
      />
      <CustomPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        _filtered={filtered}
      />
      {/* <div style={{ display: "flex", marginTop: 16 }}>
        <Space>
        
          <Dropdown menu={menuProps}>
            <Button>
              <Space>
                SERVICE TYPE
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>

          <Button onClick={() => handleFilter(1)}>ENABLED</Button>
          <Button onClick={() => handleFilter(0)}>DISABLED</Button>
          <Button onClick={() => handleFilter(true)}>RECURSIVE</Button>
        </Space>
      </div> */}
      {/* <Table
        rowKey="id"
        dataSource={filtered}
        columns={columns}
        bordered
        onRow={(record, rowIndex) => {
          return { onClick: () => handleRowClick(record, rowIndex) };
        }}
        pagination={{
          position: ["topRight", "bottomCenter"],
          itemRender: (current, type, originalElement) => {
            if (type === "prev") {
              return (
                <a>
                  <LeftOutlined /> Previous
                </a>
              );
            }
            if (type === "next") {
              //   return <>{originalElement} Next &#8250;</>;
              return (
                <a>
                  Next <RightOutlined />
                </a>
              );
            }
            return originalElement;
          },
          showSizeChanger: false,
          pageSize: 10,
          //   showTotal: (total, range) => `Showing ${range[0]}-${range[1]} out of ${total}`,
        }}
      /> */}

      {/* <CustomPagination total={500} /> */}
      {/* <Outlet /> */}
      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          setType("");
        }}
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
            <div style={{ padding: "0 40px" }}>
              <div>
                <p className="modal-title">Add New Service Rule</p>
              </div>
              <FormControl
                // form={form}
                // name="basic"
                // onFinish={onFinish}
                // // initialValues={{ type: "option1" }}
                // //   style={{ marginLeft: "100px" }}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
                {/* <Form.Item
              label="Service Type"
              name="type"
              rules={[{ required: true, message: "Please select a type!" }]}
              style={{ marginLeft: "10%", width: "70%" }}
            >
      
            </Form.Item> */}
                <div className="inputView" style={{ marginTop: "24px" }}>
                  <Grid container spacing={2} style={{ alignItems: "center" }}>
                    <Grid item xs={3}>
                      <p className="inputLabel">Service Type</p>
                    </Grid>
                    <Grid item xs={9}>
                      <Select
                        defaultValue={dropdownOptionsAsd[0]?.label || ""}
                        value={type}
                        onChange={(e) => {
                          setType(e?.target?.value);
                        }}
                        // defaultChecked={dropdownOptionsAsd?.[0]?.label}
                        sx={{
                          "& legend": { display: "none" },
                          "& fieldset": { top: 0 },
                        }}
                        className="inputType"
                        label={null}
                        style={{
                          width: "100%",
                          color: type === 0 ? "gray" : "black",
                        }}
                      >
                        {dropdownOptionsAsd?.map((item, i) => {
                          return (
                            <MenuItem
                              disabled={i === 0 ? true : false}
                              key={item?.id}
                              style={{ paddingLeft: "31px" }}
                              sx={{
                                color:
                                  item?.label === "-- Select Service Type --"
                                    ? "gray"
                                    : "#5C5C5C",
                                "&:hover": { color: "#4B3D76" },
                              }}
                              value={item?.label}
                            >
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
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
                {type.toLocaleLowerCase() !== 'first service' && (
                  <div className="checkboxView">
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <p className="inputLabel"></p>
                      </Grid>
                      <Grid
                        item
                        xs={9}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Checkbox
                          onChange={onCheckboxChange}
                          style={{
                            color: "#4B3D76",
                            outline: "none",
                            borderColor: "transparent",
                          }}
                          checked={isChecked}
                        ></Checkbox>
                        <p className="inputLabel">Recursive Service</p>
                      </Grid>
                    </Grid>
                  </div>
                )}

                <div className="bottomView" style={{ marginTop: "5rem" }}>
                  <Button
                    disabled={!type}
                    sx={{
                      "&.Mui-disabled": {
                        color: "#5C5C5C",
                        backgroundColor: "#EEEEEE",
                        padding: "9px 41px",
                        border: "none",
                        boxShadow: "0px 0px 4px #00000029",
                        fontSize: "18px",
                      },
                    }}
                    style={{ fontFamily: "MulishBold" }}
                    className="newButton"
                    onClick={handleOk}
                  >
                    ADD SERVICE DETAILS
                  </Button>
                </div>
              </FormControl>
            </div>
            {/* <ChildModal /> */}
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceRulesHome;
