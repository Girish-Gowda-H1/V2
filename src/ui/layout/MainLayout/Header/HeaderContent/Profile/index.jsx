import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, ClickAwayListener, Paper, Popper, Stack, Typography } from '@mui/material';

// project import
import MainCard from '@components/cards/MainCard';
import Transitions from '@components/@extended/Transitions';
import ProfileTab from './ProfileTab';

// assets
import { useUserContext } from '@context/UserContextProvider';
import ArrowUpIcon from '@assets/svgs/ArrowUpIcon';
import ArrowDownIcon from '@assets/svgs/ArrowDownIcon';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const { user } = useUserContext();

  const handleLogout = async () => {
    localStorage.removeItem('u_t');
    localStorage.removeItem('u_id');
    localStorage.removeItem('u_st');

    const redirectUrl = import.meta.env.RB_SSO_AUTH_URL || 'https://www.royalbrothers.club/admin/login';

    window.location.replace(redirectUrl);
  };

  const anchorRef = useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
        }}
        disableRipple
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt={user?.data?.username[0]} src={'avatar1'} sx={{ width: 50, height: 50 }} />
          {/* <Typography variant="subtitle1">{user.data.username}</Typography> */}
          <Box>
            <Typography variant="h4">{user?.data?.username}</Typography>
            <Typography variant="h4" sx={{ fontSize: '1.1rem', fontFamily: 'MulishExtraLight', textAlign: 'left' }}>
              {user?.data?.username}
            </Typography>
          </Box>
          {open ? <ArrowUpIcon strokeWidth="3px" /> : <ArrowDownIcon strokeWidth="3px" />}
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-start"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    {open && (
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <ProfileTab handleLogout={handleLogout} />
                      </TabPanel>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
