import { Link } from "react-router-dom";

const Navbar = ({ onTabChange, onLogout }) => {
  return (
    <nav>
      <ul>
        <li className="Company">
          <span className="nav-item">Ghana Audit Service</span>
        </li>
        <li>
          <button onClick={() => onTabChange("dashboard")} className="nav-item">
            Dashboard
          </button>
        </li>
        <li>
          <button onClick={() => onTabChange("search")} className="nav-item">
            Search
          </button>
        </li>
        <li>
          <button onClick={() => onTabChange("newForm")} className="nav-item">
            New FORM
          </button>
        </li>
        <li>
          <button
            className="logout nav-item"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            LOGOUT
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
