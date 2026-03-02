import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import * as goalService from '../../services/goalService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';
import GoalForm from './GoalForm';

const styles = {
  page: {
    maxWidth: '1200px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottom: '2px solid #e2e8f0',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
  },
  progressBarContainer: {
    width: '100%',
    minWidth: '100px',
    backgroundColor: '#e2e8f0',
    borderRadius: '8px',
    height: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '8px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '4px',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  statusInProgress: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  statusCancelled: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
  },
  editBtn: {
    color: '#2563eb',
  },
  deleteBtn: {
    color: '#dc2626',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '40px 20px',
    fontSize: '14px',
  },
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'COMPLETED':
      return styles.statusCompleted;
    case 'CANCELLED':
      return styles.statusCancelled;
    default:
      return styles.statusInProgress;
  }
};

const getProgressColor = (percentage) => {
  if (percentage >= 100) return '#16a34a';
  if (percentage >= 60) return '#2563eb';
  if (percentage >= 30) return '#f59e0b';
  return '#94a3b8';
};

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await goalService.getAll();
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err?.message || 'Failed to load goals.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await goalService.remove(confirmDelete.id);
      toast.success('Goal deleted successfully.');
      setConfirmDelete({ open: false, id: null });
      fetchGoals();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete goal.');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchGoals();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Financial Goals</h1>
        <button style={styles.addBtn} onClick={handleAdd}>
          <FaPlus size={14} />
          Add Goal
        </button>
      </div>

      <div style={styles.tableContainer}>
        {goals.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Target</th>
                <th style={styles.th}>Current</th>
                <th style={styles.th}>Deadline</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Progress</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => {
                const target = goal.targetAmount || 0;
                const current = goal.currentAmount || 0;
                const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
                const progressColor = getProgressColor(percentage);

                return (
                  <tr key={goal.id}>
                    <td style={styles.td}>{goal.name}</td>
                    <td style={styles.td}>{formatCurrency(target)}</td>
                    <td style={styles.td}>{formatCurrency(current)}</td>
                    <td style={styles.td}>{formatDate(goal.deadline)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...getStatusStyle(goal.status) }}>
                        {goal.status?.replace('_', ' ') || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.progressBarContainer}>
                        <div
                          style={{
                            ...styles.progressBarFill,
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: progressColor,
                          }}
                        />
                      </div>
                      <span style={styles.progressText}>{percentage}%</span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.actionBtn, ...styles.editBtn }}
                        onClick={() => handleEdit(goal)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                        onClick={() => setConfirmDelete({ open: true, id: goal.id })}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={styles.emptyText}>No goals yet. Set a financial goal to start saving!</p>
        )}
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />
    </div>
  );
};

export default GoalList;
