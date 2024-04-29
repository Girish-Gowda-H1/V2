// import { Layout } from "antd";
import Logo from "@assets/svgs/RB-img.svg";
import { useNavigate } from "react-router-dom";
import "./header.less"
// const { Header } = Layout;

const CustomHeader = () => {
  const navigate = useNavigate();
  const headerStyle = {
    background: "#fff", // Background color of the header
    padding: "16px", // Adjust as needed
    margin: "0px",
    width: "100%",
    height: "120px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Box shadow for elevation
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  };

  const logoStyle = {
    width: "220px",
    padding: "20px",
  };

  return (
    // <Header style={headerStyle}>
    <div className="actionHeader">
      <img
        src={Logo}
        alt="Logo"
        style={logoStyle}
        onClick={() => navigate("/")}
      />

    </div>
    // </Header>
  );
};

export default CustomHeader;
