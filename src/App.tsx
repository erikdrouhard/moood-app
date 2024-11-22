import MoodTracker from './components/MoodTracker';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <MoodTracker />
    </ThemeProvider>
  );
}

export default App;