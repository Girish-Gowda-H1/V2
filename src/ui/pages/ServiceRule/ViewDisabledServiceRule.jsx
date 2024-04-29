import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import { Button, Card, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiUrl from '../../../../api-config';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomHeader from '../../components/Header';
import './ViewDisabledServiceRule.css';

const ViewDisabledServiceRule = () => {
  const [data, setData] = useState([]);
  const [dropdownServiceTypes, setDropdownServiceTypes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  let { id } = useParams();
  const navigate = useNavigate();

  const fetchData = () => {
    axios
      .get(`${apiUrl}/ops-service-rules/${id}/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const handleEnable = () => {
    setLoading(true);

    axios
      .put(`${apiUrl}/service-rules/${id}/status/`, { status: 1 })
      .then((response) => {
        setLoading(false);
        setSuccess('Status Changed From Disable To Enable');
        setTimeout(() => {
          setSuccess('');
          navigate('/service-rules');
        }, 2000);
      })
      .catch((error) => {
        setError('Faild to Change Status');
        setLoading(false);
        console.log(error);
      });
  };

  const handleClose = () => {
    navigate(`/service-rules`);
  };

  useEffect(() => {
    fetchData();
    getServiceTypes();
  }, []);

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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '80%' }}>
          <Typography variant="h3" className="action-subtitle" sx={{ color: '#222', margin: 0, justifyContent: 'center', fontSize: "22px" }} style={{ fontSize: "22px", paddingBottom: "50px" }}>
            VIEW SERVICE RULE
          </Typography>
          <Card headerbg="#FED250" sx={{ boxShadow: '0px 0px 10px #00000034', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid
                container
                style={{
                  width: '85%',
                  marginTop: 70,
                }}
              >
                <Grid item xs={6}>
                  <div style={{ height: '228px', width: '331px', backgroundColor: '#ccc' }}>
                    <img alt="bike image"></img>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h3" className="action-subtitle" style={{ marginLeft: '0', padding: '0', marginBottom: 50 }}>
                    VEHICLE DETAILS
                  </Typography>
                  <div className="veh-details">
                    <span>
                      <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>Vehicle Make</Typography>
                      <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>{data.bike_segment}</Typography>
                    </span>
                    <span>
                      <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>
                        Vehicle Model
                      </Typography>
                      <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>{data.bike_model_name}</Typography>
                    </span>
                    <span>
                      <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>
                        Vehicle Model Year
                      </Typography>
                      <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>{data.year}</Typography>
                    </span>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="divider-container">
              <Divider className="divider" style={{ width: '86%', margin: '54px auto 0', border: '2px dashed #d4d4d4' }} />
            </div>
            <Grid style={{ marginLeft: '8%' }}>
              <Typography variant="h3" className="action-subtitle">
                SERVICE DETAILS
              </Typography>
              <div className="ser-details" style={{ paddingTop: '35px' }}>
                <span>
                  <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>Service Type</Typography>
                  <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>
                    {dropdownServiceTypes?.find((i) => i?.id === data?.service_type)?.name}
                  </Typography>
                </span>
                <span>
                  <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>
                    Service Description
                  </Typography>
                  <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>{data.description}</Typography>
                </span>
                <span>
                  <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>
                    Service Active After
                  </Typography>
                  <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>{data.days} Days</Typography>
                </span>
                <span>
                  <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>
                    Odometer Interval
                  </Typography>
                  <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>{data.kms} km</Typography>
                </span>
                {data.is_recursive ? (
                  <>
                    <span>
                      <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>
                        Service Repeat Count
                      </Typography>
                      <Typography sx={{ fontFamily: 'MulishSemiBold', color: '#000000', letterSpacing: '0.7' }}>
                        {data.no_of_recursive_services} counts
                      </Typography>
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Grid>
            <Grid style={{ marginLeft: '8%' }}>
              <Typography variant="h3" className="action-subtitle" style={{ paddingTop: '26px' }}>
                SERVICE BUFFER
              </Typography>

              <div className="buf-details" style={{ paddingTop: '23px' }}>
                <span>
                  <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>Buffer Duration</Typography>
                  <div>
                    <Typography sx={{ color: '#7a7a7a', fontFamily: 'MulishSemiBold', paddingRight: '12px' }}>Lower Limit</Typography>
                    <Typography sx={{ paddingLeft: '12px', fontFamily: 'MulishBold', color: '#222222' }}>{data.lower_buffer_days} Days</Typography>
                  </div>
                  <div>
                    <Typography sx={{ color: '#7a7a7a', fontFamily: 'MulishSemiBold', paddingRight: '12px' }}>Upper Limit</Typography>
                    <Typography sx={{ paddingLeft: '12px', fontFamily: 'MulishBold', color: '#222222' }}>{data.upper_buffer_days} Days</Typography>
                  </div>
                </span>
                <span>
                  <Typography sx={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8px', color: '#000' }}>
                    Buffer Odometer Reading
                  </Typography>
                  <div>
                    <Typography sx={{ color: '#7a7a7a', fontFamily: 'MulishSemiBold', paddingRight: '12px' }}>Lower Limit</Typography>
                    <Typography sx={{ paddingLeft: '12px', fontFamily: 'MulishBold', color: '#222222' }}>{data.lower_buffer_odo} km</Typography>
                  </div>
                  <div>
                    <Typography sx={{ color: '#7a7a7a', fontFamily: 'MulishSemiBold', paddingRight: '12px' }}>Upper Limit</Typography>
                    <Typography sx={{ paddingLeft: '12px', fontFamily: 'MulishBold', color: '#222222' }}>{data.upper_buffer_odo} km</Typography>
                  </div>
                </span>
              </div>
            </Grid>
          </Card>

          <Grid container justifyContent={'space-between'} margin={'60px 0px'}>
            <Button
              size="large"
              type="text"
              className="close-button"
              onClick={handleClose}
              style={{ color: '#5c5c5c', fontSize: '20px', letterSpacing: '1px', fontFamily: 'MulishBold' }}
            >
              CLOSE
            </Button>
            <Button
              size="large"
              style={{
                backgroundColor: '#FED250',
                padding: '12px 62px',
                color: '#222',
                textDecoration: 'none',
                fontFamily: 'MulishBold',
                fontSize: '20px',
                letterSpacing: '1px',
                borderRadius: '10px',
              }}
              onClick={handleEnable}
            >
              ENABLE RULE
            </Button>
          </Grid>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default ViewDisabledServiceRule;
