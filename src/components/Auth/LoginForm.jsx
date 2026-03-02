import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaUser, FaLock, FaFlask } from 'react-icons/fa';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';

const s = {
  page: {
    display: 'flex',
    minHeight: '100vh',
  },
  brand: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 40px',
    color: '#fff',
  },
  brandIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  brandTitle: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  },
  brandSub: {
    fontSize: '16px',
    opacity: 0.9,
    margin: '0 0 36px 0',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: '340px',
  },
  features: { listStyle: 'none', padding: 0, margin: 0 },
  feat: {
    fontSize: '14px',
    opacity: 0.85,
    marginBottom: '10px',
    paddingLeft: '20px',
    position: 'relative',
  },
  formSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 32px',
    backgroundColor: '#f8fafc',
  },
  card: { width: '100%', maxWidth: '420px' },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  sub: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 28px 0',
  },
  group: { marginBottom: '18px' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  wrap: { position: 'relative' },
  icon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '14px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    backgroundColor: '#fff',
  },
  inputErr: { borderColor: '#ef4444' },
  err: { color: '#ef4444', fontSize: '12px', marginTop: '5px', fontWeight: '500' },
  btn: {
    width: '100%',
    padding: '13px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '6px',
  },
  off: { opacity: 0.6, cursor: 'not-allowed' },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '22px 0',
    gap: '12px',
  },
  line: { flex: 1, height: '1px', backgroundColor: '#e2e8f0' },
  or: { fontSize: '12px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase' },
  demo: {
    width: '100%',
    padding: '11px',
    borderRadius: '10px',
    border: '2px dashed #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  demoCreds: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '8px' },
  footer: { textAlign: 'center', marginTop: '26px', fontSize: '14px', color: '#64748b' },
  link: { color: '#2563eb', textDecoration: 'none', fontWeight: '600' },
};

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await login(data.username, data.password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error?.message || 'Login failed. Please try again.';
      setServerError(message);
      toast.error(message);
    }
  };

  const handleDemoLogin = () => {
    setValue('username', 'demo');
    setValue('password', 'demo1234');
    handleSubmit(onSubmit)();
  };

  return (
    <div style={s.page}>
      <div style={s.brand}>
        <div style={s.brandIcon}>$</div>
        <h1 style={s.brandTitle}>Finance Tracker</h1>
        <p style={s.brandSub}>
          Take control of your money with smart budgeting, tracking, and forecasting.
        </p>
        <ul style={s.features}>
          <li style={s.feat}>Track income & expenses in real time</li>
          <li style={s.feat}>Set budgets and monitor spending</li>
          <li style={s.feat}>AI-powered spending forecasts</li>
          <li style={s.feat}>Set and achieve financial goals</li>
        </ul>
      </div>

      <div style={s.formSide}>
        <div style={s.card}>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to continue to your dashboard</p>

          <ErrorMessage message={serverError} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={s.group}>
              <label style={s.label} htmlFor="username">Username</label>
              <div style={s.wrap}>
                <span style={s.icon}><FaUser /></span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  style={{ ...s.input, ...(errors.username ? s.inputErr : {}) }}
                  {...register('username')}
                />
              </div>
              {errors.username && <p style={s.err}>{errors.username.message}</p>}
            </div>

            <div style={s.group}>
              <label style={s.label} htmlFor="password">Password</label>
              <div style={s.wrap}>
                <span style={s.icon}><FaLock /></span>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{ ...s.input, ...(errors.password ? s.inputErr : {}) }}
                  {...register('password')}
                />
              </div>
              {errors.password && <p style={s.err}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ ...s.btn, ...(isSubmitting ? s.off : {}) }}
            >
              <FaSignInAlt size={16} />
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.line} />
            <span style={s.or}>or</span>
            <div style={s.line} />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isSubmitting}
            style={{ ...s.demo, ...(isSubmitting ? s.off : {}) }}
          >
            <FaFlask size={14} />
            Try with Demo Account
          </button>
          <p style={s.demoCreds}>demo / demo1234</p>

          <p style={s.footer}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={s.link}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
