import MoodTracker from './components/MoodTracker';
import { ThemeProvider } from './components/theme-provider';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="fixed left-4 top-4 z-50">
        <ThemeSwitcher />
      </div>
      <MoodTracker />
    </ThemeProvider>
  );
}

export default App;
