import React from 'react';
import { Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { TimelineEvent } from '../../types/editor';

interface ProjectTimelineProps {
  events: TimelineEvent[];
}

export default function ProjectTimeline({ events }: ProjectTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'status_change': return CheckCircle;
      case 'comment': return MessageSquare;
      case 'review': return AlertCircle;
      case 'assignment': return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => {
          const Icon = getEventIcon(event.type);
          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 && (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center ring-8 ring-white">
                      <Icon className="h-5 w-5 text-indigo-600" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">{event.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{event.description}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={event.timestamp}>
                        {new Date(event.timestamp).toLocaleString()}
                      </time>
                      <p className="mt-0.5 text-xs text-gray-400">{event.user.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}