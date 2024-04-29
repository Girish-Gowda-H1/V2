import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { Autocomplete, Box, Button, Card, Divider, FormControl, FormHelperText, Grid, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { DatePicker } from 'rsuite';
import apiUrl from '../../../../api-config';
import { operationsError } from '../../../../errorConstant';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomHeader from '../../components/Header';
import FormInputField from '../../components/forms/FormInputField';
import ActionHeader from '../components/services/actionHeader';
import './CreateServiceLog.css';
import { CreateServiceLogSchema } from './formSchema/CreateServiceLogSchema';

const CreateServiceLog = () => {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(CreateServiceLogSchema),
    mode: 'all',
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;

  const [status, setStatus] = useState(1)

  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        const mimeType = image.type;
        const base64WithPrefix = `data:${mimeType};base64,${base64String}`;
        resolve(base64WithPrefix);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const invoiceBody = {
      invoice_number: data.invoice_number.toString(),
      total_amount: data.actual_total_cost,
      billed_to: Number(data.billed_to),
      invoice_date: data.invoice_date,
      status: 0,
      images: [],
      is_enabled: Boolean(status),
    };

    const requestBody = {
      invoice: invoiceBody,
      spares_amount: data.spare_part_charges,
      labour_amount: data.labor_charges || 0,
      discount: data.discount || 0,
      tax: data.taxes,
      service_type: Number(data.service_type),
      odometer_log: null,
      vendor_location: Number(data.service_vendor),
      remarks: data.remarks,
      service_date: data.service_date,
      total_amount: data.actual_total_cost,
      status: 0,
      spares_tax: data.spare_taxes,
      is_enabled: Boolean(status),
      bike: Number(data.registration),
      // service_projection: Number(data.service_projection),
      odo_reading: data.odo_reading,
    };

    if (images) {
      for (const image of images) {
        const base64Image = await convertImageToBase64(image);
        invoiceBody.images.push({ image: base64Image });
      }
    } else {
      invoiceBody.image = []
    }


    // if (images.length) {
    axios
      .post(`${apiUrl}/create-service-log/`, requestBody)
      .then((response) => {
        setLoading(false);
        setSuccess('Service Log Created');
        setTimeout(() => {
          setSuccess('');
          navigate('/service-history');
        }, 2000);
      })
      .catch((error) => {
        setError(operationsError.serviceHistory);
        // setError('Faild to Create Service Log.');
        setLoading(false);
        console.log("error+++", error);
      });
    // }
  };
  const [uploadFile, setUploadFile] = useState(false);
  const [images, setImages] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [data, setData] = useState([]);
  const [dropdownBikes, setDropdownBikes] = useState([]);
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [showErr, setShowErr] = useState(false);
  const [projection, setProjection] = useState('');
  const [projData, setProjData] = useState([]);
  const [selectedBikeData, setSelectedBikeData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [openPicker, setOpenPicker] = useState(false);
  const taxes = watch('taxes');
  const spareTaxes = watch('spare_taxes');
  const taxesValue = watch('spare_part_charges');
  const spareTaxesValue = watch('labor_charges');
  const costOfService = watch('cost_of_service');
  const discount = watch('discount');


  useEffect(() => {
    getServiceTypes();
    fetchData();
    getBikesTypes();
  }, []);

  const dropdownOptionsBikes = dropdownBikes.map((obj) => {
    return {
      value: obj.id,
      label: obj.registration_no,
    };
  });
  const regNumber = dropdownOptionsBikes?.find((i) => i.value == projection)?.label;
  const regValue = dropdownOptionsBikes?.find((i) => i.value == projection)?.value;

  useEffect(() => {
    if (regValue) {
      getServiceProj()
    }
  }, [regValue]);

  // useEffect(() => {
  //   if (regNumber) {
  //     getServiceProjections();
  //   }
  // }, [regNumber]);

  // useEffect(() => {
  //   const newImageUrls = [];

  //   if (!images.length) return;

  //   images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
  //   setFileData(newImageUrls);
  // }, [images.length]);


  const deleteImage = (id) => {
    const updatedImages = [...images];
    updatedImages.splice(id, 1);
    setImages(updatedImages);

    const updatedFileData = [...fileData];
    updatedFileData.splice(id, 1);
    setFileData(updatedFileData);
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    const newImageUrls = [];

    if (files?.length > 0) {
      for (let i = 0; i < files.length; i++) {
        newImageUrls.push(URL.createObjectURL(files[i]));
      }

      setImages([...images, ...e.target.files]);
      setFileData(prev => [...prev, ...newImageUrls]);
    } else {
      const newImageUrls = [];
      newImageUrls.push(URL.createObjectURL(files));

      setImages([...images, ...e.target.files]);
      setFileData(prev => [...prev, ...newImageUrls]);
    }

    setUploadFile(false)
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

  // const getServiceProjections = () => {
  //   axios
  //     .get(`${apiUrl}/bike-service-projections/${regNumber}/`)
  //     .then((response) => {
  //       setProjData(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const getServiceProj = () => {
    axios
      .get(`${apiUrl}/bike/${regValue}/`)
      .then((response) => {
        setProjData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBikesTypes = () => {
    axios
      .get(`${apiUrl}/bikes/`)
      .then((response) => {
        setDropdownBikes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dropdownOptions = dropdownServiceTypes.map((obj) => {
    return {
      value: obj.id,
      label: obj.name,
    };
  });

  const dropdownOptionsData = data.map((obj) => {
    return {
      value: obj.id,
      label: obj.name,
    };
  });

  const fetchData = () => {
    axios
      .get(`${apiUrl}/partial-vendors/`)
      .then((response) => {
        let data = [];
        response?.data?.map((item) => {
          if (item?.locations?.length) {
            item?.locations?.map((location) => {
              location.name = item?.name;
              data = [...data, location];
            });
          } else {
            data = [...data, item];
          }
        });
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setSelectedBikeData(dropdownBikes.find((item) => item.id === projection));
  }, [projection]);


  const total = useMemo(() => {
    return (+spareTaxesValue + +taxesValue + +spareTaxes + +taxes + +costOfService - +discount)
    // return (+spareTaxesValue + +taxesValue + (+spareTaxesValue * +spareTaxes / 100) + (+taxesValue * +taxes / 100))
  }, [taxes, spareTaxes, taxesValue, spareTaxesValue, costOfService, discount]);

  return (
    <>
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
      <CustomHeader />
      <CustomBreadcrumb />
      <div className="form-container-servicerule">
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              setShowErr(true);
              handleSubmit(onSubmit)(e);
            }}
            style={{ width: '80%' }}
          >
            <Card headerbg="#FED250" sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <ActionHeader text="CREATE VEHICLE SERVICE LOG" />
              <Grid style={{ marginLeft: '8%' }}>
                <h3 className="action-subtitle">VEHICLE DETAILS</h3>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView" id='inputView'>
                    <p className="inputLabel">Vehicle Registration</p>
                    <FormControl sx={{ width: '68%' }} error={errors.registration}>
                      {/* <Select
                        name="registration"
                        className="input-select"
                        {...register('registration')}
                        onBlur={() => {
                          trigger('registration');
                        }}
                        style={{ fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000' }}
                        onChange={(e) => { setProjection(e.target.value); setValue('registration', e.target.value) }}
                      >
                        {dropdownOptionsBikes?.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select> */}
                      <Autocomplete
                        disablePortal
                        name="registration"
                        className="input-select"
                        {...register('registration')}
                        onBlur={() => {
                          trigger('registration');
                        }}
                        style={{ fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000' }}
                        onChange={(e) => { setProjection(e.target.value); setValue('registration', e.target.value) }}
                        options={dropdownOptionsBikes}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      {errors.registration && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.registration.message}</FormHelperText>}
                    </FormControl>
                  </div>
                  <div className="inputView">
                    <p className="inputLabel">Vehicle Brand</p>
                    <p style={{ width: '68%', fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000', marginTop: '15px' }}>{projData?.vehicle_segment || '-'}</p>
                  </div>
                  <div className="inputView">
                    <p className="inputLabel">Vehicle Model</p>
                    <p style={{ width: '68%', fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000', marginTop: '15px' }}>{projData?.vehicle_model || '-'}</p>
                  </div>
                  <div className="inputView" style={{ marginBottom: '0' }}>
                    <p className="inputLabel">Vehicle Make</p>
                    <p style={{ width: '68%', fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000', marginTop: '15px' }}>{projData?.vehicle_make || '-'}</p>
                  </div>
                </Grid>
              </Grid>
              <Grid style={{ marginLeft: '8%' }}>
                <h3 className="action-subtitle">LOCATION DETAILS</h3>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView">
                    <p className="inputLabel">State</p>
                    <p style={{ width: '68%', fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000', marginTop: '15px' }}>{projData?.state || '-'}</p>
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">City</p>
                    <p style={{ width: '68%', fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000', marginTop: '15px' }}>{projData?.city || '-'}</p>
                  </div>
                  <div className="inputView" style={{ marginBottom: '0' }}>
                    <p className="inputLabel">Location</p>
                    <p style={{ width: '68%', fontSize: '14px', fontFamily: 'MulishSemiBold', color: '#000000', marginTop: '15px' }}>{projData?.location || '-'}</p>
                  </div>
                </Grid>
              </Grid>
              <Grid style={{ marginLeft: '8%' }}>
                <h3 className="action-subtitle">SERVICE DETAILS</h3>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView">
                    <p className="inputLabel">Odometer Reading</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="odo_reading"
                      placeholder="Odometer Reading at Time of Service"
                      error={errors?.odo_reading}
                      yupMessage={errors?.odo_reading?.message}
                      InputAdornmentLabel={'KM'}
                    />
                  </div>

                  {/* <div className="inputView">
                    <p className="inputLabel">Service Projection</p>
                    <FormControl sx={{ width: '68%' }} error={errors.service_projection}>
                      <Select name="service_projection" className="input-select" {...register('service_projection')} onBlur={() => trigger('service_projection')} >
                        {dropdownProjectionData?.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.service_projection && (
                        <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.service_projection.message}</FormHelperText>
                      )}
                    </FormControl>
                  </div> */}

                  <div className="inputView">
                    <p className="inputLabel">Service Type</p>
                    <FormControl sx={{ width: '68%' }} error={errors.service_type}>
                      <Select name="service_type" className="input-select" {...register('service_type')} onBlur={() => trigger('service_type')}>
                        {dropdownOptions?.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.service_type && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.service_type.message}</FormHelperText>}
                    </FormControl>
                  </div>

                  <div className="inputView" id='service_date'>
                    <p className="inputLabel">Service Date</p>
                    <LocalizationProvider sx={{ width: '68%', background: '#fff' }} dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        sx={{ width: '68%', background: '#fff', padding: 0 }}
                        components={['DatePicker', 'MobileDatePicker', 'DesktopDatePicker', 'StaticDatePicker']}
                      >
                        <DemoItem>
                          <DatePicker
                            oneTap
                            inputFormat="YYYY/MM/DD"
                            onChange={(value) => {
                              setValue('service_date', dayjs(value).format('YYYY-MM-DD'), { shouldValidate: true });
                            }}
                            onBlur={() => trigger('service_date')}
                            className="no-border-input"
                            slotProps={{
                              textField: {
                                size: 'large',
                                error: errors.service_date,
                              },
                            }}
                          />
                        </DemoItem>
                        {errors.service_date && (
                          <FormHelperText sx={{ color: '#d32f2f', marginTop: '3px !important' }}>{errors.service_date.message}</FormHelperText>
                        )}
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Service Vendor</p>
                    <FormControl sx={{ width: '68%' }} error={errors.service_vendor}>
                      <Select name="service_vendor" className="input-select" {...register('service_vendor')} onBlur={() => trigger('service_vendor')}>
                        {dropdownOptionsData?.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.service_vendor && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.service_vendor.message}</FormHelperText>}
                    </FormControl>
                  </div>

                  <div className="inputView" style={{ alignItems: 'flex-start' }}>
                    <p className="inputLabel">Service Description</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      name="service_description"
                      inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                      multiline
                      placeholder="Enter Service Description"
                      error={errors?.service_description}
                      yupMessage={errors?.service_description?.message}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid style={{ marginLeft: '8%' }}>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView" style={{ margin: '60px 0 16px' }}>
                    <p className="inputLabel">INVOICE DETAILS</p>
                  </div>
                  <Divider className="divider" style={{ my: 2, borderTop: '1px solid #707070', marginLeft: '3rem', marginBottom: '36px', width: 'calc(100% - 3rem)' }} />
                  <div className="inputView">
                    <p className="inputLabel">Cost of Service</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="cost_of_service"
                      placeholder="Enter Total Cost of Service (without tax)"
                      error={errors?.cost_of_service}
                      yupMessage={errors?.cost_of_service?.message}
                      StartInputAdornmentLabel={'₹'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Spare Part Charges</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="spare_part_charges"
                      placeholder="Enter Spare Part Charges (If Applicable)"
                      error={errors?.spare_part_charges}
                      yupMessage={errors?.spare_part_charges?.message}
                      StartInputAdornmentLabel={'₹'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Labor Charges</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="labor_charges"
                      placeholder="Enter Labor Charges (If Applicable)"
                      error={errors?.labor_charges}
                      yupMessage={errors?.labor_charges?.message}
                      StartInputAdornmentLabel={'₹'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Discount</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="discount"
                      placeholder="Enter Discount Value (If Applicable)"
                      error={errors?.discount}
                      yupMessage={errors?.discount?.message}
                      StartInputAdornmentLabel={'₹'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Spare Taxes</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="spare_taxes"
                      placeholder="Enter Spare Tax Value"
                      error={errors?.spare_taxes}
                      yupMessage={errors?.spare_taxes?.message}
                      StartInputAdornmentLabel={'%'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Taxes</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="taxes"
                      placeholder="Enter Tax Value"
                      error={errors?.taxes}
                      yupMessage={errors?.taxes?.message}
                      StartInputAdornmentLabel={'%'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Total</p>
                    <p style={{ width: '68%', fontSize: '16px', fontWeight: 400, marginTop: '15px' }}>
                      ₹<span style={{ marginLeft: '14px' }}>{total || 0}</span>
                    </p>
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Actual Total Cost</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="actual_total_cost"
                      placeholder="Enter Actual Total Service Cost"
                      error={errors?.actual_total_cost}
                      yupMessage={errors?.actual_total_cost?.message}
                      StartInputAdornmentLabel={'₹'}
                    />
                  </div>

                  <div className="inputView" id='service_date'>
                    <p className="inputLabel">Invoice Date</p>
                    <LocalizationProvider sx={{ width: '68%', background: '#fff' }} dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        sx={{ width: '68%', background: '#fff', padding: 0 }}
                        components={['DatePicker', 'MobileDatePicker', 'DesktopDatePicker', 'StaticDatePicker']}
                      >
                        <DemoItem>
                          <DatePicker
                            oneTap
                            onChange={(value) => {
                              setValue('invoice_date', dayjs(value).format('YYYY-MM-DD'), { shouldValidate: true });
                            }}
                            onBlur={() => trigger('invoice_date')}
                            slotProps={{
                              textField: {
                                size: 'large',
                                error: errors.invoice_date,
                                boxShadow: '0 1px 6px #00000029',
                              },
                            }}
                          />
                        </DemoItem>
                        {errors.invoice_date && (
                          <FormHelperText sx={{ color: '#d32f2f', marginTop: '3px !important' }}>{errors.invoice_date.message}</FormHelperText>
                        )}
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Invoice Number</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="invoice_number"
                      placeholder="Enter Invoice Number"
                      error={errors?.invoice_number}
                      yupMessage={errors?.invoice_number?.message}
                    // StartInputAdornmentLabel={'₹'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Billed to</p>
                    {/* <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="billed_to"
                      placeholder="Select Vehicle Owner"
                      error={errors?.billed_to}
                      yupMessage={errors?.billed_to?.message}
                      // StartInputAdornmentLabel={'₹'}
                    /> */}
                    <FormControl sx={{ width: '68%' }} error={errors.billed_to}>
                      <Select name="billed_to" className="input-select" {...register('billed_to')} onBlur={() => trigger('billed_to')}>
                        {dropdownOptionsData?.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.billed_to && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.billed_to.message}</FormHelperText>}
                    </FormControl>
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Invoice or Bill Image/s</p>
                    <Button
                      startIcon={<UploadIcon />}
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: '#2f7e98',
                        color: '#fff',
                        letterSpacing: 0.9,
                        fontSize: '18px',
                        '&:hover': {
                          backgroundColor: '#2f7e98',
                        },
                      }}
                      onClick={() => setUploadFile(!uploadFile)}
                    //   onClick={() => navigate("/service-history/create-service-log")}
                    >
                      Upload
                    </Button>
                  </div>
                  {/* {showErr && !images?.length && status !== 0 &&  <p style={{ marginLeft: '3rem', color: '#d32f2f' }}>Please Upload Invoice Images</p>} */}
                  {uploadFile && (
                    <Paper
                      elevation={3}
                      sx={{
                        padding: '20px',
                        boxShadow: '0px 0px 6px #00000029',
                        margin: '60px 0 30px 48px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: '20px',
                        border: '3px dashed #B7B7B7',
                      }}
                    >
                      <Box mt={2}>
                        <input type="file" style={{ display: 'none' }} id="file-upload" onChange={handleFileChange} multiple />
                        <label htmlFor="file-upload">
                          <Button
                            variant="contained"
                            component="span"
                            sx={{
                              backgroundColor: '#fed250',
                              color: '#000',
                              letterSpacing: 0.9,
                              fontSize: '18px',
                              boxShadow: '0px 0px 6px #00000029',
                              '&:hover': {
                                backgroundColor: '#fed250',
                              },
                            }}
                          >
                            Browse
                          </Button>
                        </label>
                      </Box>

                      <Box mt={2}>
                        <Typography variant="body2" sx={{ fontSize: '16px' }}>
                          OR
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <Typography variant="body2" sx={{ fontSize: '14px', letterSpacing: 0.7, color: '#000', fontWeight: 'bold' }}>
                          Drag and drop Image or PDF files here
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                  {fileData?.length > 0 && (
                    <Box
                      elevation={3}
                      sx={{
                        margin: '50px 48px 0 48px',
                        display: 'flex',
                        flexWrap: 'wrap',
                      }}
                    >
                      {fileData?.map((imageSrc, index) => {
                        return (
                          <Grid key={index} sx={{ position: 'relative' }}>
                            <img src={imageSrc} alt="" width={'138px'} height={'138px'} style={{ marginRight: '40px', borderRadius: '10px' }} />
                            <Grid
                              sx={{
                                width: '55px',
                                height: '55px',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '-25px',
                                right: '15px',
                                background: '#FED250',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                              onClick={() => deleteImage(index)}
                            >
                              <DeleteIcon sx={{ fontSize: '37px' }} />
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Box>
                  )}

                  <Divider className="divider" style={{ margin: '60px 0 50px', borderTop: '1px solid #707070', marginLeft: '3rem', width: 'calc(100% - 3rem)' }} />
                </Grid>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView" style={{ alignItems: 'flex-start' }}>
                    <p className="inputLabel">Remarks</p>
                    <FormInputField
                      sx={{ width: '68%', background: '#fff' }}
                      name="remarks"
                      inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                      multiline
                      placeholder="Enter Service Description"
                      error={errors?.remarks}
                      yupMessage={errors?.remarks?.message}
                    />
                  </div>
                </Grid>
              </Grid>
            </Card>
            <Grid container justifyContent={'space-between'} margin={'60px 0px'}>
              <Button
                size="large"
                sx={{
                  fontSize: '20px',
                  color: '#5c5c5c',
                  letterSpacing: '1px',
                  fontFamily: 'MulishBold',
                }}
                onClick={() => {
                  navigate('/service-history');
                }}
              >
                DISCARD
              </Button>
              <div>
                <Button
                  size="large"
                  type="primary"
                  onClick={() => {
                    setStatus(0)
                    handleSubmit(onSubmit)();
                    setTimeout(() => {
                      clearErrors(
                        ["cost_of_service",
                          "spare_part_charges",
                          // "discount",
                          "taxes",
                          "spare_taxes",
                          "actual_total_cost",
                          "invoice_date",
                          "invoice_number",
                          "billed_to",
                          "remarks"])
                    }, 1000);

                  }}

                  sx={{
                    '&.Mui-disabled': {
                      color: '#5C5C5C', backgroundColor: '#EEEEEE'
                    },
                    marginRight: '40px',
                    textDecoration: 'none',
                    backgroundColor: '#307E98',
                    boxShadow: '0px 0px 4px #00000029',
                    borderRadius: '10px',
                    fontFamily: 'MulishBold',
                    color: '#fff',
                    letterSpacing: '1px',
                    fontSize: '20px',
                    lineHeight: '44px',
                    padding: '8px 28px',
                  }}
                >
                  SAVE DRAFT
                </Button>
                <Button
                  size="large"
                  disabled={!formState.isValid}
                  sx={{
                    '&.Mui-disabled': {
                      color: '#5C5C5C', backgroundColor: '#EEEEEE'
                    },
                    padding: '8px 58px',
                    lineHeight: '44px',
                    backgroundColor: '#FED250',
                    textDecoration: 'none',
                    color: '#222',
                    letterSpacing: '1px',
                    fontSize: '20px',
                    fontFamily: 'MulishBold',
                    boxShadow: '0px 0px 4px #00000029',
                    borderRadius: '10px',
                  }}
                  type="submit"
                >
                  SAVE SERVICE LOG
                </Button>
              </div>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default CreateServiceLog;
