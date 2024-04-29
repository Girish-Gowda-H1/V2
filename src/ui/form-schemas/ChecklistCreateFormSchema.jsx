import * as yup from 'yup';

export const ChecklistCreateFormSchema = yup.object().shape({
  checklist_name: yup.string().required('Checklist name is required'),

  is_checklist_important: yup.boolean().required('Please indicate if the checklist is important'),

  checklist_icon: yup.string().required('Icon is required'),

  questions: yup.array().of(
    yup.object().shape({
      question_type: yup.string().required('Question type is required'),
      question: yup.string().required('Question is required'),

      options: yup.array().when('question_type', (question_type, schema) => {
        if (question_type[0] === 'checkbox' || question_type[0] === 'radio_button') {
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

      is_media: yup.boolean().default(false),

      media_type: yup.string().when('is_media', (is_media, schema) => {
        if (is_media[0]) {
          return schema.required('Media type is required');
        }
        return schema;
      }),

      is_media_required: yup.boolean().default(false),

      media_instruction: yup.string(),
    })
  ),
});
