// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// assets
import CrossIcon from '@assets/svgs/CrossIcon';
import HamburgerMenuIcon from '@assets/svgs/HamburgerMenuIcon';
import HeaderLogoIcon from '@assets/svgs/HeaderLogoIcon';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  // common header
  const mainHeader = (
    <Toolbar sx={{ backgroundColor: 'white' }}>
      <Box sx={{ cursor: 'pointer', mr: 3 }} onClick={handleDrawerToggle}>
        {open ? <CrossIcon width={24} /> : <HamburgerMenuIcon width={24} />}
      </Box>
      <HeaderLogoIcon />
      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      marginLeft: '0',
      width: '100%',
    },
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} className="wowzie" sx={{}} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar className="wowzie" sx={{ marginLeft: '0 !important' }} {...appBar}>
          {mainHeader}
        </AppBar>
      )}
    </>
  );
};

export default Header;
