import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import { Button, Card, FormControl, FormHelperText, Grid, MenuItem, Select, Typography } from '@mui/material';
import { Space } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import * as yup from 'yup';
import apiUrl from '../../../../api-config';
import { operationsError } from '../../../../errorConstant';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomHeader from '../../components/Header';
import FormInputField from '../../components/forms/FormInputField';
import ActionHeader from '../components/services/actionHeader';
import './AddServiceVendor.css';


const EditServiceVendor = () => {
  const { id, locid } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [cities, setCities] = useState({})
  const [arrayDataOpn, setArrayDataOpn] = useState([])
  const [isOpenData, setIsOpenData] = useState(false);

  const validations = () => {
    if (!locid || locid?.includes("add")) {
      let venderData = arrayDataOpn
      const validationSchema = venderData?.map((_, index) => {

        if (locid?.includes("add") && ((index + 1) == locid?.replace("add", "")))
          return {
            [`opsvendorlocation_set_${index}_contact_number`]: yup
              .string()
              .required(`Contact Number is Required`)
              .matches(/^\d{10}$/, `Invalid mobile number`),
            [`opsvendorlocation_set_${index}_email`]: yup
              .string()
              .required(`Email is Required`)
              .email(`Invalid email`),
            [`opsvendorlocation_set_${index}_person_of_contact`]: yup
              .string()
              .trim()
              .required(`Person of Contact is Required`)
              .matches(/^[a-zA-Z0-9\s]+$/, `Enter only Alphanumeric`),
            [`opsvendorlocation_set_${index}_alternate_number`]: yup
              .string()
              .notRequired()
              .matches(/^[0-9]{0,10}$/, `Invalid alternate number`),
            [`opsvendorlocation_set_${index}_registered_address`]: yup
              .string()
              .required(`Registered Address is Required`),
            [`opsvendorlocation_set_${index}_landmark`]: yup
              .string()
              .required(`Landmark is Required`),
            [`opsvendorlocation_set_${index}_geo_location`]: yup
              .string()
              .required(`Geo Location is Required`)
              .matches(/^https:\/\/maps\.google\.com\/.*/, `Please enter a valid Google Maps URL`),
            [`opsvendorlocation_set_${index}_pincode`]: yup
              .string()
              .required(`Pincode for is Required`)
              .matches(/^\d{6}$/, `Invalid Pincode`),
            [`unique_code`]: yup.string().notRequired(),
          }

        if (!locid?.includes("add"))
          return {
            [`opsvendorlocation_set_${index}_contact_number`]: yup
              .string()
              .required(`Contact Number is Required`)
              .matches(/^\d{10}$/, `Invalid mobile number`),
            [`opsvendorlocation_set_${index}_email`]: yup
              .string()
              .required(`Email is Required`)
              .email(`Invalid email`),
            [`opsvendorlocation_set_${index}_person_of_contact`]: yup
              .string()
              .trim()
              .required(`Person of Contact is Required`)
              .matches(/^[a-zA-Z0-9\s]+$/, `Enter only Alphanumeric`),
            [`opsvendorlocation_set_${index}_alternate_number`]: yup
              .string()
              .notRequired()
              .matches(/^[0-9]{0,10}$/, `Invalid alternate number`),
            [`opsvendorlocation_set_${index}_registered_address`]: yup
              .string()
              .required(`Registered Address is Required`),
            [`opsvendorlocation_set_${index}_landmark`]: yup
              .string()
              .required(`Landmark is Required`),
            [`opsvendorlocation_set_${index}_geo_location`]: yup
              .string()
              .required(`Geo Location is Required`)
              .matches(/^https:\/\/maps\.google\.com\/.*/, `Please enter a valid Google Maps URL`),
            [`opsvendorlocation_set_${index}_pincode`]: yup
              .string()
              .required(`Pincode for is Required`)
              .matches(/^\d{6}$/, `Invalid Pincode`),
            [`unique_code`]: yup.string().notRequired(),
          }

      }) || []

      return validationSchema.reduce((acc, cur) => {
        const obj = { ...acc, ...cur }
        return obj
      }, {})
    }
    return {
      person_of_contact: yup
        .string()
        .trim()
        .required(`Person of Contact is Required`)
        .matches(/^[a-zA-Z0-9\s]+$/, `Enter only Alphanumeric`),
      contact_number: yup
        .string()
        .required(`Contact Number is Required`)
        .matches(/^\d{10}$/, `Invalid mobile number`),

      email: yup
        .string()
        .required(`Email is Required`)
        .email(`Invalid email`),
      gst_number: yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number').required('GST Number is Required'),

      alternate_number: yup
        .string()
        .matches(/^[0-9]{0,10}$/, `Invalid alternate number`),

      registered_address: yup
        .string()
        .required(`Registered Address is Required`),

      landmark: yup
        .string()
        .required(`Landmark is Required`),

      geo_location: yup
        .string()
        .required(`Geo Location is Required`)
        .matches(/^https:\/\/maps\.google\.com\/.*/, `Please enter a valid Google Maps URL`),

      pincode: yup
        .string()
        .required(`Pincode for is Required`)
        .matches(/^\d{6}$/, `Invalid Pincode`),

      unique_code: yup.string().notRequired()
    }
  }

  const yupSchema = yup.object().shape({
    vendor_name: yup
      .string()
      .required('Vender name is Required')
      .matches(/^[a-zA-Z0-9 _-]+$/, 'Alpha numeric with spaces, dot, hash and dash'),
    // gst_number: yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number').required('GST Number is Required'),
    ...validations()

    // person_of_contact: yup
    //   .string()
    //   .trim()
    //   .required(`Person of Contact is Required`)
    //   .matches(/^[a-zA-Z0-9\s]+$/, `Enter only Alphanumeric`),
    // contact_number: yup
    //   .string()
    //   .required(`Contact Number is Required`)
    //   .matches(/^\d{10}$/, `Invalid mobile number`),

    // email: yup
    //   .string()
    //   .required(`Email is Required`)
    //   .email(`Invalid email`),

    // alternate_number: yup
    //   .string()
    //   .matches(/^[0-9]{0,10}$/, `Invalid alternate number`),

    // registered_address: yup
    //   .string()
    //   .required(`Registered Address is Required`),

    // landmark: yup
    //   .string()
    //   .required(`Landmark is Required`),

    // geo_location: yup
    //   .string()
    //   .required(`Geo Location is Required`)
    //   .matches(/^https:\/\/maps\.google\.com\/.*/, `Please enter a valid Google Maps URL`),

    // pincode: yup
    //   .string()
    //   .required(`Pincode for is Required`)
    //   .matches(/^\d{6}$/, `Invalid Pincode`),

    // unique_code: yup.string().notRequired(),
  })

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    mode: 'all',
  });
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    control,
    getValues,
    formState: { errors, isDirty },
  } = methods;
  // const methods = useForm();
  const locationVal = watch('location');

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'opsvendorlocation_set',
  // });
console.log("methods" , methods)
  const getVendorData = async () => {
    await axios
      .get(`${apiUrl}/vendors/${id}/`)
      .then((response) => {
        let locations = locid?.includes("add") ? [...response?.data?.opsvendorlocation_set || [], {}] : response?.data?.opsvendorlocation_set
        setArrayDataOpn(locations || [])
        let city = {}
        response?.data?.opsvendorlocation_set?.map((item, index) => {
          city = { ...city, [item?.id]: item?.location?.city }
          return ({ label: item.name, value: item.id })
        });
        setCities(city)
        if (locid && !locid?.includes("add")) {
          const data = response.data.opsvendorlocation_set.find(item => +item.id === +locid)
          setDataAll(response.data);
          setData(data);
          setValue('vendor_name', response?.data?.name);
          setValue('gst_number', response?.data?.gst_number);
          setValue(`person_of_contact`, data?.poc_name);
          setValue(`contact_number`, data?.poc_number);
          setValue(`gst_number`, data?.gst_number);
          setValue(`city`, data?.city || data?.location?.city);
          setValue(`location`, data?.location?.name);
          setValue(`email`, data?.poc_email);
          data?.poc_alternate_number && setValue(`alternate_number`, data?.poc_alternate_number);
          setValue(`registered_address`, data?.registered_name);
          setValue(`landmark`, data?.landmark);
          setValue(`geo_location`, `https://maps.google.com/?q=${data?.lat},${data?.lng}`);
          setValue(`pincode`, data?.pincode);
          setValue(`unique_code`, response?.data?.number);
        } else {
          setDataAll(response?.data);
          setData(response?.data);
          setValue('vendor_name', response?.data?.name);
          // setValue('gst_number', response?.data?.gst_number);
          let locations = locid?.includes("add") ? [...response?.data?.opsvendorlocation_set, {}] : response?.data?.opsvendorlocation_set
          locations.forEach((item, index) => {
            const { name, ...rest } = item?.location
            const location = { ...rest, name, label: name, value: name };
            if (locid?.includes("add") && index + 1 == locid?.replace("add", "")) {
              setValue(`opsvendorlocation_set_${index}_city`, item?.city || item?.location?.city);
              setValue(`opsvendorlocation_set_${index}_location`, location);
              setValue(`opsvendorlocation_set_${index}_person_of_contact`, item?.poc_name);
              setValue(`opsvendorlocation_set_${index}_contact_number`, item?.poc_number);
              setValue(`opsvendorlocation_set_${index}_gst_number`, item?.gst_number);
              setValue(`opsvendorlocation_set_${index}_email`, item?.poc_email);
              item?.poc_alternate_number && setValue(`opsvendorlocation_set_${index}_alternate_number`, item?.poc_alternate_number);
              setValue(`opsvendorlocation_set_${index}_registered_address`, item?.registered_name);
              setValue(`opsvendorlocation_set_${index}_landmark`, item?.landmark);
              setValue(`opsvendorlocation_set_${index}_geo_location`, `https://maps.google.com/?q=${item?.lat},${item?.lng}`);
              setValue(`opsvendorlocation_set_${index}_pincode`, item?.pincode);
              setValue(`unique_code`, response?.data?.number);
            }

            if (!locid?.includes("add")) {
              setValue(`opsvendorlocation_set_${index}_city`, item?.city || item?.location?.city);
              setValue(`opsvendorlocation_set_${index}_location`, location);
              setValue(`opsvendorlocation_set_${index}_person_of_contact`, item?.poc_name);
              setValue(`opsvendorlocation_set_${index}_contact_number`, item?.poc_number);
              setValue(`opsvendorlocation_set_${index}_email`, item?.poc_email);
              setValue(`opsvendorlocation_set_${index}_gst_number`, item?.gst_number);
              item?.poc_alternate_number && setValue(`opsvendorlocation_set_${index}_alternate_number`, item?.poc_alternate_number);
              setValue(`opsvendorlocation_set_${index}_registered_address`, item?.registered_name);
              setValue(`opsvendorlocation_set_${index}_landmark`, item?.landmark);
              setValue(`opsvendorlocation_set_${index}_geo_location`, `https://maps.google.com/?q=${item?.lat},${item?.lng}`);
              setValue(`opsvendorlocation_set_${index}_pincode`, item?.pincode);
              setValue(`unique_code`, response?.data?.number);
            }
            // locid?.includes("add") ? 
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getVendorData();
  }, [id]);

  const onSubmit = async (values, status, i) => {
    // const queryString = new URL(data.geo_location).searchParams.get('q');
    //     const [latitude, longitude] = queryString.split(',');
    // let result = {};
    // result.opsvendorlocation_set = [];
    // result.opsvendorlocation_set.push({
    //   lng: longitude,
    //       lat: latitude,
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
    // result.name = data?.vendor_name,
    // result.gst_number = data?.gst_number;
    // result.number = Number(data?.unique_code);
    // result.is_enabled = true;
    // result.registered_name = data?.registered_name;
    let vendorData = arrayDataOpn
    let result = {
      name: values.vendor_name,
      opsvendorlocation_set: (!locid || locid?.includes("add")) ? vendorData?.map((l, index) => {
        const queryString = values[`opsvendorlocation_set_${index}_geo_location`] && new URL(values[`opsvendorlocation_set_${index}_geo_location`])?.searchParams?.get('q');
        let [latitude, longitude] = queryString ? queryString?.split(',') : [0, 0]
        latitude = Number(latitude) || 0;
        longitude = Number(longitude) || 0;
        if (locid?.includes("add") && ((index + 1) == locid?.replace("add", ""))) {
          return {
            lng: longitude,
            lat: latitude,
            poc_name: values[`opsvendorlocation_set_${index}_person_of_contact`],
            poc_number: +values[`opsvendorlocation_set_${index}_contact_number`],
            poc_email: values[`opsvendorlocation_set_${index}_email`],
            poc_alternate_number: +values[`opsvendorlocation_set_${index}_alternate_number`],
            registered_name: values[`opsvendorlocation_set_${index}_registered_address`],
            landmark: values[`opsvendorlocation_set_${index}_landmark`],
            pincode: values[`opsvendorlocation_set_${index}_pincode`],
            status: (i === index ? status : l?.status) ?? (l.status || 1),
            gst_number: values?.[`opsvendorlocation_set_${index}_gst_number`] || l?.gst_number,
            // registered_name: dataAll.registered_name||l?.registered_name,
            location: {
              is_enabled: true,
              name: values[`opsvendorlocation_set_${index}_location`], //static
              city: values[`opsvendorlocation_set_${index}_city`], //static
            },
          };

        } else if (!locid?.includes("add")) {
          return {
            lng: longitude,
            lat: latitude,
            poc_name: values[`opsvendorlocation_set_${index}_person_of_contact`],
            poc_number: +values[`opsvendorlocation_set_${index}_contact_number`],
            poc_email: values[`opsvendorlocation_set_${index}_email`],
            poc_alternate_number: +values[`opsvendorlocation_set_${index}_alternate_number`],
            registered_name: values[`opsvendorlocation_set_${index}_registered_address`],
            landmark: values[`opsvendorlocation_set_${index}_landmark`],
            pincode: values[`opsvendorlocation_set_${index}_pincode`],
            status: (i === index ? status : l?.status) ?? (l.status || 1),
            gst_number: values?.[`opsvendorlocation_set_${index}_gst_number`],
            vendor: l?.vendor,
            id: l?.id,
            // registered_name: dataAll.registered_name||l?.registered_name,
            location: {
              is_enabled: true,
              id: l?.location?.id,
              name: values[`opsvendorlocation_set_${index}_location`]?.name || values[`opsvendorlocation_set_${index}_location`] || l?.location?.name, //static
              city: values[`opsvendorlocation_set_${index}_city`] || l?.location?.city, //static
            },
          };
        } else {

          let location = data?.opsvendorlocation_set?.[index]
          return {
            lng: longitude,
            lat: latitude,
            poc_name: location?.poc_name,
            poc_number: location?.poc_number,
            poc_email: location?.poc_email,
            poc_alternate_number: location?.poc_alternate_number,
            // address: location?.address,
            landmark: location?.landmark,
            gst_number: values.gst_number || l?.gst_number,
            registered_name: dataAll.registered_name || l?.registered_name,
            pincode: location?.pincode,
            vendor: l?.vendor,
            id: l?.id,

            status: i === index ? status : l?.status || location.status,
            location: {
              is_enabled: true,
              id: l?.location?.id,
              name: location?.location?.name, //static
              city: location?.location?.city, //static
            },
          };
          // return data?.
        }
      }) : [{
        poc_name: values.person_of_contact,
        poc_number: +values.contact_number,
        poc_email: values.email,
        poc_alternate_number: +values.alternate_number,
        registered_name: values.registered_address,
        landmark: values.landmark,
        pincode: values.pincode,
        is_enabled: true,
        status: status === 0 || status === 1 ? status : 1,
        gst_number: values.gst_number,
        // registered_name: dataAll.registered_name||l?.registered_name,
        location: {
          is_enabled: true,
          name: data.location.name, //static
          city: data.location.city, //static
        },
      }],

      is_enabled: true,
      number: values.unique_code,
    };
    // const res = await createServiceVendor({ url: `${apiUrl}/vendors/create/`, body: result });
    await axios
      .patch(`${apiUrl}/vendors/${id}/`, result)
      .then(() => {
        setLoading(false);
        setSuccess('Service Vendor Updated');
        setTimeout(() => {
          setSuccess('');
          navigate('/service-vendors');
        }, 2000);
        // navigate(`/service-rules/view-rule/${response.id}`);
        // navigate(`/service-rules`);
      })
      .catch((error) => {
        setError(operationsError.serviceVendorEdit);
        // setError('Faild to Update Service Vendor.');
        setLoading(false);
        console.log(error);
      });
  };

  const getServiceTypes = () => {
    console.log("hiii")
    axios
      .get(`${apiUrl}/cities-with-locations/`)
      .then((response) => {
        const data = response.data.map((item) => {
          return {
            id: item?.id,
            name: item.name,
            locations: [{ id: 0, is_enabled: true, label: "-- Select Location --", value: "-- Select Location --" }, ...item.locations.map((l) => ({ id: l?.id, is_enabled: true, label: l?.name, value: l?.name }))]
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
  }, []);

  console.log("arrayDataOpn?.[id]", data);

  const handleDiscart = (id) => {
    console.log("hi clicked")
    if (id !== "") {
      const { name, ...rest } = arrayDataOpn?.[id]?.location
      console.log("iddd")
      const location = { ...rest, name, label: name, value: name };
      setValue(`opsvendorlocation_set_${id}_city`, arrayDataOpn?.[id]?.city || arrayDataOpn?.[id]?.location?.city);
      setValue(`opsvendorlocation_set_${id}_location`, location);
      setValue(`opsvendorlocation_set_${id}_person_of_contact`, arrayDataOpn?.[id]?.poc_name);
      setValue(`opsvendorlocation_set_${id}_contact_number`, arrayDataOpn?.[id]?.poc_number);
      setValue(`opsvendorlocation_set_${id}_gst_number`, arrayDataOpn?.[id]?.gst_number);
      setValue(`opsvendorlocation_set_${id}_email`, arrayDataOpn?.[id]?.poc_email);
      setValue(`opsvendorlocation_set_${id}_alternate_number`, arrayDataOpn?.[id]?.poc_alternate_number);
      setValue(`opsvendorlocation_set_${id}_registered_address`, arrayDataOpn?.[id]?.registered_name);
      setValue(`opsvendorlocation_set_${id}_landmark`, arrayDataOpn?.[id]?.landmark);
      setValue(`opsvendorlocation_set_${id}_geo_location`, `https://maps.google.com/?q=${arrayDataOpn?.[id]?.lat},${arrayDataOpn?.[id]?.lng}`);
      setValue(`opsvendorlocation_set_${id}_pincode`, arrayDataOpn?.[id]?.pincode);
      setValue(`unique_code`, dataAll?.number);
    } else {
      if (!locid?.includes('add') && id === "") {
        setValue('gst_number', data?.gst_number);
        setValue(`person_of_contact`, data?.poc_name);
        setValue(`contact_number`, data?.poc_number);
        setValue(`gst_number`, data?.gst_number);
        setValue(`city`, data?.city || data?.location?.city);
        setValue(`location`, data?.location?.name);
        setValue(`email`, data?.poc_email);
        data?.poc_alternate_number && setValue(`alternate_number`, data?.poc_alternate_number);
        setValue(`registered_address`, data?.registered_name);
        setValue(`landmark`, data?.landmark);
        setValue(`geo_location`, `https://maps.google.com/?q=${data?.lat},${data?.lng}`);
        setValue(`pincode`, data?.pincode);
        setValue(`unique_code`, dataAll?.number);
      } else {
        setIsOpenData(true);
        setArrayDataOpn([]);
      }
    }
  }

  const add = () => {
    setArrayDataOpn(prev => [...prev, {
      gst_number: '',
      person_of_contact: '',
      contact_number: '',
      email: '',
      alternate_number: '',
      registered_address: '',
      landmark: '',
      geo_location: '',
      pincode: '',
      unique_code: '',
      city: '',
    }]);
    setIsOpenData(false);
  }


  const editCity = watch("city")
  let cityValue = editCity?.toString() || control?._formValues?.city?.toString()

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
        <form onSubmit={(e) => e?.preventDefault()}>
          <Grid container flexDirection="column" alignItems={'center'}>
            <Card
              bordered={true}
              headerbg="#FED250"
              headStyle={{ backgroundColor: '#FED250' }}
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '80%', paddingBottom: '2rem', marginBottom: 40 }}
            // bodyStyle={{paddingRight: "40px"}}
            // className="vendor-card-container"
            >
              <ActionHeader text="SERVICE VENDOR DETAILS" />
              <Grid style={{ marginLeft: '8%' }}>
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
                      placeholder="Enter Vehicle Name"
                      error={errors?.vendor_name}
                      yupMessage={errors?.vendor_name?.message}
                    />
                  </div>
                  {/* <div className="inputView">
                    <p className="inputLabel">GST Number</p>
                    <FormInputField
                      sx={{ width: '70%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="gst_number"
                      placeholder="GST Number"
                      error={errors?.gst_number}
                      yupMessage={errors?.gst_number?.message}
                    />
                  </div> */}
                </Grid>
              </Grid>
            </Card>

            {!locid ? arrayDataOpn?.map((field, index) => {
              let city = watch(`opsvendorlocation_set_${index}_city`)
              let location = watch(`opsvendorlocation_set_${index}_location`)

              let filteredCities = { ...cities }
              delete filteredCities[field?.id]
              return (
                <Card
                  bordered={true}
                  key={field?.id}
                  headerbg="#FED250"
                  headStyle={{ backgroundColor: '#FED250' }}
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '80%', paddingBottom: '2rem', marginBottom: 40 }}
                >
                  <ActionHeader text={`VENDOR LOCATION ${index + 1}`} />
                  <Grid style={{ marginLeft: '8%' }}>
                    <h3 className="action-subtitle">VENDOR CONTACT DETAILS</h3>
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
                          name={`opsvendorlocation_set_${index}_person_of_contact`}
                          placeholder="Enter name of person of contact"
                          error={errors?.[`opsvendorlocation_set_${index}_person_of_contact`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_person_of_contact`]?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Contact Number</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`opsvendorlocation_set_${index}_contact_number`}
                          placeholder="Enter Contact Number"
                          error={errors?.[`opsvendorlocation_set_${index}_contact_number`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_contact_number`]?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Email</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`opsvendorlocation_set_${index}_email`}
                          placeholder="Enter Contact Email"
                          error={errors?.[`opsvendorlocation_set_${index}_email`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_email`]?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Alternate Number</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`opsvendorlocation_set_${index}_alternate_number`}
                          placeholder="Enter Alternate Number (Optional)"
                          error={errors?.[`opsvendorlocation_set_${index}_alternate_number`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_alternate_number`]?.message}
                        />
                      </div>

                      <h3 className="action-subtitle">VENDOR ADDRESS DETAILS</h3>
                      <Grid className="inputView" style={{ alignItems: 'flex-start' }}>
                        <p className="inputLabel">Registered Address</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          name={`opsvendorlocation_set_${index}_registered_address`}
                          inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                          multiline
                          placeholder="Enter Registered Address"
                          error={errors?.[`opsvendorlocation_set_${index}_registered_address`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_registered_address`]?.message}
                        />
                      </Grid>
                      <div className="inputView">
                        <p className="inputLabel">City</p>
                        <FormControl sx={{ width: '70%' }} error={errors[`opsvendorlocation_set_${index}_city`]}>
                          <Select
                            value={`${city}`}
                            name={`opsvendorlocation_set_${index}_city`}
                            {...register(`opsvendorlocation_set_${index}_city`)}
                            onBlur={() => {
                              // trigger(`opsvendorlocation_set_${index}_city`);
                              // setChange(!changes);
                            }}
                            onChange={(e) => {
                              console.log("🚀 ~ {!locid?arrayDataOpn?.map ~ e:", e, e?.target?.value)
                              setValue(`opsvendorlocation_set_${index}_city`, e?.target?.value);
                              // setValue(`opsvendorlocation_set_${index}_location`, 'location', '-- Select Location --');
                            }}
                            defaultValue={`${city}`}
                            className="input-select"
                          >
                            {dropdownServiceTypes?.map((item, i) => {
                              return (
                                <MenuItem key={i} disabled={item.id === 0 ? true : false} value={item?.id}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {errors[`opsvendorlocation_set_${index}_city`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`opsvendorlocation_set_${index}_city`].message}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="inputView" id='inputView'>
                        <p className="inputLabel">Area</p>
                        <FormControl sx={{ width: '70%' }} error={errors[`opsvendorlocation_set_${index}_location`]}>
                          {/* <Select
                            name={`opsvendorlocation_set_${index}_location`}
                            disabled={([`opsvendorlocation_set_${index}_city`]) === 0 ? true : false}
                            {...register(`opsvendorlocation_set_${index}_location`)}
                            onBlur={() => {
                              // trigger(`opsvendorlocation_set_${index}_location`);
                              // setChange(!changes);
                            }}
                            onChange={(e) => {

                              setValue(`opsvendorlocation_set_${index}_location`, e?.target?.value);
                            }}
                            value={`${location?.name || location}` || ""}
                            defaultValue={`${location}` || ""}
                            className="input-select"
                          >

                            {

                              dropdownServiceTypes
                                ?.find((i) => i?.id === city)
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
                            name={`opsvendorlocation_set_${index}_location`}
                            disabled={([`opsvendorlocation_set_${index}_city`]) === 0 ? true : false}
                            {...register(`opsvendorlocation_set_${index}_location`)}
                            onBlur={() => {
                              // trigger(`opsvendorlocation_set_${index}_location`);
                              // setChange(!changes);
                            }}
                            onChange={(newValue) => {
                              setValue(`opsvendorlocation_set_${index}_location`, newValue);
                            }}
                            placeholder="Enter Area"
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            options={dropdownServiceTypes
                              ?.find((i) => i?.id === city)
                              ?.locations}
                            // value={`${location}` || ""}
                            value={{ label: location?.label, value: location?.value }}
                            defaultValue={location || ""}
                          />
                          {errors[`opsvendorlocation_set_${index}_location`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`opsvendorlocation_set_${index}_location`].message}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Landmark</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`opsvendorlocation_set_${index}_landmark`}
                          placeholder="Enter Landmark"
                          error={errors?.[`opsvendorlocation_set_${index}_landmark`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_landmark`]?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Geo Location</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`opsvendorlocation_set_${index}_geo_location`}
                          placeholder="Enter Google Maps Location Here"
                          error={errors?.[`opsvendorlocation_set_${index}_geo_location`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_geo_location`]?.message}
                        />
                      </div>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Card
                          bordered={true}
                          style={{ width: '70%', minHeight: '150px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: 40 }}
                        ></Card>
                      </div>

                      <div className="inputView">
                        <p className="inputLabel">Pincode</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`opsvendorlocation_set_${index}_pincode`}
                          placeholder="Pincode is autofilled here"
                          error={errors?.[`opsvendorlocation_set_${index}_pincode`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_pincode`]?.message}
                        />
                      </div>

                      <h3 className="action-subtitle">BUSINESS INFORMATION</h3>
                      <div className="inputView">
                        <p className="inputLabel">Unique ID/Code</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`unique_code`}
                          placeholder="Enter Unique ID/Code (Optional)"
                          error={errors?.[`unique_code`]}
                          yupMessage={errors?.[`unique_code`]?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">GST Number</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`opsvendorlocation_set_${index}_gst_number`}
                          placeholder="GST Number"
                          error={errors?.[`opsvendorlocation_set_${index}_gst_number`]}
                          yupMessage={errors?.[`opsvendorlocation_set_${index}_gst_number`]?.message}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container alignItems={'center'} justifyContent={'space-between'} margin={'60px 0px'} width={'90%'} style={{ margin: '59px auto 39px' }}>
                    <Button
                      size="large"
                      type="text"
                      onClick={() => handleDiscart(index)}
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
                        onClick={handleSubmit((data) => onSubmit(data, 0, index))}
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
                          backgroundColor: '#C1E5E1',
                          textDecoration: 'none',
                          color: '#222',
                          letterSpacing: '1px',
                          fontSize: '18px',
                          fontFamily: 'MulishBold',
                          boxShadow: '0px 0px 4px #00000029',
                          borderRadius: '10px',
                        }}
                        // className="newButton"
                        onClick={handleSubmit((data) => onSubmit(data, 1, index))}
                      >
                        SAVE CHANGES
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              );
            }) :
              !locid?.includes("add") ?
                <Card
                  bordered={true}
                  headerbg="#FED250"
                  headStyle={{ backgroundColor: '#FED250' }}
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '80%', paddingBottom: '2rem', marginBottom: 40 }}
                >
                  <div className='edit-vendor-action-header'>
                    <ActionHeader text={`VENDOR LOCATION ${locid?.replace("add", "")}`} />
                  </div>
                  <Grid style={{ marginLeft: '8%' }}>
                    <h3 className="action-subtitle">VENDOR CONTACT DETAILS</h3>
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
                          name={`person_of_contact`}
                          placeholder="Enter name of person of contact"
                          error={errors?.person_of_contact}
                          yupMessage={errors?.person_of_contact?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Contact Number</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`contact_number`}
                          placeholder="Enter Contact Number"
                          error={errors?.contact_number}
                          yupMessage={errors?.contact_number?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Email</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`email`}
                          placeholder="Enter Contact Email"
                          error={errors?.email}
                          yupMessage={errors?.email?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Alternate Number</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`alternate_number`}
                          placeholder="Enter Alternate Number (Optional)"
                          error={errors?.alternate_number}
                          yupMessage={errors?.alternate_number?.message}
                        />
                      </div>

                      <h3 className="action-subtitle">VENDOR ADDRESS DETAILS</h3>

                      {/* <Grid className="inputView" style={{ alignItems: 'flex-start' }}>
                        <p className="inputLabel">City</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          name={`city`}
                          inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                          multiline
                          placeholder="Enter City"
                          error={errors?.city}
                          yupMessage={errors?.city?.message}
                        />
                      </Grid> */}
                      <Grid className="inputView" style={{ alignItems: 'flex-start' }}>
                        <p className="inputLabel">Registered Address</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          name={`registered_address`}
                          inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                          multiline
                          placeholder="Enter Registered Address"
                          error={errors?.registered_address}
                          yupMessage={errors?.registered_address?.message}
                        />
                      </Grid>
                      <div className="inputView">
                        <p className="inputLabel">City</p>
                        <FormControl sx={{ width: '70%' }} error={errors[`city`]}>
                          <Select
                            // value={2||editCity||control?._formValues?.city}
                            value={`${cityValue}`}
                            name={`city`}
                            {...register(`city`)}
                            onBlur={() => {
                              // trigger(`city`);
                              // setChange(!changes);
                            }}
                            onChange={(e) => {
                              setValue(`city`, e?.target?.value);
                              setValue(`location`, 'location', '-- Select Location --');
                            }}
                            // defaultValue={"3"||cityValue}
                            className="input-select"
                          >
                            {dropdownServiceTypes?.map((item, i) => {
                              return (
                                <MenuItem key={i} disabled={item.id === 0 ? true : false} value={item?.id}>
                                  {item?.name}
                                </MenuItem>
                                // !Object.values(filteredCities)?.includes(item?.id) ? <MenuItem key={i} disabled={item.id === 0 ? true : false} value={item?.id}>
                                //   {item?.name}
                                // </MenuItem> : null
                              );
                            })}
                          </Select>
                          {errors[`city`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`city`].message}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Area</p>
                        <FormControl sx={{ width: '70%' }} error={errors[`location`]}>
                          {/* <Select
                            name={`location`}
                            disabled={([`city`]) === 0 ? true : false}
                            {...register(`location`)}
                            onBlur={() => {
                              // trigger(`opsvendorlocation_set_${index}_location`);
                              // setChange(!changes);
                            }}
                            onChange={(e) => {

                              setValue(`location`, e?.target?.value);
                            }}
                            value={`${locationVal}` || ""}
                            defaultValue={locationVal || ""}
                            className="input-select"
                          >

                            {

                              dropdownServiceTypes
                                ?.find((i) => i?.id === editCity)
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
                            name={`location`}
                            disabled={([`city`]) === 0 ? true : false}
                            {...register(`location`)}
                            onBlur={() => {
                              // trigger(`opsvendorlocation_set_${index}_location`);
                              // setChange(!changes);
                            }}
                            onChange={(newValue) => {
                              setValue(`location`, newValue.value);
                            }}
                            placeholder="Enter Area"
                            sx={{ width: '70%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            options={dropdownServiceTypes
                              ?.find((i) => i?.id === editCity)
                              ?.locations}
                            value={{ value: locationVal, label: locationVal }}
                          />
                          {errors[`location`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`location`].message}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Landmark</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`landmark`}
                          placeholder="Enter Landmark"
                          error={errors?.landmark}
                          yupMessage={errors?.landmark?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">Geo Location</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`geo_location`}
                          placeholder="Enter Google Maps Location Here"
                          error={errors?.geo_location}
                          yupMessage={errors?.geo_location?.message}
                        />
                      </div>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Card
                          bordered={true}
                          style={{ width: '70%', minHeight: '150px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: 40 }}
                        ></Card>
                      </div>

                      <div className="inputView">
                        <p className="inputLabel">Pincode</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`pincode`}
                          placeholder="Pincode is autofilled here"
                          error={errors?.pincode}
                          yupMessage={errors?.pincode?.message}
                        />
                      </div>

                      <h3 className="action-subtitle">BUSINESS INFORMATION</h3>
                      <div className="inputView">
                        <p className="inputLabel">Unique ID/Code</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`unique_code`}
                          placeholder="Enter Unique ID/Code (Optional)"
                          error={errors?.unique_code}
                          yupMessage={errors?.unique_code?.message}
                        />
                      </div>
                      <div className="inputView">
                        <p className="inputLabel">GST Number</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name={`gst_number`}
                          placeholder="GST Number"
                          error={errors?.[`gst_number`]}
                          yupMessage={errors?.[`gst_number`]?.message}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container alignItems={'center'} justifyContent={'space-between'} margin={'60px 0px'} width={'90%'} style={{ margin: '59px auto 39px' }}>
                    <Button
                      size="large"
                      type="text"
                      onClick={() => { handleDiscart(''); console.log("handleDiscart"); }}
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
                        onClick={handleSubmit((data) => onSubmit(data, 1))}
                      >
                        SAVE DETAILS
                      </Button>
                    </Grid>
                  </Grid>
                </Card> :
                arrayDataOpn?.map((field, index) => {
                  let city = watch(`opsvendorlocation_set_${index}_city`) || ''
                  let filteredCities = { ...cities }
                  delete filteredCities[field?.id]
                  return (
                    (index + 1) == locid?.replace("add", "") ? <Card
                      bordered={true}
                      key={index}
                      headerbg="#FED250"
                      headStyle={{ backgroundColor: '#FED250' }}
                      style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '80%', paddingBottom: '2rem', marginBottom: 40 }}
                    >
                      <ActionHeader text={`VENDOR LOCATION ${index + 1}`} />
                      <Grid style={{ marginLeft: '8%' }}>
                        <h3 className="action-subtitle">VENDOR CONTACT DETAILS</h3>
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
                              name={`opsvendorlocation_set_${index}_person_of_contact`}
                              placeholder="Enter name of person of contact"
                              error={errors?.[`opsvendorlocation_set_${index}_person_of_contact`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_person_of_contact`]?.message}
                            />
                          </div>
                          <div className="inputView">
                            <p className="inputLabel">Contact Number</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`opsvendorlocation_set_${index}_contact_number`}
                              placeholder="Enter Contact Number"
                              error={errors?.[`opsvendorlocation_set_${index}_contact_number`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_contact_number`]?.message}
                            />
                          </div>
                          <div className="inputView">
                            <p className="inputLabel">Email</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`opsvendorlocation_set_${index}_email`}
                              placeholder="Enter Contact Email"
                              error={errors?.[`opsvendorlocation_set_${index}_email`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_email`]?.message}
                            />
                          </div>
                          <div className="inputView">
                            <p className="inputLabel">Alternate Number</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`opsvendorlocation_set_${index}_alternate_number`}
                              placeholder="Enter Alternate Number (Optional)"
                              error={errors?.[`opsvendorlocation_set_${index}_alternate_number`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_alternate_number`]?.message}
                            />
                          </div>

                          <h3 className="action-subtitle">VENDOR ADDRESS DETAILS</h3>
                          <Grid className="inputView" style={{ alignItems: 'flex-start' }}>
                            <p className="inputLabel">Registered Address</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              name={`opsvendorlocation_set_${index}_registered_address`}
                              inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                              multiline
                              placeholder="Enter Registered Address"
                              error={errors?.[`opsvendorlocation_set_${index}_registered_address`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_registered_address`]?.message}
                            />
                          </Grid>
                          <div className="inputView">
                            <p className="inputLabel">City</p>
                            <FormControl sx={{ width: '70%' }} error={errors[`opsvendorlocation_set_${index}_city`]}>
                              <Select
                                // value={type}
                                name={`opsvendorlocation_set_${index}_city`}
                                {...register(`opsvendorlocation_set_${index}_city`)}
                                onBlur={() => {
                                  // trigger(`opsvendorlocation_set_${index}_city`);
                                  // setChange(!changes);
                                }}
                                onChange={(e) => {
                                  setValue(`opsvendorlocation_set_${index}_city`, e?.target?.value);
                                  setValue(`opsvendorlocation_set_${index}_location`, 'location', '-- Select Location --');
                                }}
                                // defaultValue={dropdownServiceTypes[0]?.id || city}
                                className="input-select"
                              >
                                {dropdownServiceTypes?.map((item, i) => {
                                  return (
                                    <MenuItem key={i} disabled={item.id === 0 ? true : false} value={item?.id}>
                                      {item?.name}
                                    </MenuItem>
                                    // !Object.values(filteredCities)?.includes(item?.id) ? <MenuItem key={i} disabled={item.id === 0 ? true : false} value={item?.id}>
                                    //   {item?.name}
                                    // </MenuItem> : null
                                  );
                                })}
                              </Select>
                              {errors[`opsvendorlocation_set_${index}_city`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`opsvendorlocation_set_${index}_city`].message}</FormHelperText>}
                            </FormControl>
                          </div>
                          <div className="inputView">
                            <p className="inputLabel">Area</p>
                            <FormControl sx={{ width: '70%' }} error={errors[`opsvendorlocation_set_${index}_location`]}>
                              {/* <Select
                                name={`opsvendorlocation_set_${index}_location`}
                                disabled={([`opsvendorlocation_set_${index}_city`]) === 0 ? true : false}
                                {...register(`opsvendorlocation_set_${index}_location`)}
                                onBlur={() => {
                                  // trigger(`opsvendorlocation_set_${index}_location`);
                                  // setChange(!changes);
                                }}
                                onChange={(e) => {

                                  setValue(`opsvendorlocation_set_${index}_location`, e?.target?.value);
                                }}
                                // value={locationVal || ""}
                                defaultValue={locationVal || ""}
                                className="input-select"
                              >

                                {

                                  dropdownServiceTypes
                                    ?.find((i) => i?.id === city)
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
                                name={`opsvendorlocation_set_${index}_location`}
                                disabled={([`opsvendorlocation_set_${index}_city`]) === 0 ? true : false}
                                {...register(`opsvendorlocation_set_${index}_location`)}
                                onBlur={() => {
                                  // trigger(`opsvendorlocation_set_${index}_location`);
                                  // setChange(!changes);
                                }}
                                onChange={(newValue) => {
                                  setValue(`opsvendorlocation_set_${index}_location`, newValue);
                                }}
                                // value={locationVal || ""}
                                value={{ label: locationVal, value: locationVal }}
                                defaultValue={locationVal || ""}
                                placeholder="Enter Area"
                                sx={{ width: '70%', background: '#fff' }}
                                inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                                options={dropdownServiceTypes
                                  ?.find((i) => i?.id === city)
                                  ?.locations}
                              />
                              {errors[`opsvendorlocation_set_${index}_location`] && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors[`opsvendorlocation_set_${index}_location`].message}</FormHelperText>}
                            </FormControl>
                          </div>
                          <div className="inputView">
                            <p className="inputLabel">Landmark</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`opsvendorlocation_set_${index}_landmark`}
                              placeholder="Enter Landmark"
                              error={errors?.[`opsvendorlocation_set_${index}_landmark`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_landmark`]?.message}
                            />
                          </div>
                          <div className="inputView">
                            <p className="inputLabel">Geo Location</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`opsvendorlocation_set_${index}_geo_location`}
                              placeholder="Enter Google Maps Location Here"
                              error={errors?.[`opsvendorlocation_set_${index}_geo_location`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_geo_location`]?.message}
                            />
                          </div>
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <Card
                              bordered={true}
                              style={{ width: '70%', minHeight: '150px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: 40 }}
                            ></Card>
                          </div>

                          <div className="inputView">
                            <p className="inputLabel">Pincode</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`opsvendorlocation_set_${index}_pincode`}
                              placeholder="Pincode is autofilled here"
                              error={errors?.[`opsvendorlocation_set_${index}_pincode`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_pincode`]?.message}
                            />
                          </div>

                          <h3 className="action-subtitle">BUSINESS INFORMATION</h3>
                          <div className="inputView">
                            <p className="inputLabel">Unique ID/Code</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`unique_code`}
                              placeholder="Enter Unique ID/Code (Optional)"
                              error={errors?.[`unique_code`]}
                              yupMessage={errors?.[`unique_code`]?.message}
                            />
                          </div>
                          <div className="inputView">
                            <p className="inputLabel">GST Number</p>
                            <FormInputField
                              sx={{ width: '70%', background: '#fff' }}
                              inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                              name={`opsvendorlocation_set_${index}_gst_number`}
                              placeholder="GST Number"
                              error={errors?.[`opsvendorlocation_set_${index}_gst_number`]}
                              yupMessage={errors?.[`opsvendorlocation_set_${index}_gst_number`]?.message}
                            />
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container alignItems={'center'} justifyContent={'space-between'} margin={'60px 0px'} width={'90%'} style={{ margin: '59px auto 39px' }}>
                        <Button
                          size="large"
                          type="text"
                          onClick={() => handleDiscart("")}
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
                            onClick={handleSubmit((data) => onSubmit(data, 0, index))}
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
                              backgroundColor: '#C1E5E1',
                              textDecoration: 'none',
                              color: '#222',
                              letterSpacing: '1px',
                              fontSize: '18px',
                              fontFamily: 'MulishBold',
                              boxShadow: '0px 0px 4px #00000029',
                              borderRadius: '10px',
                            }}
                            // className="newButton"
                            onClick={handleSubmit((data) => onSubmit(data, 1, index))}
                          >
                            SAVE CHANGES
                          </Button>
                        </Grid>
                      </Grid>
                    </Card> : null
                  );
                })
            }
            {!locid || isOpenData ? <Space
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
                  (locid?.includes('add') && id) ? add() :
                    setArrayDataOpn(prev => [...prev, {
                      [`opsvendorlocation_set_${prev?.length}_registered_name`]: '',
                      [`opsvendorlocation_set_${prev?.length}_person_of_contact`]: '',
                      [`opsvendorlocation_set_${prev?.length}_contact_number`]: '',
                      [`opsvendorlocation_set_${prev?.length}_email`]: '',
                      [`opsvendorlocation_set_${prev?.length}_alternate_number`]: '',
                      [`opsvendorlocation_set_${prev?.length}_registered_address`]: '',
                      [`opsvendorlocation_set_${prev?.length}_landmark`]: '',
                      [`opsvendorlocation_set_${prev?.length}_geo_location`]: '',
                      [`opsvendorlocation_set_${prev?.length}_pincode`]: '',
                      [`unique_code`]: '',
                      [`opsvendorlocation_set_${prev?.length}_city`]: '',
                    }]);
                }}
              >
                <AddIcon />
                <span style={{ fontSize: '20px', fontFamily: 'MulishBold', lineHeight: '25px', marginLeft: '30px' }}>ADD A LOCATION</span>
              </Button>
            </Space> : null
            }
            <Grid container justifyContent={'space-between'} margin={'60px 0px'} width={'80%'}>
              <Button
                size="large"
                type="button"
                onClick={() => navigate('/service-vendors')}
                sx={{
                  fontSize: '20px',
                  color: '#5c5c5c',
                  letterSpacing: '1px',
                  fontFamily: 'MulishBold',
                }}
              >
                <Typography variant="h5" letterSpacing="1px">
                  DISCARD CHANGES
                </Typography>
              </Button>
              <div>
                <Button
                  size="large"
                  disabled={!isDirty}
                  onClick={handleSubmit(onSubmit)}
                  sx={{
                    '&.Mui-disabled': {
                      color: '#5C5C5C', backgroundColor: '#EEEEEE'
                    },
                    padding: '8px 28px',
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
                >
                  SAVE CHANGES
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </FormProvider >
    </>
  );
};

export default EditServiceVendor;
