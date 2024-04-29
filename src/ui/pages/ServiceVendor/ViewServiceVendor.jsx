import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomHeader from '../../components/Header';
import { Button, Card, Col, Row, Space } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './ViewServiceVendor.css';
import apiUrl from '../../../../api-config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomSnackbar from '@components/common/CustomSnackbar';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
// import MapContainer from './ViewMap';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import AddIcon from '@mui/icons-material/Add';

const ViewServiceVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const getVendorData = () => {
    axios
      .get(`${apiUrl}/vendors/${id}/`)
      .then((response) => {
        const data = response.data;
        setData(data);
        setUserLocation({ lat: parseFloat(data.lat), lng: parseFloat(data.lng) });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDHiN-srgNPgeP0FipCvWDSecAg_sl18lU',
  });

  useEffect(() => {
    getVendorData();
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
      <div className="vendor-details-container">
        <div className="vendor-details-first-heading">
          <h3
            className="underlined-heading"
            style={{
              marginLeft: '0',
              padding: '0',
              fontSize: '22px',
              fontWeight: '800',
              fontFamily: 'MulishBold',
              borderBottom: '2px solid #FED250',
              lineHeight: '48px',
            }}
          >
           {data?.name}
          </h3>

          <Link to={`/service-vendors/edit-vendor/${id}`}>
            <Button
              size="large"
              style={{
                backgroundColor: '#FED250',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50px',
              }}
            >
              <img
                style={{ width: '25px', marginRight: '20px' }}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAV1JREFUaEPtmNEOwiAMReuf6ZepX6Z+maYxM+oYvaWUdgm8+MLmObuFEg6083HYOT9NgegEZwKdEjgS0ZmI+HcZVyK6SO/PkABDMnxpiBLRAjV4KIlIAQRelNiLAIuciOj+X2eRAsyiSYHhWeJnRAtoJVa8IwWWLbG0NaJJhAl8A25tjYhEiEAJrEWi+Ix3CbU0KY2w62kUKQkkiWo39koAgZeaVG3Rf7ZSDwENvCQhneW6l1ALvEmiZwIW+GaJXgI94FlCPD57HCXC4FnGmkAovFUgHN4ikAK+VSANfItAKnitQDp4jUBKeFQgLTwq8BRPVPIEdYeVX/megTQyq4AbPCJgLR9XeG8Bd3hE4PZ3Y4yW5hB4RKCl/ofBewgMhZcEtAt4OHwvAb50ZfjVzTG6YCzzan1gawEz6OMLOAR8ka4J8AJOBVtKCunEloTdn50C7p9Y+IOZwEzA+AVen0NWMVoIJ6cAAAAASUVORK5CYII="
              />
              <span style={{ fontSize: '20px', fontFamily: 'MulishBold', color: '#222' }}>EDIT VENDOR DETAILS</span>
            </Button>
          </Link>
        </div>

        {/* <Row style={{ width: '90%', marginBottom: '41px' }}>
          <Col span={6}>
            <div className="vendor-details">
              <h3 style={{ fontFamily: 'MulishLight', fontSize: '22px' }}>Vendor Name</h3>
              <h3 style={{ fontFamily: 'MulishLight', fontSize: '22px' }}>GST Number</h3>
            </div>
          </Col>
          <Col span={6}>
            <div className="vendor-details">
              <h3 style={{ fontFamily: 'MulishBold', fontSize: '22px' }}>{data?.name}</h3>
              <h3 style={{ fontFamily: 'MulishBold', fontSize: '22px' }}>{data?.gst_number}</h3>
            </div>
          </Col>
        </Row> */}

        {data?.opsvendorlocation_set?.length > 0 &&
          data?.opsvendorlocation_set?.map((item, i) => {
            return (
              <Card
                bordered={true}
                key={i}
                style={{
                  width: '90%',
                  margin: '20px',
                  borderRadius: '10px',
                  boxShadow: '0px 0px 10px #00000034',
                  backgroundColor: item.status === 2 ? '#EEEEEE' : 'white'
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    backgroundColor: item.status === 2 ? '#FFF' :'#FFE8A4',
                    width: '150px',
                    borderRadius: '10px',
                    margin: '-24px 0px 0 -24px',
                    padding: '15px 26px',
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '18px', fontFamily: 'MulishExtraBold' }}>Location {i + 1}</h4>
                </div>
                <Row style={{ padding: '30px 63px 10px' }}>
                  <Col span={6}>
                    <div className="vendor-details" style={{ fontWeight: '700' }}>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Person of Contact</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Contact Number</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Contact Email</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Alternate Number</p>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="vendor-details">
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{item?.poc_name}</p>
                      <p
                        style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px', textDecoration: 'underline', color: '#307E98' }}
                      >
                        {item?.poc_number}
                      </p>
                      <p
                        style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px', textDecoration: 'underline', color: '#307E98' }}
                      >
                        {item?.poc_email}
                      </p>
                      <p
                        style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px', textDecoration: 'underline', color: '#307E98' }}
                      >
                        {item?.poc_alternate_number}
                      </p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Card
                      bordered={true}
                      id="map"
                      style={{ minHeight: '193px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-50px' }}
                    >
                      {/* <img alt="Google maps"></img> */}
                      {/* Google Maps Display here */}
                      {!isLoaded ? (
                        <h1>Loading....</h1>
                      ) : (
                        data && (
                          <GoogleMap zoom={10} center={userLocation} mapContainerClassName="map-container">
                            <Marker position={userLocation} />
                          </GoogleMap>
                        )
                      )}
                    </Card>
                  </Col>
                </Row>
                <Row style={{ padding: '0px 63px' }}>
                  <Col span={6}>
                    <div className="vendor-details" style={{ fontWeight: '700' }}>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Registered Address</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Area</p>
                    </div>
                  </Col>
                  <Col span={18}>
                    <div className="vendor-details" style={{ paddingRight: '12%' }}>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{item?.address}</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{item?.area}</p>
                    </div>
                  </Col>
                </Row>
                <Row style={{ padding: '0px 63px' }}>
                  <Col span={6}>
                    <div className="vendor-details" style={{ fontWeight: '700' }}>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>City</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Landmark</p>
                    </div>
                  </Col>
                  <Col span={18}>
                    <div className="vendor-details" style={{ paddingRight: '12%' }}>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{item?.city}</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{item?.landmark}</p>
                    </div>
                  </Col>
                </Row>
                <Row align={'middle'} style={{ padding: '10px 63px' }}>
                  <Col span={6}>
                    <div className="vendor-details" style={{ fontWeight: '700' }}>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Pincode</p>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="vendor-details">
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{item?.pincode}</p>
                    </div>
                  </Col>
                </Row>
                <Row align={'middle'} style={{ padding: '10px 63px' }}>
                  <Col span={6}>
                    <div className="vendor-details" style={{ fontWeight: '700' }}>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>GST number</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishBold', lineHeight: '40px' }}>Unique ID/Code</p>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="vendor-details">
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{item?.gst_number}</p>
                      <p style={{ fontSize: '16px', fontFamily: 'MulishSemiBold', lineHeight: '40px' }}>{data?.number}</p>
                    </div>
                  </Col>
                </Row>
                <Row style={{ padding: '42px 63px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Col span={6}>
                    {item?.status === 1 || item?.status === 0 ? (
                      <Button
                        size="20px"
                        type="primary"
                        style={{ backgroundColor: '#2F7E98', fontFamily: 'MulishBold', height: '50px', padding: '0px 48px', fontSize: '20px' }}
                        onClick={() => {
                          setLoading(true);
                          try {
                            axios.patch(`${apiUrl}/opsvendorlocations/${item.id}/status/`, { status: 2 }).then(() => {
                              setLoading(false);
                              setSuccess('Status Changed.');
                              getVendorData()
                              setTimeout(() => {
                                setSuccess('');
                              }, 2000);
                              // fetchData();
                            });
                          } catch (error) {
                            setLoading(false);
                            setError('Faild to Change Status');
                            console.log('Error:', error);
                          }
                        }}
                      >
                       DISABLE LOCATION
                      </Button>
                    ) : (
                      <Button
                        size="20px"
                        type="primary"
                        style={{ backgroundColor: '#4B3D76', fontFamily: 'MulishBold', height: '50px', padding: '0px 48px', fontSize: '20px' }}
                        onClick={() => {
                          setLoading(true);
                          try {
                            axios.patch(`${apiUrl}/opsvendorlocations/${item.id}/status/`, { status: 1 }).then(() => {
                              setLoading(false);
                              setSuccess('Status Changed.');
                              getVendorData()
                              setTimeout(() => {
                                setSuccess('');
                              }, 2000);
                              // fetchData();
                            });
                          } catch (error) {
                            setLoading(false);
                            setError('Faild to Change Status');
                            console.log('Error:', error);
                          }
                        }}
                      >
                        ENABLE LOCATION
                      </Button>
                    )}
                  </Col>
                  <Col span={6}>
                    <Button
                      size="large"
                      style={{
                        backgroundColor: '#ECE3F1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50px',
                        color: '#4B3D76',
                      }}
                      onClick={() => navigate(`/service-vendors/edit-vendor/${id}/${item?.id}`)}
                    >
                      <img
                        style={{ width: '25px', marginRight: '20px' }}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAZhJREFUaEPtmE1OwzAQRj3lWhS16/Y6VOza7lC5TrsmUK4FUyUIFIHj+fE440jpNon7nr+xJzGEif9g4vxhFvBOcE7AIoHt/dMK4XMfAqx+xgMIx/P76UCN757A9mF3QAz7GChHwlUgBc9Nwk2AA8+RmIRAKwK4WJ8/npu/peYm0IJIUggBm8v1ZV2VgFTicj39m/DREmhnuwWObY3cJNwE+oBDWyNHwkUgBqaRGHqmaAlpmpREuNudqFatvc4pCU4SVDcuIsCBp5pUatH3J9VcQAJPSXDSNxXQwOdKmAnkwOdImAhYwHc7CvMbwHQNeMJnb6Pe8FkCNcCrBWqBVwnUBC8WqA1eJFAjPFugVniWQM3wLIHNcoecl6rUPZoOy/1P8lUiV6AkPJlAbvmUhi8qMAY8KbBZPr72T4zZdal4q+SOLTrY0tT/WDP/+w2RMpcKjA2fLCHpAvaANxLABvDuGDs51ta15LnBPjC8gLEBgLfwteiOur3AyTXwXf91wcaSITuxJE6Pe2cBj1k3PVaZBTJnYPJr4AZIyiNAcT0xPwAAAABJRU5ErkJggg=="
                      />
                      <span style={{ fontSize: '20px', fontFamily: 'MulishBold' }}>EDIT LOCATION</span>
                    </Button>
                  </Col>
                </Row>
              </Card>
            );
          })}

        <Space
          style={{
            display: 'flex',
            justifyContent: 'end',
            width: '90%',
            margin: '53px 0 60px',
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
              padding: "18px 98px 18px 80px"
            }}
            onClick={() => navigate(`/service-vendors/edit-vendor/${data?.id}/add${data?.opsvendorlocation_set?.length+1}`)}
          >
            <AddIcon />
            <span style={{ fontSize: '20px', fontFamily: 'MulishBold', lineHeight: '25px', marginLeft: '30px' }}>ADD A LOCATION</span>
          </Button>
        </Space>

        <Space
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '90%',
            margin: '30px 0 50px',
          }}
        >
          <Button
            size="20px"
            type="primary"
            style={{ backgroundColor: '#2F7E98', fontFamily: 'MulishBold', height: '50px', padding: '0px 56px', fontSize: '20px' }}
            onClick={() => {
              setLoading(true);
              try {
                axios.patch(`${apiUrl}/opsvendors/${id}/status/`, { is_enabled: false }).then(() => {
                  setLoading(false);
                  setSuccess('Status Changed.');
                  setTimeout(() => {
                    setSuccess('');
                    navigate('/service-vendors');
                  }, 2000);
                  // fetchData();
                });
              } catch (error) {
                setLoading(false);
                setError('Faild to Change Status');
                console.log('Error:', error);
              }
            }}
          >
            DISABLE VENDOR
          </Button>
          <Button onClick={() => navigate('/service-vendors/')} size="large" type="text" className="close-button">
            <span style={{ textDecoration: 'underline', fontFamily: 'MulishBold', letterSpacing: '1px', fontSize: '20px', color: '#5C5C5C' }}>CLOSE</span>
          </Button>
        </Space>
      </div>
    </>
  );
};

export default ViewServiceVendor;
