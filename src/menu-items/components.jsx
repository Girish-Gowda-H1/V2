// assets
import WidgetsIcon from '@mui/icons-material/Widgets';

// icons
const icons = {
  WidgetsIcon,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const components = {
  id: 'components',
  title: 'Components',
  type: 'group',
  children: [
    {
      id: 'components',
      title: 'Components',
      type: 'item',
      url: '/components',
      icon: icons.WidgetsIcon,
      breadcrumbs: false,
    },
  ],
};

export default components;
