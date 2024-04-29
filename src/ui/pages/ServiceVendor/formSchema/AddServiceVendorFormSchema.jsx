import * as yup from 'yup';

export const AddServiceVendorFormSchema = yup.object().shape({
  city: yup.number().positive('City must be a Valid City').required('City is Required'),
  location: yup.string()
  .test('notSelectLocation', 'Location is Required', value => value !== '-- Select Location --')
  .required('Location is Required'),
  vendor_name: yup
    .string()
    .required('Vender name is Required')
    .matches(/^[a-zA-Z0-9 _-]+$/, 'Alpha numeric with spaces, dot, hash and dash'),
  registered_name: yup
    .string()
    .required('Registered name is Required')
    .matches(/^[a-zA-Z0-9 _-]+$/, 'Alpha numeric with spaces, dot, hash and dash'),
  person_of_contact: yup
    .string()
    .trim()
    .required('Person of Contact is Required')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Enter only Alphanumeric'),
  contact_number: yup
    .string()
    .required('Contact Number is Required')
    .matches(/^\d{10}$/, 'Invalid mobile number'),
  email: yup.string().required('Email is Required').email('Invalid email'),
  alternate_number: yup.string().matches(/^[0-9]{0,10}$/, 'Invalid mobile number'),
  registered_address: yup.string().required('Registered Address is Required'),
  landmark: yup.string().required('Landmark is Required'),
  geo_location: yup
    .string()
    .required('Geo Location is Required')
    .matches(/^https:\/\/maps\.google\.com\/.*/, 'Please enter a valid Google Maps URL'),
  pincode: yup
    .string()
    .required('Pincode is Required')
    .matches(/^\d{6}$/, 'Invalid Pincode'),
  gst_number: yup.string().required('GST Number is Required'),
  unique_code: yup.string().notRequired(),
});
