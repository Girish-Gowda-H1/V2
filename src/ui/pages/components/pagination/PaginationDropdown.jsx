import { FormControl, MenuItem, Select } from '@mui/material';
import "./pagination.css"

const PaginationDropdown = (props) => {
    return (<div style={{
        display: "flex",
        alignItems: "center"
      }}>
        <p className='textView' style={{marginTop: props?.data?.length > 10 ? "0" : "8px"}}>Showing</p>
        {props?.data?.length > 10 ? <FormControl sx={{
          m: 1,
          minWidth: 50,
          borderRadius: "8px",
          margin: "0 12px",
          border: "none"
        }}>
          <Select className='limitSelect' value={props?.limit} onChange={e => {props?.setLimit(e?.target?.value); props?.setCurrentPage(0)}} displayEmpty inputProps={{
            'aria-label': 'Without label'
          }}>
    
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={75}>75</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl> : <p style={{marginTop: '8px', padding: "0 5px", fontWeight: "600", fontFamily: "MulishBold", fontSize: "13px"}}>{props?.data?.length || 0}</p>}
        <p className='textView'>out of <span style={{
          fontFamily: "MulishBold",
          fontSize: "13px"
        }}>{props?.data?.length || 0}</span></p>
      </div>);
}

export default PaginationDropdown
