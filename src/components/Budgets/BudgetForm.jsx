import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { budgetSchema } from '../../utils/validators';
import { formatDateForInput } from '../../utils/formatters';
import * as budgetService from '../../services/budgetService';
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

const BudgetForm = ({ budget, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [serverError, setServerError] = useState('');
  const isEditing = !!budget;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(budgetSchema),
    defaultValues: {
      amountLimit: budget?.amountLimit || '',
      period: budget?.period || 'MONTHLY',
      startDate: formatDateForInput(budget?.startDate) || new Date().toISOString().split('T')[0],
      endDate: formatDateForInput(budget?.endDate) || '',
      categoryId: budget?.categoryId || budget?.category?.id || '',
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
      const payload = {
        ...data,
        endDate: data.endDate || null,
      };
      if (isEditing) {
        await budgetService.update(budget.id, payload);
        toast.success('Budget updated successfully.');
      } else {
        await budgetService.create(payload);
        toast.success('Budget created successfully.');
      }
      onSuccess();
    } catch (err) {
      const message = err?.message || 'Failed to save budget.';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>
            {isEditing ? 'Edit Budget' : 'Add Budget'}
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
              <label style={modalStyles.label} htmlFor="amountLimit">Amount Limit</label>
              <input
                id="amountLimit"
                type="number"
                step="0.01"
                placeholder="0.00"
                style={{
                  ...modalStyles.input,
                  ...(errors.amountLimit ? modalStyles.inputError : {}),
                }}
                {...register('amountLimit')}
              />
              {errors.amountLimit && <p style={modalStyles.fieldError}>{errors.amountLimit.message}</p>}
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="period">Period</label>
              <select
                id="period"
                style={{
                  ...modalStyles.select,
                  ...(errors.period ? modalStyles.inputError : {}),
                }}
                {...register('period')}
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
              {errors.period && <p style={modalStyles.fieldError}>{errors.period.message}</p>}
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                style={{
                  ...modalStyles.input,
                  ...(errors.startDate ? modalStyles.inputError : {}),
                }}
                {...register('startDate')}
              />
              {errors.startDate && <p style={modalStyles.fieldError}>{errors.startDate.message}</p>}
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label} htmlFor="endDate">End Date (Optional)</label>
              <input
                id="endDate"
                type="date"
                style={modalStyles.input}
                {...register('endDate')}
              />
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

export default BudgetForm;
