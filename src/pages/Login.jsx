import { Link, useNavigate } from 'react-router-dom'
import { GoogleIcon, AppleIcon } from '../components/AuthIcons'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const handleEmailSubmit = (event) => {
    event.preventDefault()
    navigate('/app')
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-panel-inner">
          <Link to="/" className="login-logo">
            continuum
          </Link>

          <div className="login-form-wrap">
            <h1>Welcome back!</h1>
            <p className="login-subtitle">
              Your students, their sessions, their progress — all remembered.
            </p>

            <div className="login-oauth">
              <button type="button" className="btn-oauth" onClick={() => navigate('/app')}>
                <GoogleIcon />
                Sign in with Google
              </button>
              <button type="button" className="btn-oauth" onClick={() => navigate('/app')}>
                <AppleIcon />
                Sign in with Apple
              </button>
            </div>

            <div className="login-divider">
              <span>Or</span>
            </div>

            <form className="login-email-form" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="btn-email">
                Sign in with email
              </button>
            </form>

            <p className="login-signup">
              Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>

          <div className="login-footer-links">
            <a href="#help">Help</a>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
      </div>

      <div className="login-media">
        <img src="/images/garadan.png" alt="" className="login-media-img" />
      </div>
    </div>
  )
}

export default Login
