import { useSyncContext } from '@/context/SyncContext';
import { cn } from '@/lib/utils';
import { RefreshCw, Check, AlertCircle, WifiOff, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function SyncIndicator() {
  const { syncStatus, pendingCount, isOnline, forceSync } = useSyncContext();

  const statusConfig = {
    idle: {
      icon: Cloud,
      text: 'Ready',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      animate: false,
    },
    syncing: {
      icon: RefreshCw,
      text: 'Syncing...',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      animate: true,
    },
    synced: {
      icon: Check,
      text: 'Synced',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      animate: false,
    },
    error: {
      icon: AlertCircle,
      text: 'Sync failed',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      animate: false,
    },
    offline: {
      icon: WifiOff,
      text: `Offline${pendingCount > 0 ? ` (${pendingCount} pending)` : ''}`,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      animate: false,
    },
  };

  const config = statusConfig[syncStatus];
  const Icon = config.icon;

  const handleRetry = async () => {
    if (isOnline && (syncStatus === 'error' || pendingCount > 0)) {
      await forceSync();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 gap-2 px-3 rounded-full transition-colors',
              config.bgColor,
              config.color,
              (syncStatus === 'error' || (isOnline && pendingCount > 0)) && 'cursor-pointer hover:opacity-80',
              syncStatus === 'synced' && 'cursor-default'
            )}
            onClick={handleRetry}
            disabled={syncStatus === 'syncing' || (!isOnline && syncStatus === 'offline')}
          >
            <Icon
              className={cn(
                'h-4 w-4',
                config.animate && 'animate-spin'
              )}
            />
            <span className="text-xs font-medium hidden sm:inline">
              {config.text}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {syncStatus === 'offline' && pendingCount > 0
              ? `${pendingCount} changes waiting to sync`
              : syncStatus === 'error'
              ? 'Click to retry sync'
              : syncStatus === 'syncing'
              ? 'Synchronizing with server...'
              : syncStatus === 'synced'
              ? 'All changes saved'
              : 'Ready to sync'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
