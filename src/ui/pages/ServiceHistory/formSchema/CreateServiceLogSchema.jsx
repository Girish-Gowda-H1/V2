import * as yup from 'yup';

export const CreateServiceLogSchema = yup.object().shape({
    registration: yup.string().required('Vehicle Registration is required'),
    odo_reading: yup
      .number()
      .required('Odometer Reading is required')
      .positive('Odometer Reading must be a positive number')
      .typeError('Odometer Reading must be a number'),
    service_type: yup.string().required('Service Type is required'),
    service_date: yup.string().required('Service Date is required'),
    service_vendor: yup.string().required('Service Vendor is required'),
    // service_projection: yup.string().required('Service Projection is required'),
    service_description: yup.string().required('Service Description is required'),



    cost_of_service: yup
      .number()
      .notRequired()
      .nullable()
      .positive('Cost of Service must be a positive number'),
    spare_part_charges: yup.string()
    .nullable()
    .test('discount', 'Discount must be a number', value => {
      if (value === null || value?.match(/^\d+$/)) {
        return true;
      }
      return value >= 0
    }),
    // labor_charges: yup.number().notRequired().positive('Labor Charges must be a positive number').typeError('Labor Charges must be a number'),
    // discount: yup.number().notRequired().nullable().positive('Discount must be a positive number').typeError('Discount must be a number').min(0, 'Discount must be greater than or equal to 0'),
    discount: yup.string()
    .nullable()
    .test('discount', 'Discount must be a number', value => {
      if (value === null || value?.match(/^\d+$/)) {
        return true;
      }
      return value >= 0
    }),
    taxes: yup.number().required('Taxes are required').positive('Taxes must be a positive number').typeError('Taxes must be a number'),
    spare_taxes: yup.number().required('Spare Taxes are required').positive('Spare Taxes must be a positive number').typeError('Spare Taxes must be a number'),
    actual_total_cost: yup
      .number()
      .required('Actual Total Cost is required')
      .positive('Actual Total Cost must be a positive number')
      .typeError('Actual Total Cost must be a number'),
    invoice_date: yup.string().required('Invoice Date is required'),
    invoice_number: yup.string().required('Invoice Number is required'),
    billed_to: yup.string().required('Billed to is required'),
    remarks: yup.string().required('Remarks are required'),
  });