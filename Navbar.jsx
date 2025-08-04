/* eslint-disable jsx-a11y/anchor-is-valid */


const Navbar = ({ onTabChange, onLogout }) => {
  return (
    <nav>
      <ul>
        <li><a href="#" className="Company"><span className="nav-item">Ghana Audit Service</span></a></li>
        <li><a href="#" onClick={() => onTabChange("dashboard")}><span className="nav-item">Dashboard</span></a></li>
        <li><a href="#" onClick={() => onTabChange("search")}><span className="nav-item">Search</span></a></li>
        <li><a href="#" onClick={() => onTabChange("newForm")}><span className="nav-item">New FORM</span></a></li>
        <li><a href="#" className="logout" onClick={(e) => {
              e.preventDefault(); // prevent page reload
              onLogout(); // call logout handler
            }}><span className="nav-item">LOGOUT</span></a></li>
      </ul>
    </nav>
  );
};

export default Navbar;