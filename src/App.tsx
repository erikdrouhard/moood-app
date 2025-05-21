import MoodTracker from './components/MoodTracker';
import { ThemeProvider } from './components/theme-provider';
import ThemeSwitcher from './components/ThemeSwitcher';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleAuth = (t: string) => {
    localStorage.setItem('token', t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="absolute left-4 top-4">
        <ThemeSwitcher />
      </div>
      {!token ? (
        mode === 'login' ? (
          <div>
            <Login onLogin={handleAuth} />
            <p className="mt-4 text-center">
              No account?{' '}
              <button
                className="underline text-primary"
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </p>
          </div>
        ) : (
          <div>
            <Signup onSignup={handleAuth} />
            <p className="mt-4 text-center">
              Have an account?{' '}
              <button
                className="underline text-primary"
                onClick={() => setMode('login')}
              >
                Log in
              </button>
            </p>
          </div>
        )
      ) : (
        <div>
          <button className="absolute right-4 top-4" onClick={logout}>
            Log out
          </button>
          <MoodTracker />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
