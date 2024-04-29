import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Grid, useTheme } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import FormInputField from '@components/forms/FormInputField';

const ResponseOptionComponent = ({ nestIndex, questionTypeValue }) => {
  const { control, getValues, resetField, watch } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`,
  });

  return (
    <Fragment>
      <Grid container flexDirection="column">
        {fields.map((field, index) => {
          const referenceMediaTarget = `questions.${nestIndex}.options.${index}.reference_media`;
          const isChecked = getValues(`questions.${nestIndex}.response`).includes(getValues(`questions.${nestIndex}.options.${index}`));

          const startIcon = () => {
            if (questionTypeValue === 'radio_button') {
              if (isChecked) {
                return CheckedRadio;
              } else {
                return RadioButtonUncheckedIcon;
              }
            } else {
              if (isChecked) {
                return CheckedCheckbox;
              } else {
                return CheckBoxOutlineBlankIcon;
              }
            }
          };

          resetField(referenceMediaTarget);
          watch(referenceMediaTarget);

          return (
            <Fragment key={field.id}>
              <Grid container wrap="nowrap" alignItems="start">
                <Grid item sm={8}>
                  <FormInputField
                    name={`questions.${nestIndex}.options.${index}`}
                    placeholder={`Option ${index + 1}`}
                    sx={{
                      width: '100%',
                      '& input': {
                        padding: 0,
                        fontSize: '20px',
                        fontFamily: 'MulishSemiBold',
                      },
                    }}
                    startIcon={startIcon()}
                    inputStyles={{ paddingLeft: 0, fontSize: 18 }}
                    className="no-border"
                    index={index}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    </Fragment>
  );
};

const CheckedCheckbox = () => {
  const theme = useTheme();
  return <CheckBoxIcon sx={{ color: theme.palette.purplePrimary }} />;
};

const CheckedRadio = () => {
  const theme = useTheme();
  return <RadioButtonCheckedIcon sx={{ color: theme.palette.purplePrimary }} />;
};

export default ResponseOptionComponent;
