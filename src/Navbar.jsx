/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
    navigate("/"); // Redirect back to login page
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard" className="Company">
            <span className="nav-item">Ghana Audit Service</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <span className="nav-item">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/search">
            <span className="nav-item">Search</span>
          </Link>
        </li>
        <li>
          <Link to="/new">
            <span className="nav-item">New FORM</span>
          </Link>
        </li>
        <li>
          <a href="#" className="logout" onClick={handleLogout}>
            <span className="nav-item">LOGOUT</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
