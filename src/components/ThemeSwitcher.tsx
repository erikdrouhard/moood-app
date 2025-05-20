import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTheme } from './theme-provider';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="fun">Fun</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThemeSwitcher;
