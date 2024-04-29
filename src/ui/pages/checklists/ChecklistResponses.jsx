// React
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Mui
import { Box, CircularProgress, Grid, InputAdornment, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Internal
import CustomTable from '@components/common/CustomTable';
import Loader from '@components/common/Loader';
import ChecklistResponseQuestionFilter from '@components/checklists/ChecklistResponseQuestionFilter';
import ChecklistResponseLocationFilter from '@components/checklists/ChecklistResponseLocationFilter';
import ChecklistResponseDateFilter from '@components/checklists/ChecklistResponseDateFilter';
import CreatedByCell from '@components/checklists/CreatedByCell';
import StatusChip from '@components/common/StatusChip';
import useFetchApi from '@hooks/useFetchApi';

// External
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import ArrowDownIcon from '@assets/svgs/ArrowDownIcon';

const baseURL = 'checklist_response_list_view';
const filterURL = 'checklist_filters';
const limitOptions = [10, 25, 50];

export default function ChecklistResponses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultCities =
    searchParams
      .get('cities')
      ?.split(',')
      ?.map((item) => (item ? Number(item) : null))
      ?.filter((item) => Boolean(item)) || [];
  const defaultLocations =
    searchParams
      .get('locations')
      ?.split(',')
      ?.map((item) => (item ? Number(item) : null))
      ?.filter((item) => Boolean(item)) || [];

  const [locationFilterData, setLocationFilterData] = useState({ city: defaultCities, locations: defaultLocations });

  const limit = searchParams.get('limit') || 10;
  const baseQuery = baseURL + '?' + 'page_no=' + (searchParams.get('page_no') || 1) + '&';

  const updateQuery = (key, value) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const getSearchQuery = useCallback(() => {
    const searchQuery = searchParams.get('search_text');
    const limitQuery = 'limit=' + (searchParams.get('limit') || 10);
    const locationQuery = 'locations=' + (searchParams.get('locations') || '');
    const citiesQuery = 'cities=' + (searchParams.get('cities') || '');
    const startDateQuery = 'start_date=' + (searchParams.get('start_date') || '');
    const endDateQuery = 'end_date=' + (searchParams.get('end_date') || '');
    const optionQuery = 'option_id=' + (searchParams.get('option_id') || '');

    let query =
      baseQuery +
      // pageQuery +
      '&' +
      limitQuery +
      '&' +
      locationQuery +
      '&' +
      citiesQuery +
      '&' +
      startDateQuery +
      '&' +
      endDateQuery +
      '&' +
      optionQuery +
      '&';

    if (searchQuery) {
      query = query + 'search_text=' + searchQuery + '&';
    }

    return query;
  }, [baseQuery, searchParams]);

  const { data: filtersData } = useFetchApi({
    key: ['checklist_filters'],
    url: filterURL,
  });

  const {
    data: tableData,
    setUrl,
    func: fetchTableData,
    isLoading,
    isFetching,
  } = useFetchApi({
    key: ['checklist_response_list_view'],
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

  const handleLocationsSearch = () => {
    // const locationsToString = locationFilterData.locations.join(',');
    // const citiesToString = locationFilterData.city.join(',');

    const locationsToString = searchParams.get('locations');
    const citiesToString = searchParams.get('cities');

    updateQuery('locations', locationsToString);
    updateQuery('cities', citiesToString);
    setUrl(getSearchQuery());
    fetchTableData();
  };

  const theme = useTheme();

  const handleDateFilter = (dates) => {
    if (dates[0] && dates[1]) {
      const startDate = dayjs(dates[0]).format('DD/MM/YYYY');
      const endDate = dayjs(dates[1]).format('DD/MM/YYYY');

      updateQuery('start_date', startDate);
      updateQuery('end_date', endDate);

      setUrl(getSearchQuery());
      fetchTableData();
    } else {
      updateQuery('start_date', '');
      updateQuery('end_date', '');

      setUrl(getSearchQuery());
      fetchTableData();
    }
  };

  useEffect(() => {
    updateQuery('option_id', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Box component="section" mb={5} mt={5}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" fontSize="30px" color={theme.palette.common.black} letterSpacing="1.1px">
              View Responses
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              className="rb-primary"
              placeholder="Search by Vehicle Model, Registration Number or Checklist Name"
              InputProps={{
                endAdornment: <InputAdornment position="end">{isFetching ? <CircularProgress size={14} /> : <SearchIcon />}</InputAdornment>,
              }}
              defaultValue={searchParams.get('search_text')}
              onChange={handleSearch}
              sx={{
                mr: 0,
                width: 550,
                '& input': {
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box component="section" mb={5}>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Three Filters Button */}
          <Grid container width="max-content" columnGap={1}>
            {/* Location Filter */}
            <ChecklistResponseLocationFilter
              filtersData={filtersData?.data?.data ? filtersData : []}
              locationFilterData={locationFilterData}
              setLocationFilterData={setLocationFilterData}
              handleLocationsSearch={handleLocationsSearch}
              updateQuery={updateQuery}
            />

            {/* Date Filter */}
            <ChecklistResponseDateFilter onOk={handleDateFilter} />

            {/* Responses Filter */}
            <ChecklistResponseQuestionFilter
              baseURL={baseURL}
              fetchTableData={fetchTableData}
              setUrl={setUrl}
              updateQuery={updateQuery}
              getSearchQuery={getSearchQuery}
            />
          </Grid>

          {/* Row Count Component */}
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
              value={limit}
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
                    <Typography variant="h4" fontSize="14px" color={theme.palette.allMainTextColor}>
                      {item}
                    </Typography>
                  </MenuItem>
                );
              })}
            </TextField>
            <Typography variant="mulishMedium" fontSize="12px">
              out of <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{tableData?.data?.total_count || 0}</span>
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

const DataTable = ({ tableData, onPageChange, updateQuery, limit }) => {
  const { data, total_count } = tableData.data || {};

  const dataClone = data ? structuredClone(data) : [];

  const navigate = useNavigate();

  const formattedData = dataClone.map((item) => {
    const isAccepted = item.status === 'accepted';
    const isPending = item.status === 'pending';

    const chipLabel = isAccepted ? 'ACCEPTED' : isPending ? 'PENDING' : 'REJECTED';
    const chipColor = isAccepted ? '#E6F9DA' : isPending ? '#EFFAFF' : '#FFBEA9';
    const labelColor = isAccepted ? '#2D9B00' : isPending ? '#307E98' : '#EF4723';

    item['Registration No.'] = item.bike_reg_no;
    delete item.bike_reg_no;

    item['Vehicle Model'] = item.bike_model;
    delete item.bike_model;

    item['Location'] = item.location_name;
    delete item.location_name;

    item['Checklist Name'] = item.checklist_name;
    delete item.checklist_name;

    item['Response Status'] = <StatusChip label={chipLabel} color={chipColor} labelColor={labelColor} />;
    delete item.status;

    item['Filled by'] = <CreatedByCell creator={item.admin_user_name} date={item.created_at} />;
    delete item.admin_user_name;
    delete item.created_at;

    return item;
  });

  const leftAlignedItems = ['Registration No.', 'Vehicle Model', 'Location', 'Checklist Name', 'Filled by'];

  return data?.length > 0 ? (
    <CustomTable
      tableData={formattedData}
      itemCount={Math.ceil(total_count / limit)}
      leftAlignedItems={leftAlignedItems}
      onPageChange={onPageChange}
      updateQuery={updateQuery}
      onRowClick={(id) => navigate(`/checklists/single-response?response_id=${id}`)}
    />
  ) : (
    <Typography variant="h1">No data to show</Typography>
  );
};
