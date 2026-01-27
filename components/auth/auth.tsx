"use client";
import { useState } from 'react';
import '../../styles/kalano-auth.css';
import { createClient } from '@/utils/supabase/client'; // Ensure this path is correct


export default function KalanoAuth() {
  const supabase = createClient();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsLoading(true);
    if (!isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setIsSignUp(true);
      if (error) {
        console.error('Error during sign up:', error.message);
        setIsLoading(false);
        return;
      }
    } else {

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error during sign in:', error.message);
      }
    }

    // Simulate authentication
    setTimeout(() => {
      console.log('Sign in with:', { email, password });
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/demo` },
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
        // Optionally show error to user
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className='flex items-center justify-center min-h-screen ' >
      {/* Auth card */}
      {/* Background glow */}

      <div className="kalano-auth-card">
        {/* Decorative elements */}
        <div className="kalano-auth-card-glow" />
        <div className="kalano-auth-card-accent-corner kalano-auth-corner-tl" />
        <div className="kalano-auth-card-accent-corner kalano-auth-corner-br" />
        <div className="kalano-auth-vertical-accent" />
        <div className="kalano-auth-data-stream" />
        {/* Scanline effect */}
        <div className="kalano-auth-scanline" />
        {/* Floating particles */}
        <div className="kalano-auth-particles">
          <div className="kalano-auth-particle" />
          <div className="kalano-auth-particle" />
          <div className="kalano-auth-particle" />
          <div className="kalano-auth-particle" />
          <div className="kalano-auth-particle" />
        </div>

        <div className="kalano-auth-brand-container">
          <div className="kalano-auth-brand-text">KLANO</div>
        </div>

        {/* Google sign in - moved to top */}
        <button
          onClick={handleGoogleSignIn}
          className="kalano-auth-button-google"
          disabled={isLoading}
        >
          <svg
            className="kalano-auth-google-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="kalano-auth-divider">
          <div className="kalano-auth-divider-line" />
          <span className="kalano-auth-divider-text">OR</span>
          <div className="kalano-auth-divider-line" />
        </div>
        {/* Background glow */}
        <div className="kalano-auth-background-glow" />

        {/* Sign in form */}
        <form onSubmit={handleSubmit} className="kalano-auth-form">
          <div className="kalano-auth-input-group">
            <label htmlFor="kalano-email" className="kalano-auth-label">
              Email Address
            </label>
            <input
              id="kalano-email"
              type="email"
              placeholder="user@domain.com"
              className="kalano-auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="kalano-auth-input-group">
            <label htmlFor="kalano-password" className="kalano-auth-label">
              Password
            </label>
            <input
              id="kalano-password"
              type="password"
              placeholder="••••••••••••"
              className="kalano-auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="kalano-auth-forgot-password">
              <a href="#" className="kalano-auth-forgot-password-link">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="kalano-auth-button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Continue'}
          </button>
        </form>

        {/* Footer */}
        <div className="kalano-auth-footer">
          {"Don't have an account?"}{' '}
          <a href="#" className="kalano-auth-footer-link">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}