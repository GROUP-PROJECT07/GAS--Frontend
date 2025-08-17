import React, { useState } from "react";
import "./styles.css";
import { supabase } from "./utils/supabase"; // ✅ fixed import

function AuthForm({ onLoginSuccess }) {
  const [view, setView] = useState("login"); // 'login' | 'register' | 'forgot'
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Safe localStorage function
  const setLocalStorageItem = (key, value) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
  };

  // --- Login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        const user = data.user;
        const userFullName = user?.user_metadata?.full_name || fullName;

        // Safe localStorage usage
        setLocalStorageItem("auth", "true");
        setLocalStorageItem("userFullName", userFullName);

        onLoginSuccess?.(userFullName);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
    }
  };

  // --- Register ---
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        alert(error.message);
      } else {
        alert("Registration successful! Please check your email to confirm.");
        setView("login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please try again.");
    }
  };

  // --- Forgot Password ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        alert(error.message);
      } else {
        alert("Password reset email sent!");
        setView("login");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      alert("Password reset failed. Please try again.");
    }
  };

  // --- UI Forms ---
  const renderForm = () => {
    switch (view) {
      case "login":
        return (
          <div className="wrapper">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember Me
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
            <form onSubmit={handleRegister}>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
            <form onSubmit={handleForgotPassword}>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
