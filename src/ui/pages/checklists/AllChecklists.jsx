// React
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Mui
import { Box, Button, CircularProgress, Grid, InputAdornment, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Internal
import CustomTable from '@components/common/CustomTable';
import StatusChip from '@components/common/StatusChip';
import TableActionButtons from '@components/checklists/TableActionButtons';
import CreatedByCell from '@components/checklists/CreatedByCell';
import useFetchApi from '@hooks/useFetchApi';

// Other
import debounce from 'lodash.debounce';
import ArrowDownIcon from '@assets/svgs/ArrowDownIcon';
import SearchIcon from '@assets/svgs/SearchIcon';

const baseURL = 'checklist_list_view';
const limitOptions = [10, 25, 50];

export default function AllChecklists() {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get('limit') || 10;
  const isEnabled = searchParams.get('status') === 'enabled';
  const isDisabled = searchParams.get('status') === 'disabled';
  const isDrafted = searchParams.get('status') === 'draft';

  const theme = useTheme();
  const navigate = useNavigate();

  const updateQuery = (key, value) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const getSearchQuery = useCallback(() => {
    let query = '?';

    const pageQuery = searchParams.get('page_no') || 1;
    const searchQuery = searchParams.get('search_text');
    const limitQuery = searchParams.get('limit') || 10;
    const statusQuery = searchParams.get('status') || '';

    query = query + 'page_no=' + pageQuery + '&' + 'limit=' + limitQuery + '&' + 'status=' + statusQuery + '&';

    if (searchQuery) {
      query = query + 'search_text=' + searchQuery + '&';
    }

    return baseURL + query;
  }, [searchParams]);

  const {
    data: tableData,
    setUrl,
    func: fetchTableData,
    isFetching,
  } = useFetchApi({
    key: [baseURL],
    url: getSearchQuery(),
  });

  const updatePageData = useCallback(() => {
    setUrl(getSearchQuery());
    fetchTableData();
  }, [fetchTableData, getSearchQuery, setUrl]);

  const debouncedSearch = debounce(async (text) => {
    updateQuery('search_text', text);
    setUrl(getSearchQuery());
    fetchTableData();
  }, 1000);

  const handleSearch = (event) => {
    debouncedSearch(event.target.value);
  };

  const handleLimitChange = (event) => {
    updateQuery('limit', event.target.value);
    setUrl(getSearchQuery());
    fetchTableData();
  };

  const handleStatusChange = (query) => {
    const isEnabled = searchParams.get('status') === 'enabled';
    const isDisabled = searchParams.get('status') === 'disabled';
    const isDrafted = searchParams.get('status') === 'draft';

    if (query === 'enable') {
      if (!isEnabled) {
        updateQuery('status', 'enabled');
      } else {
        updateQuery('status', '');
      }
    }

    if (query === 'disable') {
      if (!isDisabled) {
        updateQuery('status', 'disabled');
      } else {
        updateQuery('status', '');
      }
    }

    if (query === 'draft') {
      if (!isDrafted) {
        updateQuery('status', 'draft');
      } else {
        updateQuery('status', '');
      }
    }

    setUrl(getSearchQuery());
    fetchTableData();
  };

  return (
  // isLoading ? (
  //   <Loader />
  // ) : (
    <>
      <Box component="section" mb={5} mt={5}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontSize="26px" letterSpacing="1.2px" color={theme.palette.common.black}>
              Vehicle Checklists
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder="Search by Checklist Name, Vehicle Model"
              className="rb-primary"
              InputProps={{
                endAdornment: <InputAdornment position="end">{isFetching ? <CircularProgress size={14} /> : <SearchIcon />}</InputAdornment>,
              }}
              inputProps={{
                style: {
                  padding: '2px 0',
                },
              }}
              defaultValue={searchParams.get('search_text')}
              onChange={handleSearch}
              sx={{ mr: 2, width: 400 }}
            />
            <Button sx={{ letterSpacing: '1.75px' }} variant="rb-yellow-primary" startIcon={<AddIcon />} onClick={() => navigate('/checklists/new')}>
              CREATE CHECKLIST
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" mb={5}>
        <Grid container justifyContent="space-between">
          <Box>
            <Button
              sx={{
                mr: 2,
                p: '18px 20px',
                ':hover': {
                  background: isEnabled ? '#EBE3F1' : '#ffffff',
                  boxShadow: '0px 0px 6px #E0E0E0',
                },
              }}
              variant={isEnabled ? 'rb-contained' : 'rb-outlined'}
              onClick={() => handleStatusChange('enable')}
            >
              <Typography variant="h3" fontSize="12px" fontWeight="600" letterSpacing="1.5px">
                Enabled
              </Typography>
            </Button>
            <Button
              sx={{
                mr: 2,
                p: '18px 20px',
                ':hover': {
                  background: isDisabled ? '#EBE3F1' : '#ffffff',
                  boxShadow: '0px 0px 6px #E0E0E0',
                },
              }}
              variant={isDisabled ? 'rb-contained' : 'rb-outlined'}
              onClick={() => handleStatusChange('disable')}
            >
              <Typography variant="h3" fontSize="12px" fontWeight="600" letterSpacing="1.5px">
                Disabled
              </Typography>
            </Button>
            <Button
              sx={{
                p: '18px 20px',
                ':hover': {
                  background: isDrafted ? '#EBE3F1' : '#ffffff',
                  boxShadow: '0px 0px 6px #E0E0E0',
                },
              }}
              variant={isDrafted ? 'rb-contained' : 'rb-outlined'}
              onClick={() => handleStatusChange('draft')}
            >
              <Typography variant="h3" fontSize="12px" fontWeight="600" letterSpacing="1.5px">
                Draft
              </Typography>
            </Button>
          </Box>
          <Grid container width="max-content" alignItems="center">
            <Typography variant="mulishMedium" fontSize="12px">
              Showing
            </Typography>
            <TextField
              className="rb-primary-select"
              sx={{
                mx: 1,
                '& .MuiInputBase-root': {
                  pr: 0,
                  '& .MuiSelect-select': {
                    pr: '8px !important',
                    pl: 1,
                  },
                },
              }}
              select
              defaultValue={limit}
              onChange={handleLimitChange}
              SelectProps={{ IconComponent: () => null }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <ArrowDownIcon width={10} stroke="#000000" />
                  </InputAdornment>
                ),
              }}
            >
              {limitOptions.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    <Typography fontWeight="bold">{item}</Typography>
                  </MenuItem>
                );
              })}
            </TextField>
            <Typography variant="mulishMedium" fontSize="12px">
              out of
              <span style={{ fontWeight: 'bold', marginLeft: 4, fontSize: '14px' }}>{tableData?.data?.total_count || 0}</span>
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box component="section">
        <DataTable tableData={tableData} onPageChange={updatePageData} updateQuery={updateQuery} fetchTableData={fetchTableData} limit={limit} />
      </Box>
    </>
  );
}

const DataTable = ({ tableData, onPageChange, updateQuery, fetchTableData, limit }) => {
  const { data, total_count } = tableData?.data || {};

  const dataClone = data ? structuredClone(data) : [];

  const navigate = useNavigate();

  const formattedData = dataClone.map((item) => {
    const isEnabled = item.current_status === 'published';
    const isDraft = item.current_status === 'draft';

    const chipLabel = isEnabled ? 'ENABLED' : isDraft ? 'DRAFT' : 'DISABLED';
    const chipColor = isEnabled ? '#E6F9DA' : isDraft ? '#EFFAFF' : '#EEEEEE';
    const labelColor = isEnabled ? '#2D9B00' : isDraft ? '#307E98' : '#5C5C5C';

    item['Checklist Name'] = item.name;
    delete item.name;

    item['Created By'] = <CreatedByCell creator={item.created_by} date={item.created_at} />;
    delete item.created_by;
    delete item.created_at;

    item['Vehicle Models'] = item.assigned_model_count;
    delete item.assigned_model_count;

    item['Status'] = <StatusChip label={chipLabel} color={chipColor} labelColor={labelColor} />;
    delete item.current_status;

    item['Action'] = <TableActionButtons id={item.id} isEnabled={isEnabled} onChange={fetchTableData} />;

    return item;
  });

  const leftAlignedItems = ['Checklist Name', 'Created By'];

  return formattedData.length > 0 ? (
    <CustomTable
      tableData={formattedData}
      leftAlignedItems={leftAlignedItems}
      itemCount={Math.ceil(total_count / limit)}
      onPageChange={onPageChange}
      updateQuery={updateQuery}
      onRowClick={(id) => navigate(`/checklists/edit/${id}`)}
    />
  ) : (
    <Typography variant="h1">No data to show </Typography>
  );
};
