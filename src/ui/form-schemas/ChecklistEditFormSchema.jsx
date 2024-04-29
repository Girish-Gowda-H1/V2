import * as yup from 'yup';

export const ChecklistEditFormSchema = yup.object().shape({
  checklist_name: yup.string().required('Checklist name is required'),

  is_checklist_important: yup.boolean().required('Please indicate if the checklist is important'),

  checklist_icon: yup.string().required('Icon is required'),

  questions: yup.array().of(
    yup.object().shape({
      option_type: yup.string().required('Question type is required'),
      question: yup.string().required('Question is required'),

      is_question_required: yup.boolean().required(),

      options: yup.array().when('option_type', (option_type, schema) => {
        if (option_type[0] === 'checkbox' || option_type[0] === 'radio_button') {
          return schema
            .of(
              yup.object().shape({
                reference_media: yup.string(),
                value: yup.string().required('This is required'),
                is_reference_media: yup.boolean().default(false),
              })
            )
            .min(1, 'At least one option is required');
        }
        return schema;
      }),

      is_media: yup.boolean(),

      media_type: yup.string().when('is_media', (is_media, schema) => {
        if (is_media[0]) {
          return schema.required('Media type is required');
        }
        return schema;
      }),

      is_media_required: yup.boolean(),

      media_instruction: yup.string(),
    })
  ),
});
