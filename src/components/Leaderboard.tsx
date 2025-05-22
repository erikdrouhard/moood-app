import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getMockLeaderboard } from '@/lib/leaderboard';

const Leaderboard = () => {
  const data = getMockLeaderboard();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="absolute right-4 top-16">
          Leaderboard
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 sm:w-80">
        <SheetHeader>
          <SheetTitle>Top Mood Streaks</SheetTitle>
        </SheetHeader>
        <ol className="mt-4 space-y-2">
          {data.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right">{idx + 1}.</span>
              <Avatar className="h-3 w-3">
                <AvatarFallback className="text-[8px]">{item.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="flex-1 ml-2">{item.name}</span>
              <span className="text-muted-foreground">{item.streak}d</span>
            </li>
          ))}
        </ol>
      </SheetContent>
    </Sheet>
  );
};

export default Leaderboard;
