import { useState } from 'react';

import { Button, Grid, IconButton, MenuItem, Popover, TextField, Typography, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import useFetchApi from '@hooks/useFetchApi';
import ArrowDownIcon from '@assets/svgs/ArrowDownIcon';

const questionURL = 'response_question_search';

export default function ChecklistResponseQuestionFilter({ baseURL, setUrl: setTableDataUrl, fetchTableData, updateQuery, getSearchQuery }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [questionValue, setQuestionValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [hasFilter, setHasFilter] = useState(false);

  const theme = useTheme();

  const {
    data: questionsData,
    setUrl: setQuestionUrl,
    func: fetchQuestionsData,
  } = useFetchApi({
    key: [questionURL],
    url: questionURL,
    fetchOnMount: false,
  });

  const handleQuestionSearch = () => {
    const query = questionURL + '?' + 'search_text=' + questionValue;

    setQuestionUrl(query);
    fetchQuestionsData();
  };

  const handleFilterSearch = () => {
    updateQuery('option_id', responseValue);

    setTableDataUrl(getSearchQuery());
    setHasFilter(true);
    fetchTableData().then(() => {
      setAnchorEl(null);
    });
  };

  const handleResetForm = () => {
    setQuestionValue('');
    setResponseValue('');
    setHasFilter(false);
  };

  return (
    <>
      <Button
        variant={hasFilter ? 'rb-contained' : 'rb-outlined'}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          width: 150,
          justifyContent: 'space-between',
          ':hover': {
            background: hasFilter ? '#EBE3F1' : '#ffffff',
            boxShadow: '0px 0px 6px #E0E0E0',
          },
        }}
        endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        <Typography variant="h5" textTransform="capitalize" color="#000000">
          Responses
        </Typography>
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              px: 3.5,
              py: 3,
            },
          },
        }}
      >
        <Grid container width={400} rowGap={1}>
          <Typography variant="h5" fontSize="16px">
            Enter the question
          </Typography>
          <Grid container columnGap={1} mb={2}>
            <TextField
              className="rb-primary"
              placeholder="Enter the question here"
              value={questionValue}
              onChange={(event) => setQuestionValue(event.target.value)}
              autoFocus
              sx={{
                flex: 1,
                '& input': {
                  fontWeight: '200',
                  fontSize: '14px !important',
                },
              }}
            />
            <IconButton
              onClick={handleQuestionSearch}
              size="large"
              sx={{
                height: '100%',
                boxShadow: '0px 0px 6px ' + theme.palette.shadowPrimary,
                borderRadius: '10px',
                background: questionValue ? theme.palette.button.text.purplePrimary : theme.palette.button.greyPrimary + '!important',
                ':hover': {
                  background: theme.palette.purplePrimary,
                },
                '& svg': {
                  fill: questionValue ? theme.palette.button.whitePrimary : theme.palette.button.text.greyText + '!important',
                },
              }}
              disabled={!questionValue}
            >
              <SearchIcon />
            </IconButton>
          </Grid>
          <Typography variant="h5" fontSize="16px">
            Select a response
          </Typography>
          <Grid container columnGap={2} mb={2}>
            <TextField
              className="rb-primary-select"
              value={responseValue}
              label={responseValue ? '' : <Typography fontWeight="h5">Select the response</Typography>}
              onChange={(event) => setResponseValue(event.target.value)}
              InputLabelProps={{ shrink: false }}
              select
              SelectProps={{
                IconComponent: ArrowDownIcon,
              }}
              sx={{
                flex: 1,
                opacity: questionsData ? '100%' : '50%',
                '& label': {
                  fontSize: '14px !important',
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '14px !important',
                },
                '& svg': {
                  mr: '1rem',
                },
              }}
              // disabled={!questionsData}
            >
              {questionsData?.data?.data?.length ? (
                questionsData.data.data.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      <Typography variant="h5">{item.value}</Typography>
                    </MenuItem>
                  );
                })
              ) : (
                <Typography pl={2}>No Options to show</Typography>
              )}
            </TextField>
          </Grid>
          <Grid container justifyContent="space-between">
            <Button>
              <Typography onClick={handleResetForm} sx={{ textDecoration: 'underline' }} variant="h5" fontSize="14px">
                RESET ALL
              </Typography>
            </Button>
            <Button
              size="large"
              variant="rb-yellow-primary"
              sx={{
                p: '10px 26px',
                borderRadius: 1.5,
                background: responseValue ? theme.palette.button.yellowPrimary + '!important' : theme.palette.button.greyPrimary + '!important',
                pointerEvents: responseValue ? 'auto' : 'none',
                color: responseValue ? theme.palette.button.blackPrimary : theme.palette.button.text.greyText,
              }}
              onClick={handleFilterSearch}
            >
              <Typography variant="h5" fontSize="14px" letterSpacing="0.5px">
                APPLY FILTER
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
