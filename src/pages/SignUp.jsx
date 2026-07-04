import { Link, useNavigate } from 'react-router-dom'
import { GoogleIcon, AppleIcon } from '../components/AuthIcons'
import './Login.css'

function SignUp() {
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
            <h1>Create your account</h1>
            <p className="login-subtitle">
              Start remembering every session, for every student.
            </p>

            <div className="login-oauth">
              <button type="button" className="btn-oauth" onClick={() => navigate('/app')}>
                <GoogleIcon />
                Sign up with Google
              </button>
              <button type="button" className="btn-oauth" onClick={() => navigate('/app')}>
                <AppleIcon />
                Sign up with Apple
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
                Sign up with email
              </button>
            </form>

            <p className="login-signup">
              Already have an account? <Link to="/login">Sign In</Link>
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

export default SignUp
