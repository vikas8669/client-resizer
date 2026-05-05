'use client';

import React from 'react';
import { Bell, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from './ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';

export function NotificationPanel() {
  const { feedback } = useFeedback();
  
  const unresolvedSuggestions = feedback.filter(item => item.type === 'suggestion' && !item.isResolved);
  const notificationCount = unresolvedSuggestions.length;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full hover:bg-zinc-100"
          >
            <Bell className="h-5 w-5 text-zinc-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {notificationCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent className="border-zinc-100" align="end" sideOffset={12}>
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-zinc-900">Notifications</h3>
          {notificationCount > 0 && (
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
              {notificationCount} new
            </span>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notificationCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-500 mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-zinc-900">All caught up!</p>
              <p className="text-xs text-zinc-500 mt-1">No new suggestions or notifications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {unresolvedSuggestions.slice(0, 5).map((item) => (
                <div key={item._id} className="flex gap-3 p-4 hover:bg-zinc-50 transition-colors cursor-pointer">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-zinc-900">New Suggestion</p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{item.comment}</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-400">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {notificationCount > 5 && (
          <div className="border-t border-zinc-100 p-2 text-center">
            <Button variant="ghost" size="sm" className="w-full text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              View all suggestions
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
