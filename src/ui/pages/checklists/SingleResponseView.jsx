import { Box, Button, Grid, IconButton, MenuItem, Modal, Typography, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';
import { Fragment, useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomCard from '@components/common/CustomCard';
import FormInputField from '@components/forms/FormInputField';
import FormSwitchField from '@components/forms/FormSwitchField';
import { questionTypes } from '@constants';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import ResponseOptionComponent from '@components/checklists/ResponseOptionComponent';
import usePostApi from '@hooks/usePostApi';

import '../../themes/fonts.css';

import LeftDirection from '@assets/svgs/LeftDirection';
import RightDirection from '@assets/svgs/RightDirection';
import BikeFallback from '@assets/images/bike-fallback.png';
import { useToastContext } from '@context/ToastContextProvider';

export default function SingleResponseView() {
  const [searchParams] = useSearchParams();

  const { setSnackbar } = useToastContext();

  const theme = useTheme();

  const navigate = useNavigate();

  const { func: patchChecklistResponseStatus } = usePostApi({ url: 'checklist_response_status_update', method: 'patch' });

  const fetchData = useCallback(async () => {
    return await axios.get(`single_response_view?response_id=${searchParams.get('response_id')}`).then((res) => {
      const filteredQuestionsData = res.data.questions_data.map((item) => {
        if (item?.question_type === 'text' || item?.question_type === 'short_text' || item?.question_type === 'decimal_input') {
          item.response = item?.response[0];
        }
        return item;
      });
      const filteredRes = { ...res.data.basic_info, questions: filteredQuestionsData };
      return filteredRes;
    });
  }, [searchParams]);

  const methods = useForm({
    defaultValues: async () => await fetchData(),
  });

  const { getValues, control, watch } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'questions',
  });

  const handleChecklistResponse = (status) => {
    patchChecklistResponseStatus({ url: `checklist_response_status_update?response_id=${searchParams.get('response_id')}&status=${status}` }).then(
      (res) => {
        if (res.data.status) {
          setSnackbar({
            show: true,
            autohide: true,
            autohideDuration: 3000,
            message: status === 'accepted' ? 'Checklist accepted successfully!' : 'Checklist rejected successfully!',
            variant: 'success',
            vertical: 'bottom',
          });
          navigate('/checklists/responses');
        }
      }
    );
    return null;
  };

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

  return (
    <Box
      sx={{
        '& .MuiGrid-root': {
          mb: 1,
        },
      }}
    >
      <FormProvider {...methods}>
        <CustomCard
          sx={{
            px: 0,
            '& .MuiCardContent-root': {
              pb: 0,
            },
            mb: '0 !important',
          }}
          cardContentProps={{ sx: { paddingY: '40px !important', paddingX: 0 } }}
        >
          <Grid container alignItems="center" sx={{ mb: '0 !important' }}>
            <Grid item sm={5} p={3} container justifyContent="center" position="relative" sx={{ mb: '0 !important' }}>
              <Box
                sx={{
                  width: 260,
                  height: 260,
                  backgroundImage: `url(${BikeFallback})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              ></Box>
              <Box sx={{ width: 170, height: 170, borderRadius: '50%', background: theme.palette.yellowSecondary }}></Box>
            </Grid>
            <Grid item sm={7}>
              <Typography
                variant="h1"
                fontSize="28px"
                width="max-content"
                letterSpacing="1.2px"
                color="#222222"
                mb={5}
                pb={1}
                borderBottom="3px solid"
                borderColor={theme.palette.yellowPrimary}
              >
                VEHICLE DETAILS
              </Typography>
              <Grid container alignItems="center" columnGap={1}>
                <Grid item>
                  <Typography variant="h5" fontWeight="bold" fontSize="18px" color="#5C5C5C" letterSpacing="0.9px">
                    Vehicle Brand:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4" color="#000000" fontSize="18px" letterSpacing="0.9px">
                    {getValues('bike_brand')}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container alignItems="center" columnGap={1}>
                <Grid item>
                  <Typography variant="h5" fontWeight="bold" color="#5C5C5C" fontSize="18px" letterSpacing="0.9px">
                    Vehicle Model:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4" color="#000000" fontSize="18px" letterSpacing="0.9px">
                    {getValues('bike_model')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CustomCard>

        {/* Main Form */}

        <CustomCard sx={{ px: 0 }} cardContentProps={{ sx: { paddingTop: 0, paddingX: 0 } }}>
          <CustomCard sx={{ margin: 0, paddingX: '30px', background: theme.palette.yellowSecondary }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <FormInputField
                fullWidth={false}
                sx={{
                  flex: 1,
                  '& input': {
                    fontFamily: 'MulishExtraBold',
                  },
                }}
                inputStyles={{ fontSize: '24px', letterSpacing: '2px' }}
                className="no-border"
                name="checklist_name"
                placeholder="Sample Checklist Name"
                InputProps={{
                  readOnly: true,
                }}
              />
              <FormSwitchField
                name="is_checklist_important"
                variant="rb-white-primary"
                noPointerEvents={true}
                label={
                  <Typography variant="h4" sx={{ ml: 1 }} fontSize="20px">
                    Important
                  </Typography>
                }
              />
            </Grid>
          </CustomCard>
          <Box px={7} pb={3} pt={5}>
            <FormInputField
              InputProps={{
                readOnly: true,
              }}
              inputStyles={{
                fontSize: '20px',
              }}
              sx={{
                '& .MuiInputBase-root': {
                  paddingBottom: '10.5px !important',
                },
              }}
              className="only-border"
              name="checklist_description"
              multiline
              maxRows={Infinity}
              placeholder="Description"
            />
          </Box>
        </CustomCard>

        {fields.map((field, index) => {
          return (
            <Fragment key={field.id}>
              <Grid container columnGap={2} mt={4}>
                <CustomCard sx={{ flex: 1, marginTop: 0, paddingX: '30px' }}>
                  {/* Question and Question Type Dropdown */}
                  <Grid container justifyContent="space-between" alignItems="center" columnGap={8} mb={4}>
                    <Grid item sm={8}>
                      <FormInputField
                        inputStyles={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1.8px' }}
                        sx={{
                          '& input': {
                            fontFamily: 'MulishBold',
                          },
                        }}
                        className="only-border"
                        name={`questions.${index}.question`}
                        placeholder="Your Question"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <FormInputField
                        select
                        defaultValue=""
                        InputProps={{
                          readOnly: true,
                        }}
                        inputStyles={{ fontSize: '20px' }}
                        SelectProps={{
                          IconComponent: () => null,
                        }}
                        label={questionTypeValue(index) ? '' : 'Select Input Type'}
                        className="rb-primary-select"
                        name={`questions.${index}.question_type`}
                        sx={{
                          borderRadius: '8px',
                          height: '50px',
                        }}
                      >
                        {questionTypes.map(({ value, label, icon: Icon }) => {
                          return (
                            <MenuItem key={value} value={value}>
                              <IconButton>
                                <Icon color="black" />
                              </IconButton>
                              <Typography variant="h5" ml={1}>
                                {label}
                              </Typography>
                            </MenuItem>
                          );
                        })}
                      </FormInputField>
                    </Grid>
                  </Grid>

                  {/* Question Preview */}
                  <Box mt={4} px={3}>
                    <QuestionPreview questionIndex={index} questionTypeValue={questionTypeValue} />
                  </Box>

                  {/* Add Media Section */}
                  {mediaTypeValue(index) ? (
                    <Grid container px={3}>
                      <AddMediaSection questionIndex={index} mediaTypeValue={mediaTypeValue} />
                    </Grid>
                  ) : null}

                  {/* Footer Actions */}
                  <Grid container justifyContent="end">
                    <Grid container width="max-content" alignItems="center" columnGap={1}>
                      <FormSwitchField
                        name={`questions.${index}.is_question_required`}
                        variant="rb-purple-primary"
                        label={
                          <Typography variant="h4" fontSize="16px" ml={1.5}>
                            Required
                          </Typography>
                        }
                        sx={{ ml: 1, pointerEvents: 'none' }}
                        noPointerEvents={true}
                      />
                    </Grid>
                  </Grid>
                </CustomCard>
              </Grid>
            </Fragment>
          );
        })}

        {!(getValues('status') === 'accepted' || getValues('status') === 'rejected') ? (
          <Grid container justifyContent="space-between">
            <Button
              variant="rb-grey-contained"
              sx={{
                p: '18px 36px',
                background: theme.palette.redPrimary,
                color: theme.palette.common.white,
                ':hover': {
                  background: theme.palette.redPrimary,
                  color: theme.palette.common.white,
                },
              }}
              onClick={() => handleChecklistResponse('rejected')}
            >
              <Typography variant="h3" fontSize="20px">
                Reject Response
              </Typography>
            </Button>
            <Button
              variant="rb-grey-contained"
              sx={{
                p: '18px 36px',
                background: theme.palette.yellowPrimary,
                color: theme.palette.common.black,
                ':hover': {
                  background: theme.palette.yellowPrimary,
                  color: theme.palette.common.black,
                },
              }}
              onClick={() => handleChecklistResponse('accepted')}
            >
              <Typography variant="h3" fontSize="20px">
                Accept Response
              </Typography>
            </Button>
          </Grid>
        ) : null}
      </FormProvider>
    </Box>
  );
}

const AddMediaSection = ({ questionIndex, mediaTypeValue }) => {
  const mediaType = mediaTypeValue(questionIndex);

  const renderableComponent = () => {
    if (mediaType === 'image' || mediaType === 'multiple_images') {
      return <ImagesComponent questionIndex={questionIndex} />;
    } else if (mediaType === 'video') {
      return <VideoComponent questionIndex={questionIndex} />;
    } else if (mediaType === 'audio') {
      return <AudioComponent questionIndex={questionIndex} />;
    }
  };

  return (
    <Grid container flexDirection="column" rowGap={3} wrap="nowrap">
      <Grid item sm={5}>
        <FormInputField
          name={`questions.${questionIndex}.media_instruction`}
          placeholder="No Instructions"
          className="only-border"
          sx={{
            '& input': {
              fontSize: '16px',
              fontFamily: 'MulishRegular',
              letterSpacing: '0.8px',
            },
          }}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item>{renderableComponent()}</Grid>
    </Grid>
  );
};

const VideoComponent = ({ questionIndex }) => {
  const [open, setOpen] = useState(false);

  const [videoID, setVideoID] = useState(0);

  const { getValues } = useFormContext();
  const allVideos = { ...getValues(`questions.${questionIndex}.media`) };
  const registrationNumber = getValues(`bike_reg_no`);
  const question = getValues(`questions.${questionIndex}.question`);

  const theme = useTheme();

  return (
    <Fragment>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ width: 150, height: 150, boxShadow: `0px 0px 6px ${theme.palette.shadowPrimary}`, borderRadius: 4 }}
      >
        <IconButton onClick={() => setOpen(true)}>
          <PlayArrowIcon sx={{ fontSize: 80 }} color="black" />
        </IconButton>
      </Grid>
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 550,
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          {allVideos[videoID - 1] ? (
            <IconButton onClick={() => setVideoID(Number(videoID) - 1)}>
              <ArrowBackIosIcon sx={{ fontSize: '25px', fontWeight: 'bold' }} />
            </IconButton>
          ) : null}

          <Grid
            container
            flexDirection="column"
            justifyContent="center"
            flexWrap="nowrap"
            sx={{
              width: 550,
              height: 500,
              borderRadius: 4,
              background: theme.palette.yellowSecondary,
            }}
          >
            <Grid container flexDirection="column" sx={{ padding: '23px' }}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid container>
                  <Grid item flex={1}>
                    <Typography variant="h3" letterSpacing="1.25px">
                      {registrationNumber}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => setOpen(false)}
                      sx={{
                        textAlign: 'end !important',
                      }}
                    >
                      <CloseIcon
                        sx={{
                          color: '#222222',
                          fontSize: '28px',
                          fontWeight: 'bold',
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Typography variant="mulishMedium" fontSize="18px" letterSpacing="1px">
                {question}
              </Typography>
            </Grid>
            <Box
              sx={{
                width: 550,
                height: 500,
                overflow: 'hidden',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: 4,
              }}
            >
              <video width="550" height="400" controls style={{ backgroundColor: '#ffffff' }}>
                <source src={allVideos[videoID]} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            </Box>
          </Grid>

          {allVideos[videoID + 1] ? (
            <IconButton onClick={() => setVideoID(Number(videoID) + 1)}>
              <ArrowForwardIosIcon sx={{ fontSize: '25px', fontWeight: 'bold' }} />
            </IconButton>
          ) : null}
        </Grid>
      </Modal>
    </Fragment>
  );
};

const ImagesComponent = ({ questionIndex }) => {
  const [imageId, setImageId] = useState(null);

  const { getValues } = useFormContext();
  const theme = useTheme();

  const allImages = { ...getValues(`questions.${questionIndex}.media`) };
  const registrationNumber = getValues(`bike_reg_no`);
  const question = getValues(`questions.${questionIndex}.question`);

  const isBackEnabled = Boolean(allImages[Number(imageId) - 1]);
  const isForwardEnabled = Boolean(allImages[Number(imageId) + 1]);

  return (
    <Fragment>
      <Grid container columnGap={2} rowGap={2}>
        {Object.keys(allImages).map((item) => {
          return (
            <Box
              key={item}
              sx={{
                width: 120,
                height: 120,
                backgroundImage: `url(${allImages[item]})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: 4,
              }}
              onClick={() => setImageId(item)}
            ></Box>
          );
        })}
      </Grid>
      <Modal open={Boolean(imageId)} onClose={() => setImageId(null)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          columnGap={4}
        >
          <Box
            sx={{
              p: 1,
              paddingLeft: 0.8,
              paddingRight: 1.2,
              borderRadius: '50%',
              background: theme.palette.yellowPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: isBackEnabled ? 'auto' : 'none',
              opacity: isBackEnabled ? '100%' : '0%',
            }}
            onClick={() => setImageId(String(Number(imageId) - 1))}
          >
            <IconButton>
              <LeftDirection width={20} />
            </IconButton>
          </Box>

          <Grid
            container
            flexDirection="column"
            justifyContent="center"
            flexWrap="nowrap"
            sx={{
              width: 550,
              height: 500,
              borderRadius: 4,
              background: theme.palette.yellowSecondary,
            }}
          >
            <Grid
              container
              flexDirection="column"
              sx={{
                padding: '23px',
              }}
            >
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid container>
                  <Grid item flex={1}>
                    <Typography variant="h3" letterSpacing="1.25px">
                      {registrationNumber}
                    </Typography>
                  </Grid>
                  <Grid item width="max-content">
                    <IconButton onClick={() => setImageId(null)} sx={{ ml: 'auto' }}>
                      <CloseIcon
                        sx={{
                          color: '#222222',
                          fontSize: '28px',
                          fontWeight: 'bold',
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Typography variant="mulishMedium" fontSize="18px" letterSpacing="1px">
                {question}
              </Typography>
            </Grid>
            <Box
              sx={{
                width: 550,
                height: 500,
                backgroundImage: `url(${allImages[imageId]})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: 4,
              }}
            />
          </Grid>

          <Box
            sx={{
              p: 1,
              borderRadius: '50%',
              background: theme.palette.yellowPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: isForwardEnabled ? 'auto' : 'none',
              opacity: isForwardEnabled ? '100%' : '0%',
            }}
            onClick={() => setImageId(String(Number(imageId) + 1))}
          >
            <IconButton>
              <RightDirection width={20} />
            </IconButton>
          </Box>
        </Grid>
      </Modal>
    </Fragment>
  );
};

const AudioComponent = ({ questionIndex }) => {
  const { getValues } = useFormContext();

  const audioSource = getValues(`questions.${questionIndex}.media`)[0];

  return (
    <audio id="myAudio" controls>
      <source src={audioSource} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

const QuestionPreview = ({ questionIndex, questionTypeValue }) => {
  const renderableComponent = () => {
    const value = questionTypeValue(questionIndex);
    if (value === 'text' || value === 'short_text' || value === 'decimal_input') {
      return <TextInput questionIndex={questionIndex} />;
    } else if (value === 'radio_button' || value === 'checkbox') {
      return <ResponseOptionComponent questionTypeValue={value} nestIndex={questionIndex} />;
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

const TextInput = ({ questionIndex }) => {
  return (
    <Grid container>
      <Grid item sm={8}>
        <FormInputField
          sx={{
            pointerEvents: 'none',
            '& input': {
              fontSize: '20px',
              fontFamily: 'MulishSemiBold',
              letterSpacing: '1px',
            },
          }}
          className="only-border"
          name={`questions.${questionIndex}.response`}
          placeholder="Short Text Answer"
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
    </Grid>
  );
};
