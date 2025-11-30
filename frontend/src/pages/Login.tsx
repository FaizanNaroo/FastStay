import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/faststay_app/login/", {
        email,
        password,
      });

      console.log("Login Data:", response.data);

      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("usertype", response.data.usertype);

      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="login-card">

        <h2 className="title">
          <i className="fa-solid fa-building-user"></i> FastStay
        </h2>
        <p className="subtitle">Your trusted hostel companion</p>

        <form onSubmit={handleLogin}>
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

          <div className="input-group">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="divider">or</div>

          <button
            className="google-btn"
            type="button"
            onClick={() => alert("Google login coming soon")}
          >
            <i className="fa-brands fa-google"></i> Login with Google
          </button>

          <p className="bottom-text">
            Don’t have an account?
            <a href="/signup"> Create Account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;