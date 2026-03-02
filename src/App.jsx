import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/Layout/MainLayout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardPage from './components/Dashboard/DashboardPage';
import TransactionList from './components/Transactions/TransactionList';
import BudgetList from './components/Budgets/BudgetList';
import CategoryList from './components/Categories/CategoryList';
import GoalList from './components/Goals/GoalList';
import ForecastPage from './components/Forecast/ForecastPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionList />} />
            <Route path="budgets" element={<BudgetList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="goals" element={<GoalList />} />
            <Route path="forecast" element={<ForecastPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
