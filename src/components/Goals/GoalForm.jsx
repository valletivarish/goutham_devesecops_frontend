import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { goalSchema } from '../../utils/validators';
import { formatDateForInput } from '../../utils/formatters';
import * as goalService from '../../services/goalService';
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

const GoalForm = ({ goal, onClose, onSuccess }) => {
  const [serverError, setServerError] = useState('');
  const isEditing = !!goal;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(goalSchema),
    defaultValues: {
      name: goal?.name || '',
      targetAmount: goal?.targetAmount || '',
      currentAmount: goal?.currentAmount || 0,
      deadline: formatDateForInput(goal?.deadline) || '',
      status: goal?.status || 'ACTIVE',
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      if (isEditing) {
        await goalService.update(goal.id, data);
        toast.success('Goal updated successfully.');
      } else {
        await goalService.create(data);
        toast.success('Goal created successfully.');
      }
      onSuccess();
    } catch (err) {
      const message = err?.message || 'Failed to save goal.';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>
            {isEditing ? 'Edit Goal' : 'Add Goal'}
          </h2>
          <button style={modalStyles.closeBtn} onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        <ErrorMessage message={serverError} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="name">Goal Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Emergency Fund, Vacation"
              style={{
                ...modalStyles.input,
                ...(errors.name ? modalStyles.inputError : {}),
              }}
              {...register('name')}
            />
            {errors.name && <p style={modalStyles.fieldError}>{errors.name.message}</p>}
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="targetAmount">Target Amount</label>
            <input
              id="targetAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              style={{
                ...modalStyles.input,
                ...(errors.targetAmount ? modalStyles.inputError : {}),
              }}
              {...register('targetAmount')}
            />
            {errors.targetAmount && <p style={modalStyles.fieldError}>{errors.targetAmount.message}</p>}
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="currentAmount">Current Amount</label>
            <input
              id="currentAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              style={{
                ...modalStyles.input,
                ...(errors.currentAmount ? modalStyles.inputError : {}),
              }}
              {...register('currentAmount')}
            />
            {errors.currentAmount && <p style={modalStyles.fieldError}>{errors.currentAmount.message}</p>}
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              type="date"
              style={{
                ...modalStyles.input,
                ...(errors.deadline ? modalStyles.inputError : {}),
              }}
              {...register('deadline')}
            />
            {errors.deadline && <p style={modalStyles.fieldError}>{errors.deadline.message}</p>}
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="status">Status</label>
            <select
              id="status"
              style={{
                ...modalStyles.select,
                ...(errors.status ? modalStyles.inputError : {}),
              }}
              {...register('status')}
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {errors.status && <p style={modalStyles.fieldError}>{errors.status.message}</p>}
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

export default GoalForm;
