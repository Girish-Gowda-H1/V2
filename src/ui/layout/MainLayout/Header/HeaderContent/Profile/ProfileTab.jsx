// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, Typography } from '@mui/material';

// assets
import LogoutIcon from '../../../../../../assets/svgs/LogoutIcon';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const theme = useTheme();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      <ListItemButton
        onClick={handleLogout}
        sx={{
          ':hover': {
            background: 'transparent',
          },
        }}
      >
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <Typography variant="h4" fontSize="1rem" color="#A3A3A3">
          Logout
        </Typography>
      </ListItemButton>
    </List>
  );
};

export default ProfileTab;
