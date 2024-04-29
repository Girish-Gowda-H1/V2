import { Fragment, useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Box, Grid, InputAdornment, TextField, Tooltip, useTheme } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import axios from 'axios';

import useFetchApi from '@hooks/useFetchApi';
import FormInputField from '@components/forms/FormInputField';
import RoundedSvgIcon from './RoundedSvgIcon';
import DeleteIcon from '@assets/svgs/DeleteIcon';
import ImageIcon from '@assets/svgs/ImageIcon';

const AddOptionComponent = ({ nestIndex, questionTypeValue }) => {
  const { control, getValues, setValue, resetField, watch } = useFormContext();

  const {
    fields,
    append: addOptions,
    remove,
  } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`,
  });

  const addOption = useCallback(() => {
    addOptions();
  }, [addOptions]);

  const removeOption = useCallback(
    (optionId) => {
      remove(optionId);
    },
    [remove]
  );

  const theme = useTheme();

  const { func: postImageToS3 } = useFetchApi({ key: ['generate_s3_link'], url: 'generate_s3_link', fetchOnMount: false });

  const handleMediaUpload = async (file, targetUrl) => {
    if (file) {
      postImageToS3().then(async (res) => {
        const { url, key } = res.data.data;

        if (url) {
          await axios.put(url, file, { headers: { 'Content-Type': file.type } }).then((s3Res) => {
            if (s3Res.status === 200) {
              setValue(targetUrl('reference_media'), key, { shouldDirty: true });
              setValue(targetUrl('is_reference_media'), true, { shouldDirty: true });
            }
          });
        }
      });
    }
  };

  return (
    <Fragment>
      <Grid container flexDirection="column">
        {fields.map((field, index) => {
          const referenceMediaTarget = `questions.${nestIndex}.options.${index}.reference_media`;
          const targetUrl = (item) => `questions.${nestIndex}.options.${index}.${item}`;
          const imageUrl = getValues(referenceMediaTarget) || getValues(targetUrl('blobUrl'));
          const blobUrl = getValues(targetUrl('blobUrl'));
          const referenceMediaUrl = getValues(targetUrl('url'));

          resetField(referenceMediaTarget);
          watch(referenceMediaTarget);

          return (
            <Fragment key={field.id}>
              <Grid container wrap="nowrap" alignItems="stretch" mt={0.8} mb={0.8}>
                <FormInputField
                  name={`questions.${nestIndex}.options.${index}.value`}
                  placeholder={`Option ${index + 1}`}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input:hover + fieldset': {
                      borderRadius: '0px',
                      borderBottom: '1px solid' + theme.palette.input.borderBottom + '!important',
                    },
                    '& .MuiInputBase-input:focus + fieldset': {
                      borderRadius: '0px',
                      borderBottom: '2px solid' + theme.palette.purplePrimary + '!important',
                    },
                  }}
                  InputProps={{
                    startAdornment:
                      questionTypeValue === 'radio_button' ? (
                        <InputAdornment position="start">
                          <RadioButtonUncheckedIcon sx={{ opacity: '30%' }} />
                        </InputAdornment>
                      ) : (
                        <InputAdornment position="start">
                          <CheckBoxOutlineBlankIcon sx={{ opacity: '30%' }} />
                        </InputAdornment>
                      ),
                  }}
                  startIcon={questionTypeValue === 'radio_button' ? RadioButtonUncheckedIcon : CheckBoxOutlineBlankIcon}
                  inputStyles={{ paddingLeft: 0, fontSize: 18 }}
                  className="no-border"
                  index={index}
                />
                <Tooltip title="Upload an image" placement="right" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                    <TextField
                      type="file"
                      sx={{ position: 'absolute', inset: 0, opacity: 0 }}
                      name={referenceMediaTarget}
                      InputProps={{
                        title: '',
                      }}
                      onChange={({ target: { files } }) => {
                        const blobUrl = URL.createObjectURL(files[0]);
                        setValue(targetUrl('blobUrl'), blobUrl);
                        setValue(targetUrl('is_reference_media'), false, { shouldDirty: true });
                        setValue(referenceMediaTarget, '', { shouldDirty: true });
                        handleMediaUpload(files[0], targetUrl);
                      }}
                    />
                    <ImageIcon width={24} color="#9ea0a0" />
                  </Box>
                </Tooltip>
                {fields.length > 1 ? (
                  <CloseIcon
                    sx={{
                      fontSize: 24,
                      ml: 2,
                      mt: 1.25,
                      cursor: 'pointer',
                      color: theme.palette.accentGrey,
                    }}
                    onClick={() => {
                      setValue(referenceMediaTarget, '', { shouldDirty: true });
                      removeOption(index);
                    }}
                  />
                ) : null}
              </Grid>
              <BlobImageComponent
                blobUrl={blobUrl}
                targetUrl={targetUrl}
                imageUrl={imageUrl}
                handleMediaUpload={handleMediaUpload}
                referenceMediaTarget={referenceMediaTarget}
                referenceMediaUrl={referenceMediaUrl}
              />
            </Fragment>
          );
        })}
      </Grid>
      <Grid item marginLeft="auto">
        <TextField
          className="no-border"
          size="large"
          value=""
          InputProps={{
            startAdornment:
              questionTypeValue === 'radio_button' ? (
                <InputAdornment position="start">
                  <RadioButtonUncheckedIcon sx={{ opacity: '30%' }} />
                </InputAdornment>
              ) : (
                <InputAdornment position="start">
                  <CheckBoxOutlineBlankIcon sx={{ opacity: '30%' }} />
                </InputAdornment>
              ),
            inputProps: {
              style: { paddingLeft: 0, fontSize: 18, caretColor: 'transparent' },
            },
          }}
          placeholder="Add option"
          sx={{
            '& *': {
              cursor: 'pointer',
            },
            textDecoration: 'none',
            ':hover': {
              textDecoration: 'none',
            },
            '& button': {
              pl: 0,
            },
            '& .MuiInputBase-root': {
              pl: 0,
            },
          }}
          onClick={addOption}
        >
          Add Option
        </TextField>
      </Grid>
    </Fragment>
  );
};

const BlobImageComponent = ({ referenceMediaUrl, blobUrl, targetUrl, referenceMediaTarget }) => {
  const [blobImage, setBlobImage] = useState('');

  const { setValue } = useFormContext();

  const blobVerifier = useCallback(
    async (url) => {
      try {
        const blob = await fetch(url);
        if (!blob.ok) {
          URL.revokeObjectURL(url);
          setValue(referenceMediaTarget, '');
          return false;
        } else {
          setBlobImage(url);
          return url;
        }
      } catch (error) {
        URL.revokeObjectURL(url);
        setValue(referenceMediaTarget, '');
        return false;
      }
    },
    [referenceMediaTarget, setValue]
  );

  useEffect(() => {
    blobVerifier(blobUrl);
  }, [blobVerifier, blobUrl]);

  return blobImage || referenceMediaUrl ? (
    <Grid container alignItems="center" my={3}>
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${blobImage || referenceMediaUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 4,
          width: 100,
          height: 100,
          mr: 2,
        }}
      >
        <RoundedSvgIcon
          icon={DeleteIcon}
          onClick={() => {
            setValue(referenceMediaTarget, '', { shouldDirty: true });
            setValue(targetUrl('is_reference_media'), false, { shouldDirty: true });
            setValue(targetUrl('blobUrl'), '', { shouldDirty: true });
            setValue(targetUrl('url'), '');
          }}
          sx={{ position: 'absolute', right: 0, top: 0, transform: 'translate(50%, -50%)' }}
        />
      </Box>
    </Grid>
  ) : null;
};

export default AddOptionComponent;
