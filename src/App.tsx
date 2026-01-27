import MoodTracker from './components/MoodTracker';
import { ThemeProvider } from './components/theme-provider';
import ThemeSwitcher from './components/ThemeSwitcher';
import { SyncProvider } from './context/SyncContext';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SyncProvider>
        <div className="fixed left-4 top-4 z-50">
          <ThemeSwitcher />
        </div>
        <MoodTracker />
      </SyncProvider>
    </ThemeProvider>
  );
}

export default App;
