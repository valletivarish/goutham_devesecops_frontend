import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { transactionSchema } from '../../utils/validators';
import { formatDateForInput } from '../../utils/formatters';
import * as transactionService from '../../services/transactionService';
import * as categoryService from '../../services/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    width: '90%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: '4px',
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldError: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  disabledBtn: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
};

const TransactionForm = ({ transaction, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [serverError, setServerError] = useState('');
  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      amount: transaction?.amount || '',
      type: transaction?.type || 'EXPENSE',
      description: transaction?.description || '',
      transactionDate: formatDateForInput(transaction?.transactionDate) || new Date().toISOString().split('T')[0],
      categoryId: transaction?.categoryId || transaction?.category?.id || '',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      setServerError('');
      if (isEditing) {
        await transactionService.update(transaction.id, data);
        toast.success('Transaction updated successfully.');
      } else {
        await transactionService.create(data);
        toast.success('Transaction created successfully.');
      }
      onSuccess();
    } catch (err) {
      const message = err?.message || 'Failed to save transaction.';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button style={modalStyles.closeBtn} onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        <ErrorMessage message={serverError} />

        {loadingCategories ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                style={{
                  ...modalStyles.input,
                  ...(errors.amount ? modalStyles.inputError : {}),
                }}
                {...register('amount')}
              />
              {errors.amount && <p style={modalStyles.fieldError}>{errors.amount.message}</p>}
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="type">Type</label>
              <select
                id="type"
                style={{
                  ...modalStyles.select,
                  ...(errors.type ? modalStyles.inputError : {}),
                }}
                {...register('type')}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
              {errors.type && <p style={modalStyles.fieldError}>{errors.type.message}</p>}
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter a description"
                style={{
                  ...modalStyles.textarea,
                  ...(errors.description ? modalStyles.inputError : {}),
                }}
                {...register('description')}
              />
              {errors.description && <p style={modalStyles.fieldError}>{errors.description.message}</p>}
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="transactionDate">Date</label>
              <input
                id="transactionDate"
                type="date"
                style={{
                  ...modalStyles.input,
                  ...(errors.transactionDate ? modalStyles.inputError : {}),
                }}
                {...register('transactionDate')}
              />
              {errors.transactionDate && <p style={modalStyles.fieldError}>{errors.transactionDate.message}</p>}
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                style={{
                  ...modalStyles.select,
                  ...(errors.categoryId ? modalStyles.inputError : {}),
                }}
                {...register('categoryId')}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.type})
                  </option>
                ))}
              </select>
              {errors.categoryId && <p style={modalStyles.fieldError}>{errors.categoryId.message}</p>}
            </div>

            <div style={modalStyles.buttonRow}>
              <button type="button" style={modalStyles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...modalStyles.submitBtn,
                  ...(isSubmitting ? modalStyles.disabledBtn : {}),
                }}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
