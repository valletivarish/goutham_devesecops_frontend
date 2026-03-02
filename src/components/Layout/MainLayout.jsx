import { Outlet } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';

const layoutStyles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
  },
  main: {
    marginLeft: '220px',
    marginTop: '60px',
    flex: 1,
    padding: '24px 32px',
    minHeight: 'calc(100vh - 60px)',
  },
};

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div style={layoutStyles.wrapper}>
        <Sidebar />
        <main style={layoutStyles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
