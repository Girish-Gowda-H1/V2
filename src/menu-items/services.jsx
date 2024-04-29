// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const services = {
  id: 'services',
  title: 'Services',
  type: 'group',
  children: [
    {
      id: 'service-type',
      title: 'Service Types',
      type: 'item',
      url: '/service-types',
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
    {
      id: 'service-rules',
      title: 'Service Rules',
      type: 'item',
      url: "/service-rules",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
    {
      id: 'service-vendors',
      title: 'Service Vendors',
      type: 'item',
      url: "/service-vendors",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
    {
      id: 'service-projections',
      title: 'Service Projections',
      type: 'item',
      url: "/service-projections",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
    {
      id: 'service-history',
      title: 'Service History',
      type: 'item',
      url: "/service-history",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
  ],
};

export default services;
