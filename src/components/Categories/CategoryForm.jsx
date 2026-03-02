import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { categorySchema } from '../../utils/validators';
import * as categoryService from '../../services/categoryService';
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
    maxWidth: '440px',
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

const CategoryForm = ({ category, onClose, onSuccess }) => {
  const [serverError, setServerError] = useState('');
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      type: category?.type || 'EXPENSE',
      icon: category?.icon || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const payload = {
        ...data,
        icon: data.icon || null,
      };
      if (isEditing) {
        await categoryService.update(category.id, payload);
        toast.success('Category updated successfully.');
      } else {
        await categoryService.create(payload);
        toast.success('Category created successfully.');
      }
      onSuccess();
    } catch (err) {
      const message = err?.message || 'Failed to save category.';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>
            {isEditing ? 'Edit Category' : 'Add Category'}
          </h2>
          <button style={modalStyles.closeBtn} onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        <ErrorMessage message={serverError} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Category name"
              style={{
                ...modalStyles.input,
                ...(errors.name ? modalStyles.inputError : {}),
              }}
              {...register('name')}
            />
            {errors.name && <p style={modalStyles.fieldError}>{errors.name.message}</p>}
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
            <label style={modalStyles.label} htmlFor="icon">Icon (Optional)</label>
            <input
              id="icon"
              type="text"
              placeholder="e.g., shopping-cart, home"
              style={modalStyles.input}
              {...register('icon')}
            />
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
      </div>
    </div>
  );
};

export default CategoryForm;
