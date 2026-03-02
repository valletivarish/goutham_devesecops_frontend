# Personal Finance Budget Tracker - Frontend

A React 18 single-page application for managing personal finances with interactive dashboards, CRUD operations for transactions, budgets, categories, financial goals, and ML-based spending forecast visualization.

## Tech Stack

- React 18
- Vite (Build Tool)
- React Router DOM (Routing)
- Axios (HTTP Client)
- Recharts (Charts and Graphs)
- React Hook Form + Yup (Form Validation)
- React Toastify (Notifications)
- React Icons

## Project Structure

```
src/
    components/
        Auth/           LoginForm, RegisterForm, ProtectedRoute
        Layout/         Navbar, Sidebar, MainLayout
        Dashboard/      DashboardPage with summary cards and charts
        Transactions/   TransactionList, TransactionForm
        Budgets/        BudgetList, BudgetForm
        Categories/     CategoryList, CategoryForm
        Goals/          GoalList, GoalForm
        Forecast/       ForecastPage with trend chart
        common/         LoadingSpinner, ErrorMessage, ConfirmDialog
    context/            AuthContext (JWT state management)
    services/           API service modules (Axios)
    utils/              Validators, formatCurrency, dateUtils
    App.jsx             Router and route definitions
    App.css             Application styles
    main.jsx            Entry point
```

## Prerequisites

- Node.js 18 or higher
- npm 9+

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will start on `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## Pages and Features

### Authentication
- Login page with email/password
- Registration page with username, email, password
- JWT token stored in localStorage
- Automatic redirect for unauthenticated users

### Dashboard
- Summary cards: total income, total expenses, net balance, transaction count
- Bar chart showing income vs expenses by category (Recharts)
- Recent transactions table

### Transactions
- Full CRUD operations (Create, Read, Update, Delete)
- Filterable by type (Income/Expense) and category
- Modal form with validation
- Amount, date, category, type, and description fields

### Budgets
- Create and manage monthly, weekly, or yearly budgets per category
- Progress bars showing budget utilization
- Visual indicators for budget status

### Categories
- Manage income and expense categories
- Icon selection for categories
- Type classification (INCOME or EXPENSE)

### Financial Goals
- Set savings goals with target amounts and deadlines
- Track progress with visual progress bars
- Status management (Active, Completed, Cancelled)

### Spending Forecast
- Line chart displaying predicted spending for next 3 months
- Trend indicator (Increasing, Decreasing, Stable)
- Confidence score from ML model
- Historical vs predicted data visualization

## Form Validation

All forms use React Hook Form with Yup schema validation:

- Required field validation on all forms
- Monetary inputs: positive numbers only, max 2 decimal places, minimum 0.01
- Date validation: valid format, transaction dates not in the future
- String length limits on descriptions and names
- Real-time validation feedback with error messages

## API Integration

The frontend communicates with the Spring Boot backend API. The base URL is configured in `src/services/api.js`.

Default API base URL: `http://localhost:8080/api`

All authenticated requests include the JWT token via an Axios request interceptor:

```
Authorization: Bearer <token>
```

The Axios instance handles:
- Automatic token injection on every request
- 401 response interception (auto-logout on token expiry)
- Base URL configuration

## Styling

The application uses custom CSS with:
- CSS custom properties for theming
- Responsive layout with sidebar navigation
- Card-based UI components
- Styled tables, forms, buttons, badges, and progress bars
- Mobile-responsive breakpoints

## Static Analysis

ESLint is configured for React code quality:

```bash
npm run lint
```

Security audit for dependencies:

```bash
npm audit
```

## Building for Production

```bash
npm run build
```

The optimized production build is output to the `dist/` directory.

## Deployment

The frontend is deployed to an AWS S3 bucket with static website hosting enabled via the GitHub Actions CI/CD pipeline. The build artifacts from `dist/` are synced to the S3 bucket.

Production URL format: `http://<bucket-name>.s3-website-<region>.amazonaws.com`

## Environment Configuration

To point the frontend to a different backend API URL, update the `baseURL` in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://<backend-url>/api'
});
```
