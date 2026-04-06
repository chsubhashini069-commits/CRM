import { LuBell, LuSearch } from "react-icons/lu";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="search-bar">
        <LuSearch />
        <input type="text" placeholder="Search leads, tasks, customers..." />
      </div>
      <div className="navbar-actions">
        <button className="icon-btn">
          <LuBell />
          <span className="badge"></span>
        </button>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
