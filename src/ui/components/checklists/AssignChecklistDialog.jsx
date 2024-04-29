// React
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mui
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  Chip,
  Grid,
  Box,
  Typography,
  useTheme,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

// Internal
import useFetchApi from '@hooks/useFetchApi';
import usePostApi from '@hooks/usePostApi';
import CustomSwitchField from '@components/common/CustomSwitchField';
import InputWithName from '@components/common/InputWithName';

const baseUrl = 'assign_checklist';
const allowedChipLength = 6;

export default function AssignChecklistDialog({ checklistDialogRef, open, onClose, checklistId }) {
  const [vehicleSearchValue, setVehicleSearchValue] = useState('');
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [isMultipleAllowed, setIsMultipleAllowed] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [updationIntervalValue, setUpdationIntervalValue] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();

  const { data: modelData } = useFetchApi({ key: [baseUrl], url: `${baseUrl}?checklist_id=${checklistId}`, cacheTime: 1 });
  const { func: assignChecklist } = usePostApi({ url: baseUrl });

  const filtersData = useMemo(() => {
    if (modelData) {
      const models = modelData.data.all_models;
      setAssignedVehicles(modelData.data.assigned_models.map((item) => ({ label: item.bike_model_name, value: item.bike_model_id })));
      setUpdationIntervalValue(modelData.data.updation_interval);
      setIsMultipleAllowed(modelData.data.allow_multiple);
      const allModels = models.map((item) => ({ label: item.bike_model_name, value: item.bike_model_id }));
      allModels.unshift({ label: 'Select all', value: 'all' });
      return allModels;
    }
    return [];
  }, [modelData]);

  const handleAutoCompleteChange = (values) => {
    const valueArray = values.map((item) => item.value);

    if (valueArray.includes('all')) {
      setAssignedVehicles(filtersData.filter((item) => item.value !== 'all'));
    } else {
      setAssignedVehicles(values);
    }
  };

  const handleChecklistAssign = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const updationInterval = Number(formData.get('updationInterval'));
    const allow_multiple = formData.get('allow_multiple') === 'on';

    const formBody = {
      assigned_vehicles: assignedVehicles.map((item) => item.value),
      updation_interval: updationInterval,
      allow_multiple: allow_multiple,
    };

    assignChecklist({ url: baseUrl + '?checklist_id=' + checklistId, body: formBody }).then((res) => {
      if (res.data.status) {
        navigate('/checklists/all');
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        navigate('/checklists/all');
      }}
      PaperProps={{
        sx: {
          width: 950,
          maxWidth: 'unset',
          borderRadius: 5,
          border: '3px dotted',
          borderColor: 'grey.400',
        },
      }}
      sx={{
        background: theme.palette.modal.backgroundPrimary,
        '& .MuiBackdrop-root': {
          background: 'transparent',
        },
      }}
      container={checklistDialogRef}
    >
      <form onSubmit={handleChecklistAssign}>
        <DialogTitle variant="h4" fontSize="24px" letterSpacing="1.2px" sx={{ px: 7, pt: 5, pb: 5.5 }}>
          Assign Checklist Name
        </DialogTitle>
        <DialogContent sx={{ p: 5, px: 14, minHeight: 300 }}>
          <Box sx={{ mb: 1.8 }}>
            <InputWithName name="Assign to Vehicle/s" titleProps={{ variant: 'h4', fontSize: '16px' }}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                renderTags={() => null}
                open={openDropDown}
                onOpen={() => setOpenDropDown(true)}
                onClose={() => setOpenDropDown(false)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => setVehicleSearchValue(e.target.value)}
                    label={vehicleSearchValue ? '' : <Typography variant="body1">Select Vehicle Models</Typography>}
                    InputLabelProps={{ shrink: false }}
                  />
                )}
                renderOption={(props, option) => {
                  if (option.value === 'all') {
                    return (
                      <Grid container justifyContent="space-between" borderBottom="1px solid" borderColor={theme.palette.grey[300]} mb={1}>
                        <Typography
                          {...props}
                          variant="subtitle1"
                          onClick={() => {
                            setAssignedVehicles([]);
                            setOpenDropDown(false);
                          }}
                          color={theme.palette.button.text.greyText}
                          fontSize="12px"
                        >
                          CLEAR
                        </Typography>
                        <Typography
                          {...props}
                          variant="subtitle1"
                          textTransform="uppercase"
                          fontSize="12px"
                          color={theme.palette.button.text.purplePrimary}
                          sx={{ textDecoration: 'underline' }}
                        >
                          {option.label}
                        </Typography>
                      </Grid>
                    );
                  } else {
                    const allValues = assignedVehicles.map((item) => item.value);
                    return (
                      <Grid container {...props} sx={{ paddingLeft: '0 !important' }}>
                        <Checkbox
                          variant="rb-purple-primary"
                          checked={allValues.includes(option.value)}
                          icon={<CheckIcon fontSize="small" sx={{ opacity: 0 }} />}
                          checkedIcon={<CheckIcon fontSize="small" />}
                        />
                        <Typography
                          variant={allValues.includes(option.value) ? 'h5' : 'body1'}
                          color={allValues.includes(option.value) ? theme.palette.button.text.purplePrimary : theme.palette.button.text.greyText}
                          fontSize="14px"
                        >
                          {option.label}
                        </Typography>
                      </Grid>
                    );
                  }
                }}
                value={assignedVehicles}
                popupIcon={<KeyboardArrowDownIcon />}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                filterOptions={(allOptions) => allOptions.filter((option) => option.label.toLowerCase().includes(vehicleSearchValue))}
                options={filtersData}
                ListboxProps={{
                  sx: {
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#EEEEEE',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#9EA0A0',
                    },
                    '& .MuiAutocomplete-option': {
                      paddingY: '2px',
                    },
                  },
                }}
                sx={{
                  mb: 2,
                  '& .Mui-focused': {
                    border: 'none',
                  },
                }}
                disabled={!filtersData.length}
                onChange={(event, values) => {
                  setVehicleSearchValue('');
                  handleAutoCompleteChange(values);
                }}
                className="rb-primary-autocomplete"
              />

              <ChipsData assignedVehicles={assignedVehicles} setAssignedVehicles={setAssignedVehicles} options={filtersData} />
            </InputWithName>
          </Box>
          <InputWithName name="Fill Checklist Every" titleProps={{ variant: 'h4', fontSize: '16px' }}>
            <TextField
              name="updationInterval"
              placeholder="Checklist Must be filled every"
              required
              type="number"
              inputMode="numeric"
              InputProps={{
                inputProps: {
                  placeholder: 'Checklist Must be filled every',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Grid container>
                      <Typography variant="h5" fontSize="14px" color="#222222">
                        Days
                      </Typography>
                    </Grid>
                  </InputAdornment>
                ),
              }}
              onWheel={(e) => e.target.blur()}
              fullWidth
              value={updationIntervalValue || undefined}
              className="rb-primary"
              onChange={(event) => setUpdationIntervalValue(event.target.value)}
              sx={{ mb: 3 }}
            />
          </InputWithName>
          <CustomSwitchField
            variant="rb-purple-primary"
            sx={{ ml: 'auto' }}
            name="allow_multiple"
            checked={isMultipleAllowed}
            onChange={(event) => setIsMultipleAllowed(event.target.checked)}
            label={
              <Typography variant="h5" sx={{ color: isMultipleAllowed ? theme.palette.allMainTextColor : theme.palette.switch.labelOff }}>
                Allow Multiple Fills
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="rb-yellow-primary"
            type="submit"
            disabled={assignedVehicles.length === 0}
            sx={{
              letterSpacing: '1.25px',
              px: 4,
              background: assignedVehicles.length === 0 ? theme.palette.button.greyPrimary : theme.palette.button.yellowPrimary,
            }}
          >
            <Typography
              variant="h4"
              fontSize="18px"
              sx={{ color: assignedVehicles.length === 0 ? theme.palette.button.text.greyText : theme.palette.button.text.blackPrimary }}
            >
              ASSIGN CHECKLIST
            </Typography>
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

const ChipsData = ({ assignedVehicles = [], setAssignedVehicles, options }) => {
  const handleDelete = (chipToDelete) => {
    setAssignedVehicles((chips) => chips.filter((chip) => chip.value !== chipToDelete));
  };

  const chipOptions = assignedVehicles.map((item) => {
    const itemLabel = options.find((option) => option.value === item.value);
    return { key: item.value, label: itemLabel.label };
  });

  return chipOptions.length > 0 ? (
    <Grid container columnGap={2} rowGap={2} mb={2}>
      {chipOptions.slice(0, allowedChipLength).map((data) => {
        return (
          <Chip
            key={data.key}
            label={
              <Typography variant="h4" fontSize="15px" fontWeight={600} color="#4B3D76">
                {data.label}
              </Typography>
            }
            sx={{ background: '#BBAAEF4D' }}
            deleteIcon={<ClearIcon sx={{ fill: '#4B3D76' }} />}
            onDelete={() => handleDelete(data.key)}
          />
        );
      })}
      {chipOptions.length > allowedChipLength ? (
        <Typography
          variant="h5"
          fontSize="12px"
          color="#212121"
          sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', textDecoration: 'underline' }}
        >
          +{chipOptions.length - allowedChipLength} MORE MODELS
        </Typography>
      ) : null}
    </Grid>
  ) : null;
};
