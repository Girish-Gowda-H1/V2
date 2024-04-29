import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from '@menu-items';
import Breadcrumbs from '@components/@extended/Breadcrumbs';
import { useMenuContext } from '@context/MenuContextProvider';
import ErrorBoundaryWrapper from '../../components/common/ErrorBoundaryWrapper';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    drawerState: { drawerOpen },
    setDrawerState,
  } = useMenuContext();

  const handleDrawerToggle = () => {
    setDrawerState((prev) => ({ ...prev, drawerOpen: !drawerOpen }));
  };

  useEffect(() => {
    setDrawerState((prev) => ({ ...prev, drawerOpen: !matchDownLG }));
  }, [matchDownLG, setDrawerState]);

  return (
    <ErrorBoundaryWrapper>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
        <Drawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Toolbar />
          <Breadcrumbs navigation={navigation} title />
          <Outlet />
        </Box>
      </Box>
    </ErrorBoundaryWrapper>
  );
};

export default MainLayout;
