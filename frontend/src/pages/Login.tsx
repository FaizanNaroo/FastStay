import { useState } from "react";
import axios from "axios";
import styles from "../styles/Login.module.css";

const Login: React.FC = () => {
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

      if (response.data.usertype === "Hostel Manager") {
        window.location.href = `/manager/dashboard?user_id=${response.data.user_id}`;
      } else if (response.data.usertype === "Student") {
        window.location.href = `/student/dashboard?user_id=${response.data.user_id}`;
      } else if (response.data.usertype === "Admin") {
        window.location.href = `/admin/dashboard?user_id=${response.data.user_id}`;
      }
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
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.loginCard}>

          <h2 className={styles.title}>
            <i className="fa-solid fa-building-user"></i> FastStay
          </h2>
          <p className={styles.subtitle}>Your trusted hostel companion</p>

          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className={styles.divider}>or</div>

            <button
              className={styles.googleBtn}
              type="button"
              onClick={() => alert("Google login coming soon")}
            >
              <i className="fa-brands fa-google"></i> Login with Google
            </button>

            <p className={styles.bottomText}>
              Don’t have an account?
              <a href="/signup"> Create Account</a>
            </p>
          </form>

          <div className={styles.errorSpace}>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;