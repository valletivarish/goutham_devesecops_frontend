import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { registerSchema } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';

const s = {
  page: {
    display: 'flex',
    minHeight: '100vh',
  },
  brand: {
    flex: 1,
    background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)',
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
  hint: { color: '#94a3b8', fontSize: '11px', marginTop: '4px' },
  btn: {
    width: '100%',
    padding: '13px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #059669, #047857)',
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
  footer: { textAlign: 'center', marginTop: '26px', fontSize: '14px', color: '#64748b' },
  link: { color: '#059669', textDecoration: 'none', fontWeight: '600' },
};

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await registerUser(data.username, data.email, data.password);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const message = error?.message || 'Registration failed. Please try again.';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.brand}>
        <div style={s.brandIcon}>$</div>
        <h1 style={s.brandTitle}>Finance Tracker</h1>
        <p style={s.brandSub}>
          Start your journey to financial freedom. It only takes a minute.
        </p>
        <ul style={s.features}>
          <li style={s.feat}>Free to use, no credit card needed</li>
          <li style={s.feat}>Track all your income & expenses</li>
          <li style={s.feat}>Smart budgets with spending alerts</li>
          <li style={s.feat}>Forecast your future spending</li>
        </ul>
      </div>

      <div style={s.formSide}>
        <div style={s.card}>
          <h2 style={s.title}>Create your account</h2>
          <p style={s.sub}>Join thousands managing their finances smarter</p>

          <ErrorMessage message={serverError} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={s.group}>
              <label style={s.label} htmlFor="username">Username</label>
              <div style={s.wrap}>
                <span style={s.icon}><FaUser /></span>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  style={{ ...s.input, ...(errors.username ? s.inputErr : {}) }}
                  {...register('username')}
                />
              </div>
              {errors.username
                ? <p style={s.err}>{errors.username.message}</p>
                : <p style={s.hint}>3-50 characters</p>
              }
            </div>

            <div style={s.group}>
              <label style={s.label} htmlFor="email">Email</label>
              <div style={s.wrap}>
                <span style={s.icon}><FaEnvelope /></span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{ ...s.input, ...(errors.email ? s.inputErr : {}) }}
                  {...register('email')}
                />
              </div>
              {errors.email && <p style={s.err}>{errors.email.message}</p>}
            </div>

            <div style={s.group}>
              <label style={s.label} htmlFor="password">Password</label>
              <div style={s.wrap}>
                <span style={s.icon}><FaLock /></span>
                <input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  style={{ ...s.input, ...(errors.password ? s.inputErr : {}) }}
                  {...register('password')}
                />
              </div>
              {errors.password
                ? <p style={s.err}>{errors.password.message}</p>
                : <p style={s.hint}>At least 6 characters</p>
              }
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ ...s.btn, ...(isSubmitting ? s.off : {}) }}
            >
              <FaUserPlus size={16} />
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={s.footer}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
