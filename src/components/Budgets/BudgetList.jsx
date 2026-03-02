import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import * as budgetService from '../../services/budgetService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';
import BudgetForm from './BudgetForm';

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
    minWidth: '120px',
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
  periodBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
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

const getProgressColor = (percentage) => {
  if (percentage >= 100) return '#dc2626';
  if (percentage >= 80) return '#f59e0b';
  return '#22c55e';
};

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await budgetService.getAll();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err?.message || 'Failed to load budgets.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await budgetService.remove(confirmDelete.id);
      toast.success('Budget deleted successfully.');
      setConfirmDelete({ open: false, id: null });
      fetchBudgets();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete budget.');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchBudgets();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Budgets</h1>
        <button style={styles.addBtn} onClick={handleAdd}>
          <FaPlus size={14} />
          Add Budget
        </button>
      </div>

      <div style={styles.tableContainer}>
        {budgets.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Limit</th>
                <th style={styles.th}>Spent</th>
                <th style={styles.th}>Period</th>
                <th style={styles.th}>Progress</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => {
                const spent = budget.spent || budget.currentSpending || 0;
                const limit = budget.amountLimit || 0;
                const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const progressColor = getProgressColor(percentage);

                return (
                  <tr key={budget.id}>
                    <td style={styles.td}>
                      {budget.categoryName || budget.category?.name || '-'}
                    </td>
                    <td style={styles.td}>{formatCurrency(limit)}</td>
                    <td style={styles.td}>{formatCurrency(spent)}</td>
                    <td style={styles.td}>
                      <span style={styles.periodBadge}>{budget.period}</span>
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
                        onClick={() => handleEdit(budget)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                        onClick={() => setConfirmDelete({ open: true, id: budget.id })}
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
          <p style={styles.emptyText}>No budgets yet. Create a budget to start tracking your spending.</p>
        )}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          budget={editingBudget}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />
    </div>
  );
};

export default BudgetList;
