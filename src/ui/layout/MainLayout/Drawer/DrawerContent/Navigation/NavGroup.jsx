// material-ui NewGroup.jsx
import { Box, List, Typography } from '@mui/material';

// project import
import NavItem from './NavItem';
import { useMenuContext } from '@context/MenuContextProvider';
import { usePermissionsContext } from '@context/PermissionsContextProvider';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const {
    drawerState: { drawerOpen },
  } = useMenuContext();

  const { isRouteAllowed } = usePermissionsContext();

  const filteredItems = item.children
  // const filteredItems = item.children?.filter((menuItem) => {
  //   return isRouteAllowed(menuItem.validation_path);
  // });

  const navCollapse = filteredItems?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
            collapse - only available in paid version
          </Typography>
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return filteredItems?.length > 0 ? (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle1" color="textSecondary" textTransform="uppercase" letterSpacing="0.6px">
              {item?.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  ) : null;
};

export default NavGroup;
