import * as yup from 'yup';

export const AddServiceTypeSchema = yup.object().shape({
  type: yup
    .string()
    .matches(/^[a-zA-Z0-9 _-]+$/, 'Invalid service type. Only letters, numbers, spaces, underscores, and hyphens are allowed.'),
  description: yup.string().required('Please Enter Description!'),
});
