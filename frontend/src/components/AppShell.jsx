import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const AppShell = ({ children, headerAction = null }) => {
  const { user, logout, colorMode, toggleColorMode } = useAppContext();

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-mark top">protoN</span>
          <span className="brand-divider small" />
          <span className="brand-highlight top">for Social</span>
          {headerAction ? <div className="topbar-brand-action">{headerAction}</div> : null}
        </div>

        <nav className="topbar-nav">
          <NavLink to="/" end>
            Tree
          </NavLink>
          <NavLink to="/growth">My Growth</NavLink>
          <NavLink to="/nest">Nest</NavLink>
        </nav>

        <div className="topbar-user">
          <button type="button" className="mode-toggle" onClick={toggleColorMode} title="Switch appearance mode">
            <span className="mode-toggle-label">{colorMode === "light" ? "Light" : "Dark"}</span>
          </button>
          <Link to="/profile" className="profile-trigger">
            <div className="avatar-circle" />
            <div className="user-meta">
              <strong>{user?.username}</strong>
              <span>Growing branch</span>
            </div>
          </Link>
          <button type="button" className="ghost-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {children}
    </div>
  );
};

export default AppShell;
