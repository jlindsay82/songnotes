import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import betaLogo from "../images/beta.png";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };
  return (
    <header>
      <div className="container">
        <Link to="/">
          <div className="flex-container">
            <h1>SongNotes</h1>
            <span style={{ paddingTop: "8px" }}>
              <img src={betaLogo} alt="beta logo" height="30px" width="30px" />
            </span>
          </div>
        </Link>
        <nav>
          {user && (
            <div className="flex-container">
              <button onClick={handleClick} className="smaller">
                Logout
              </button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
      {user && <div className="nav-username smaller">{user.email}</div>}
    </header>
  );
};

export default Navbar;
