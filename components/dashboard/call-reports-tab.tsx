"use client";

import { Bot } from 'lucide-react'; // Or another relevant icon like BarChart

export function CallReportsTab() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 h-full min-h-[200px]">
       <Bot className="h-10 w-10 text-muted-foreground mb-4 stroke-1" />
      <p className="text-sm font-medium text-muted-foreground">
        Previous cold call reports will be displayed here.
      </p>
      <p className="text-xs text-muted-foreground/80 mt-1">
        Analyze past calls to gain insights.
      </p>
    </div>
  );
} 