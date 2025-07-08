
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, List, Grid } from "lucide-react";
import { ViewMode } from './types';
import { monthNames } from './utils';

interface PostsHeaderProps {
  platform: 'instagram' | 'linkedin';
  currentDate: Date;
  viewMode: ViewMode;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export const PostsHeader = ({
  platform,
  currentDate,
  viewMode,
  onPrevMonth,
  onNextMonth,
  onViewModeChange
}: PostsHeaderProps) => {
  const platformIcon = platform === 'instagram' ? '📷' : '💼';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{platformIcon}</span>
        <span className="text-xl font-semibold">
          {platform === 'instagram' ? 'Instagram' : 'LinkedIn'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-medium min-w-[140px] text-center">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <Button variant="outline" size="sm" onClick={onNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-r-none"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('calendar')}
            className="rounded-l-none"
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
        
        <Button size="sm" className="ml-2">
          <Plus className="w-4 h-4 mr-1" />
          Novo Post
        </Button>
      </div>
    </div>
  );
};
