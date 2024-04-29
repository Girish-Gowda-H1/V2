import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText, Divider, ClickAwayListener, OutlinedInput, InputAdornment, Box } from '@mui/material';
import './services.less';
import { Button } from 'rsuite';
import CheckIcon from '@mui/icons-material/Check';
import { SearchOutlined } from '@ant-design/icons';

const CheckboxDropdown = ({
  options,
  selectedValues,
  onChange,
  submitFilter,
  resetFilter,
  noCheckBox,
  secondmenu,
  onLocation,
  locations,
  hasCheckbox = false,
  setOpen,
  locationName,
  setLocationName,
  location,
  setLocation
}) => {
  const [city, setCity] = useState([]);
  const [searchCity, setSearchCity] = useState();
  const [searchLocation, setSearchLocation] = useState();
  console.log("city", city)
  let cities = searchCity ? options?.filter((item) => item?.name?.toLowerCase()?.includes(searchCity?.toLowerCase())) : options
  let citiesLocation = searchLocation ? location?.filter((item) => item?.name?.toLowerCase()?.includes(searchLocation?.toLowerCase())) : location
  const handleChange = (event, id) => {
    // setSelectedItems([selected]);
    if (selectedValues?.includes(id)) {
      onChange(selectedValues?.filter((item) => item !== id));
    } else {
      onChange([...selectedValues, id]);
    }
    // onChange(selected);
  };
  const handlechange = (id) => {
    // setSelectedItems([selected]);
    if (locations?.includes(id)) {
      onLocation(locations?.filter((item) => item !== id));
    } else {
      onLocation([...locations, id]);
    }
    // onChange(selected);
  };

  return (
    <FormControl style={{ position: 'relative', display: 'inline' }}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div className={`backView  ${hasCheckbox === true ? 'no-location' : ''}`}>
          <div className="menuView" style={{ gap: '0' }}>
            <div className="menu" style={{ rowGap: '4px', display: 'flex', flexDirection: 'column', backgroundColor: secondmenu ? "#FFF" : '#FFF', padding: '19px 14px' }}>
              <Box sx={{ width: '100%', ml: { xs: 0, md: 1 },marginBottom: '10px' }}>
                <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
                  <OutlinedInput
                    size="small"
                    id="header-search"
                    endAdornment={
                      <InputAdornment position="start" sx={{ mr: -0.5 }}>
                        <SearchOutlined />
                      </InputAdornment>
                    }
                    sx={{padding: '5px  15px'}}
                    onChange={(e) => setSearchCity(e.target.value)}
                    aria-describedby="header-search-text"
                    inputProps={{
                      'aria-label': 'weight'
                    }}
                    placeholder="Search"
                  />
                </FormControl>
              </Box>
              {cities.map((option) => {
                return (
                  <MenuItem
                    key={option?.service_type}
                    sx={{
                      borderRadius: '5px',
                      padding: '11px 20px 11px 28px',
                      position: 'relative',
                      marginRight: '10px',
                      backgroundColor: selectedValues?.length ?"transparent": (secondmenu ? locationName === option?.name || location?.includes(option?.name) : selectedValues.includes(option?.id)) ? '#EBE3F1' : 'transparent',
                      color: selectedValues?.length ?"#9EA0A0": locationName === option?.name || location?.includes(option?.name) ? '#4B3D76' : '#9EA0A0',
                      '&:hover': {
                        backgroundColor: '#EBE3F1',
                        color: '#4B3D76',
                      }
                    }}
                    value={option?.name}
                    onClick={(e) => {
                      setCity(option?.locations.map((item) => item.name));
                      secondmenu
                        ? (setLocation(option?.locations), setLocationName(option?.name))
                        : (handleChange(e, option?.id), setLocation(prev => {
                          if (prev?.includes(option?.name)) {
                            return prev?.filter((item) => item !== option?.name);
                          } else {
                            return [...prev, option?.name];
                          }
                        }))
                    }
                    }
                  >
                    {noCheckBox ? null : <Checkbox checked={selectedValues.includes(option?.id)} onClick={(e) => handleChange(e, option?.id)} style={{ padding: '0px', marginRight: '10px', color: selectedValues.includes(option?.id) ? '#4B3D76' : '#dddddd' }} />}
                    {locationName === option.name && (
                      <CheckIcon sx={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }} />
                    )}
                    {secondmenu ? (
                      <ListItemText primary={option?.name} style={{ marginLeft: '11px' }} onClick={() => (secondmenu ? setLocation(option?.locations) : null)} />
                    ) : (
                      <ListItemText primary={option?.name} onClick={(e) => handleChange(e, option?.id)} />
                    )}
                  </MenuItem>
                )
              })}
            </div>
            {hasCheckbox !== true && (
              <div className="menu" style={{ rowGap: '4px', display: 'flex', flexDirection: 'column', padding: '19px 14px' }}>
                {secondmenu && location?.length ? (
                  <div>
                    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 },marginBottom: '10px'  }}>
                      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
                        <OutlinedInput
                          size="small"
                          id="header-search"
                          endAdornment={
                            <InputAdornment position="start" sx={{ mr: -0.5 }}>
                              <SearchOutlined />
                            </InputAdornment>
                          }
                          sx={{padding: '5px  15px'}}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          aria-describedby="header-search-text"
                          inputProps={{
                            'aria-label': 'weight'
                          }}
                          placeholder="Search"
                        />
                      </FormControl>
                    </Box>
                    {citiesLocation?.map((option) => (
                      <MenuItem
                        key={option?.service_type}
                        sx={{
                          padding: '1px 37px',
                          borderRadius: '5px',
                          backgroundColor: selectedValues.includes(option?.id) ? '#EBE3F1' : '#FFF',
                          position: 'relative',
                          color: '#9EA0A0',
                        }}
                        value={option?.id}
                        onClick={() => {
                          handleChange('e', option?.id);
                          handlechange(option?.name);
                        }}
                      >
                        <Checkbox
                          checked={selectedValues.includes(option?.id)}
                          style={{
                            color: selectedValues.includes(option?.id) ? '#4B3D76' : '#dddddd',
                          }}
                          onClick={(e) => {
                            handlechange(option?.name);
                            handleChange(e, option?.id);
                          }}
                        />
                        <ListItemText
                          primary={option?.name}
                          style={{ color: '#222222' }}
                          onClick={() => {
                            handleChange('e', option?.id);
                            handlechange(option?.name);
                          }}
                        />
                      </MenuItem>
                    ))}

                  </div>
                ) : (
                  <p style={{ padding: '10px 37px', width: '200px', textAlign: 'center' }}>No location</p>
                )}
              </div>
            )}
          </div>
          <Divider />
          <div className="bottom">
            <a className="resetAll" onClick={(e) => resetFilter(e)}>
              RESET ALL
            </a>
            <Button className="filterType resetAll" onClick={(city) => submitFilter(city)}>
              APPLY FILTER
            </Button>
          </div>
        </div>
      </ClickAwayListener>
    </FormControl>
  );
};

export default CheckboxDropdown;
