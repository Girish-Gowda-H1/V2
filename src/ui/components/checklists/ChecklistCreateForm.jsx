// React
import { Fragment, useCallback, useRef, useState } from 'react';

// Mui Imports
import { Box, Button, Chip, Divider, Grid, IconButton, MenuItem, Tooltip, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// React Hook form
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
// import useFormPersist from 'react-hook-form-persist';
import { yupResolver } from '@hookform/resolvers/yup';

// Custom Hooks
import usePostApi from '@hooks/usePostApi';
import useFetchApi from '@hooks/useFetchApi';

// File Imports
import { questionTypes } from '@constants';
import FormInputField from '@components/forms/FormInputField';
import FormSwitchField from '@components/forms/FormSwitchField';
import CustomCard from '@components/common/CustomCard';
import CustomSwitchField from '@components/common/CustomSwitchField';
import { ChecklistCreateFormSchema } from '@schemas/ChecklistCreateFormSchema';
import AddOptionComponent from './AddOptionComponent';
import AssignChecklistDialog from './AssignChecklistDialog';
import RoundedSvgIcon from './RoundedSvgIcon';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from '@components/common/CustomSnackbar';
import CameraIcon from '@assets/svgs/CameraIcon';
import VideoIcon from '@assets/svgs/VideoIcon';
import MicrophoneIcon from '@assets/svgs/MicrophoneIcon';
import CopyIcon from '@assets/svgs/CopyIcon';
import DeleteIcon from '@assets/svgs/DeleteIcon';
import ErrorSnackbarIcon from '@assets/svgs/ErrorSnackbarIcon';
import SuccessSnackbarIcon from '@assets/svgs/SuccessSnackbarIcon';
import ImageIcon from '@assets/svgs/ImageIcon';
import axios from 'axios';
import { useToastContext } from '@context/ToastContextProvider';

export default function ChecklistCreateForm() {
  const [assignDialogId, setAssignDialogId] = useState(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showIconUploadSuccess, setShowIconUploadSuccess] = useState(false);
  const [checklistIcon, setChecklistIcon] = useState({ url: '', file: null });

  const theme = useTheme();
  const navigate = useNavigate();

  const { setSnackbar } = useToastContext();

  const checklistDialogRef = useRef();

  // const sessionChecklistForm = JSON.parse(sessionStorage.getItem('checklistForm'));

  const methods = useForm({
    resolver: yupResolver(ChecklistCreateFormSchema),
  });

  const {
    register,
    handleSubmit: submit,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
    clearErrors,
  } = methods;

  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  // useFormPersist('checklistForm', {
  //   watch,
  //   setValue,
  //   exclude: ['reference_media'],
  // });

  const { func: postFormData, isLoading: isFormSubmitting } = usePostApi({ url: 'create_checklist' });
  const { func: fetchchecklistIconUrl } = useFetchApi({
    key: ['s3_link_checklist_icon'],
    url: 's3_link_checklist_icon',
    fetchOnMount: false,
  });

  const addQuestion = useCallback(() => {
    append();
  }, [append]);

  const insertQuestion = useCallback(
    (questionIndex) => {
      const questionValues = getValues(`questions.${questionIndex}`);
      insert(questionIndex + 1, questionValues);
    },
    [getValues, insert]
  );

  const removeQuestion = useCallback(
    (optionId) => {
      remove(optionId);
    },
    [remove]
  );

  //////////////////// Question Input Change Actions

  const mediaTypeValue = useCallback(
    (questionIndex) => {
      return getValues(`questions.${questionIndex}.media_type`);
    },
    [getValues]
  );

  const questionTypeValue = useCallback(
    (index) => {
      return watch(`questions.${index}.question_type`);
    },
    [watch]
  );

  //////////////////// Checklist Icon Upload

  const handleChecklistIconUpload = async (file) => {
    await fetchchecklistIconUrl().then(async (res) => {
      const { url, key } = res.data.data;
      if (url) {
        await axios.put(url, file, { headers: { 'Content-Type': file.type } }).then((s3Res) => {
          if (s3Res.status === 200) {
            setValue('checklist_icon', key);
            clearErrors('checklist_icon');
            setChecklistIcon((prev) => ({ ...prev, file: null }));
            setShowIconUploadSuccess(true);
          }
        });
      }
    });
  };

  //////////////////// Final Form Submit

  const handleSubmit = (isDraft = false) => {
    const initialValues = getValues();
    const values = structuredClone(initialValues);

    values.questions.map((item) => {
      // Remove media_type, is_media_required, and media_instruction on is_media uncheck
      if (!item.is_media) {
        delete item['media_type'];
        delete item['is_media_required'];
        delete item['media_instruction'];
      }

      // Remove Options if question typs is not checkbox Or Radio
      if (!(item.question_type === 'checkbox' || item.question_type === 'radio_button')) {
        item.options = [];
      }

      if (item?.options?.length > 0) {
        item.options = item?.options?.filter((item) => Boolean(item));

        item.options.map((option) => {
          if (!('is_reference_media' in option)) {
            option.is_reference_media = false;
          }
          if (!('reference_media' in option)) {
            option.reference_media = '';
          }

          if (!option.reference_media) {
            option.is_reference_media = false;
          }
        });
      }

      item.is_media = item?.is_media || false;
    });

    postFormData({ url: 'create_checklist' + (isDraft ? '?is_draft=true' : ''), body: values }).then((finalRes) => {
      if (finalRes?.data.status) {
        if (isDraft) {
          navigate('/checklists/all');
          setSnackbar({
            show: true,
            autohide: true,
            autohideDuration: 3000,
            message: 'Checklist drafted successfully!',
            variant: 'success',
            vertical: 'bottom',
          });
        } else {
          setAssignDialogId(finalRes.data.checklist_id);
          setShowSuccessSnackbar(true);
          setTimeout(() => {
            setShowSuccessSnackbar(false);
          }, 3000);
        }
      }
    });
  };

  const isSubmitDisabled = watch('questions')?.length === 0;

  return (
    <Box sx={{ position: assignDialogId ? 'relative' : 'unset' }} height={assignDialogId ? '85vh' : 'auto'} ref={checklistDialogRef}>
      <FormProvider {...methods}>
        <CustomSnackbar
          open={showSuccessSnackbar}
          message="Checklist created successfully!"
          autoHide={true}
          autoHideDuration={3000}
          variant="success"
          vertical="bottom"
          startEdornment={<SuccessSnackbarIcon width={30} />}
        />

        <CustomSnackbar
          open={showIconUploadSuccess}
          message="Icon Uploaded successfully!"
          autoHide={true}
          autoHideDuration={3000}
          variant="success"
          vertical="bottom"
          startEdornment={<SuccessSnackbarIcon width={30} />}
        />

        <CustomSnackbar
          open={Boolean(Object.keys(errors).length)}
          message="Please validate this form!"
          autoHide={true}
          autoHideDuration={2000}
          variant="error"
          vertical="bottom"
          startEdornment={<ErrorSnackbarIcon width={30} />}
        />

        {assignDialogId ? (
          <AssignChecklistDialog
            checklistDialogRef={checklistDialogRef.current}
            open={Boolean(assignDialogId)}
            onClose={() => setAssignDialogId(null)}
            checklistId={assignDialogId}
          />
        ) : (
          <form onSubmit={submit(() => handleSubmit(false))} encType="multipart/form-data">
            <Grid container columnGap={2} alignItems="stretch">
              <Grid item xs={10}>
                <CustomCard
                  sx={{ px: 0, outlineStyle: 'solid', outlineColor: errors?.checklist_name ? 'red' : 'transparent' }}
                  cardContentProps={{ sx: { paddingTop: 0, paddingX: 0 } }}
                >
                  <CustomCard sx={{ margin: 0, background: theme.palette.yellowPrimary }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <FormInputField
                        fullWidth={false}
                        sx={{
                          flex: 1,
                          textTransform: 'uppercase',
                        }}
                        inputStyles={{ fontSize: '30px', fontWeight: '800', letterSpacing: '1.5px' }}
                        className="no-border"
                        name="checklist_name"
                        register={register}
                        placeholder="Untitled Checklist"
                      />
                      <FormSwitchField
                        name="is_checklist_important"
                        variant="rb-white-primary"
                        label={
                          <Typography variant="h4" sx={{ ml: 1 }}>
                            Important
                          </Typography>
                        }
                      />
                    </Grid>
                  </CustomCard>
                  <Box px={7} pb={3} pt={5}>
                    <FormInputField
                      className="only-border"
                      name="checklist_description"
                      multiline
                      maxRows={Infinity}
                      register={register}
                      inputStyles={{ fontSize: '20px', fontWeight: 'medium', letterSpacing: '.5px' }}
                      sx={{
                        '& .MuiInputBase-root': {
                          paddingBottom: '10.5px !important',
                        },
                      }}
                      placeholder="Add a checklist description"
                    />
                  </Box>
                </CustomCard>
              </Grid>
              <Grid item container alignItems="stretch" flex={1} className="ok" sx={{ paddingY: '1rem !important' }}>
                <Grid
                  container
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    position: 'relative',
                    flex: 1,
                    border: errors?.checklist_icon ? '3px solid #FF6141' : 'none',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px #00000034',
                  }}
                >
                  <ImageIcon width={60} />
                  <Typography variant="h4" mt={2}>
                    + Add Image
                  </Typography>
                  <Box
                    sx={{
                      backgroundImage: `url(${checklistIcon.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'absolute',
                      inset: '0',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        '& .upload-icon': {
                          display: checklistIcon.url ? 'block' : 'none',
                        },
                      },
                    }}
                  >
                    <input
                      type="file"
                      title=""
                      onChange={(event) => {
                        const iconBlob = URL.createObjectURL(event.target.files[0]);
                        setChecklistIcon({ file: event.target.files[0], url: iconBlob });
                        handleChecklistIconUpload(event.target.files[0]);
                      }}
                      style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }}
                    />
                  </Box>
                  {checklistIcon.url ? (
                    <RoundedSvgIcon
                      icon={DeleteIcon}
                      onClick={() => {
                        setValue('checklist_icon', '');
                        setChecklistIcon({ file: null, url: '' });
                      }}
                      sx={{ position: 'absolute', right: 0, top: 0, transform: 'translate(50%, -50%)' }}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
            {/* Single Question Card  */}

            {fields.map((field, index) => {
              return (
                <Fragment key={field.id}>
                  <Grid container columnGap={2} mt={4}>
                    <CustomCard
                      sx={{ flex: 1, marginTop: 0, border: '3px solid', borderColor: errors?.questions?.[index] ? '#FF6141' : 'transparent' }}
                    >
                      {/* Question and Question Type Dropdown */}
                      <Grid container justifyContent="space-between" alignItems="center" columnGap={8} mb={4}>
                        <Grid item flex={1}>
                          <FormInputField
                            inputStyles={{
                              fontSize: '24px',
                              '& input': {
                                fontFamily: 'MulishLight !important',
                                fontWeight: getValues(`questions.${index}.question`) ? '600' : '200',
                              },
                              letterSpacing: '1.2px',
                            }}
                            className="only-border"
                            register={register}
                            name={`questions.${index}.question`}
                            placeholder="Enter Question"
                          />
                        </Grid>
                        <Grid item sm={3} md={3} xs={4} flex={1}>
                          <FormInputField
                            select
                            defaultValue=""
                            label={questionTypeValue(index) ? '' : 'SELECT INPUT TYPE'}
                            className="rb-primary-select"
                            name={`questions.${index}.question_type`}
                            register={register}
                            sx={{
                              borderRadius: '8px',
                              height: '50px',
                            }}
                          >
                            {questionTypes.map(({ value, label, icon: Icon }) => {
                              return (
                                <MenuItem key={value} value={value} sx={{ px: 0.5 }} disableRipple>
                                  <IconButton>
                                    <Icon width={20} color="black" />
                                  </IconButton>
                                  <Typography variant="h5" ml={1} letterSpacing="0.4px">
                                    {label}
                                  </Typography>
                                </MenuItem>
                              );
                            })}
                          </FormInputField>
                        </Grid>
                      </Grid>

                      {/* Question Preview */}
                      <QuestionPreview questionIndex={index} questionTypeValue={questionTypeValue} />

                      {/* Add Media Section */}
                      {mediaTypeValue(index) ? (
                        <Grid container>
                          <AddMediaSection questionIndex={index} mediaTypeValue={mediaTypeValue} register={register} setValue={setValue} errors={errors} />
                        </Grid>
                      ) : null}

                      {/* Footer Actions */}
                      <Grid container justifyContent="end">
                        <FooterActionButtons questionIndex={index} insertQuestion={insertQuestion} removeQuestion={removeQuestion} />
                      </Grid>
                    </CustomCard>

                    <Grid container width="max-content" flexDirection="column" justifyContent="start" rowGap={2}>
                      <Tooltip title="Ask for supporting image/s">
                        <Box>
                          <RoundedSvgIcon
                            icon={CameraIcon}
                            isActive={mediaTypeValue(index) === 'image' || mediaTypeValue(index) === 'multiple_images'}
                            onClick={() => {
                              if (mediaTypeValue(index) === 'image' || mediaTypeValue(index) === 'multiple_images') {
                                setValue(`questions.${index}.media_type`, '');
                                setValue(`questions.${index}.is_media`, false);
                              } else {
                                setValue(`questions.${index}.media_type`, 'image');
                                setValue(`questions.${index}.is_media`, true);
                              }
                            }}
                          />
                        </Box>
                      </Tooltip>
                      <Tooltip title="Ask for supporting video">
                        <Box>
                          <RoundedSvgIcon
                            icon={VideoIcon}
                            isActive={mediaTypeValue(index) === 'video'}
                            onClick={() => {
                              if (mediaTypeValue(index) === 'video') {
                                setValue(`questions.${index}.media_type`, '');
                                setValue(`questions.${index}.is_media`, false);
                              } else {
                                setValue(`questions.${index}.media_type`, 'video');
                                setValue(`questions.${index}.is_media`, true);
                              }
                            }}
                          />
                        </Box>
                      </Tooltip>
                      <Tooltip title="Ask for supporting audio">
                        <Box>
                          <RoundedSvgIcon
                            icon={MicrophoneIcon}
                            isActive={mediaTypeValue(index) === 'audio'}
                            onClick={() => {
                              if (mediaTypeValue(index) === 'audio') {
                                setValue(`questions.${index}.media_type`, '');
                                setValue(`questions.${index}.is_media`, false);
                              } else {
                                setValue(`questions.${index}.media_type`, 'audio');
                                setValue(`questions.${index}.is_media`, true);
                              }
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Fragment>
              );
            })}

            <Grid container justifyContent="end">
              <Button variant="rb-yellow-outlined" onClick={addQuestion} startIcon={<AddIcon style={{ fontSize: 28 }} />}>
                Add a Question
              </Button>
            </Grid>

            {/* Submit */}
            <Grid container justifyContent="space-between" alignItems="center" mt={20} columnGap={3}>
              <Grid item>
                <Button
                  variant="text"
                  disabled={isFormSubmitting}
                  onClick={() => navigate('/checklists/all')}
                  sx={{ textDecorationColor: '#5C5C5C' }}
                >
                  <Typography variant="h5" color="#5c5c5c" letterSpacing="1px">
                    DISCARD
                  </Typography>
                </Button>
              </Grid>

              <Grid item container width="max-content" columnGap={3}>
                <Grid item>
                  <Button onClick={submit(() => handleSubmit(true))} variant="rb-teal-contained" disabled={isFormSubmitting} letterSpacing="1px">
                    Save Draft
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="rb-grey-contained"
                    sx={{
                      background: isSubmitDisabled ? '#DDDDDD' : theme.palette.yellowPrimary,
                      color: isSubmitDisabled ? '#5C5C5C' : '#222222',
                      pointerEvents: isSubmitDisabled ? 'none' : 'auto',
                      letterSpacing: '1px',
                      ':hover': {
                        background: isSubmitDisabled ? '#DDDDDD' : theme.palette.yellowPrimary,
                        color: isSubmitDisabled ? '#5C5C5C' : '#222222',
                      },
                    }}
                  >
                    Save & Assign Checklist
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </FormProvider>
    </Box>
  );
}

const QuestionPreview = ({ questionIndex, questionTypeValue }) => {
  const renderableComponent = () => {
    const value = questionTypeValue(questionIndex);
    if (value === 'short_text') {
      return <TextInput />;
    } else if (value === 'text') {
      return <ParagraphInput />;
    } else if (value === 'decimal_input') {
      return <NumericInput />;
    } else if (value === 'radio_button' || value === 'checkbox') {
      return <AddOptionComponent questionTypeValue={value} nestIndex={questionIndex} />;
    }
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center" columnGap={2}>
      <Grid item flex={1}>
        {renderableComponent()}
      </Grid>
    </Grid>
  );
};

const AddMediaSection = ({ questionIndex, mediaTypeValue, register , setValue }) => {
  const chipLabelMapping = {
    image: 'Ask for supporting image/s',
    multiple_images: 'Ask for supporting image/s',
    video: 'Ask for supporting video',
    audio: 'Ask for supporting audio',
  };

  const chipIconMapping = {
    image: CameraIcon,
    multiple_images: CameraIcon,
    video: VideoIcon,
    audio: MicrophoneIcon,
  };

  const theme = useTheme();

  return (
    <Fragment>
      <Grid container alignItems="center" mt={5} mb={2.5}>
        <Grid sx={{ position: 'relative' }}>
          <Chip
            sx={{ background: 'white', pl: 1, pr: 5, py: 2.5, boxShadow: `0px 0px 6px ${theme.palette.shadowPrimary}` }}
            label={
              <Typography variant="h5" fontWeight={500}>
                {chipLabelMapping[mediaTypeValue(questionIndex)]}
              </Typography>
            }
          />
          <RoundedSvgIcon
            icon={chipIconMapping[mediaTypeValue(questionIndex)]}
            sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translate(50%, -50%)', width: 50, height: 50 }}
          />
        </Grid>

        {mediaTypeValue(questionIndex) === 'image' || mediaTypeValue(questionIndex) === 'multiple_images' ? (
          <Grid ml={10}>
            <CustomSwitchField
              variant="rb-purple-primary"
              label={
                <Typography variant="h4" fontSize="16px" ml={1}>
                  Allow Multiple
                </Typography>
              }
              sx={{ ml: 1 }}
              onChange={({ target: { checked } }) => {
                setValue(`questions.${questionIndex}.media_type`, checked ? 'multiple_images' : 'image');
              }}
              defaultChecked={mediaTypeValue(questionIndex) === 'multiple_images'}
            />
          </Grid>
        ) : null}
      </Grid>
      <Grid container>
        <Grid item sm={5}>
          <FormInputField
            name={`questions.${questionIndex}.media_instruction`}
            placeholder="Add Media Instruction"
            register={register}
            sx={{
              ml: 2.5,
              '& input': {
                fontSize: '16px',
                letterSpacing: '0.8px',
              },
            }}
            className="only-border"
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const FooterActionButtons = ({ questionIndex, insertQuestion, removeQuestion }) => {
  const { getValues } = useFormContext();
  const theme = useTheme();

  return (
    <Grid container width="max-content" alignItems="center" columnGap={1}>
      <Tooltip title="Duplicate this question">
        <IconButton sx={{ width: 30, p: 0 }} onClick={() => insertQuestion(questionIndex)}>
          <CopyIcon width={30} color="black" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this question" placement="bottom">
        <IconButton sx={{ width: 30, p: 0 }} onClick={() => removeQuestion(questionIndex)}>
          <DeleteIcon width={30} color="black" />
        </IconButton>
      </Tooltip>
      <Grid item>
        <Divider orientation="vertical" flexItem />
      </Grid>
      <hr style={{ height: '32px', width: '2px', background: '#eeeeee' }} />
      <FormSwitchField
        name={`questions.${questionIndex}.is_question_required`}
        variant="rb-purple-primary"
        label={
          <Typography variant="h5" color={getValues(`questions.${questionIndex}.is_question_required`) ? 'black' : theme.palette.accentGrey}>
            Required
          </Typography>
        }
        sx={{ ml: 1 }}
      />
    </Grid>
  );
};

const TextInput = () => {
  return (
    <Grid container>
      <Grid item sm={8}>
        <FormInputField
          inputStyles={{
            fontSize: 20,
            '& input': {
              fontFamily: 'MulishLight',
              letterSpacing: '1.2px',
            },
          }}
          sx={{ pointerEvents: 'none' }}
          className="only-border"
          name="checklist_name_disabled"
          placeholder="Short Text Answer"
        />
      </Grid>
    </Grid>
  );
};

const ParagraphInput = () => {
  return (
    <Grid container mb={2}>
      <Grid item sm={8}>
        <FormInputField
          inputStyles={{
            fontSize: 20,
            '& input': {
              fontFamily: 'MulishLight',
              letterSpacing: '1.2px',
            },
          }}
          sx={{ pointerEvents: 'none' }}
          className="only-border"
          name="checklist_name_disabled"
          placeholder="Long Text Answer"
        />
        <FormInputField sx={{ pointerEvents: 'none' }} className="only-border" name="checklist_name_disabled" placeholder="" />
      </Grid>
    </Grid>
  );
};

const NumericInput = () => {
  return (
    <Grid container>
      <Grid item sm={8}>
        <FormInputField
          inputStyles={{
            fontSize: 20,
            '& input': {
              fontFamily: 'MulishLight',
              letterSpacing: '1.2px',
            },
          }}
          sx={{ pointerEvents: 'none' }}
          className="only-border"
          name="checklist_name_disabled"
          placeholder="Ask For Numeric Value"
        />
      </Grid>
    </Grid>
  );
};
