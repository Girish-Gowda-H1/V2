import { Button, alpha, styled } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: "10px",
  boxShadow: " 0px 0px 5px #0000003D",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: "flex",
  justifyContent: "space-between",
  height: "50px",
  marginRight: 20,
  minWidth: "300px",
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    // padding: ,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    height: "50px",
    [theme.breakpoints.up('sm')]: {
      width: '45ch',
      '&:focus': {
        width: '45ch',
      },
    },
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  top: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
}));



const CommonHeader = (props) => {
  return (<div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}>
    <h2 className='mainTitle' style={{
      minWidth: "115px"
    }}>{props?.title}</h2>
    <div style={{
      display: "flex"
    }}>
      <Search>
        <StyledInputBase placeholder={props?.searchPlaceholder} inputProps={{
          'aria-label': 'search'
        }} value={props?.searchText} onChange={props?.handleSearch} />
        <SearchIconWrapper>
          {
            props?.searchText !== '' &&
            <CloseIcon color='#9EA0A0' style={{
              color: "#9EA0A0",
              cursor: "pointer"
            }} onClick={() => props?.handleClear()} />
          }
          <SearchIcon color='#9EA0A0' style={{
            color: "#9EA0A0",
            cursor: "pointer"
          }} onClick={() => props?.handleSearchButton()} />
        </SearchIconWrapper>
      </Search>
      {
        /* <Search
         size="large"
         placeholder="Search by Service Type"
         // value={searchText}
         // onChange={handleSearchInputChange}
         onSearch={handleSearch}
         // suffix={<SearchOutlined />}
         style={{ marginRight: "15px", maxWidth: "250px" }}
        /> */
      }
      {
        /* <Input
         size="large"
         value={searchText}
         onChange={handleSearchInputChange}
         placeholder="Search by Service Type"
         suffix={<SearchOutlined />}
         style={{ marginRight: "15px", maxWidth: "250px" }}
        /> */
      }
      {props.onAdd ?

        <Button size="large" style={{
          backgroundColor: "#FED250"
        }} className='newButton'
          onClick={props.onAdd}
        >
          + {props.addButtonText}
        </Button> : props.path ?
          <Link to={props?.path}>
            <Button size="large" style={{
              backgroundColor: "#FED250"
            }} className='newButton'
              onClick={props.onAdd}
            >
              + {props.addButtonText}
            </Button>
          </Link> : null}
    </div>
  </div>);
}

export default CommonHeader