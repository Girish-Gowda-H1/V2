import { useState, useEffect, useMemo } from 'react';
import CustomHeader from '../../components/Header';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Divider, FormControl, FormHelperText, Grid, MenuItem, Paper, Select, Typography } from '@mui/material';
import ActionHeader from '../components/services/actionHeader';
import FormInputField from '../../components/forms/FormInputField';
import './CreateServiceLog.css';
import UploadIcon from '@mui/icons-material/Upload';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import apiUrl from '../../../../api-config';
import dayjs from 'dayjs';
import CustomSnackbar from '@components/common/CustomSnackbar';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import { operationsError } from '../../../../errorConstant';
import * as yup from 'yup';
const EditServiceHistory = ({ bikeData, serviceData }) => {
    const navigate = useNavigate();

    const EditServiceLogSchema = yup.object().shape({
        registration: yup.string().required('Vehicle Registration is required'),
        odo_reading: yup
            .number()
            .required('Odometer Reading is required')
            .positive('Odometer Reading must be a positive number')
            .typeError('Odometer Reading must be a number'),
        service_type: yup.string().required('Service Type is required'),
        service_date: yup.string().required('Service Date is required'),
        service_vendor: yup.string().required('Service Vendor is required'),
        // service_projection: yup.string().required('Service Projection is required'),
        service_description: yup.string().required('Service Description is required'),



        cost_of_service: yup
            .number()
            .notRequired()
            .nullable()
            .positive('Cost of Service must be a positive number'),
        spare_part_charges: yup.string()
            .nullable()
            .test('discount', 'Discount must be a number', value => {
                if (value === null || value?.match(/^\d+$/)) {
                    return true;
                }
                return value >= 0
            }),
        // labor_charges: yup.number().notRequired().positive('Labor Charges must be a positive number').typeError('Labor Charges must be a number'),
        // discount: yup.number().notRequired().nullable().positive('Discount must be a positive number').typeError('Discount must be a number').min(0, 'Discount must be greater than or equal to 0'),
        discount: yup.string()
            .nullable()
            .test('discount', 'Discount must be a number', value => {
                if (value === null || value?.match(/^\d+$/)) {
                    return true;
                }
                return value >= 0
            }),
        taxes: yup.number().required('Taxes are required').positive('Taxes must be a positive number').typeError('Taxes must be a number'),
        spare_taxes: yup.number().required('Spare Taxes are required').positive('Spare Taxes must be a positive number').typeError('Spare Taxes must be a number'),
        actual_total_cost: yup
            .number()
            .required('Actual Total Cost is required')
            .positive('Actual Total Cost must be a positive number')
            .typeError('Actual Total Cost must be a number'),
        invoice_date: yup.string().required('Invoice Date is required'),
        invoice_number: yup.string().required('Invoice Number is required'),
        billed_to: yup.string().required('Billed to is required'),
        remarks: yup.string().required('Remarks are required'),
    });
    const methods = useForm({
        resolver: yupResolver(EditServiceLogSchema),
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
        reset,
        control,
        formState: { errors },
    } = methods;
    console.log("🚀 ~ EditServiceHistory ~ control:", errors)

    const [status, setStatus] = useState(1)

    const [showErr, setShowErr] = useState(false);



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



    const [uploadFile, setUploadFile] = useState(false);
    const [images, setImages] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [data, setData] = useState([]);
    const [dropdownBikes, setDropdownBikes] = useState([]);
    const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
    const [projection, setProjection] = useState('');
    const [projData, setProjData] = useState([]);
    const [selectedBikeData, setSelectedBikeData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [enableServiceHistory, setEnableServiceHistory] = useState(false);
    const [disableInvoiceDetails, setDisableInvoiceDetails] = useState(false);
    const [enableInvoice, setEnableInvoice] = useState(false);
    const [edit, setEdit] = useState(false);

    const taxes = watch('taxes');
    const spareTaxes = watch('spare_taxes');
    const taxesValue = watch('spare_part_charges');
    const spareTaxesValue = watch('labor_charges');
    const billed_to = watch('billed_to');
    const service_type = watch('service_type');
    const service_vendor = watch('service_vendor');


    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("")
            }, 3000);
        }
    }, [error])

    const onSubmit = async (data) => {
        if (!images?.length) {
            setShowErr(true)
        } else {
            if (!showErr) {

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
                    service_type: Number(data.service_type) ? Number(data.service_type) : dropdownOptions?.find(item => item?.label === data?.service_type)?.value,
                    odometer_log: null,
                    vendor_location: Number(data.service_vendor) ? Number(data.service_vendor) : dropdownOptionsData?.find(item => item?.label === data?.service_vendor)?.value,
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

                console.log('requestBody', requestBody, data);

                if (images) {
                    for (const image of images) {
                        console.log("🚀 ~ onSubmit ~ image:", image)
                        const base64Image = !image?.image ? await convertImageToBase64(image) : image?.image;
                        invoiceBody.images.push({ image: base64Image,invoice_id:bikeData?.invoice_id,id:image?.id });
                    }
                } else {
                    invoiceBody.image = []
                }

                console.log("data++++", data);

                // if (images.length) {
                axios
                    .put(`${apiUrl}/service-logs/${bikeData?.id}/update/`, requestBody, { headers: { "Content-Type": "application/json" } })
                    .then((response) => {
                        setLoading(false);
                        setSuccess('Service Log Updated');
                        setTimeout(() => {
                            setSuccess('');
                            navigate('/service-history');
                        }, 2000);
                    })
                    .catch((error) => {
                        setError(error?.response?.data?.invoice_number?.toString() || operationsError.serviceHistory);
                        // setError('Faild to Create Service Log.');
                        setLoading(false);
                        console.log("error+++", error);
                    });
            }

        }
        // }
    };

    useEffect(() => {
        if (bikeData) {
            reset({ ...bikeData, registration: bikeData?.bike, odo_reading: bikeData?.odometer_log, spare_part_charges: bikeData?.spares_amount, actual_total_cost: bikeData?.total_amount, spare_taxes: bikeData?.spares_tax, taxes: bikeData?.tax, labor_charges: bikeData?.labour_amount, cost_of_service: bikeData?.total_amount })
            //   "Pending"
            //   "Rejected"
            //   "Accepted"
            setProjection(bikeData?.bike)
            //   "Drafted"
            setFileData(bikeData?.invoice_images);
            setImages(bikeData?.invoice_images);

            if (bikeData?.status === 1)
                setEdit(true)
            if (bikeData?.status === 1)
                setEnableServiceHistory(true)
            if (serviceData?.invoice_id)
                setDisableInvoiceDetails(true)
            if (!serviceData?.invoice_images) {
                setEnableInvoice(true)
                setEdit(true)

            }
            if (!serviceData?.invoice_id)
                setEdit(true)
        }
    }, [bikeData])

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
    const regNumber = dropdownOptionsBikes?.find((i) => i.value == projection)?.value;

    useEffect(() => {
        if (regNumber) {
            getServiceProj();
        }
    }, [regNumber]);

    useEffect(() => {
        const newImageUrls = [];
        images.forEach((image) => newImageUrls.push(!image?.image ? URL.createObjectURL(image) : image?.image));
        setFileData(newImageUrls);
    }, [images.length]);

    const deleteImage = (id) => {
        const updatedImages = [...images];
        updatedImages.splice(id, 1);
        setImages(updatedImages);
    };

    const handleFileChange = (e) => {
        setShowErr(false)
        setImages([...e.target.files]);
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

    const getServiceProj = () => {
        axios
          .get(`${apiUrl}/bike/${regNumber}/`)
          .then((response) => {
            setProjData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

    // const getServiceProjections = () => {
    //     axios
    //         .get(`${apiUrl}/bike-service-projections/${regNumber}/`)
    //         .then((response) => {
    //             setProjData(response.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

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
    console.log("🚀 ~ dropdownOptionsData ~ dropdownOptionsData:", dropdownOptionsData)

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
        setSelectedBikeData(dropdownBikes.find((item) => item.id === (projection || bikeData?.bike)));
    }, [projection, dropdownBikes]);


    const total = useMemo(() => {
        return (+spareTaxesValue + +taxesValue + (+spareTaxesValue * +spareTaxes / 100) + (+taxesValue * +taxes / 100))
    }, [taxes, spareTaxes, taxesValue, spareTaxesValue]);


    return (
       edit ?  <div className="form-container-servicerule">
            {error !== '' && <CustomSnackbar variant="error" onClose={() => setError("")} message={error} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />}
            {success !== '' && (
                <CustomSnackbar
                    // open={!loading}
                    variant="success"
                    message={success}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    startEdornment={<SuccessSnackbarIcon width={20} />}
                />
            )}
            <FormProvider {...methods}>
                <form
                    onSubmit={(e) => {




                        handleSubmit(onSubmit)(e);


                    }}
                    style={{ width: '100%' }}
                >
                    <Card headerbg="#FED250" sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <ActionHeader text="EDIT VEHICLE SERVICE LOG" />
                        {bikeData?.status == 1 ? <>
                            <Grid style={{ marginLeft: '8%' }}>
                                <h3 className="action-subtitle">VEHICLE DETAILS</h3>
                                <Grid
                                    style={{
                                        width: '85%',
                                    }}
                                >
                                    <div className="inputView">
                                        <p className="inputLabel">Vehicle Registration</p>
                                        <FormControl sx={{ width: '68%' }} error={errors.registration}>
                                            <Select
                                                name="registration"
                                                className="input-select"
                                                {...register('registration')}
                                                // onBlur={() => {
                                                //   trigger('registration');
                                                // }}
                                                value={`${watch("registration")}`}
                                                defaultValue={`${watch("registration")}`}
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
                                            </Select>
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
                        </> : null}
                        {enableServiceHistory || bikeData?.status == 1 ? <Grid style={{ marginLeft: '8%' }}>
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
                                        <Select name="service_type" className="input-select" value={`${dropdownOptions?.find(item => item?.label === service_type)?.value || service_type}`} defaultValue={control?._defaultValues?.service_type} {...register('service_type')} onBlur={() => trigger('service_type')}>
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

                                <div className="inputView">
                                    <p className="inputLabel">Service Date</p>
                                    <LocalizationProvider sx={{ width: '68%', background: '#fff' }} dateAdapter={AdapterDayjs}>
                                        <DemoContainer
                                            sx={{ width: '68%', background: '#fff', padding: 0 }}
                                            components={['DatePicker', 'MobileDatePicker', 'DesktopDatePicker', 'StaticDatePicker']}
                                        >
                                            <DemoItem>
                                                <DatePicker
                                                    onChange={(value) => {
                                                        setValue('service_date', dayjs(value).format('YYYY-MM-DD'), { shouldValidate: true });
                                                    }}
                                                    defaultValue={dayjs(control?._defaultValues?.service_date)}
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
                                        <Select name="service_vendor" className="input-select" {...register('service_vendor')} value={`${dropdownOptionsData?.find(item => item?.label === service_vendor)?.value || service_vendor}`} onBlur={() => trigger('service_vendor')}>
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
                        </Grid> : null}
                        <Grid style={{ marginLeft: '8%' }}>
                            <Grid
                                style={{
                                    width: '85%',
                                }}
                            >
                                {!disableInvoiceDetails || bikeData?.status == 1 ? <>
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

                                    <div className="inputView">
                                        <p className="inputLabel">Invoice Date</p>
                                        <LocalizationProvider sx={{ width: '68%', background: '#fff' }} dateAdapter={AdapterDayjs}>
                                            <DemoContainer
                                                sx={{ width: '68%', background: '#fff', padding: 0 }}
                                                components={['DatePicker', 'MobileDatePicker', 'DesktopDatePicker', 'StaticDatePicker']}
                                            >
                                                <DemoItem>
                                                    <DatePicker
                                                        onChange={(value) => {
                                                            setValue('invoice_date', dayjs(value).format('YYYY-MM-DD'), { shouldValidate: true });
                                                        }}
                                                        defaultValue={dayjs(control?._defaultValues?.invoice_date)}
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
                                            // value={cont  rol?._defaultValues?.invoice_number}
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
                                            <Select name="billed_to" className="input-select" {...register('billed_to')} value={`${dropdownOptionsData?.find(item => (item?.label === billed_to || item?.value === billed_to))?.value || billed_to}`} >
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
                                </> : null}
                                {enableInvoice || bikeData?.status == 1 ? <>
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
                                    {showErr && !images?.length && status !== 0 && <p style={{ marginLeft: '3rem', color: '#d32f2f' }}>Please Upload Invoice Images</p>}
                                    {uploadFile && fileData?.length === 0 && (
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
                                                        <img src={imageSrc?.image || imageSrc} alt="" width={'138px'} height={'138px'} style={{ marginRight: '40px', borderRadius: '10px' }} />
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
                                </> : null}

                                <Divider className="divider" style={{ margin: '60px 0 50px', borderTop: '1px solid #707070', marginLeft: '3rem', width: 'calc(100% - 3rem)' }} />
                            </Grid>
                            {!disableInvoiceDetails || bikeData?.status == 1 ? <Grid
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
                            </Grid> : null}
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
                            {/* <Button
                  size="large"
                  type="primary"
                  onClick={() => {
                    setStatus(0)
                    handleSubmit(onSubmit)();
                    setTimeout(() => {
                      clearErrors(
                       [ "cost_of_service",
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
                </Button> */}
                            <Button
                                size="large"
                                // disabled={!formState.isValid}
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
        </div>:null
    )
}

export default EditServiceHistory