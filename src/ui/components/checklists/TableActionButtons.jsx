// React
import { useNavigate } from 'react-router-dom';

// Mui
import { Grid, IconButton, useTheme } from '@mui/material';
import ArchiveIcon from '@assets/svgs/ArchiveIcon';
import EditIcon from '@assets/svgs/EditIcon';

// Internal
import usePostApi from '@hooks/usePostApi';

const TableActionButtons = ({ id, isEnabled, onChange = () => null }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { func: patchChecklistArchive } = usePostApi({ url: 'checklist_archive', method: 'patch' });

  const handleChecklistArchive = () => {
    patchChecklistArchive({ url: `checklist_archive?checklist_id=${id}` }).then((res) => {
      if (res.data.status) {
        onChange();
      }
    });
  };

  return (
    <Grid container columnGap={2} justifyContent="center">
      <IconButton
        aria-label="delete"
        sx={{ width: 45, pointerEvents: isEnabled ? 'auto' : 'none' }}
        onClick={(event) => {
          event.stopPropagation();
          handleChecklistArchive();
        }}
      >
        {isEnabled && <ArchiveIcon width={45} color={theme.palette.button.text.greyText} />}
      </IconButton>
      <IconButton aria-label="delete" sx={{ width: 45 }} onClick={() => navigate(`/checklists/edit/${id}`)}>
        <EditIcon width={45} color={theme.palette.button.text.greyText} />
      </IconButton>
    </Grid>
  );
};

export default TableActionButtons;
