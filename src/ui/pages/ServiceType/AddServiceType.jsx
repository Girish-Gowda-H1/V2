import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../../../../api-config';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomHeader from '../../components/Header';
import FormInputField from '../../components/forms/FormInputField';
import ActionHeader from '../components/services/actionHeader';
import { AddServiceTypeSchema } from './formSchema/AddServiceTypeSchema';
import './serviceType.less';

const AddServiceType = () => {
  const methods = useForm({
    resolver: yupResolver(AddServiceTypeSchema),
    mode: 'all',
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const type = watch('type');
  const description = watch('description');

  const onSubmit = (data) => {
    setLoading(true);
    if (data.type.toLowerCase() !== 'first service') {
      axios
        .post(`${apiUrl}/servicetype/`, {
          name: data.type,
          description: data.description,
          is_enabled: true,
        })
        .then(() => {
          setLoading(false);
          setSuccess('Service type Created');
          setTimeout(() => {
            navigate('/service-types/');
            setSuccess('');
          }, 2000);
        })
        .catch((error) => {
          setError(error.response.data.name[0]);
          setTimeout(() => {
            setError('');
          }, 2000);
          // setError('Faild to create Service Type.');
          setLoading(false);
        });
    } else {
      setTimeout(() => {
        setError('');
      }, 2000);
      setError('This Name is Reserved.');
      setLoading(false);
    }
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

      <div
        style={{
          display: 'flex',
          placeItems: 'center',
          flexDirection: 'column',
        }}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80%' }}>
            <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', paddingBottom: '2rem' }}>
              <ActionHeader text="CREATE VEHICLE SERVICE TYPE" />

              <div style={{ marginLeft: '8%', width: '80%' }}>
                <h3 className="action-subtitle"> SERVICE DETAILS </h3>
                <div className="inputView">
                  <p className="inputLabel">Service Type</p>
                  <FormInputField
                    sx={{ width: '70%', background: '#fff' }}
                    inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                    name="type"
                    placeholder="Enter Service Type"
                    error={errors?.type}
                    yupMessage={errors?.type?.message}
                  // onBlurHndler={() => trigger('type')}
                  />
                </div>
                <div className="inputView" style={{ alignItems: 'flex-start', padding: '20px 0 30px' }}>
                  <p className="inputLabel">Service Description</p>
                  <FormInputField
                    sx={{ width: '70%', background: '#fff' }}
                    name="description"
                    inputStyles={{ height: '150px', alignItems: 'flex-start', paddingTop: '15px', boxShadow: '0 1px 6px #00000029' }}
                    multiline
                    placeholder="Enter Service Description"
                    error={errors?.description}
                    yupMessage={errors?.description?.message}
                  // onBlurHndler={() => trigger('description')}
                  />
                </div>
              </div>
            </Card>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '50px',
                marginBottom: '30px',
              }}
            >
              <Button
                size="large"
                type="text"
                onClick={() => navigate('/service-types')}
                sx={{
                  fontSize: '20px',
                  color: '#5c5c5c',
                  letterSpacing: '1px',
                  fontFamily: 'MulishBold',
                }}
              >
                DISCARD
              </Button>
              <Button
                disabled={type === '' || type === undefined || description === undefined || description === ''}
                type="submit"
                sx={{
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
                  '&.Mui-disabled': {
                    color: '#5C5C5C',
                    backgroundColor: '#EEEEEE',
                  },
                }}
              >
                SAVE SERVICE TYPE
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default AddServiceType;
