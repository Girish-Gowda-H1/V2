import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { useMenuContext } from '@context/MenuContextProvider';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    drawerState,
    drawerState: { drawerOpen },
    setDrawerState,
  } = useMenuContext();

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const onItemSelect = (itemId) => {
    setDrawerState({ ...drawerState, currentItem: itemId, drawerOpen: !matchDownLG });
  };

  const itemIcon = item.icon ? <item.icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

  const isSelected = item.id === drawerState.currentItem;

  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.url) && !isSelected) {
      onItemSelect(item.id);
    }
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => onItemSelect(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 42}px` : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        '&.MuiButtonBase-root': {
          ':hover': {
            background: 'rgba(0, 0, 0, 0.04) !important',
            borderRadius: '8px',
          },
        },
      }}
    >
      {drawerOpen && (
        <ListItemText
          className="wow"
          sx={{ border: 'none' }}
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? '#000000' : '#A3A3A3' }}>
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;
