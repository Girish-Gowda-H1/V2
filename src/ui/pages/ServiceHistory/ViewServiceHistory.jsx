import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Box, Button, Card, Divider, FormControl, Grid, Modal, Paper, Switch, TextField, Typography } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import apiUrl from '../../../../api-config';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomHeader from '../../components/Header';
import './CreateServiceLog.css';
// import BikeFallback from '@assets/images/bike-fallback.png';
import BikeFallback from '@assets/svgs/RB-logo.svg';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import CustomSnackbar from '@components/common/CustomSnackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import EditServiceHistory from './EditServiceHistory';

const ViewServiceHistory = () => {
  const { id } = useParams();
  const params = useParams();
  console.log("🚀 ~ ViewServiceHistory ~ params:", params)

  const [data, setData] = useState([]);
  console.log("🚀 ~ ViewServiceHistory ~ data:", data)
  const [bikeData, setBikeData] = useState([]);
  const [serviceLog, setServiceLog] = useState();
  console.log("🚀 ~ ViewServiceHistory ~ serviceLog:", serviceLog)
  const [reason, setReason] = useState('');
  const [inviceId, setInvoiceId] = useState('');
  const [showButton, setShowButton] = useState([]);
  const [modal, setModal] = useState(false);
  const [reimbursement, setReimbursement] = useState(false);
  const [reimbursementAmount, setReimbursementAmount] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [serviceDate, setServiceDate] = useState(null);
  const [serviceAllDate, setServiceAllDate] = useState([]);
  const [uploadFile, setUploadFile] = useState(false);
  const [images, setImages] = useState([]);
  const [fileData, setFileData] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vehicle/${id}/service-details/`);
      setData(response?.data)
      console.log("🚀 ~ getData ~ response:", response)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if(!params?.invoicenumber && window?.location?.pathname?.includes("edit")){
    //   setData([])
    // }else {
    // setData(data?.filter(item=>item?.id == params?.invoicenumber));
    // }
  }, [params?.invoicenumber])


  const fetchData = async () => {
    await axios
      .get(`${apiUrl}/api/vehicle-service-list/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setServiceAllDate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchServiceData = async () => {
    let id = localStorage.getItem("serviceId")
    let url = params?.invoicenumber ? `${apiUrl}/service-invoice/${id}/${params?.invoicenumber}/` : `${apiUrl}/service-invoice/${id}/`
    await axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if ((response?.data?.status == 1) && window?.location?.pathname?.includes("edit")) {
          setShowEdit(true)
        }
        if ((response?.data?.status == 2 || response?.data?.status == 3 || response?.data?.status == 0) && window?.location?.pathname?.includes("edit")) {
          setData([response?.data])
        }
        setServiceLog(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {

    fetchServiceData()
    fetchData();
  }, []);

  const downloadData = useMemo(() => {
    return serviceAllDate?.find((data) => data?.vehicle_registration_number === id);
  }, [serviceAllDate, id]);

  const getBikeData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/bike-details/${id}/`);


      setBikeData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!window?.location?.pathname?.includes("edit")) {
      getData();

    }
    getBikeData();

  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const downloadImage = (image, index) => {
    const blob = dataURLtoBlob(image);
    const extension = getImageExtension(image);
    const filename = `image_${index}.${extension}`;
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
    document.body.removeChild(anchor);
  };

  const getImageExtension = (dataURL) => {
    const matches = dataURL.match(/^data:image\/([a-zA-Z]*);base64,/);
    return matches && matches[1] ? matches[1] : 'png';
  };

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

  const updateStatus = async (id, status, invId, item) => {
    console.log('itemitem', item, invId, inviceId)

    // console.log('id, status, invId', !invId , !inviceId && status === 1 , item.invoice_images?.length === 0 , images.length === 0)
    if (!invId && !inviceId && status === 1 && (item.invoice_images?.length === 0 || !item) && images?.length === 0) {
      setError('Please upload invoice for accept record')
      return
    }
    // console
    // if ((invId || inviceId) && status === 2) {
    //   setError('You can not reject this record.')
    //   setModal(false);
    //   return
    // }

    try {
      let body = {
        id: id,
        status: status === 0 ? status : status + 1,
        invoice: {
          id: invId || inviceId,
          status: status,
          reimbursement_amount: status === 1 ? reimbursementAmount || 0 : 0,
          is_reimbursement: status === 1 ? reimbursement : false,
          image: []
        }
      }

      if (images && item?.invoice_images?.length === 0) {
        for (const image of images) {
          const base64Image = await convertImageToBase64(image);
          body.invoice.image.push({ image: base64Image });
        }
      } else {
        body.invoice.image = []
      }

      if (status === 2) {
        body.invoice.rejection_reason = reason
      }
      console.log("++++++++++++", body);
      const response = await axios.put(`${apiUrl}/vehicle-service/${id}/status/`, body);
      if (response.status === 200) {
        getData();
        setModal(false);
        setReason();
        if (status === 2) {
          setSuccess('Service is Rejected');
        } else {
          setSuccess('Service is Accepted');
        }
        setTimeout(() => {
          navigate(`/service-history`)
        }, 1000)


      }
    } catch (error) {
      console.error(error);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const array = new Uint8Array(new ArrayBuffer(raw.length));

    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }

    return new Blob([array], { type: contentType });
  };

  const exportData = () => {
    const cdata = data;
    // data.push(downloadData);
    const worksheet = XLSX.utils.json_to_sheet(cdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'ServiceHistoryData.xlsx');
  };
  const exportSingleData = (service) => {
    const data = [];
    data.push(service);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'ServiceHistoryData.xlsx');
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: '#FAFAFA',
    border: '3px dashed #B7B7B7',
    borderRadius: '20px',
    boxShadow: '0px 0px 6px #00000029',
    p: 4,
  };

  useEffect(() => {
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setFileData(newImageUrls);
  }, [images.length]);

  const deleteImage = (id) => {
    const updatedImages = [...images];
    updatedImages.splice(id, 1);
    setImages(updatedImages);
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };


  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("")
      }, 3000);
    }
  }, [error])

  console.log("+++++", data);


  return (
    <>
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

      <CustomHeader />
      <CustomBreadcrumb />
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        {/* {
          !!downloadData && (
            <div style={{ position: 'fixed', bottom: '20px', right: '80px', zIndex: '99' }}>
              <button
                style={{
                  background: '#FED250 0% 0% no-repeat padding-box',
                  boxShadow: '0px 0px 6px #00000029',
                  border: '1px solid #E0E0E0',
                  borderRadius: '10px',
                  opacity: 1,
                  padding: '18px 46px',
                }}
                onClick={() => exportData()}
              >
                <span
                  style={{
                    textAlign: 'left',
                    fontSize: '16px',
                    letterSpacing: '0.9px',
                    color: '#000000',
                    fontFamily: 'MulishBold',
                    fontWeight: 'semibold',
                  }}
                >
                  EXPORT DATA
                </span>
              </button>
            </div>
          )
        } */}
        {showButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              background: '#FED250',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 55,
            }}
          >
            <UpgradeIcon />
          </button>
        )}
        <div style={{ width: '90%' }}>
          <h3 className="action-subtitle" style={{ justifyContent: 'center', fontSize: '22px' }}>
            SERVICE HISTORY OF {id}
          </h3>
          <Card headerbg="#FED250" sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid
                container
                style={{
                  width: '90%',
                  margin: '70px 0 70px 0',
                }}
              >
                <Grid item md={window?.location?.pathname?.includes("edit") ? 5 : 4} sm={window?.location?.pathname?.includes("edit") ? 5 : 6} xs={12}>
                  <img src={bikeData?.bike_image_url} alt="bike image" onError={(e) => {
                    event.target.src = BikeFallback
                    event.onerror = null
                  }} style={{ maxWidth: '100%', maxHeight: "320px" }}></img>
                </Grid>
                {window?.location?.pathname?.includes("edit") ? <Grid item sm={1} md={1}>

                </Grid> : null}
                <Grid item xs={12} md={window?.location?.pathname?.includes("edit") ? 6 : 5} sm={window?.location?.pathname?.includes("edit") ? 6 : 6} style={{ paddingLeft: '50px' }}>
                  <div className="veh-details" style={{ borderRight: window?.location?.pathname?.includes("edit") ? 'none' : '1px solid #707070' }}>
                    <span>
                      <p style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', letterSpacing: '0.8' }}>Vehicle Brand</p>
                      <p style={{ fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{bikeData?.vehicle_segment}</p>
                    </span>
                    <span>
                      <p style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', letterSpacing: '0.8' }}>Vehicle Model</p>
                      <p style={{ fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{bikeData?.vehicle_model}</p>
                    </span>
                    <span>
                      <p style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', letterSpacing: '0.8' }}>Vehicle Make</p>
                      <p style={{ fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{bikeData?.vehicle_make}</p>
                    </span>
                    <span>
                      <p style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', letterSpacing: '0.8' }}>State</p>
                      <p style={{ fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{bikeData?.state}</p>
                    </span>
                    <span>
                      <p style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', letterSpacing: '0.8' }}>City</p>
                      <p style={{ fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{bikeData?.city}</p>
                    </span>
                    <span style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', letterSpacing: '0.8' }}>
                      <p>Location</p>
                      <p style={{ fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{bikeData?.location}</p>
                    </span>
                  </div>
                </Grid>
                {!window?.location?.pathname?.includes("edit") ? <Grid item xs={12} md={3} sm={12}>
                  <div style={{ marginLeft: '25px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', letterSpacing: '0.8' }}>Recorded Services</span>
                    <span style={{ fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{data?.length}</span>
                  </div>
                  <div
                    style={{
                      marginTop: '21px',
                      marginLeft: '25px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      maxHeight: '280px',
                      gap: '6px',
                      overflow: 'auto',
                    }}
                  >
                    {data?.map((item, i) => {
                      return (
                        <a
                          href={`#${item.id}`}
                          key={i}
                          style={{
                            fontFamily: 'MulishSemiBold',
                            fontSize: '16px',
                            letterSpacing: '0.8',
                            border: '1px solid',
                            borderRadius: '5px',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor:
                              item.service_history_status === 'UNPLANNED' ? '#FFE8A4' : item.service_history_status === 'ON TIME' ? '#E6F9DA' : '#FFCCCC',
                            color: item.service_history_status === 'UNPLANNED' ? '#E39804' : item.service_history_status === 'ON TIME' ? '#2D9B00' : '#EF4723',
                            borderColor: item.service_history_status === 'UNPLANNED' ? '#FED24F' : item.service_history_status === 'ON TIME' ? '#5DC701' : '#EF4623',
                          }}
                        >
                          {i + 1}
                        </a>
                      );
                    })}
                  </div>
                </Grid> : null}
              </Grid>
            </div>
          </Card>

          {data?.map((item) => {
            console.log("🚀 ~ {data?.map ~ item:", item?.status, item?.invoice_images?.length)
            return (
              <>
                <Card id={`${item?.id}`} headerbg="#FED250" sx={{ boxShadow: '0px 0px 10px #00000034', position: 'relative', marginBottom: '50px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '44px' }}>
                    <Grid
                      container
                      style={{
                        width: '85%',
                      }}
                    >
                      <Grid item xs={6}>
                        <h3 className="action-subtitle">SERVICE DETAILS</h3>
                        <div className="veh-details">
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Service Status</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.display_status || item?.status}</p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Service Type</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.service_type}</p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Service Vendor</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.service_vendor}</p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Service Vendor Location</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.service_vendor_location}</p>
                          </span>
                        </div>
                        <Divider className="divider" style={{ my: 2, borderTop: '1px solid #707070' }} />
                        <div>
                          <h3 style={{ letterSpacing: '0.8px', fontSize: '16px', marginTop: '35px' }}>Service Description</h3>
                          <p style={{ fontFamily: 'MulishRegular', letterSpacing: '0.7px', fontSize: '14px' }}>{item?.service_description}</p>
                        </div>
                        <div>
                          <h3 style={{ letterSpacing: '0.8px', fontSize: '16px', marginTop: '35px' }}>Service Remarks</h3>
                          <p style={{ fontFamily: 'MulishRegular', letterSpacing: '0.7px', fontSize: '14px' }}>{item?.remarks}</p>
                        </div>
                        <div>
                          <h3 style={{ letterSpacing: '0.8px', fontSize: '16px', marginTop: '35px' }}>Invoices / Bills</h3>
                          {item?.invoice_images?.length > 0 ? item?.invoice_images?.map((i, index) => {
                            return (
                              <Grid key={index} sx={{ position: 'relative', marginBottom: '50px', display: 'inline-block' }}>
                                <img width={123} height={123} style={{ marginRight: '40px', borderRadius: '10px' }} src={i?.image} alt="invoice" />
                                <Grid
                                  sx={{
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    bottom: '-25px',
                                    right: '15px',
                                    background: '#FED250',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => downloadImage(i?.image, index)}
                                >
                                  <SystemUpdateAltIcon sx={{ fontSize: '24px' }} />
                                </Grid>
                              </Grid>
                            );
                          }) : <>
                            {(item?.status != 3 && item?.status != 2) && <div className="inputView">
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
                            </div>}
                            {/* {showErr && !images?.length && status !== 0 &&  <p style={{ marginLeft: '3rem', color: '#d32f2f' }}>Please Upload Invoice Images</p>} */}
                            {uploadFile && fileData?.length === 0 && (
                              <Paper
                                elevation={3}
                                sx={{
                                  padding: '20px',
                                  boxShadow: '0px 0px 6px #00000029',
                                  margin: '60px 0 30px 0px',
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
                          </>}
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="veh-details" style={{ marginTop: '150px' }}>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Invoice Date</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>
                              {dayjs(item?.item?.invoice_date).format('DD MMM YYYY')}
                            </p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Invoice Number</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.invoice_number}</p>
                          </span>
                        </div>
                        <div style={{ marginBottom: '28px' }}>
                          <h3 style={{ letterSpacing: '0.8px', fontSize: '16px' }}>Billed From</h3>
                          <p style={{ fontFamily: 'MulishRegular', letterSpacing: '0.7px', fontSize: '14px' }}>{item?.billed_from}</p>
                        </div>
                        <div style={{ marginBottom: '28px' }}>
                          <h3 style={{ letterSpacing: '0.8px', fontSize: '16px' }}>Billed To</h3>
                          <p style={{ fontFamily: 'MulishRegular', letterSpacing: '0.7px', fontSize: '14px' }}>{item?.billed_to}</p>
                        </div>
                        <div className="veh-details">
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Cost of Service</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.reading}</p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Spare Part Charges</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.spares_amount}</p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Labor Charges</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.labour_amount}</p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Discount</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.discount}</p>
                          </span>
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '16px', letterSpacing: '0.8' }}>Taxes</p>
                            <p style={{ fontFamily: 'MulishSemiBold', fontSize: '14px', letterSpacing: '0.7' }}>{item?.tax}</p>
                          </span>
                          <Divider className="divider" style={{ my: 2, borderTop: '1px solid #707070', marginBottom: 24 }} />
                          <span>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '18px', letterSpacing: '0.9' }}>Total Service Cost</p>
                            <p style={{ fontFamily: 'MulishBold', fontSize: '18px', letterSpacing: '0.9' }}>₹ {item?.total_amount}</p>
                          </span>
                        </div>
                        {!window.location.pathname?.includes('edit') ? <div style={{ display: "flex", justifyContent: "flex-end" }}>

                          <button
                            type="button"
                            onClick={() => exportSingleData(item)}
                            style={{
                              border: '2px solid #4B3D76',
                              color: '#FFFFFF',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              backgroundColor: '#4B3D76',
                              cursor: 'pointer',
                              fontSize: '18px',
                              fontFamily: 'MulishBold',
                              letterSpacing: '1px',
                              boxShadow: '0px 0px 4px #00000029',
                              display: "flex", alignItems: "center"
                            }}
                          >
                            EXPORT DATA
                            {/* <span > */}
                            <svg style={{ width: "21px", height: "20px", marginLeft: "10px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>

                            {/* </span> */}

                          </button>
                        </div> : null}

                      </Grid>
                      {/* {item.status === 0 && (
                        <>
                          <Divider className="divider" style={{ my: 2, borderTop: '1px solid #707070', marginBottom: 39, width: '100%' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => updateStatus(item.id, 2)}
                              style={{
                                border: '2px solid #FE6342',
                                color: '#FE6342',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontFamily: 'MulishSemiBold',
                                letterSpacing: '1px',
                                boxShadow: '0px 0px 4px #00000029',
                              }}
                            >
                              REJECT SERVICE LOG
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStatus(item.id, 1)}
                              style={{
                                border: '2px solid #307E98',
                                color: '#fff',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                backgroundColor: '#307E98',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontFamily: 'MulishSemiBold',
                                letterSpacing: '1px',
                                boxShadow: '0px 0px 4px #00000029',
                              }}
                            >
                              ACCEPT RESPONSE
                            </button>
                          </div>
                        </>
                      )} */}
                    </Grid>
                  </div>
                  {item.is_reimbursement || window.location.pathname?.includes('edit') && item?.status === 0 ? (
                    <div>
                      <div className="reImbursementView">
                        <div style={{ fontFamily: 'MulishBold', fontSize: '16px' }}>
                          REIMBURSEMENT
                          <span className="switchView">
                            <Switch
                              checked={window.location.pathname?.includes('edit') && item?.status === 0 ? reimbursement : item?.is_reimbursement}
                              onChange={() => {
                                setReimbursement(!reimbursement);
                              }}
                            />
                          </span>
                        </div>
                        {window.location.pathname?.includes('edit') && item?.status === 0 ? (
                          <div style={{ position: 'relative' }} className="amountView">
                            <TextField
                              sx={{ width: '172px', background: '#fff', borderRadius: '8px' }}
                              inputStyles={{ boxShadow: '0px 0px 6px #00000029' }}
                              name="vendor_name"
                              id="REIMBURSEMENT"
                              type="number"
                              // className='borderRadius'
                              style={{ borderRadius: '8px' }}
                              onChange={(e) => setReimbursementAmount(e.target.value)}
                              placeholder="Enter Amount"
                            // error={errors?.vendor_name}
                            // yupMessage={errors?.vendor_name?.message}
                            />
                            <div
                              className=""
                              style={{ position: 'absolute', left: '10px', top: '6px', display: 'flex', alignItems: 'center', color: '#9EA0A0' }}
                            >
                              <p style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', marginTop: '2px' }}>₹</p>
                              <p style={{ fontFamily: 'MulishSemiBold', fontSize: '16px', margin: 0, paddingLeft: '5px' }}>|</p>
                            </div>
                          </div>
                        ) : item?.is_reimbursement ? (
                          <div className="amountView">
                            <div style={{ fontFamily: 'MulishSemiBold', fontSize: '24px' }}>
                              ₹ <span style={{ marginLeft: '5px' }}>{item?.reimbursement_amount}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : !window.location.pathname?.includes('edit') ? (
                    <div>
                      <div className="reImbursementView">
                        <div style={{ fontFamily: 'MulishBold', fontSize: '16px' }}>
                          REIMBURSEMENT
                          <span className="switchView">
                            <Switch
                              checked={item?.is_reimbursement}
                              onChange={() => {
                                setReimbursement(!reimbursement);
                              }}
                            />
                          </span>
                        </div>

                        {item?.reimbursement_amount ? (
                          <div className="amountView">
                            <div style={{ fontFamily: 'MulishSemiBold', fontSize: '24px' }}>
                              ₹ <span style={{ marginLeft: '5px' }}>{item?.reimbursement_amount}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      padding: '27px 47px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      boxShadow: '0px 0px 10px #00000034',
                      backgroundColor:
                        item.service_history_status === 'UNPLANNED' ? '#FFE8A4' : item.service_history_status === 'ON TIME' ? '#E6F9DA' : '#FFCCCC',
                      color: item.service_history_status === 'UNPLANNED' ? '#E39804' : item.service_history_status === 'ON TIME' ? '#2D9B00' : '#EF4723',
                      borderColor: item.service_history_status === 'UNPLANNED' ? '#FED24F' : item.service_history_status === 'ON TIME' ? '#5DC701' : '#EF4623',
                    }}
                  >
                    <p style={{ letterSpacing: '0.9px', fontFamily: 'MulishExtraBold', fontSize: '14px' }}>
                      {dayjs(item?.service_date).format('DD MMM YYYY')}
                    </p>
                    <p style={{ letterSpacing: '0.9px', fontFamily: 'MulishExtraBold', fontSize: '14px' }}>{item?.odometer_log} km</p>
                  </div>
                </Card>
                {window.location.pathname?.includes('edit') && item.status === 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '50px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setInvoiceId(item?.invoice_id)
                          setModal(item?.id)
                        }}
                        style={{
                          border: '2px solid #FE6342',
                          color: '#FFFFFF',
                          padding: '10px 20px',
                          borderRadius: '10px',
                          backgroundColor: '#FF6241',
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontFamily: 'MulishSemiBold',
                          letterSpacing: '1px',
                          boxShadow: '0px 0px 4px #00000029',
                        }}
                      >
                        REJECT RECORD
                      </button>
                      <button
                        type="button"
                        disabled={!item?.invoice_id && !inviceId && (item.invoice_images?.length === 0 || !item) && images?.length === 0}
                        onClick={() => updateStatus(item.id, 1, item?.invoice_id, item)}
                        style={{
                          border: '2px solid #FED250',
                          color: '#222222',
                          padding: '10px 20px',
                          borderRadius: '10px',
                          backgroundColor: '#FED250',
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontFamily: 'MulishSemiBold',
                          letterSpacing: '1px',
                          opacity: !item?.invoice_id && !inviceId && (item.invoice_images?.length === 0 || !item) && images?.length === 0 ? 0.65 : 1,
                          boxShadow: '0px 0px 4px #00000029',
                        }}
                      >
                        ACCEPT RECORD
                      </button>
                    </div>
                  </div>
                )}

                {item.status === 3 && item?.rejection_reason && (
                  <div>
                    <div className="rejectText">Reason for rejection</div>
                    <div className="rejectionView">{item?.rejection_reason}</div>
                  </div>
                )}
              </>
            );
          })}
          {showEdit ? <EditServiceHistory bikeData={{ ...bikeData, ...serviceLog }} serviceData={data[0]} /> : null}

          {(showEdit || (data[0]?.display_status === 'Pending' && window.location.pathname?.includes('edit'))) ? null : window.location.pathname?.includes('edit') ? <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
            <Button className="closeBtn" onClick={() => navigate('/service-history')}>
              CLOSE
            </Button>
          </div> :
            !!downloadData && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
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
                  CLOSE
                </Button>


                <button
                  style={{
                    background: '#FED250 0% 0% no-repeat padding-box',
                    boxShadow: '0px 0px 6px #00000029',
                    border: '1px solid #E0E0E0',
                    borderRadius: '10px',
                    opacity: 1,
                    padding: '18px 46px',
                  }}
                  onClick={() => exportData()}
                >
                  <span
                    style={{
                      textAlign: 'left',
                      fontSize: '16px',
                      letterSpacing: '0.9px',
                      color: '#000000',
                      fontFamily: 'MulishBold',
                      fontWeight: 'semibold',
                      display: 'flex', justifyContent: 'end', alignItems: 'center',
                    }}
                  >
                    EXPORT SERVICE HISTORY
                    <svg style={{ width: "21px", height: "20px", marginLeft: "10px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </span>
                </button>
              </div>
            )
          }
          <Modal
            open={modal ? true : false}
            onClose={() => {
              setModal(false);
              setReason('');
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
                <div style={{ padding: '0 40px' }}>
                  <div>
                    <p className="modal-title">Enter reason for rejection of record</p>
                  </div>
                  <FormControl
                    // form={form}
                    // name="basic"
                    // onFinish={onFinish}
                    // // initialValues={{ type: "option1" }}
                    // //   style={{ marginLeft: "100px" }}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                    }}
                  >
                    {/* <Form.Item
              label="Service Type"
              name="type"
              rules={[{ required: true, message: "Please select a type!" }]}
              style={{ marginLeft: "10%", width: "70%" }}
            >
      
            </Form.Item> */}
                    <div className="inputView" style={{ marginTop: '24px', borderRadius: '20px' }}>
                      <Grid container spacing={2} style={{ alignItems: 'center' }}>
                        {/* <Grid item xs={3}>
                      <p className="inputLabel">Vendor Name</p>
                    </Grid> */}
                        <Grid item xs={12} style={{ paddingTop: '30px', borderRadius: '20px' }}>
                          <TextField
                            sx={{ width: '80%', background: '#fff', borderRadius: '20px' }}
                            inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                            name="vendor_name"
                            className="borderRadius"
                            multiline
                            rows={5}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter remark here"
                          // error={errors?.vendor_name}
                          // yupMessage={errors?.vendor_name?.message}
                          />

                          {/* <FormProvider {...methods}>
                        <FormInputField
                          sx={{ width: '70%', background: '#fff' }}
                          inputStyles={{ boxShadow: '0 1px 6px #00000029' }}
                          name="vendor_name"
                          placeholder="Enter Vendor Name"
                          error={errors?.vendor_name}
                          yupMessage={errors?.vendor_name?.message}
                        />
                      </FormProvider> */}
                          {/* <Select
                        defaultValue={dropdownOptionsAsd[0]?.value || ""}
                        value={type}
                        onChange={(e) => {
                          setType(e?.target?.value);
                        }}
                        // defaultChecked={dropdownOptionsAsd?.[0]?.label}
                        sx={{ '& legend': { display: 'none' }, '& fieldset': { top: 0 }, }}
                        className="inputType"
                        label={null}
                        style={{ width: '100%', color: type === 0 ? 'gray' : 'black' }}
                      >
                        {dropdownOptionsAsd?.map((item, i) => {
                          return (
                            <MenuItem disabled={i === 0 ? true : false} key={item?.value} style={{ paddingLeft: '31px' }} sx={{ color: item?.label === '-- Select Service Type --' ? 'gray' : '#5C5C5C', '&:hover': { color: '#4B3D76' } }} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select> */}
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

                    <div className="bottomView" style={{ marginTop: '5rem' }}>
                      <Button
                        sx={{
                          '&.Mui-disabled': {
                            color: '#5C5C5C',
                            backgroundColor: '#EEEEEE',
                            padding: '9px 41px',
                            border: 'none',
                            boxShadow: '0px 0px 4px #00000029',
                            fontSize: '18px',
                          },
                        }}
                        style={{ fontFamily: 'MulishBold' }}
                        className="newButton"
                        onClick={() => updateStatus(modal, 2, inviceId)}
                      >
                        PROCEED
                      </Button>
                    </div>
                  </FormControl>
                </div>
                {/* <ChildModal /> */}
              </Box>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ViewServiceHistory;
