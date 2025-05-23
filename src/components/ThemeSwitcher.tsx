import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 0.9 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </motion.div>
    </Button>
  );
};

export default ThemeSwitcher;
