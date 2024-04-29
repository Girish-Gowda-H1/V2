import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  MenuOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  BookOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import Logo from "../assets/RB-img.svg";

const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const siderItems = [
  getItem("Service Types", "ServiceTypeMenu", <HomeOutlined />),
  getItem("Service Rules", "ServiceRuleMenu", <ApiOutlined />),
  getItem("Service Vendors", "ServiceVendorMenu", <PieChartOutlined />),
  getItem("Service History", "ServiceHistoryMenu", <BookOutlined />),
  getItem("Service Projection", "ServiceProjectionMenu", <AreaChartOutlined />),
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    switch (event.key) {
      case "ServiceTypeMenu":
        navigate("/service-types");
        break;
      case "ServiceRuleMenu":
        navigate("/service-rules");
        break;
      case "ServiceVendorMenu":
        navigate("/service-vendors");
        break;
      case "ServiceHistoryMenu":
        navigate("/service-history");
        break;
      case "ServiceProjectionMenu":
        navigate("/service-projections");
        break;
      default:
        navigate("/");
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
    >
      {/* <div className="logo" /> */}
      {/* <img src={Logo} style={{ padding: "15px" }} /> */}
      {/* <MenuOutlined style={{ margin: "25px", alignItems: "left" }} />
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={siderItems}
        style={{ textAlign: "left" }}
        onClick={(e) => handleMenuClick(e)}
      /> */}
    </Sider>
  );
};

export default Sidebar;
