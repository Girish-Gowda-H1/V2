import { lazy } from 'react';

// project import
import MainLayout from '../ui/layout/MainLayout';
import Loadable from '@components/Loadable';

// Check if we are in development environment
const isDevEnv = import.meta.env.RB_MODE?.toLowerCase() === 'development';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('@pages/dashboard')));
const DevComponents = Loadable(lazy(() => (isDevEnv ? import('@pages/components') : null)));

// render - checklists
const CreateNewChecklist = Loadable(lazy(() => import('@pages/checklists/CreateNewChecklist')));
const EditChecklist = Loadable(lazy(() => import('@pages/checklists/EditChecklist')));
const AllChecklists = Loadable(lazy(() => import('@pages/checklists/AllChecklists')));
const ChecklistResponses = Loadable(lazy(() => import('@pages/checklists/ChecklistResponses')));
const SingleResponseView = Loadable(lazy(() => import('@pages/checklists/SingleResponseView')));

const ServiceTypeHome = Loadable(lazy(() => import('@pages/ServiceType/ServiceTypeHome')));
const AddServiceType = Loadable(lazy(() => import('@pages/ServiceType/AddServiceType')));
const ViewServiceType = Loadable(lazy(() => import('@pages/ServiceType/ViewServiceType')));
const ViewDisabledServiceType = Loadable(lazy(() => import('@pages/ServiceType/ViewDisabledServiceType')));

const ServiceRulesHome = Loadable(lazy(() => import('@pages/ServiceRule/ServiceRulesHome')));
const CreateServiceRule = Loadable(lazy(() => import('@pages/ServiceRule/CreateServiceRule')));
const ViewServiceRule = Loadable(lazy(() => import('@pages/ServiceRule/ViewServiceRule')));
const ViewDisabledServiceRule = Loadable(lazy(() => import('@pages/ServiceRule/ViewDisabledServiceRule')));

const ServiceVendorHome = Loadable(lazy(() => import('@pages/ServiceVendor/ServiceVendorHome')));
const AddServiceVendor = Loadable(lazy(() => import('@pages/ServiceVendor/AddServiceVendor')));
const ViewServiceVendor = Loadable(lazy(() => import('@pages/ServiceVendor/ViewServiceVendor')));
const ViewDisabledServiceVendor = Loadable(lazy(() => import('@pages/ServiceVendor/ViewDisabledServiceVendor')));
const EditServiceVendor = Loadable(lazy(() => import('@pages/ServiceVendor/EditServiceVendor')));

const ServiceProjectionsHome = Loadable(lazy(() => import('@pages/ServiceProjections/ServiceProjectionsHome')));
const ServiceHistoryHome = Loadable(lazy(() => import('@pages/ServiceHistory/ServiceHistoryHome')));
const CreateServiceLog = Loadable(lazy(() => import('@pages/ServiceHistory/CreateServiceLog')));
const ViewServiceHistory = Loadable(lazy(() => import('@pages/ServiceHistory/ViewServiceHistory')));

// render - utilities
const Typography = Loadable(lazy(() => import('@pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('@pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('@pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('@pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />,
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />,
    },

    // For Checklists
    {
      path: 'checklists/new',
      element: <CreateNewChecklist />,
    },
    {
      path: 'checklists/:action/:checklist_id',
      element: <EditChecklist />,
    },
    {
      path: 'checklists/all',
      element: <AllChecklists />,
    },
    {
      path: 'checklists/responses',
      element: <ChecklistResponses />,
    },
    {
      path: 'checklists/single-response',
      element: <SingleResponseView />,
    },
    { path: "/service-types", element: <ServiceTypeHome /> },
    { path: "/service-types/add-service", element: <AddServiceType /> },
    { path: "/service-types/view-enabled/:id", element: <ViewServiceType /> },
    { path: "/service-types/view-disabled/:id", element: <ViewDisabledServiceType /> },
    { path: "/service-rules", element: <ServiceRulesHome /> },
    { path: "/service-rules/create-service", element: <CreateServiceRule /> },
    { path: "/service-rules/view-rule/:id", element: <ViewServiceRule /> },
    { path: "/service-rules/view-disabled-rule/:id", element: <ViewDisabledServiceRule /> },
    { path: "/service-vendors", element: <ServiceVendorHome /> },
    { path: "/service-vendors/add-vendor", element: <AddServiceVendor /> },
    { path: "/service-vendors/view-vendor/:id", element: <ViewServiceVendor /> },
    { path: "/service-vendors/view-disabled-vendor/:id", element: <ViewDisabledServiceVendor /> },
    { path: "/service-vendors/edit-vendor/:id", element: <EditServiceVendor /> },
    { path: "/service-vendors/edit-vendor/:id/:locid", element: <EditServiceVendor /> },
    { path: "/service-projections", element: <ServiceProjectionsHome /> },
    { path: "/service-history", element: <ServiceHistoryHome /> },
    { path: "/service-history/create-service-log", element: <CreateServiceLog /> },
    { path: "/service-history/view-service-history/:id", element: <ViewServiceHistory /> },
    { path: "/service-history/view-service-history/edit/:id/:invoicenumber", element: <ViewServiceHistory /> },
    { path: "/service-history/view-service-history/edit/:id/", element: <ViewServiceHistory /> },

    //////////////////////////////////

    {
      path: 'color',
      element: <Color />,
    },
    {
      path: 'shadow',
      element: <Shadow />,
    },
    {
      path: 'typography',
      element: <Typography />,
    },
    {
      path: 'icons/ant',
      element: <AntIcons />,
    },
  ],
};

const developmentPages = [
  {
    path: 'components',
    element: <DevComponents />,
  },
];

if (isDevEnv) {
  MainRoutes.children.push(...developmentPages);
}

export default MainRoutes;
