import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, FormControl, FormHelperText, Grid, MenuItem, Select } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import CustomHeader from '../../components/Header';
import ActionHeader from '../components/services/actionHeader';
import './AddServiceVendor.css';
// import { AddServiceVendorFormSchema } from './formSchema/AddServiceVendorFormSchema';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import AddIcon from '@mui/icons-material/Add';
import { Space } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import * as yup from 'yup';
import apiUrl from '../../../../api-config';
import { operationsError } from '../../../../errorConstant.js';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import FormInputField from '../../components/forms/FormInputField';
// ChecklistEditFormSchema.jsx
const AddServiceVendor = () => {
  const navigate = useNavigate();

  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [arrayDataOpn, setArrayDataOpn] = useState([
    {
      opsvendorlocation_0_registered_name: '',
      opsvendorlocation_0_person_of_contact: '',
      opsvendorlocation_0_contact_number: '',
      opsvendorlocation_0_email: '',
      opsvendorlocation_0_alternate_number: '',
      opsvendorlocation_0_registered_address: '',
      opsvendorlocation_0_landmark: '',
      opsvendorlocation_0_geo_location: '',
      opsvendorlocation_0_pincode: '',
      unique_code: '',
      opsvendorlocation_0_city: '',
    }
  ]);
  const [cities, setCities] = useState({})

  const validations = () => {
    const validationSchema = arrayDataOpn?.map((_, index) => {
      return {
        [`opsvendorlocation_${index}_city`]: yup.number().positive('City must be a Valid City').required('City is Required'),
        [`opsvendorlocation_${index}_location`]: yup.string()
          .test('notSelectLocation', 'Location is Required', value => value !== '-- Select Location --')
          .required('Location is Required'),
        // [`opsvendorlocation_${index}_registered_name`]: yup
        //   .string()
        //   .required('Registered name is Required')
        //   .matches(/^[a-zA-Z0-9 _-]+$/, 'Alpha numeric with spaces, dot, hash and dash'),
        [`opsvendorlocation_${index}_person_of_contact`]: yup
          .string()
          .trim()
          .required('Person of Contact is Required')
          .matches(/^[a-zA-Z0-9\s]+$/, 'Enter only Alphanumeric'),
        [`opsvendorlocation_${index}_contact_number`]: yup
          .string()
          .required('Contact Number is Required')
          .matches(/^\d{10}$/, 'Invalid mobile number'),
        [`opsvendorlocation_${index}_email`]: yup.string().required('Email is Required').email('Invalid email'),
        [`opsvendorlocation_${index}_alternate_number`]: yup.string().matches(/^[0-9]{0,10}$/, 'Invalid mobile number'),
        [`opsvendorlocation_${index}_registered_address`]: yup.string().required('Registered Address is Required'),
        [`opsvendorlocation_${index}_landmark`]: yup.string().required('Landmark is Required'),
        [`opsvendorlocation_${index}_geo_location`]: yup
          .string()
          .required('Geo Location is Required')
          // .matches(/^https:\/\/maps\.google\.com\/.*/, 'Please enter a valid Google Maps URL'),
          .matches(/^https:\/\/www\.google\.com\/maps\/*/, 'Please enter a valid Google Maps URL'),
        [`opsvendorlocation_${index}_pincode`]: yup
          .string()
          .required('Pincode is Required')
          .matches(/^\d{6}$/, 'Invalid Pincode'),
        [`unique_code`]: yup.string().notRequired(),
      }
    }) || []

    return validationSchema.reduce((acc, cur) => {
      const obj = { ...acc, ...cur }
      return obj
    }, {})
  }

  const AddServiceVendorFormSchema = yup.object().shape({
    vendor_name: yup
      .string()
      .required('Vender name is Required')
      .matches(/^[a-zA-Z0-9 _-]+$/, 'Alpha numeric with spaces, dot, hash and dash'),
    gst_number: yup.string().required('GST Number is Required').matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number'),
    ...validations()
    // city: yup.number().positive('City must be a Valid City').required('City is Required'),
    // location: yup.string()
    // .test('notSelectLocation', 'Location is Required', value => value !== '-- Select Location --')
    // .required('Location is Required'),
    // registered_name: yup
    //   .string()
    //   .required('Registered name is Required')
    //   .matches(/^[a-zA-Z0-9 _-]+$/, 'Alpha numeric with spaces, dot, hash and dash'),
    // person_of_contact: yup
    //   .string()
    //   .trim()
    //   .required('Person of Contact is Required')
    //   .matches(/^[a-zA-Z0-9\s]+$/, 'Enter only Alphanumeric'),
    // contact_number: yup
    //   .string()
    //   .required('Contact Number is Required')
    //   .matches(/^\d{10}$/, 'Invalid mobile number'),
    // email: yup.string().required('Email is Required').email('Invalid email'),
    // alternate_number: yup.string().matches(/^[0-9]{0,10}$/, 'Invalid mobile number'),
    // registered_address: yup.string().required('Registered Address is Required'),
    // landmark: yup.string().required('Landmark is Required'),
    // geo_location: yup
    //   .string()
    //   .required('Geo Location is Required')
    //   .matches(/^https:\/\/maps\.google\.com\/.*/, 'Please enter a valid Google Maps URL'),
    // pincode: yup
    //   .string()
    //   .required('Pincode is Required')
    //   .matches(/^\d{6}$/, 'Invalid Pincode'),
    // unique_code: yup.string().notRequired(),
  });

  const methods = useForm({
    resolver: yupResolver(AddServiceVendorFormSchema),
    mode: 'all',
  });

  const {
    register,
    handleSubmit,
    setValue,
    // formState,
    trigger,
    watch,
    formState: { errors, isValid },
  } = methods;
  const [changes, setChange] = useState(false);


  // const isValid = useMemo(() => {
  //   const data = getValues();
  //   const keys = Object.values(data);
  //   const key = Object.keys(data);
  //   if (keys.includes('') && key.includes('opsvendorlocation_0_alt_contact_number')) {
  //     return false
  //   }
  //   return true
  // }, [changes, arrayDataOpn])
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState(1);
  const locationVal = watch('location');

  console.log("locationVal", locationVal);

  const getServiceTypes = () => {
    axios
      .get(`${apiUrl}/cities-with-locations/`)
      .then((response) => {
        const data = response.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            locations: [{ id: 0, is_enabled: true, label: "-- Select Location --", value: "-- Select Location --" }, ...item.locations.map((location) => ({ id: location.id, is_enabled: true, label: location.name, value: location.name }))],
          }
        });
        setDropdownServiceTypes([{
          id: 0,
          name: "-- Select City --",
          locations: [
            {
              id: 0, is_enabled: true, label: "-- Select Location --", value: "-- Select Location --"
            }
          ]
        }, ...data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getServiceTypes();
    let vendor_name = localStorage.getItem("vendor_name");
    setValue('vendor_name', vendor_name);
  }, []);

  const onSubmit = async (data, status) => {
    let result = {};
    result.opsvendorlocation_set = [];
    arrayDataOpn.forEach((item, i) => {
      result.opsvendorlocation_set.push({
        poc_name: data?.[`opsvendorlocation_${i}_person_of_contact`],
        poc_number: data?.[`opsvendorlocation_${i}_contact_number`],
        poc_email: data?.[`opsvendorlocation_${i}_email`],
        poc_alternate_number: Number(data?.[`opsvendorlocation_${i}_alternate_number`]),
        address: data?.[`opsvendorlocation_${i}_registered_address`],
        landmark: data?.[`opsvendorlocation_${i}_landmark`],
        pincode: Number(data?.[`opsvendorlocation_${i}_pincode`]),
        status: status === 0 || (status && status?.type !== "submit") ? status : data?.[`opsvendorlocation_${i}_status`] || 1,
        is_enabled: false,
        gst_number: data?.gst_number,
        registered_name: data?.registered_name || null,
        location: {
          name: data?.[`opsvendorlocation_${i}_location`],
          city: data?.[`opsvendorlocation_${i}_city`],
        }
      });
    })
    // result.opsvendorlocation_set.push({
    //   poc_name: data?.person_of_contact,
    //   poc_number: data?.contact_number,
    //   poc_email: data?.email,
    //   poc_alternate_number: Number(data?.alternate_number),
    //   address: data?.registered_address,
    //   landmark: data?.landmark,
    //   pincode: Number(data?.pincode),
    //   is_enabled: false,
    //   location: {
    //     name: data?.location,
    //     city: data?.city,
    //   }
    // });
    result.name = data?.vendor_name,

      result.number = data.unique_code;
    result.is_enabled = true;

    // let result = {};
    // result.opsvendorlocation_set = [];
    // result.number = data.contact_number;
    // result.name = data.vendor_name;
    // result.gst_number = data.gst_number;
    // result.is_enabled = false;
    // data.is_enabled = false;
    await axios
      .post(`${apiUrl}/vendors/create/`, result)
      .then(() => {
        setLoading(false);
        setSuccess('Service Log Created');
        setTimeout(() => {
          setSuccess('');
          navigate('/service-vendors');
        }, 2000);
        // navigate(`/service-rules/view-rule/${response.id}`);
        // navigate(`/service-rules`);
      })
      .catch((error) => {
        setError(operationsError.serviceVendor);
        // setError('Faild to Create Service Log.');
        setLoading(false);
        console.log("error", error);
      });
    // const res = await createServiceVendor({ url: `${apiUrl}/vendors/create/`, body: result });
  };

  const handleDiscard = (i) => {
    setArrayDataOpn((prev) => prev.filter((item, index) => index !== i));
  };

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

      <div style={{ padding: '20px' }}></div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container flexDirection="column" alignItems={'center'}>
            <Card
              bordered={true}
              headerbg="#FED250"
              headStyle={{ backgroundColor: '#FED250' }}
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '90%', paddingBottom: '2rem', marginBottom: '40px' }}
            >
              <ActionHeader text="ADD NEW SERVICE VENDOR" />

              <Grid style={{ marginLeft: '8%' }}>
                <h3 className="action-subtitle" style={{ paddingTop: '60px 0 36' }}> VENDOR DETAILS </h3>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView">
                    <p className="inputLabel">Vendor Name</p>
                    <FormInputField
                      sx={{ width: '70%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="vendor_name"
                      placeholder="Enter Vendor Name"
                      error={errors?.vendor_name}
                      yupMessage={errors?.vendor_name?.message}
                    />
                  </div>
                  {/* <div className="inputView">
                    <p className="inputLabel">Registered Name</p>
                    <FormInputField
                      sx={{ width: '70%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="registered_name"
                      placeholder="Enter Registered Name"
                      error={errors?.registered_name}
                      yupMessage={errors?.registered_name?.message}
                  </div> */}

                </Grid>
              </Grid>
            </Card>

            {
              arrayDataOpn?.length > 0 && arrayDataOpn?.map((item, index) => {
                const opsvendorlocation_set = watch(`opsvendorlocation_0_city`);

                let filteredCities = { ...cities }
                delete filteredCities[index]

                return (
                  <Card
                    key={index}
                    bordered={true}
                    headerbg="#FED250"
                    headStyle={{ backgroundColor: '#FED250' }}
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '90%', paddingBottom: '2rem', marginBottom: '40px' }}
                  >
                    <ActionHeader text={`VENDOR LOCATION ${index + 1}`} style={{ backgroundColor: '#FFE8A4' }} />

                    <Grid style={{ marginLeft: '8%' }}>
                      <h3 className="action-subtitle"> VENDOR CONTACT DETAILS </h3>
                      <Grid
                        style={{
                          width: '85%',
                        }}
                      >
                        <div className="inputView">
                          <p className="inputLabel">Person of Contact</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name={`opsvendorlocation_${index}_person_of_contact`}
                            placeholder="Enter name of person of contact"
                            error={errors?.[`opsvendorlocation_${index}_person_of_contact`]}
                            yupMessage={errors?.[`opsvendorlocation_${index}_person_of_contact`]?.message}

                          />
                        </div>

                        <div className="inputView">
                          <p className="inputLabel">Contact Number</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name={`opsvendorlocation_${index}_contact_number`}
                            placeholder="Enter Contact Number"
                            error={errors[`opsvendorlocation_${index}_contact_number`]}
                            yupMessage={errors[`opsvendorlocation_${index}_contact_number`]?.message}
                            StartInputAdornmentLabel="+91"

                          />
                        </div>

                        <div className="inputView">
                          <p className="inputLabel">Email</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name={`opsvendorlocation_${index}_email`}
                            placeholder="Enter Contact Email"
                            error={errors[`opsvendorlocation_${index}_email`]}
                            yupMessage={errors[`opsvendorlocation_${index}_email`]?.message}

                          />
                        </div>

                        <div className="inputView">
                          <p className="inputLabel">Alternate Number</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name={`opsvendorlocation_${index}_alternate_number`}
                            placeholder="Enter Alternate Number (Optional)"
                            error={errors[`opsvendorlocation_${index}_alternate_number`]}
                            yupMessage={errors[`opsvendorlocation_${index}_alternate_number`]?.message}
                            StartInputAdornmentLabel="+91"

                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid style={{ marginLeft: '8%' }}>
                      <h3 className="action-subtitle" style={{ paddingTop: "30px" }}> VENDOR ADDRESS DETAILS </h3>
                      <Grid
                        style={{
                          width: '85%',
                        }}
                      >
                        <Grid className="inputView" style={{ alignItems: 'flex-start' }}>
                          <p className="inputLabel">Registered Address</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            name={`opsvendorlocation_${index}_registered_address`}
                            inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                            multiline
                            placeholder="Enter Registered Address"
                            error={errors[`opsvendorlocation_${index}_registered_address`]}
                            yupMessage={errors[`opsvendorlocation_${index}_registered_address`]?.message}

                          />
                        </Grid>
                        <div className="inputView">
                          <p className="inputLabel">City</p>
                          <FormControl sx={{ width: '70%' }} error={errors[`opsvendorlocation_${index}_city`]}>
                            <Select
                              // value={type}
                              name={`opsvendorlocation_${index}_city`}
                              {...register(`opsvendorlocation_${index}_city`)}
                              onBlur={() => {
                                trigger(`opsvendorlocation_${index}_city`);
                                setChange(!changes);

                              }}
                              onChange={(e) => {
                                setValue(`opsvendorlocation_${index}_city`, e?.target?.value);
                                setCities({ ...cities, [index]: e?.target?.value })
                                setValue(`opsvendorlocation_${index}_location`, 'location', '-- Select Location --');
                              }}
                              // defaultValue={dropdownServiceTypes[0]?.id || city}
                              className="input-select"
                            >
                              {dropdownServiceTypes?.map((item, i) => {
                                return (
                                  // !Object.values(filteredCities)?.includes(item?.id) ? <MenuItem key={i} disabled={item.id === 0 ? true : false} value={item?.id}>
                                  //   {item?.name}
                                  // </MenuItem>:null
                                  <MenuItem key={i} disabled={item.id === 0 ? true : false} value={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            {errors[`opsvendorlocation_${index}_city`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`opsvendorlocation_${index}_city`].message}</FormHelperText>}
                          </FormControl>
                        </div>
                        <div className="inputView">
                          <p className="inputLabel">Area</p>
                          <FormControl sx={{ width: '70%' }} error={errors[`opsvendorlocation_${index}_location`]}>
                            {/* <Select
                              name={`opsvendorlocation_${index}_location`}
                              disabled={([`opsvendorlocation_${index}_city`]) === 0 ? true : false}
                              {...register(`opsvendorlocation_${index}_location`)}
                              onBlur={() => {
                                trigger(`opsvendorlocation_${index}_location`);
                                setChange(!changes);
                              }}
                              onChange={(e) => {
                                setValue(`opsvendorlocation_${index}_location`, e?.target?.value);
                              }}
                              // value={locationVal || ""}
                              defaultValue={locationVal || ""}
                              className="input-select"
                            >
                              {dropdownServiceTypes
                                ?.find((i) => i?.id === opsvendorlocation_set)
                                ?.locations?.map((item) => {
                                  return (
                                    <MenuItem key={item?.id} disabled={item?.id === 0 ? true : false} value={item?.name}>
                                      {item?.name}
                                    </MenuItem>
                                  );
                                })}
                            </Select> */}
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
                              name={`opsvendorlocation_${index}_location`}
                              {...register(`opsvendorlocation_${index}_location`)}
                              onBlur={() => {
                                trigger(`opsvendorlocation_${index}_location`);
                                setChange(!changes);
                              }}
                              placeholder="Enter Area"
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              onChange={(newValue) => {
                                setValue(`opsvendorlocation_${index}_location`, newValue?.value ? newValue.value : newValue);
                              }}
                              options={dropdownServiceTypes
                                ?.find((i) => i?.id === opsvendorlocation_set)?.locations}
                              defaultValue={locationVal || ""}
                            // value={item[`opsvendorlocation_${index}_location`] || ""}
                            />
                            {errors[`opsvendorlocation_${index}_location`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`opsvendorlocation_${index}_location`].message}</FormHelperText>}
                          </FormControl>
                        </div>

                        <div className="inputView">
                          <p className="inputLabel">Landmark</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name={`opsvendorlocation_${index}_landmark`}
                            placeholder="Enter Landmark"
                            error={errors[`opsvendorlocation_${index}_landmark`]}
                            yupMessage={errors[`opsvendorlocation_${index}_landmark`]?.message}

                          />
                        </div>

                        <div className="inputView">
                          <p className="inputLabel">Geo Location</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name={`opsvendorlocation_${index}_geo_location`}
                            placeholder="Enter Google Maps Location Here"
                            error={errors[`opsvendorlocation_${index}_geo_location`]}
                            yupMessage={errors[`opsvendorlocation_${index}_geo_location`]?.message}

                          />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                          <Card bordered={true} style={{ width: '70%', minHeight: '324px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <div id="map" style={{ height: '100%', width: '100%' }}></div>
                          </Card>
                        </div>

                        <div className="inputView">
                          <p className="inputLabel">Pincode</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name={`opsvendorlocation_${index}_pincode`}
                            placeholder="Pincode is autofilled here"
                            error={errors[`opsvendorlocation_${index}_pincode`]}
                            yupMessage={errors[`opsvendorlocation_${index}_pincode`]?.message}

                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid style={{ marginLeft: '8%' }}>
                      <h3 className="action-subtitle" style={{ paddingTop: '30px' }}> BUSINESS INFORMATION </h3>
                      <Grid
                        style={{
                          width: '85%',
                        }}
                      >
                        <div className="inputView">
                          <p className="inputLabel">Unique ID/Code</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name="unique_code"
                            placeholder="Enter Unique ID/Code"
                            error={errors?.unique_code}
                            yupMessage={errors?.unique_code?.message}

                          />
                        </div>
                        <div className="inputView">
                          <p className="inputLabel">GST Number</p>
                          <FormInputField
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name="gst_number"
                            uppercase={true}
                            placeholder="Enter GST Number "
                            error={errors?.gst_number}
                            yupMessage={errors?.gst_number?.message}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container alignItems={'center'} justifyContent={'space-between'} margin={'60px 0px'} width={'90%'} style={{ margin: '59px auto 39px' }}>
                      <Button
                        size="large"
                        type="text"
                        onClick={() => handleDiscard(index)}
                        sx={{
                          fontSize: '20px',
                          color: '#5c5c5c',
                          letterSpacing: '1px',
                          fontFamily: 'MulishBold',
                        }}
                      >
                        DISCARD
                      </Button>
                      <Grid>
                        <Button
                          onClick={() => {
                            setValue(`opsvendorlocation_${index}_status`, 0)

                          }}
                          // disabled={true}
                          sx={{
                            '&.Mui-disabled': {
                              color: '#5C5C5C', backgroundColor: '#EEEEEE'
                            },
                            marginRight: '40px',
                            textDecoration: 'none',
                            backgroundColor: '#ECE3F1',
                            boxShadow: '0px 0px 4px #00000029',
                            borderRadius: '10px',
                            fontFamily: 'MulishBold',
                            color: '#4B3D76',
                            letterSpacing: '1px',
                            fontSize: '17px',
                            lineHeight: '44px',
                            padding: '3px 25px',
                          }}
                        >
                          SAVE DRAFT
                        </Button>
                        <Button
                          // type="submit"
                          // disabled={true}
                          sx={{
                            '&.Mui-disabled': {
                              color: '#5C5C5C', backgroundColor: '#EEEEEE'
                            },
                            padding: '3px 38px',
                            lineHeight: '44px',
                            backgroundColor: '#FFE8A4',
                            textDecoration: 'none',
                            color: '#222',
                            letterSpacing: '1px',
                            fontSize: '18px',
                            fontFamily: 'MulishBold',
                            boxShadow: '0px 0px 4px #00000029',
                            borderRadius: '10px',
                          }}
                          // className="newButton"
                          onClick={() => setValue(`opsvendorlocation_${index}_status`, 1)}
                        >
                          SAVE DETAILS
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                )
              })
            }

            <Space
              style={{
                display: 'flex',
                justifyContent: 'end',
                width: '90%',
                margin: '5px 0 60px',
              }}
            >
              <Button
                size="large"
                style={{
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60px',
                  color: '#5C5C5C',
                  border: '3px solid #FFDD7C',
                  padding: "18px 98px 18px 80px",
                  borderRadius: '10px',
                  textDecoration: 'none',
                }}
                onClick={() => {
                  setArrayDataOpn(prev => [...prev, {
                    [`opsvendorlocation_${prev?.length}_registered_name`]: '',
                    [`opsvendorlocation_${prev?.length}_person_of_contact`]: '',
                    [`opsvendorlocation_${prev?.length}_contact_number`]: '',
                    [`opsvendorlocation_${prev?.length}_email`]: '',
                    [`opsvendorlocation_${prev?.length}_alternate_number`]: '',
                    [`opsvendorlocation_${prev?.length}_registered_address`]: '',
                    [`opsvendorlocation_${prev?.length}_landmark`]: '',
                    [`opsvendorlocation_${prev?.length}_geo_location`]: '',
                    [`opsvendorlocation_${prev?.length}_pincode`]: '',
                    [`unique_code`]: '',
                    [`opsvendorlocation_${prev?.length}_city`]: '',
                  }]);
                }}
              >
                <AddIcon />
                <span style={{ fontSize: '20px', fontFamily: 'MulishBold', lineHeight: '25px', marginLeft: '30px' }}>ADD A LOCATION</span>
              </Button>
            </Space>


            <Grid container justifyContent={'space-between'} margin={'60px 0px'} width={'90%'}>
              <Button
                size="large"
                type="text"
                onClick={() => navigate('/service-vendors')}
                sx={{
                  fontSize: '20px',
                  color: '#5c5c5c',
                  letterSpacing: '1px',
                  fontFamily: 'MulishBold',
                }}
              >
                DISCARD
              </Button>
              <Grid>
                <Button
                  onClick={handleSubmit((data) => onSubmit(data, 0))}
                  disabled={!isValid}
                  type='submit'
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
                  type="submit"
                  disabled={!isValid}
                  sx={{
                    '&.Mui-disabled': {
                      color: '#5C5C5C', backgroundColor: '#EEEEEE'
                    },
                    padding: '8px 48px',
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
                // className="newButton"
                // onClick={() => onFinish()}
                >
                  SAVE VENDOR DETAILS
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </>
  );
};

export default AddServiceVendor;
