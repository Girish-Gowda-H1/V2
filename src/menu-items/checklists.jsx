// assets
import { FontSizeOutlined } from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
};

// ==============================|| MENU ITEMS - CHECKLISTS ||============================== //

const checklists = {
  id: 'checklists',
  title: 'Checklists',
  type: 'group',
  children: [
    {
      id: 'checklist-create',
      title: 'Create New Checklist',
      type: 'item',
      url: '/checklists/new',
      icon: icons.FontSizeOutlined,
      breadcrumbs: false,
      validation_path: 'checklist__create',
    },
    {
      id: 'checklists-all',
      title: 'See All checklists',
      type: 'item',
      url: '/checklists/all',
      icon: icons.FontSizeOutlined,
      breadcrumbs: false,
      validation_path: 'checklist__read',
    },
    {
      id: 'checklists-responses',
      title: 'See Checklist Responses',
      type: 'item',
      url: '/checklists/responses',
      icon: icons.FontSizeOutlined,
      breadcrumbs: false,
      validation_path: 'checklist_response__read',
    },
  ],
};

export default checklists;
