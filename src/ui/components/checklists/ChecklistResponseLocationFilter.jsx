import { Box, Button, Checkbox, Grid, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { NestedMenuItem } from 'mui-nested-menu';
import { useCallback, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const nestedMenuStyles = {
  '& .nested-menu': {
    paddingLeft: 0,
    minWidth: 300,
  },
};

export default function ChecklistResponseLocationFilter({
  filtersData,
  locationFilterData,
  setLocationFilterData,
  handleLocationsSearch,
  updateQuery,
}) {
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [hasFilter, setHasFilter] = useState(locationFilterData.city.length > 0 || locationFilterData.locations.length > 0);
  const [target, setTarget] = useState(null);

  const handleLocationFiltersOpen = (e) => setLocationAnchorEl(e.currentTarget);
  const handleLocationFiltersClose = () => setLocationAnchorEl(null);

  const cityLocationMapping = useCallback(() => {
    if (filtersData) {
      const mapping = {};
      filtersData.data.data.map((item) => {
        const arr = item.locations
          .filter((location) => {
            return locationFilterData.locations.includes(location.location_id);
          })
          .map((loc) => loc.location_id);

        return (mapping[item.city_id] = arr);
      });
      return mapping;
    }
  }, [filtersData, locationFilterData.locations]);

  const theme = useTheme();

  const handleCityChange = (cityId) => {
    let cityArray = locationFilterData.city;
    let locationsArray = locationFilterData.locations;

    if (cityArray.includes(cityId)) {
      cityArray.splice(cityArray.indexOf(cityId), 1);
    } else {
      cityArray.push(cityId);

      const allLocationsForACity = filtersData.data.data.find((item) => item.city_id === cityId).locations.map((item) => item.location_id);

      locationsArray = locationsArray.filter((item) => !allLocationsForACity.includes(item));
    }

    setLocationFilterData({ locations: locationsArray, city: cityArray });
  };

  const handleLocationChange = (locationId, cityId) => {
    let locationArray = locationFilterData.locations;
    let cityArray = locationFilterData.city;

    if (locationArray.includes(locationId)) {
      locationArray.splice(locationArray.indexOf(locationId), 1);
    } else {
      locationArray.push(locationId);
    }

    if (cityArray.includes(cityId)) {
      cityArray.splice(cityArray.indexOf(cityId), 1);
    }

    setLocationFilterData({ city: cityArray, locations: locationArray });
  };

  const isDisabled = locationFilterData.city.length === 0 && locationFilterData.locations.length === 0;

  return (
    <Box>
      <Button
        variant={hasFilter ? 'rb-contained' : 'rb-outlined'}
        size="large"
        onClick={handleLocationFiltersOpen}
        endIcon={locationAnchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        sx={{
          width: 150,
          justifyContent: 'space-between',
          p: '18px 20px',
          ':hover': {
            background: hasFilter ? '#EBE3F1' : '#ffffff',
            boxShadow: '0px 0px 6px #E0E0E0',
          },
        }}
      >
        <Typography variant="h5" textTransform="capitalize" color="#000000">
          Location
        </Typography>
      </Button>
      <Menu
        anchorEl={locationAnchorEl}
        open={Boolean(locationAnchorEl)}
        onClose={handleLocationFiltersClose}
        className="mainMenu"
        onFocus={(event) => {
          setTarget(event.currentTarget.childNodes[2]);
        }}
      >
        <Box
          sx={{
            maxHeight: 300,
            width: 400,
            overflowY: 'scroll',
            '&::-webkit-scrollbar': {
              width: '3px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#EEEEEE',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#9EA0A0',
            },
          }}
          className="wowziee"
        >
          {filtersData?.data?.data.map((item) => {
            return (
              <Grid
                key={item.city_id}
                container
                alignItems="center"
                sx={{
                  '& > div': {
                    flex: 1,
                  },
                  '& li > div': {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  },
                  paddingRight: 2,
                  '& li:hover': {
                    background: '#EBE3F1 !important',
                    borderRadius: '5px',
                  },
                  '& p': {
                    fontWeight: 'bold',
                    width: '100%',
                  },
                }}
              >
                <NestedMenuItem
                  leftIcon={
                    <Checkbox
                      variant="rb-purple-secondary"
                      icon={<CheckIcon fontSize="small" sx={{ fill: 'transparent' }} />}
                      checkedIcon={<CheckIcon fontSize="small" />}
                      checked={locationFilterData.city.includes(item.city_id)}
                    />
                  }
                  MenuProps={{
                    anchorEl: target,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    sx: {
                      left: '5px',
                    },
                  }}
                  className="okiee"
                  rightIcon=""
                  label={
                    <span style={{ display: 'flex' }}>
                      <Typography>{item.city_name}</Typography>
                      <Typography textAlign="end">{cityLocationMapping()[item.city_id]?.length || ''}</Typography>
                    </span>
                  }
                  parentMenuOpen={Boolean(locationAnchorEl)}
                  disableRipple
                  style={{
                    background: locationFilterData.city.includes(item.city_id) ? '#EBE3F1' : 'transparent',
                    borderRadius: '5px',
                    marginBottom: '5px',
                    color: locationFilterData.city.includes(item.city_id) ? theme.palette.purplePrimary : theme.palette.accentGrey,
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleCityChange(item.city_id)}
                >
                  <Box
                    sx={{
                      height: 300,
                      overflowY: 'scroll',
                      '&::-webkit-scrollbar': {
                        width: '3px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#EEEEEE',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#9EA0A0',
                      },
                    }}
                  >
                    {item.locations.map((location) => {
                      return (
                        <Grid
                          key={location.location_id}
                          container
                          alignItems="center"
                          sx={{
                            '& > div': {
                              flex: 1,
                            },
                            ...nestedMenuStyles,
                            paddingRight: 2,
                          }}
                        >
                          <MenuItem
                            className="nested-menu"
                            sx={{
                              background: locationFilterData.locations.includes(location.location_id) ? '#EBE3F1' : 'transparent',
                              marginBottom: '5px',
                              borderRadius: '5px',
                              '&:hover': {
                                borderRadius: '5px !important',
                              },
                            }}
                          >
                            <Checkbox
                              variant="rb-purple-primary"
                              checked={locationFilterData.locations.includes(location.location_id)}
                              onClick={() => handleLocationChange(location.location_id, item.city_id)}
                            />
                            <Typography
                              onClick={() => handleLocationChange(location.location_id, item.city_id)}
                              variant="h4"
                              color={theme.palette.allMainTextColor}
                              fontSize="14px"
                            >
                              {location.location_name}
                            </Typography>
                          </MenuItem>
                        </Grid>
                      );
                    })}
                  </Box>
                </NestedMenuItem>
              </Grid>
            );
          })}
        </Box>
        <Grid container justifyContent="space-between" pt={2}>
          <Button
            variant="text"
            onClick={() => {
              setLocationFilterData({ city: [], locations: [] });
              updateQuery('locations', '');
              updateQuery('cities', '');
              handleLocationsSearch();
              setHasFilter(false);
              setLocationAnchorEl(null);
            }}
          >
            <Typography variant="h4" fontSize="14px" color={theme.palette.allMainTextColor} letterSpacing="0.5px">
              RESET ALL
            </Typography>
          </Button>
          <Button
            variant="rb-yellow-primary"
            sx={{
              p: '10px 26px',
              borderRadius: 1.5,
              background: isDisabled ? theme.palette.button.greyPrimary : theme.palette.button.yellowPrimary,
              '&:hover': {
                background: isDisabled ? theme.palette.button.greyPrimary : theme.palette.button.yellowPrimary,
                '& h4': {
                  color: isDisabled ? theme.palette.button.text.greyText : theme.palette.button.text.blackPrimary,
                },
              },
            }}
            onClick={() => {
              updateQuery('locations', locationFilterData.locations.join(','));
              updateQuery('cities', locationFilterData.city.join(','));
              setHasFilter(true);
              setLocationAnchorEl(null);
              handleLocationsSearch();
            }}
          >
            <Typography
              variant="h4"
              fontSize="14px"
              color={isDisabled ? theme.palette.button.text.greyText : theme.palette.button.text.blackPrimary}
              letterSpacing="0.5px"
            >
              APPLY FILTER
            </Typography>
          </Button>
        </Grid>
      </Menu>
    </Box>
  );
}
