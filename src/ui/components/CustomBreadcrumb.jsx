import Breadcrumbs from '@mui/material/Breadcrumbs';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CustomBreadcrumb.css';

const breadcrumbNameMap = {
  'service-types': 'Vehicle Service Types',
  'add-service': 'Add New Service Type',
  'view-enabled': 'View Service Type',
  'view-disabled': 'View Service Type',
  'service-rules': 'Vehicle Service Rules',
  'create-service': 'Add New Service Rule',
  'view-rule': 'View Service Rule',
  'view-disabled-rule': 'View Service Rule',
  'service-vendors': 'Vehicle Service Vendors',
  'add-vendor': 'Add New Service Vendor',
  'view-vendor': 'View Service Vendor',
  'view-disabled-vendor': 'View Service Vendor',
  'edit-vendor': 'Edit Vendor Details',
  'service-history': 'Vehicle Service History',
  'create-service-log': 'Create Vehicle Service Log',
  'view-service-history': 'View Vehicle Service History',
};

const CustomBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname
    .split('/')
    .filter((i) => i)
    .filter((i) => Object.prototype.hasOwnProperty.call(breadcrumbNameMap, i));

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSnippets.length - 1;

    return (
      <div key={url}>
        {isLast ? (
          <span
            style={{
              padding: '0 4px',
              borderRadius: '4px',
              lineHeight: '22px',
              color: '#307E98',
            }}
          >
            {breadcrumbNameMap[_]}
          </span>
        ) : (
          <Link key={url} to={url}>
            {breadcrumbNameMap[_]}
          </Link>
        )}
      </div>
    );
  });

  return (
    <Breadcrumbs className="custom-bread" separator=">" aria-label="breadcrumb">
      {breadcrumbItems}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumb;
