import * as yup from 'yup';

/**
 * Validation schema for transaction forms.
 */
export const transactionSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least 0.01')
    .max(999999999.99, 'Amount must not exceed 999,999,999.99')
    .required('Amount is required'),
  type: yup
    .string()
    .oneOf(['INCOME', 'EXPENSE'], 'Type must be INCOME or EXPENSE')
    .required('Type is required'),
  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .nullable(),
  transactionDate: yup
    .date()
    .typeError('Transaction date must be a valid date')
    .max(new Date(), 'Transaction date cannot be in the future')
    .required('Transaction date is required'),
  categoryId: yup
    .number()
    .typeError('Category is required')
    .required('Category is required')
});

/**
 * Validation schema for budget forms.
 */
export const budgetSchema = yup.object().shape({
  amountLimit: yup
    .number()
    .typeError('Amount limit must be a number')
    .positive('Amount limit must be positive')
    .required('Amount limit is required'),
  period: yup
    .string()
    .required('Period is required'),
  startDate: yup
    .date()
    .typeError('Start date must be a valid date')
    .required('Start date is required'),
  categoryId: yup
    .number()
    .typeError('Category is required')
    .required('Category is required')
});

/**
 * Validation schema for category forms.
 */
export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters')
    .required('Name is required'),
  type: yup
    .string()
    .required('Type is required')
});

/**
 * Validation schema for goal forms.
 */
export const goalSchema = yup.object().shape({
  name: yup
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters')
    .required('Name is required'),
  targetAmount: yup
    .number()
    .typeError('Target amount must be a number')
    .positive('Target amount must be positive')
    .required('Target amount is required')
});

/**
 * Validation schema for login forms.
 */
export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

/**
 * Validation schema for registration forms.
 */
export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Must be a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});
