import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="layout-root">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
