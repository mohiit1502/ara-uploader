
import React from "react"
import { ENDPOINTS, HOST } from "@config/constants"
import Network from "@utils/network"
import { useContext } from "react"
import { UploaderContext } from "@contexts/UploaderContext"
import "./LoginPanel.component.scss"

const LoginPanel = (): JSX.Element => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const uploaderCtx = useContext(UploaderContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const apiBase = process.env.NODE_ENV === "production" ? HOST.production : HOST.development;
      if (isSignup) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await Network.post(apiBase + ENDPOINTS.USER.SIGNUP, { email, password });
        if (uploaderCtx && uploaderCtx.setLoggingIn) uploaderCtx.setLoggingIn(false);
      } else {
        await Network.post(apiBase + ENDPOINTS.USER.LOGIN, { email, password });
        if (uploaderCtx && uploaderCtx.setLoggingIn) uploaderCtx.setLoggingIn(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="c-LoginPanel my-4 shadow-md rounded p-4 bg-white">
      <form className="c-LoginPanel__form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="c-LoginPanel__title">{isSignup ? "Sign Up" : "Login"}</h2>
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">Email</label>
          <input
            id="login-email"
            className="form-control"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">Password</label>
          <div className="input-group">
            <input
              id="login-password"
              className="form-control"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {isSignup && (
          <div className="mb-3">
            <label htmlFor="login-confirm-password" className="form-label">Confirm Password</label>
            <input
              id="login-confirm-password"
              className="form-control"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? (isSignup ? "Signing Up..." : "Logging In...") : isSignup ? "Sign Up" : "Login"}
        </button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setIsSignup(s => !s)}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPanel
