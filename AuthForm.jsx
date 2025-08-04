
import React, { useState } from "react";
import "./styles.css";


function AuthForm({onLoginSuccess}) {
  const [view, setView] = useState("login"); // 'login' | 'register' | 'forgot'
  const [fullName, setFullName] = useState("");

  const renderForm = () => {
    switch (view) {
      case "login":
        return (
          <div className="wrapper">
            <h1>Login</h1>
            <form onSubmit={(e) => {
              e.preventDefault();
                localStorage.setItem("auth", "true");
                localStorage.setItem("userFullName", fullName);
                onLoginSuccess(fullName); // Navigate to App2
            }}
                >
                  <div className="input-box">
                <input type="text" placeholder="Username"value={fullName}
    onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="input-box">
                <input type="email" placeholder="Email" required />
              </div>
              <div className="input-box">
                <input type="password" placeholder="Password" required />
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" />Remember Me
                </label>
                <span
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={() => setView("forgot")}
                >
                  Forgot password?
                </span>
              </div>
              <button type="submit" className="btn">Login</button>
              <div className="register-link">
                <p>
                  Don't have an account?{" "}
                  <span
                    onClick={() => setView("register")}
                    style={{ cursor: "pointer", color: "white", fontWeight: 600 }}
                  >
                    Register
                  </span>
                </p>
              </div>
            </form>
          </div>
        );
      case "register":
        return (
          <div className="wrapper">
            <h1>Register</h1>
            <form>
              <div className="input-box">
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="input-box">
                <input type="email" placeholder="Email" required />
              </div>
              <div className="input-box">
                <input type="password" placeholder="Password" required />
              </div>
              <button type="submit" className="btn">Register</button>
              <div className="register-link">
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => setView("login")}
                    style={{ cursor: "pointer", color: "white", fontWeight: 600 }}
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </div>
        );
      case "forgot":
        return (
          <div className="wrapper">
            <h1>Forgot Password</h1>
            <form>
              <div className="input-box">
                <input type="email" placeholder="Enter your email" required />
              </div>
              <button type="submit" className="btn">Send Reset Link</button>
              <div className="register-link">
                <p>
                  Remembered your password?{" "}
                  <span
                    onClick={() => setView("login")}
                    style={{ cursor: "pointer", color: "white", fontWeight: 600 }}
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderForm()}</div>;
}

export default AuthForm;



