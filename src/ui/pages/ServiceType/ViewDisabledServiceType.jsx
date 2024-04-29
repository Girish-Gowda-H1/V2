import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import CustomHeader from "../../components/Header";
// import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import  axios  from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./ViewServiceType.less";
import "./serviceType.less";
import Link from '@mui/material/Link';
import { Button, Card, Grid } from "@mui/material";
import Typography from '@mui/material/Typography';
import ActionHeader from "../components/services/actionHeader";
import apiUrl from "../../../../api-config";

const ViewDisabledServiceType = () => {
  const [data, setData] = useState([]);
  let { id } = useParams();  
  const navigate = useNavigate();
  // const location = useLocation();
  // const data = location.state?.data;

  const fetchData = () => {
    axios.get(`${apiUrl}/servicetype/${id}/`)
    .then((response) => {
      setData(response.data);
      // navigate("/service-types/")
    })
    .catch((error) => {
      console.log(error);
    });
  }  

  const handleEnable = () => {
    axios.put(`${apiUrl}/service-types/${id}/status/`, {"is_enabled": true})
    .then((response)=> {
      navigate("/service-types/")
    })
    .catch((error) =>{
      console.log(error);
    })
  }

  useEffect(() => {
    fetchData();
  },[])

  return (
    <>
      <CustomHeader />
      <CustomBreadcrumb />
      <div style={{ padding: "20px" }}>
      </div>
      <div
      className='service-details-container'
      >
        <Card 
          bordered={true}
          headerbg="#FED250"
          headStyle={{ backgroundColor: "#FED250" }}
          style={{width: "80%", margin: "20px",boxShadow: "0px 0px 10px #00000034",borderRadius:"10px"}}
        >
          <ActionHeader text={"VIEW VEHICLE SERVICE TYPE"}/>
          <div style={{ margin:"20px 0 50px 80px"}}>
          <h3 className="action-subtitle" style={{paddingTop: "30px", paddingBottom: "40px"}} > SERVICE DETAILS </h3>

         
          <Grid className="viewservices-details-wrapper" container >
            <Grid item className="viewservices-details">
              <Grid xs={4} className="label"><p>Service Type</p></Grid>
              <Grid xs={8} className="value"><p>{data.name}</p></Grid>
            </Grid>
            <Grid item className="viewservices-details">
              <Grid xs={4} className="label"><p>Service Description</p></Grid>
              <Grid xs={8} className="value"><p>{data.description}</p></Grid>
            </Grid>
            <Grid item className="viewservices-details">
              <Grid xs={4} className="label"><p>Linked to</p></Grid>
              <Grid xs={8} className="value"><p>{data.service_rules_count} <span></span> Service Rules </p></Grid>
            </Grid>
          </Grid>

          </div>
        </Card>
        <div style={{ display: "flex", justifyContent: "space-between", width: "80%",margin:"20px 0"}}>
          <Button size="large" type="text" className="cancel-button" style={{fontSize: "20px", fontFamily:'MulishBold', color: '#5C5C5C'}} onClick={() => navigate("/service-types/")}>CLOSE</Button>
          {/* <Button size="large" style={{backgroundColor: "#FED250"}} onClick={handleEnable}>ENABLE SERVICE TYPE</Button> */}
          <Button
            style={{ fontSize: "20px",padding:"12px 49px",background:'#FED250 0% 0% no-repeat padding-box', textDecoration:'none', boxShadow: '0px 0px 4px #00000029', borderRadius: '10px', fontFamily: 'MulishBold' }}
            // className="newButton"
            onClick={()=>handleEnable()}
          > 
            ENABLE SERVICE TYPE
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewDisabledServiceType;
