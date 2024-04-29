import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Divider, FormControl, FormControlLabel, FormHelperText, Grid, MenuItem, Select, Switch } from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import apiUrl from '../../../../api-config';
import { operationsError } from '../../../../errorConstant';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomHeader from '../../components/Header';
import FormInputField from '../../components/forms/FormInputField';
import ActionHeader from '../components/services/actionHeader';
import './CreateServiceRule.css';

const CreateServiceRule = () => {
  const navigate = useNavigate();
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [bikeSegments, setBikeSegments] = useState([]);
  const [bikeSegmentModels, setBikeSegmentModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [reqType, setReqType] = useState(1);
  const [configValue, setConfigValue] = useState({
    BUFFER_ODO_LOWER_LIMIT: 0,
    BUFFER_ODO_UPPER_LIMIT: 0,
    BUFFER_DURATION_LOWER_LIMIT: 0,
    BUFFER_DURATION_UPPER_LIMIT: 0
  });

  const location = useLocation();
  let data = location.state?.data;
  const [switchValue, setSwitchValue] = useState(data?.recursiveFlag ? 0 : undefined);

  const getConfigValue = async () => {
    try {
      const response = await axios.get(`${apiUrl}/configs/`);
      response?.data.map((obj) => {
        if (obj.config_key === 'BUFFER_ODO_LOWER_LIMIT') {
          setConfigValue((prev) => {
            return { ...prev, BUFFER_ODO_LOWER_LIMIT: obj.config_value };
          });
        }
        if (obj.config_key === 'BUFFER_ODO_UPPER_LIMIT') {
          setConfigValue((prev) => {
            return { ...prev, BUFFER_ODO_UPPER_LIMIT: obj.config_value };
          });
        }
        if (obj.config_key === 'BUFFER_DURATION_LOWER_LIMIT') {
          setConfigValue((prev) => {
            return { ...prev, BUFFER_DURATION_LOWER_LIMIT: obj.config_value };
          });
        }
        if (obj.config_key === 'BUFFER_DURATION_UPPER_LIMIT') {
          setConfigValue((prev) => {
            return { ...prev, BUFFER_DURATION_UPPER_LIMIT: obj.config_value };
          });
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  let serviceDropdownOptions = dropdownServiceTypes.map((obj) => {
    return {
      value: obj.id,
      label: obj.name,
    };
  });

  let bikeDropdownOptions = useMemo(() => {
    const data = []
    data.push({
      value: 0,
      label: '-- Select Vehicle Make --',
    })
    bikeSegments.map((obj) => {
      data.push({
        value: obj.id,
        label: obj.name,
      });
    })
    return data
  }, [bikeSegments]);

  let bikeModelsDropdownOptions = useMemo(() => {
    const data = []
    data.push({
      value: 0,
      label: '-- Select Vehicle Model --',
    })
    bikeSegmentModels.map((obj) => {
      data.push({
        value: obj.id,
        label: obj.name,
      });
    })
    return data
  }, [bikeSegmentModels])

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

  const getBikeSegments = () => {
    axios
      .get(`${apiUrl}/bike-companies/`)
      .then((response) => {
        setBikeSegments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getBikeSegmentModels = () => {
    axios
      .get(`${apiUrl}/bike-models/${+selectedMake}/`)
      .then((response) => {
        setBikeSegmentModels(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleIncrement = () => {
    const currentValue = getValues('count') || 0;
    setValue('count', Number(currentValue) + 1);
  };

  const handleDecrement = () => {
    const currentValue = getValues('count') || 0;
    if (currentValue > 0) {
      setValue('count', currentValue - 1);
    }
  };

  useEffect(() => {
    getServiceTypes();
    getBikeSegments();
    getConfigValue()
  }, []);

  let yupSchema = yup.object().shape({
    ruleName: yup.string().required('Please provide Rule Name!'),
    make: yup.string().required('Please provide vehicle make!'),
    model: yup.number().required('Please provide vehicle model!'),
    year: yup.number().required('Please provide a year!').typeError('Year must be a number').min(2000, 'Year should be above 2000').max(new Date().getFullYear(), `Year should be below or equal to ${new Date().getFullYear()}`),
    description: yup.string().required('Please input a description!'),
    day: yup.number().required('Please provide number of days!').typeError('Days must be a number').min(0, 'Day must be a positive number'),
    odo: yup.number().required('Please provide kilometers!').typeError('Kilometers must be a number').min(0, 'Odo must be a positive number'),
    durationLowerLimit: yup
      .number()
      .required('Please provide lower limit!')
      .typeError('Lower Limit must be a number')
      .min(0, 'Duration Lower Limit must be a positive number')
      .test('greater-than-equal-to-day', `Duration Lower Limit must be greater than or equal to ${configValue?.BUFFER_DURATION_LOWER_LIMIT} Days`, function (value) {
        return !value || value <= configValue?.BUFFER_DURATION_LOWER_LIMIT;
      }),
    durationUpperLimit: yup
      .number()
      .required('Please provide upper limit!')
      .typeError('Upper Limit must be a number')
      .min(0, 'Duration Upper Limit must be a positive number')
      .test('greater-than-equal-to-day', `Duration Upper Limit must be greater than or equal to ${configValue?.BUFFER_DURATION_UPPER_LIMIT} Days`, function (value) {
        return !value || value <= configValue?.BUFFER_DURATION_UPPER_LIMIT;
      }),
    odoLowerLimit: yup
      .number()
      .required('Please provide lower limit!')
      .typeError('Lower Limit must be a number')
      .min(0, 'Odo Lower Limit must be a positive number')
      .test('greater-than-equal-to-odo', `Odo Lower Limit must be greater than or equal to ${configValue?.BUFFER_ODO_LOWER_LIMIT}`, function (value) {
        return !value || value <= configValue?.BUFFER_ODO_LOWER_LIMIT;
      }),
    odoUpperLimit: yup
      .number()
      .required('Please provide upper limit!')
      .typeError('Upper Limit must be a number')
      .min(0, 'Odo Upper Limit must be a positive number')
      .test('greater-than-equal-to-odo', `Odo Upper Limit must be greater than or equal to ${configValue?.BUFFER_ODO_UPPER_LIMIT}`, function (value) {
        return !value || value <= configValue?.BUFFER_ODO_UPPER_LIMIT;
      }),
  });

  if (data?.recursiveFlag) {
    const additionalSchema = yup.object().shape({
      serviceAfter: yup.string().notRequired(),
      count: yup.number().notRequired(),
    });

    yupSchema = yupSchema.concat(additionalSchema);
  }

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: { make: bikeDropdownOptions && bikeDropdownOptions[0]?.value, model: bikeModelsDropdownOptions && bikeModelsDropdownOptions[0]?.value },
    mode: 'all',
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState,
    watch,
    trigger,
    formState: { errors },
  } = methods;

  const make = watch('make');
  const model = watch('model');

  useEffect(() => {
    if (make) {
      getBikeSegmentModels();
    }
  }, [make]);

  const onSubmit = async (values) => {
    setLoading(true);
    const requestBody = {
      is_recursive: data?.recursiveFlag,
      kms: values.odo,
      days: values.day,
      no_of_recursive_services: values?.count ? values.count : 0,
      bike_model: values.model,
      status: reqType,
      description: values.description,
      year: values.year,
      lower_buffer_odo: values.odoLowerLimit,
      lower_buffer_days: values.durationLowerLimit,
      upper_buffer_odo: values.odoUpperLimit,
      upper_buffer_days: values.durationUpperLimit,
      bike_segment: values.make + "",
      service_projection_reference: switchValue,
      service_type: dropdownServiceTypes.find(type=>type.name==data?.serviceType)?.id,
      service_type_name: dropdownServiceTypes?.find((i) => i.name == data.serviceType).name,
      previous_rule: data?.serviceType?.toLocaleLowerCase() == 'first service' ? null : values?.serviceAfter
    };

    axios
      .post(`${apiUrl}/ops-service-rules/`, requestBody)
      .then((response) => {
        setLoading(false);
        setSuccess('Service Rule Created');
        setTimeout(() => {
          setSuccess('');
          navigate(`/service-rules`);
        }, 2000);
      })
      .catch((error) => {
        // setError('Faild to Create Service Rule.');
        setError(operationsError.serviceRule);
        setLoading(false);
        console.log(error);
      });
  };

  console.log("data?.serviceType", data?.serviceType);
  console.log('Service Type ID ', dropdownServiceTypes.find(type=>type.name==data?.serviceType)?.id);
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
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '90%' }}>
            <Card headerbg="#FED250" sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <ActionHeader text="CREATE VEHICLE SERVICE RULE" />
              <Grid
                style={{
                  width: '78%',
                  marginLeft: '8%',
                  marginTop: "56px"
                }}
              >
                <div className="inputView">
                  <p className="inputLabel">Rule Name</p>
                  <FormInputField
                    sx={{ width: '70%', background: '#fff' }}
                    inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                    name="ruleName"
                    placeholder="Name the service rule"
                    error={errors?.ruleName}
                    yupMessage={errors?.ruleName?.message}
                  />
                </div>
              </Grid>
              <Grid style={{ marginLeft: '8%' }}>
                <h3 className="action-subtitle" style={{ paddingTop: '30px' }}>VEHICLE DETAILS</h3>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView">
                    <p className="inputLabel">Vehicle Make</p>
                    <FormControl sx={{ width: '70%' }} error={errors.make}>
                      <Select
                        name="make"
                        className="input-select"
                        {...register('make')}
                        onChange={(e) => {
                          clearErrors('make')
                          setSelectedMake(e.target.value);
                          setValue('make', e.target.value)
                          setValue('model', 0);
                        }}
                        defaultValue={bikeDropdownOptions[0]?.value || make}
                        value={make}
                        style={{ color: make === 0 ? 'gray' : 'black' }}
                        onBlur={() => trigger('make')}
                      >
                        {bikeDropdownOptions?.map((item, index) => {
                          return (
                            <MenuItem key={index} disabled={index === 0 ? true : false} style={{ color: item?.label === '-- Select Vehicle Make --' ? 'gray' : 'black' }} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.make && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.make.message}</FormHelperText>}
                    </FormControl>
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Vehicle Model</p>
                    <FormControl sx={{ width: '70%' }} error={errors.model}>
                      <Select name="model" disabled={bikeModelsDropdownOptions.length === 0} className="input-select" {...register('model')} value={model} style={{ color: model === 0 ? 'gray' : 'black' }} defaultValue={bikeModelsDropdownOptions[0]?.value} onChange={(e) => setValue('model', e.target.value)} onBlur={() => trigger('model')}>
                        {bikeModelsDropdownOptions?.map((item, index) => {
                          return (
                            <MenuItem disabled={index === 0 ? true : false} style={{ color: item?.label === '-- Select Vehicle Model --' ? 'gray' : 'black' }} key={index} value={index === 0 ? null : item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.model && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.model.message}</FormHelperText>}
                    </FormControl>
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Vehicle Model Year</p>
                    <FormInputField
                      sx={{ width: '70%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="year"
                      placeholder="Enter Vehicle Model Year"
                      error={errors?.year}
                      yupMessage={errors?.year?.message}
                      InputAdornmentLabel={'Year'}

                    />
                  </div>
                </Grid>
              </Grid>
              <Grid style={{ marginLeft: '8%' }}>
                <h3 className="action-subtitle" style={{ paddingTop: '30px' }}>SERVICE DETAILS</h3>
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <div className="inputView" style={{ alignItems: 'flex-start' }}>
                    <p className="inputLabel">Service Description</p>
                    <FormInputField
                      sx={{ width: '70%', background: '#fff' }}
                      name="description"
                      inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                      multiline
                      placeholder="Enter Description"
                      error={errors?.description}
                      yupMessage={errors?.description?.message}

                    />
                  </div>
                  {/* {data?.serviceType?.toLocaleLowerCase() !== 'first service' ? ( */}
                    <>
                      <div className="inputView">
                        <p className="inputLabel">Service Active After</p>
                        <FormControl sx={{ width: '70%' }} error={errors.serviceAfter}>
                          <Select  name="serviceAfter" className="input-select" {...register('serviceAfter')} onBlur={() => trigger('serviceAfter')}>
                            {serviceDropdownOptions?.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item?.value}>
                                  {item?.label}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {errors.serviceAfter && <FormHelperText sx={{ margin: '3px 14px 0 0' }}>{errors.serviceAfter.message}</FormHelperText>}
                        </FormControl>
                      </div>
                    </>
                  {/* ) : (
                    <></>
                  )} */}

                  <div className="inputView">
                    <p className="inputLabel">Service Start Day</p>
                    <FormInputField
                      sx={{ width: '70%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="day"
                      placeholder="Service to be scheduled after"
                      error={errors?.day}
                      yupMessage={errors?.day?.message}
                      InputAdornmentLabel={'Days'}
                    />
                  </div>

                  <div className="inputView">
                    <p className="inputLabel">Odometer Interval</p>
                    <FormInputField
                      sx={{ width: '70%', background: '#fff' }}
                      inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                      name="odo"
                      placeholder="Enter Odo Interval"
                      error={errors?.odo}
                      yupMessage={errors?.odo?.message}
                      InputAdornmentLabel={'KM'}
                    />
                  </div>
                  {data?.recursiveFlag ? (
                    <>
                      <div className="inputView">
                        <p className="inputLabel">Repeat Count</p>
                        <div style={{ width: '70%', display: 'flex', alignItems: 'center' }}>
                          <FormInputField
                            sx={{ width: '82%', background: '#fff' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name="count"
                            placeholder="Enter Repeat Count"
                            error={errors?.count}
                            yupMessage={errors?.count?.message}
                            InputAdornmentLabel={'Counts'}

                          />
                          <Button onClick={handleDecrement} className="input-field" style={{ margin: '0px 10px 0px 10px', minHeight: '40px', minWidth: '40px' }}>
                            <MinusOutlined />
                          </Button>
                          <Button onClick={handleIncrement} className="input-field" style={{ minHeight: '40px', minWidth: '40px' }}>
                            <PlusOutlined />
                          </Button>
                        </div>
                      </div>

                    </>
                  ) : (
                    <></>
                  )}
                  {data?.serviceType?.toLocaleLowerCase() !== 'first service' && <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <div style={{ width: '70%', display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span style={{ lineHeight: '38px' }}>Consider Previous Projected Service</span>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={switchValue === 1}
                            onChange={() => {
                              setSwitchValue((prevValue) => (prevValue === 0 ? 1 : 0));
                            }}
                            style={{
                              color: '#4B3D76',
                              marginRight: '0',
                            }}
                            veriant="soft"
                          />
                        }
                        style={{ margin: '0' }}
                      />
                      <span style={{ lineHeight: '38px' }}>Consider Previous Service Log</span>
                    </div>
                  </div>}
                </Grid>
              </Grid>
              <Grid style={{ marginLeft: '11%', paddingTop: 80, paddingBottom: 76 }}>
                <h3 style={{ fontSize: '18px', color: "#5C5C5C", lineHeight: "23px" }}>DEFINE BUFFERS</h3>
                <Divider className="divider" sx={{ mt: 2, marginBottom: '37px' }} />
                <Grid
                  style={{
                    width: '85%',
                  }}
                >
                  <p className="heading-second" style={{ fontSize: '16px', fontFamily: 'MulishBold', paddingBottom: '6px' }}>Buffer Duration</p>

                  <Grid container columnSpacing={5} >
                    <Grid item xs={6}>
                      <div className="inputView" style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <p className="inputLabel" style={{ margin: '10px', fontSize: '14px' }}>Lower Limit</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name="durationLowerLimit"
                          placeholder="Lower Limit"
                          error={errors?.durationLowerLimit}
                          yupMessage={errors?.durationLowerLimit?.message}
                          InputAdornmentLabel={'Days'}

                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="inputView" style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <p className="inputLabel" style={{ margin: '10px', fontSize: '14px' }}>Upper Limit</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name="durationUpperLimit"
                          placeholder="Upper Limit"
                          error={errors?.durationUpperLimit}
                          yupMessage={errors?.durationUpperLimit?.message}
                          InputAdornmentLabel={'Days'}

                        />
                      </div>
                    </Grid>
                  </Grid>
                  <p className="heading-second" style={{ fontSize: '16px', fontFamily: 'MulishBold', marginTop: '24px' }}>Buffer Odometer Reading</p>

                  <Grid container columnSpacing={5} >
                    <Grid item xs={6}>
                      <div className="inputView" style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <p className="inputLabel" style={{ margin: '10px', fontSize: '14px' }}>Lower Limit</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name="odoLowerLimit"
                          placeholder="Lower Limit"
                          error={errors?.odoLowerLimit}
                          yupMessage={errors?.odoLowerLimit?.message}
                          InputAdornmentLabel={'KM'}

                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="inputView" style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <p className="inputLabel" style={{ margin: '10px', fontSize: '14px' }}>Upper Limit</p>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name="odoUpperLimit"
                          placeholder="Upper Limit"
                          error={errors?.odoUpperLimit}
                          yupMessage={errors?.odoUpperLimit?.message}
                          InputAdornmentLabel={'KM'}

                        />
                      </div>
                    </Grid>
                  </Grid>
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
                  navigate('/service-rules');
                }}
              >
                DISCARD
              </Button>
              <div>
                <Button
                  size="large"
                  type="submit"
                  disabled={!formState.isValid}
                  onClick={() => setReqType(0)}
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
                    cursor: "pointer"
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
                    padding: '8px 47px',
                    lineHeight: '44px',
                    backgroundColor: '#FED250',
                    textDecoration: 'none',
                    color: '#222',
                    letterSpacing: '1px',
                    fontSize: '20px',
                    fontFamily: 'MulishBold',
                    boxShadow: '0px 0px 4px #00000029',
                    borderRadius: '10px',
                    cursor: "pointer"
                  }}
                  onClick={() => setReqType(1)}
                  type="submit"
                >
                  SAVE SERVICE RULE
                </Button>
              </div>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default CreateServiceRule;
